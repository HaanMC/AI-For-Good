import { GoogleGenAI, Type, Schema } from "@google/genai";
import logger from "../utils/logger";
import { checkContentSafety, SafetyCheckResult } from "../utils/contentSafetyFilter";
import {
  ExamStructure,
  UploadedFile,
  GradingResult,
  DictionaryEntry,
  WritingFeedback,
  UserProfile,
  ExamLevel,
  ExamType,
  ExamTypeConfig,
  EXAM_TYPE_CONFIGS,
  ExamHistory,
  Flashcard,
  MindmapNode,
  StudyPlan,
  StudyPlanDay,
  StudyPlanOptions,
  DEFAULT_STUDY_PLAN_OPTIONS,
} from "../types";
import { getStaticEntry, getStaticEntryFuzzy, normalizeTerm, normalizeTermFuzzy, searchTerms } from "../data/staticDictionary";
import {
  GRADE_10_SYSTEM_ENHANCEMENT,
  SEMESTER_1_WORKS,
  SEMESTER_2_WORKS,
  GRADE_10_ESSAY_RUBRIC,
  GRADE_10_READING_RUBRIC,
  GRADE_10_TEXTBOOK_LESSONS,
  LiteraryWork
} from "../grade10-literature-knowledge";

// Re-export searchTerms for use in components
export { searchTerms } from "../data/staticDictionary";

// Validate API key exists
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  logger.error("⚠️ GEMINI_API_KEY is not configured. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

const MODEL_FAST = "gemini-2.5-flash"; // Suy nghĩ nhanh
const MODEL_DICTIONARY = "gemini-2.5-flash"; // Tra cứu từ điển
const MODEL_COMPLEX = "gemini-2.5-pro"; // Xử lý phức tạp
const MODEL_THINKING = "gemini-2.5-pro"; // Suy nghĩ sâu

// Danh sách các trang từ điển uy tín được phép tìm kiếm
const TRUSTED_DICTIONARY_SITES = [
  "dictionary.cambridge.org",
  "oxfordlearnersdictionaries.com",
  "merriam-webster.com",
  "collinsdictionary.com",
  "longmandictionaries.com",
  "macmillandictionary.com",
  "dictionary.com",
  "thefreedictionary.com",
  "vi.wiktionary.org",
  "en.wiktionary.org",
  "tratu.soha.vn",
  "vdict.com",
  "tudienviet.net"
];

// Dictionary cache for API results
const dictionaryCache = new Map<string, DictionaryEntry>();

// LocalStorage cache configuration
const CACHE_KEY = 'literary_dictionary_cache';
const CACHE_EXPIRATION_DAYS = 7;

interface CachedEntry {
  data: DictionaryEntry;
  timestamp: number;
}

// Load cache from localStorage on initialization
const loadCacheFromStorage = (): void => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return;

    const parsedCache = JSON.parse(cached) as Record<string, CachedEntry>;
    const now = Date.now();
    const expirationMs = CACHE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

    let validCount = 0;
    let expiredCount = 0;

    // Load valid entries into memory cache
    Object.entries(parsedCache).forEach(([key, entry]) => {
      if (now - entry.timestamp < expirationMs) {
        dictionaryCache.set(key, entry.data);
        validCount++;
      } else {
        expiredCount++;
      }
    });

    logger.log(`📚 Loaded ${validCount} cached dictionary entries from localStorage${expiredCount > 0 ? `, removed ${expiredCount} expired entries` : ''}`);
  } catch (err) {
    logger.error('Failed to load dictionary cache from localStorage:', err);
  }
};

// Save cache to localStorage
const saveCacheToStorage = (): void => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;

    const cacheObject: Record<string, CachedEntry> = {};
    const now = Date.now();

    dictionaryCache.forEach((data, key) => {
      cacheObject[key] = {
        data,
        timestamp: now,
      };
    });

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
  } catch (err) {
    logger.error('Failed to save dictionary cache to localStorage:', err);
  }
};

// Initialize cache on module load
loadCacheFromStorage();

// Priority levels for tasks
enum TaskPriority {
  HIGH = 0,    // Chat messages - always processed immediately
  NORMAL = 1,  // Dictionary lookups, writing analysis
  LOW = 2      // Mindmap, flashcards, study plan generation (background tasks)
}

// Enhanced concurrent task queue system with priority support
class TaskQueue {
  private highPriorityQueue: Array<() => Promise<any>> = [];
  private normalQueue: Array<() => Promise<any>> = [];
  private backgroundQueue: Array<() => Promise<any>> = [];
  private runningHigh: number = 0;
  private runningNormal: number = 0;
  private runningBackground: number = 0;
  private maxConcurrent: number = 1;
  private maxBackgroundConcurrent: number = 2;

  setMaxConcurrent(max: number) {
    this.maxConcurrent = Math.max(1, Math.min(max, 10)); // Clamp between 1-10
    this.maxBackgroundConcurrent = Math.max(1, max); // Background tasks can run more
    this.processQueue();
  }

  // Add task with priority - high priority tasks (chat) never get blocked
  async add<T>(task: () => Promise<T>, priority: TaskPriority = TaskPriority.NORMAL): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          if (priority === TaskPriority.HIGH) {
            this.runningHigh--;
          } else if (priority === TaskPriority.LOW) {
            this.runningBackground--;
          } else {
            this.runningNormal--;
          }
          this.processQueue();
        }
      };

      // Add to appropriate queue based on priority
      if (priority === TaskPriority.HIGH) {
        this.highPriorityQueue.push(wrappedTask);
      } else if (priority === TaskPriority.LOW) {
        this.backgroundQueue.push(wrappedTask);
      } else {
        this.normalQueue.push(wrappedTask);
      }

      this.processQueue();
    });
  }

  private processQueue() {
    // High priority tasks (chat) - always process immediately, no limit
    while (this.highPriorityQueue.length > 0) {
      const task = this.highPriorityQueue.shift();
      if (task) {
        this.runningHigh++;
        task();
      }
    }

    // Normal priority tasks - respect concurrent limit
    while (this.runningNormal < this.maxConcurrent && this.normalQueue.length > 0) {
      const task = this.normalQueue.shift();
      if (task) {
        this.runningNormal++;
        task();
      }
    }

    // Background tasks (mindmap, flashcards) - separate limit, doesn't block chat
    while (this.runningBackground < this.maxBackgroundConcurrent && this.backgroundQueue.length > 0) {
      const task = this.backgroundQueue.shift();
      if (task) {
        this.runningBackground++;
        task();
      }
    }
  }

  // Get queue status for UI display
  getStatus() {
    return {
      highPriority: this.highPriorityQueue.length,
      normal: this.normalQueue.length,
      background: this.backgroundQueue.length,
      runningHigh: this.runningHigh,
      runningNormal: this.runningNormal,
      runningBackground: this.runningBackground
    };
  }
}

// Global task queue instance
const taskQueue = new TaskQueue();

// Export TaskPriority for use in components
export { TaskPriority };

// Function to update concurrent task settings
export const updateConcurrentTaskSettings = (enabled: boolean, maxTasks: number = 3) => {
  taskQueue.setMaxConcurrent(enabled ? maxTasks : 1);
};

// Get current queue status
export const getTaskQueueStatus = () => taskQueue.getStatus();

// Check if error is a rate limit error (temporary, can retry)
const isRateLimitError = (error: any): boolean => {
  const message = error?.message?.toLowerCase() || '';
  const status = error?.status || error?.code;
  return (
    status === 429 ||
    message.includes('rate') ||
    message.includes('too many requests')
  );
};

// Check if error is a quota exhausted error (permanent, should NOT retry)
// This happens when free tier quota is completely used up
const isQuotaExhaustedError = (error: any): boolean => {
  const message = error?.message?.toLowerCase() || '';
  return (
    message.includes('quota') ||
    message.includes('resource exhausted') ||
    message.includes('free_tier') ||
    (message.includes('limit') && message.includes('0'))
  );
};

// Retry logic helper with rate limit awareness
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  options?: {
    isExtendedThinking?: boolean;
    onRateLimitRetry?: (attempt: number, delay: number) => void;
  }
): Promise<T> => {
  // Reduced retries to avoid excessive API calls
  const effectiveMaxRetries = options?.isExtendedThinking ? 3 : maxRetries;
  const rateLimitBaseDelay = options?.isExtendedThinking ? 5000 : 2000; // 5s for thinking, 2s for others

  for (let i = 0; i < effectiveMaxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = i === effectiveMaxRetries - 1;

      // Don't retry on certain errors - throw immediately
      if (error?.message?.includes('API key') || error?.message?.includes('unauthorized')) {
        throw error;
      }

      // IMPORTANT: Don't retry on quota exhausted errors - it's permanent, not temporary
      // Retrying will just waste requests and hit rate limits faster
      if (isQuotaExhaustedError(error)) {
        logger.error('❌ Quota exhausted - không retry vì quota đã hết hoàn toàn');
        throw new Error('QUOTA_EXCEEDED: API quota đã hết. Vui lòng kiểm tra API key và billing account tại https://aistudio.google.com/apikey');
      }

      if (isLastAttempt) {
        throw error;
      }

      // Use longer delays for rate limit errors (temporary)
      let delay: number;
      if (isRateLimitError(error)) {
        // Rate limit: exponential backoff
        delay = rateLimitBaseDelay * Math.pow(2, i);
        delay = Math.min(delay, 60000); // Cap at 1 minute

        if (options?.onRateLimitRetry) {
          options.onRateLimitRetry(i + 1, delay);
        }
        logger.warn(`⏳ Rate limit hit, waiting ${delay / 1000}s before retry ${i + 1}/${effectiveMaxRetries - 1}...`);
      } else {
        // Other errors: shorter exponential backoff
        delay = baseDelay * Math.pow(2, i);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Retry failed');
};

// Helper: Tạo danh sách tác phẩm từ knowledge
const buildWorksListForPrompt = (): string => {
  const sem1Works = SEMESTER_1_WORKS.map((w, i) => `${i + 1}. ${w.title} (${w.author})`).join('\n');
  const sem2Works = SEMESTER_2_WORKS.map((w, i) => `${i + 1}. ${w.title} (${w.author})`).join('\n');

  return `HỌC KỲ 1:\n${sem1Works}\n\nHỌC KỲ 2:\n${sem2Works}`;
};

// Helper: Lấy tên tác phẩm để check trong prompt
const getAllWorkTitles = (): string[] => {
  return [...SEMESTER_1_WORKS, ...SEMESTER_2_WORKS].map(w => w.title);
};

// Helper: Lấy danh sách tác phẩm ngắn gọn cho validation
const getShortWorksList = (): string => {
  const sem1 = SEMESTER_1_WORKS.map(w => w.title).join(', ');
  const sem2 = SEMESTER_2_WORKS.map(w => w.title).join(', ');
  return `HỌC KỲ 1: ${sem1}\nHỌC KỲ 2: ${sem2}`;
};

// Sử dụng system enhancement từ knowledge file
const BASE_SYSTEM_INSTRUCTION = GRADE_10_SYSTEM_ENHANCEMENT;

const ROLEPLAY_SYSTEM = `
Bạn đang HOÁ THÂN thành một nhân vật văn học hoặc tác giả.
- Luôn trả lời trong vai nhân vật đó, không nói mình là AI.
- Ngôn ngữ, xưng hô, giọng điệu phù hợp với bối cảnh và tính cách nhân vật.
`;

// ====== Helper types & functions ======

type ChatHistoryItem = {
  role: "user" | "model";
  parts: { text: string }[];
};

const toFileParts = (files: UploadedFile[] | undefined) => {
  if (!files || files.length === 0) return [];
  return files.map((f) => ({
    inlineData: {
      mimeType: f.mimeType || "application/octet-stream",
      data: f.data,
    },
  }));
};

// ====== Schemas for JSON responses ======

// Schema cho đề thi đầy đủ (có cả nghị luận xã hội)
const EXAM_SCHEMA_FULL: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    subTitle: { type: Type.STRING },
    duration: { type: Type.STRING },
    readingComprehension: {
      type: Type.OBJECT,
      properties: {
        material: { type: Type.STRING },
        source: { type: Type.STRING },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionNumber: { type: Type.INTEGER },
              level: { type: Type.STRING },
              content: { type: Type.STRING },
              score: { type: Type.NUMBER },
            },
            required: ["content", "score"],
          },
        },
      },
      required: ["material", "questions"],
    },
    socialEssay: {
      type: Type.OBJECT,
      properties: {
        prompt: { type: Type.STRING },
        score: { type: Type.NUMBER },
        wordCount: { type: Type.INTEGER },
      },
      required: ["prompt", "score"],
    },
    literaryEssay: {
      type: Type.OBJECT,
      properties: {
        prompt: { type: Type.STRING },
        score: { type: Type.NUMBER },
        wordCount: { type: Type.INTEGER },
      },
      required: ["prompt", "score"],
    },
  },
  required: [
    "title",
    "subTitle",
    "duration",
    "readingComprehension",
    "socialEssay",
    "literaryEssay",
  ],
};

// Schema cho đề kiểm tra nhanh (không có nghị luận xã hội)
const EXAM_SCHEMA_QUICK: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    subTitle: { type: Type.STRING },
    duration: { type: Type.STRING },
    readingComprehension: {
      type: Type.OBJECT,
      properties: {
        material: { type: Type.STRING },
        source: { type: Type.STRING },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionNumber: { type: Type.INTEGER },
              level: { type: Type.STRING },
              content: { type: Type.STRING },
              score: { type: Type.NUMBER },
            },
            required: ["content", "score"],
          },
        },
      },
      required: ["material", "questions"],
    },
    literaryEssay: {
      type: Type.OBJECT,
      properties: {
        prompt: { type: Type.STRING },
        score: { type: Type.NUMBER },
        wordCount: { type: Type.INTEGER },
      },
      required: ["prompt", "score"],
    },
  },
  required: [
    "title",
    "subTitle",
    "duration",
    "readingComprehension",
    "literaryEssay",
  ],
};

const RUBRIC_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    logicScore: { type: Type.NUMBER },
    vocabularyScore: { type: Type.NUMBER },
    creativityScore: { type: Type.NUMBER },
    knowledgeScore: { type: Type.NUMBER },
  },
  required: ["logicScore", "vocabularyScore", "creativityScore", "knowledgeScore"],
};

const GRADING_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    totalScore: { type: Type.NUMBER },
    generalComment: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    overallRubric: RUBRIC_SCHEMA,
    readingFeedback: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          questionNumber: { type: Type.INTEGER },
          score: { type: Type.NUMBER },
          maxScore: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          sampleAnswer: { type: Type.STRING },
        },
        required: ["score", "maxScore", "feedback"],
      },
    },
    socialFeedback: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        maxScore: { type: Type.NUMBER },
        feedback: { type: Type.STRING },
        sampleAnswer: { type: Type.STRING },
        rubric: RUBRIC_SCHEMA,
      },
      required: ["score", "maxScore", "feedback"],
    },
    literaryFeedback: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        maxScore: { type: Type.NUMBER },
        feedback: { type: Type.STRING },
        sampleAnswer: { type: Type.STRING },
        rubric: RUBRIC_SCHEMA,
      },
      required: ["score", "maxScore", "feedback"],
    },
  },
  required: [
    "totalScore",
    "generalComment",
    "strengths",
    "weaknesses",
    "readingFeedback",
    "socialFeedback",
    "literaryFeedback",
  ],
};

const DICTIONARY_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    term: { type: Type.STRING },
    definition: { type: Type.STRING },
    literaryContext: { type: Type.STRING },
    example: { type: Type.STRING },
  },
  required: ["term", "definition"],
};

const WRITING_FEEDBACK_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    rubric: {
      type: Type.OBJECT,
      properties: {
        logicScore: { type: Type.NUMBER },
        vocabularyScore: { type: Type.NUMBER },
        creativityScore: { type: Type.NUMBER },
        knowledgeScore: { type: Type.NUMBER },
      },
      required: [
        "logicScore",
        "vocabularyScore",
        "creativityScore",
        "knowledgeScore",
      ],
    },
    critique: { type: Type.STRING },
    improvedVersion: { type: Type.STRING },
    betterVocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["rubric", "critique", "improvedVersion"],
};

// ====== Core chat ======

export const sendMessageToGemini = async (
  message: string,
  history: ChatHistoryItem[],
  files: UploadedFile[],
  userProfile?: UserProfile,
  useFastModel: boolean = true
): Promise<string> => {
  try {
    // Validate input
    if (!message || message.trim().length === 0) {
      return "Vui lòng nhập câu hỏi hoặc tin nhắn.";
    }

    // Content Safety Check - Kiểm tra an toàn nội dung
    const safetyCheck = checkContentSafety(message);
    if (!safetyCheck.isSafe) {
      logger.warn(`[SAFETY] Phát hiện nội dung cần hỗ trợ - Level: ${safetyCheck.riskLevel}, Category: ${safetyCheck.category}`);

      // Với mức critical hoặc high, trả về phản hồi hỗ trợ ngay lập tức
      if (safetyCheck.riskLevel === 'critical' || safetyCheck.riskLevel === 'high') {
        return safetyCheck.suggestedResponse ||
          `Cô/thầy nhận thấy em đang gặp khó khăn. Hãy chia sẻ với người lớn mà em tin tưởng hoặc gọi đường dây hỗ trợ: 111 (Tổng đài bảo vệ trẻ em) hoặc 1800 599 920 (Tư vấn tâm lý miễn phí 24/7).`;
      }
    }

    // Log medium risk để theo dõi (nhưng vẫn cho phép tiếp tục)
    if (safetyCheck.riskLevel === 'medium') {
      logger.info(`[SAFETY] Học sinh có dấu hiệu stress: ${safetyCheck.category}`);
    }

    const profileText = userProfile
      ? `
HỒ SƠ HỌC SINH:
- Tên: ${userProfile.name}
- Điểm yếu: ${userProfile.weaknesses.join(", ") || "Chưa rõ"}
- Mục tiêu: ${userProfile.goals || "Chưa rõ"}
`
      : "";

    const systemInstruction = BASE_SYSTEM_INSTRUCTION + profileText;
    const fileParts = toFileParts(files);
    const isExtendedThinking = !useFastModel;

    // Helper function to make API call with specified model
    const makeApiCall = async (model: string, temp: number) => {
      return await ai.models.generateContent({
        model,
        contents: [
          ...history,
          {
            role: "user",
            parts: [...fileParts, { text: message }],
          },
        ],
        config: {
          systemInstruction,
          temperature: temp,
        },
      });
    };

    let response;
    let usedFallback = false;

    // Use retry logic for API call with extended thinking awareness
    try {
      response = await retryWithBackoff(
        async () => makeApiCall(useFastModel ? MODEL_FAST : MODEL_THINKING, useFastModel ? 0.9 : 0.7),
        3,
        1000,
        { isExtendedThinking }
      );
    } catch (primaryErr: any) {
      // Don't fallback on quota exhausted - all models share the same quota
      if (isQuotaExhaustedError(primaryErr)) {
        throw primaryErr;
      }

      // If extended thinking model fails due to rate limit (temporary), fallback to stable model
      if (isExtendedThinking && isRateLimitError(primaryErr)) {
        logger.warn("🔄 Extended thinking model rate limited, falling back to stable model...");
        try {
          response = await retryWithBackoff(
            async () => makeApiCall(MODEL_COMPLEX, 0.7),
            2, // Reduced retries
            1000,
            { isExtendedThinking: false }
          );
          usedFallback = true;
        } catch (fallbackErr: any) {
          // Don't fallback on quota exhausted
          if (isQuotaExhaustedError(fallbackErr)) {
            throw fallbackErr;
          }
          // If fallback also fails due to rate limit, try fast model as last resort
          if (isRateLimitError(fallbackErr)) {
            logger.warn("🔄 Stable model also rate limited, trying fast model...");
            response = await retryWithBackoff(
              async () => makeApiCall(MODEL_FAST, 0.9),
              2, // Reduced retries
              1000,
              { isExtendedThinking: false }
            );
            usedFallback = true;
          } else {
            throw fallbackErr;
          }
        }
      } else {
        throw primaryErr;
      }
    }

    const responseText = response.text;

    if (!responseText || responseText.trim().length === 0) {
      return "Trợ lý AI không thể tạo phản hồi lúc này. Vui lòng thử lại.";
    }

    // Add note if fallback was used
    if (usedFallback && isExtendedThinking) {
      return `${responseText}\n\n---\n_💡 Lưu ý: Do giới hạn API, phản hồi này được tạo bởi model thường thay vì model suy nghĩ sâu._`;
    }

    return responseText;
  } catch (err: any) {
    logger.error("sendMessageToGemini error", err);

    // Better error messages based on error type
    if (err?.message?.includes('API key')) {
      return "⚠️ Lỗi API Key. Vui lòng kiểm tra cấu hình API key trong file .env";
    }
    // Check quota exhausted first (more specific)
    if (isQuotaExhaustedError(err) || err?.message?.includes('QUOTA_EXCEEDED')) {
      return "⚠️ Đã hết quota API!\n\nAPI key của bạn đang sử dụng quota miễn phí đã hết. Vui lòng:\n1. Kiểm tra API key tại: https://aistudio.google.com/apikey\n2. Đảm bảo API key liên kết với billing account đã trả phí\n3. Tạo API key mới nếu cần";
    }
    if (isRateLimitError(err)) {
      return "⚠️ Đã vượt quá giới hạn tạm thời. Vui lòng đợi vài phút và thử lại.";
    }
    if (err?.message?.includes('network') || err?.message?.includes('fetch')) {
      return "⚠️ Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.";
    }

    return "⚠️ Đã xảy ra lỗi khi kết nối tới AI. Vui lòng thử lại sau.";
  }
};

// ====== Exam generator ======

// Helper function to build exam structure prompt based on ExamType
const buildExamStructurePrompt = (config: ExamTypeConfig): string => {
  const { structure, scoring } = config;
  let prompt = "";

  // Reading Comprehension Section
  const readingScorePerQuestion = scoring.readingTotal / structure.readingQuestions;
  prompt += `\nPHẦN I. ĐỌC HIỂU (${scoring.readingTotal} điểm)
- Cho một đoạn trích từ TÁC PHẨM LỚP 10 (${structure.readingMaterial.minWords}–${structure.readingMaterial.maxWords} chữ), ghi rõ nguồn
- Ra CHÍNH XÁC ${structure.readingQuestions} câu hỏi:`;

  if (structure.readingQuestions === 2) {
    prompt += `
  + Câu 1 (${readingScorePerQuestion}đ): Nhận biết/Thông hiểu - Xác định thể loại, tác giả, nội dung chính
  + Câu 2 (${readingScorePerQuestion}đ): Vận dụng - Phân tích 1 yếu tố nghệ thuật nổi bật`;
  } else if (structure.readingQuestions === 3) {
    prompt += `
  + Câu 1 (1đ): Nhận biết - Xác định thể loại, tác giả, tác phẩm
  + Câu 2 (1đ): Thông hiểu - Nội dung, chủ đề, ý nghĩa
  + Câu 3 (1đ): Vận dụng - Phân tích nghệ thuật, liên hệ`;
  } else if (structure.readingQuestions === 4) {
    prompt += `
  + Câu 1 (0.5đ): Nhận biết - Xác định thể loại, tác giả, tác phẩm
  + Câu 2 (0.5đ): Nhận biết - Xác định phương thức biểu đạt, biện pháp tu từ
  + Câu 3 (1đ): Thông hiểu - Nội dung, chủ đề, ý nghĩa, giải thích hình ảnh
  + Câu 4 (1đ): Vận dụng - Phân tích, liên hệ, rút ra bài học`;
  }

  // Social Essay Section (if applicable)
  if (structure.hasSocialEssay && scoring.socialEssayScore > 0) {
    prompt += `

PHẦN II. NGHỊ LUẬN XÃ HỘI (${scoring.socialEssayScore} điểm)
- Viết đoạn văn khoảng ${structure.socialEssayWords} chữ về vấn đề xã hội, đạo đức phù hợp lứa tuổi học sinh lớp 10
- Yêu cầu: luận điểm rõ ràng, dẫn chứng thuyết phục, lập luận chặt chẽ`;
  }

  // Literary Essay Section
  const literaryPart = structure.hasSocialEssay ? "III" : "II";
  prompt += `

PHẦN ${literaryPart}. NGHỊ LUẬN VĂN HỌC (${scoring.literaryEssayScore} điểm)
- Phân tích/cảm nhận TÁC PHẨM LỚP 10 (khoảng ${structure.literaryEssayWords} chữ)
- Yêu cầu: phân tích nghệ thuật, hình tượng, chủ đề, giá trị văn học`;

  // Score breakdown
  let breakdown = `Tổng điểm: 10 điểm (Đọc hiểu: ${scoring.readingTotal}đ`;
  if (structure.hasSocialEssay) {
    breakdown += `, Nghị luận XH: ${scoring.socialEssayScore}đ`;
  }
  breakdown += `, Nghị luận VH: ${scoring.literaryEssayScore}đ)`;

  return prompt + "\n\n" + breakdown;
};

export const generateExamPaper = async (
  topic: string,
  examType: ExamType,
  level: ExamLevel,
  files: UploadedFile[],
  userProfile?: UserProfile
): Promise<ExamStructure | null> => {
  try {
    // Validate input
    if (!topic || topic.trim().length === 0) {
      logger.error("Topic is required for exam generation");
      return null;
    }

    // Get exam configuration
    const config = EXAM_TYPE_CONFIGS[examType];
    if (!config) {
      logger.error("Invalid exam type:", examType);
      return null;
    }

    let levelText = "";
    let weaknessIntegration = "";

    switch (level) {
      case ExamLevel.Advanced:
        levelText =
          "Đề nâng cao / học sinh giỏi, câu hỏi mở, yêu cầu tư duy phản biện, phân tích sâu.";
        break;
      case ExamLevel.Standard:
      default:
        levelText =
          "Đề luyện thi bình thường, độ khó trung bình, bám sát chương trình Ngữ văn 10.";

        // Integrate user weaknesses for Standard level if personalization is enabled
        if (
          userProfile &&
          userProfile.weaknesses &&
          userProfile.weaknesses.length > 0 &&
          userProfile.preferences?.personalizationEnabled !== false
        ) {
          weaknessIntegration = `\n\nĐẶC BIỆT LƯU Ý - Học sinh có điểm yếu về: ${userProfile.weaknesses.join(", ")}.
Hãy thiết kế đề thi có ít nhất 1-2 câu hỏi/yêu cầu tập trung vào những kỹ năng này để học sinh có cơ hội luyện tập và cải thiện.`;
        }
        break;
    }

    // Build exam structure based on config
    const examStructure = buildExamStructurePrompt(config);

    // Lấy danh sách tác phẩm động từ knowledge
    const worksList = getShortWorksList();

    const prompt = `
Hãy soạn MỘT ĐỀ THI NGỮ VĂN LỚP 10 (CHƯƠNG TRÌNH 2018) hoàn chỉnh theo cấu trúc:

⚠️ QUAN TRỌNG - TUÂN THỦ NGHIÊM NGẶT:
1. CHỈ SỬ DỤNG TÁC PHẨM TRONG DANH SÁCH LỚP 10:
${worksList}

2. ⛔ TUYỆT ĐỐI KHÔNG dùng: Truyện Kiều, Chiếc thuyền ngoài xa, Vợ nhặt (các tác phẩm lớp 11-12)

3. 📊 SỐ LƯỢNG CÂU HỎI ĐỌC HIỂU: CHÍNH XÁC ${config.structure.readingQuestions} câu (không nhiều hơn, không ít hơn)

${examStructure}

YÊU CẦU ĐỀ:
- Loại đề: ${config.name} - ${config.description}
- Chủ đề/Phạm vi: ${topic || "Chọn tác phẩm phù hợp trong chương trình lớp 10"}
- Thời gian: ${config.duration} phút
- Mức độ: ${levelText}${weaknessIntegration}

${!config.structure.hasSocialEssay ? "⚠️ LƯU Ý: Đề này KHÔNG CÓ phần nghị luận xã hội riêng. Chỉ có đọc hiểu và nghị luận văn học." : ""}

Trả về đúng cấu trúc JSON theo schema đã khai báo.
`;

    const fileParts = toFileParts(files);

    // Select appropriate schema based on exam type
    const schema = config.structure.hasSocialEssay ? EXAM_SCHEMA_FULL : EXAM_SCHEMA_QUICK;

    // Use retry logic for API call
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: MODEL_COMPLEX,
        contents: [
          {
            role: "user",
            parts: [...fileParts, { text: prompt }],
          },
        ],
        config: {
          systemInstruction: BASE_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.5,
        },
      });
    });

    if (!response.text) {
      logger.error("Empty response from API");
      return null;
    }

    let raw;
    try {
      raw = JSON.parse(response.text);
    } catch (parseError) {
      logger.error("JSON parse error in generateExamPaper:", parseError);
      return null;
    }

    // Validate the response has required fields
    if (!raw.readingComprehension || !raw.literaryEssay) {
      logger.error("Invalid exam structure from API");
      return null;
    }

    // Validate for full exams
    if (config.structure.hasSocialEssay && !raw.socialEssay) {
      logger.error("Missing socialEssay for full exam type");
      return null;
    }

    const safeExam: ExamStructure = {
      title: raw.title || `ĐỀ ${config.name.toUpperCase()} NGỮ VĂN 10`,
      subTitle: raw.subTitle || `Môn: Ngữ Văn - Lớp 10 - Thời gian: ${config.duration} phút`,
      duration: String(config.duration),
      examType: examType,
      readingComprehension: {
        material: raw.readingComprehension?.material || "",
        source: raw.readingComprehension?.source,
        questions: (raw.readingComprehension?.questions || []).map(
          (q: any, idx: number) => ({
            questionNumber: q.questionNumber ?? idx + 1,
            level: q.level || "",
            content: q.content || "",
            score: q.score ?? 0,
          })
        ),
      },
      literaryEssay: {
        prompt: raw.literaryEssay?.prompt || "",
        score: raw.literaryEssay?.score ?? config.scoring.literaryEssayScore,
        wordCount: config.structure.literaryEssayWords,
      },
    };

    // Add social essay only if applicable
    if (config.structure.hasSocialEssay && raw.socialEssay) {
      safeExam.socialEssay = {
        prompt: raw.socialEssay?.prompt || "",
        score: raw.socialEssay?.score ?? config.scoring.socialEssayScore,
        wordCount: config.structure.socialEssayWords,
      };
    }

    return safeExam;
  } catch (err: any) {
    logger.error("generateExamPaper error", err);

    // Log more specific error information
    if (err?.message) {
      logger.error("Error message:", err.message);
    }

    // Check for quota/rate limit errors and throw with specific message
    const errorMessage = err?.message?.toLowerCase() || '';
    if (errorMessage.includes('quota') || errorMessage.includes('resource_exhausted') || errorMessage.includes('rate') || errorMessage.includes('free_tier')) {
      throw new Error('QUOTA_EXCEEDED: Đã vượt quá giới hạn API. Vui lòng kiểm tra API key và billing account của bạn tại https://aistudio.google.com/apikey');
    }

    return null;
  }
};

// ====== Grading ======

export const gradeStudentWork = async (
  exam: ExamStructure,
  studentWork: string
): Promise<GradingResult | null> => {
  try {
    // Validate input
    if (!studentWork || studentWork.trim().length === 0) {
      logger.error("Student work is empty");
      return null;
    }

    // Build dynamic grading prompt based on exam structure
    const hasSocialEssay = !!exam.socialEssay;
    const socialEssayInstruction = hasSocialEssay
      ? `- Với NGHỊ LUẬN XÃ HỘI: cho điểm theo rubric, nhận xét chi tiết, đưa đoạn mẫu chuẩn lớp 10`
      : `⚠️ LƯU Ý: Đề này KHÔNG CÓ phần nghị luận xã hội - KHÔNG cần trả về socialFeedback`;

    const prompt = `
Bạn là giáo viên Ngữ văn LỚP 10 (CHƯƠNG TRÌNH 2018). Hãy CHẤM BÀI làm của học sinh theo CHUẨN LỚP 10.

ĐỀ THI:
${JSON.stringify(exam, null, 2)}

BÀI LÀM CỦA HỌC SINH:
${studentWork}

📋 RUBRIC CHẤM ĐIỂM CHUẨN LỚP 10 (THANG 10):

BÀI VĂN NGHỊ LUẬN:
- Bố cục - Mạch lạc (2.5đ): Có đủ 3 phần (Mở - Thân - Kết), liên kết rõ ràng
- Nội dung - Kiến thức (4.0đ): Nắm vững kiến thức, phân tích sâu, dẫn chứng cụ thể
- Ngôn ngữ - Diễn đạt (2.0đ): Lưu loát, dùng từ chính xác, ít lỗi chính tả
- Sáng tạo - Cảm xúc (1.5đ): Cảm nhận cá nhân, góc nhìn độc đáo, văn có cảm xúc

PHẦN ĐỌC HIỂU (${exam.readingComprehension.questions.length} câu):
- Chấm theo đúng số câu hỏi trong đề
- Nhận biết, Thông hiểu, Vận dụng tùy cấp độ câu hỏi

YÊU CẦU CHẤM:
- Cho điểm tổng (thang 10) và nhận xét chung phù hợp lớp 10
- Liệt kê điểm mạnh, hạn chế CỤ THỂ
- ĐÁNH GIÁ CHI TIẾT THEO RUBRIC (thang 10 mỗi tiêu chí):
  + logicScore: Mạch lạc, logic, bố cục (2.5đ)
  + vocabularyScore: Vốn từ, dùng từ chính xác (2.0đ)
  + creativityScore: Sáng tạo, cảm xúc, chiều sâu (1.5đ)
  + knowledgeScore: Kiến thức văn học lớp 10 (4.0đ)

- Với PHẦN ĐỌC HIỂU: chấm từng câu, đáp án mẫu
${socialEssayInstruction}
- Với NGHỊ LUẬN VĂN HỌC: cho điểm theo rubric, nhận xét chi tiết, đưa dàn ý/đoạn mẫu chuẩn lớp 10

Trả về JSON theo schema đã khai báo cho GRADING_SCHEMA.
`;

    // Use retry logic for API call
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: MODEL_COMPLEX,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: GRADING_SCHEMA,
          temperature: 0.4,
        },
      });
    });

    if (!response.text) {
      logger.error("Empty grading response");
      return null;
    }

    let raw;
    try {
      raw = JSON.parse(response.text);
    } catch (parseError) {
      logger.error("JSON parse error in gradeStudentWork:", parseError);
      return null;
    }

    const safe: GradingResult = {
      totalScore: raw.totalScore ?? 0,
      generalComment: raw.generalComment || "",
      strengths: raw.strengths || [],
      weaknesses: raw.weaknesses || [],
      overallRubric: raw.overallRubric ? {
        logicScore: raw.overallRubric.logicScore ?? 0,
        vocabularyScore: raw.overallRubric.vocabularyScore ?? 0,
        creativityScore: raw.overallRubric.creativityScore ?? 0,
        knowledgeScore: raw.overallRubric.knowledgeScore ?? 0,
      } : undefined,
      readingFeedback: (raw.readingFeedback || []).map(
        (item: any, idx: number) => ({
          questionNumber: item.questionNumber ?? idx + 1,
          score: item.score ?? 0,
          maxScore: item.maxScore ?? 0,
          feedback: item.feedback || "",
          sampleAnswer: item.sampleAnswer || "",
        })
      ),
      // Only include socialFeedback if exam has socialEssay
      socialFeedback: exam.socialEssay && raw.socialFeedback ? {
        score: raw.socialFeedback?.score ?? 0,
        maxScore: raw.socialFeedback?.maxScore ?? exam.socialEssay?.score ?? 0,
        feedback: raw.socialFeedback?.feedback || "",
        sampleAnswer: raw.socialFeedback?.sampleAnswer || "",
        rubric: raw.socialFeedback?.rubric ? {
          logicScore: raw.socialFeedback.rubric.logicScore ?? 0,
          vocabularyScore: raw.socialFeedback.rubric.vocabularyScore ?? 0,
          creativityScore: raw.socialFeedback.rubric.creativityScore ?? 0,
          knowledgeScore: raw.socialFeedback.rubric.knowledgeScore ?? 0,
        } : undefined,
      } : undefined,
      literaryFeedback: {
        score: raw.literaryFeedback?.score ?? 0,
        maxScore: raw.literaryFeedback?.maxScore ?? exam.literaryEssay?.score ?? 0,
        feedback: raw.literaryFeedback?.feedback || "",
        sampleAnswer: raw.literaryFeedback?.sampleAnswer || "",
        rubric: raw.literaryFeedback?.rubric ? {
          logicScore: raw.literaryFeedback.rubric.logicScore ?? 0,
          vocabularyScore: raw.literaryFeedback.rubric.vocabularyScore ?? 0,
          creativityScore: raw.literaryFeedback.rubric.creativityScore ?? 0,
          knowledgeScore: raw.literaryFeedback.rubric.knowledgeScore ?? 0,
        } : undefined,
      },
    };

    return safe;
  } catch (err) {
    logger.error("gradeStudentWork error", err);
    return null;
  }
};

// ====== Dictionary lookup ======

export const lookupDictionaryTerm = async (
  term: string
): Promise<DictionaryEntry | null> => {
  try {
    // Validate input
    if (!term || term.trim().length === 0) {
      logger.error("Dictionary term is empty");
      return null;
    }

    const normalizedTerm = normalizeTerm(term);
    const fuzzyTerm = normalizeTermFuzzy(term);

    // 1. Check static dictionary first with fuzzy matching (instant lookup)
    const staticEntry = getStaticEntryFuzzy(term);
    if (staticEntry) {
      logger.log(`✅ Static dictionary hit (fuzzy): ${term} → ${staticEntry.term}`);
      return staticEntry;
    }

    // 2. Check cache for previously searched terms (exact match)
    if (dictionaryCache.has(normalizedTerm)) {
      logger.log(`✅ Cache hit (exact): ${term}`);
      return dictionaryCache.get(normalizedTerm)!;
    }

    // 3. Check cache with fuzzy matching (no diacritics)
    if (dictionaryCache.has(fuzzyTerm)) {
      logger.log(`✅ Cache hit (fuzzy): ${term}`);
      return dictionaryCache.get(fuzzyTerm)!;
    }

    // 4. Call API with WebSearch for new terms - using trusted dictionary sites only
    logger.log(`🔍 API lookup with web search: ${term}`);

    // Build site restriction query for trusted dictionaries
    const siteRestriction = TRUSTED_DICTIONARY_SITES.map(site => `site:${site}`).join(" OR ");

    const prompt = `Tra cứu thuật ngữ/từ vựng: "${term}"

QUAN TRỌNG: Chỉ tìm kiếm thông tin từ các trang từ điển uy tín sau: ${TRUSTED_DICTIONARY_SITES.join(", ")}

Nếu đây là thuật ngữ NGỮ VĂN lớp 10:
- Định nghĩa ngắn gọn
- Bối cảnh văn học
- 1 ví dụ từ tác phẩm lớp 10

Nếu đây là từ vựng tiếng Anh/Việt:
- Định nghĩa chính xác từ từ điển
- Phiên âm (nếu có)
- Ví dụ sử dụng

Trả về CHÍNH XÁC JSON format sau (không có text thêm):
{"term": "...", "definition": "...", "literaryContext": "...", "example": "..."}`;

    // Use Google Search tool - Note: Cannot use responseMimeType with tools
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: MODEL_DICTIONARY,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          temperature: 0.2, // Lower temperature for more accurate dictionary results
          tools: [{ googleSearch: {} }], // Enable web search for dictionary only
        },
      });
    });

    if (!response.text) {
      logger.error("Empty dictionary response");
      return null;
    }

    // Parse JSON from response (may have markdown code blocks)
    const responseText = response.text.trim();
    const cleanJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let result: DictionaryEntry;
    try {
      result = JSON.parse(cleanJson) as DictionaryEntry;
    } catch (parseError) {
      logger.error("JSON parse error in lookupDictionaryTerm:", parseError);
      return null;
    }

    // Cache the result for future lookups
    dictionaryCache.set(normalizedTerm, result);

    // Persist to localStorage
    saveCacheToStorage();

    return result;
  } catch (err) {
    logger.error("lookupDictionaryTerm error", err);
    return null;
  }
};

// ====== Writing improvement ======

export const analyzeAndImproveWriting = async (
  text: string
): Promise<WritingFeedback | null> => {
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      logger.error("Writing text is empty");
      return null;
    }

    const prompt = `
ĐÂY LÀ ĐOẠN/BÀI VIẾT CỦA HỌC SINH:

${text}

HÃY:
1. Nhận xét chi tiết về mạch lạc, dùng từ, sáng tạo, kiến thức.
2. Đưa ra một phiên bản viết lại hay hơn, vẫn giữ ý chính.
3. Chấm điểm 4 tiêu chí: logic, vocab, creativity, knowledge (thang 10).
4. Gợi ý 5–10 từ/cụm từ hay hơn để học sinh học thêm.

Trả về JSON đúng WritingFeedback (rubric, critique, improvedVersion, betterVocabulary[]).
`;

    // Use retry logic for API call
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: MODEL_COMPLEX,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: WRITING_FEEDBACK_SCHEMA,
          temperature: 0.6,
        },
      });
    });

    if (!response.text) {
      logger.error("Empty writing feedback response");
      return null;
    }

    let raw;
    try {
      raw = JSON.parse(response.text);
    } catch (parseError) {
      logger.error("JSON parse error in analyzeAndImproveWriting:", parseError);
      return null;
    }

    const safe: WritingFeedback = {
      rubric: {
        logicScore: raw.rubric?.logicScore ?? 0,
        vocabularyScore: raw.rubric?.vocabularyScore ?? 0,
        creativityScore: raw.rubric?.creativityScore ?? 0,
        knowledgeScore: raw.rubric?.knowledgeScore ?? 0,
      },
      critique: raw.critique || "",
      improvedVersion: raw.improvedVersion || text,
      betterVocabulary: raw.betterVocabulary || [],
    };

    return safe;
  } catch (err) {
    logger.error("analyzeAndImproveWriting error", err);
    return null;
  }
};

// ====== Roleplay character ======

export const sendMessageAsCharacter = async (
  message: string,
  history: ChatHistoryItem[],
  characterName: string,
  workTitle: string,
  useFastModel: boolean = false
): Promise<string> => {
  try {
    // Validate input
    if (!message || message.trim().length === 0) {
      return "Vui lòng nhập tin nhắn.";
    }

    const systemInstruction = `
${ROLEPLAY_SYSTEM}

NHÂN VẬT/TÁC GIẢ:
- Tên: ${characterName}
- Tác phẩm: ${workTitle}
`;

    // Use retry logic for API call
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: useFastModel ? MODEL_FAST : MODEL_COMPLEX,
        contents: [
          ...history,
          { role: "user", parts: [{ text: message }] },
        ],
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });
    });

    const responseText = response.text;

    if (!responseText || responseText.trim().length === 0) {
      return "...... (nhân vật đang trầm tư suy nghĩ)";
    }

    return responseText;
  } catch (err: any) {
    logger.error("sendMessageAsCharacter error", err);

    // Better error messages
    if (err?.message?.includes('API key')) {
      return "⚠️ Lỗi kết nối. Vui lòng kiểm tra cấu hình.";
    }

    return "Nhân vật đang bối rối, hãy hỏi lại theo cách khác nhé.";
  }
};

// ====== Flashcard Generator ======

export const generateFlashcards = async (
  topic: string,
  numberOfCards: number = 10
): Promise<Flashcard[] | null> => {
  try {
    // Validate input
    if (!topic || topic.trim().length === 0) {
      logger.error("Topic is required for flashcard generation");
      return null;
    }

    const prompt = `
Tạo ${numberOfCards} flashcards (thẻ ghi nhớ) về chủ đề: "${topic}"

YÊU CẦU:
1. Mỗi flashcard có:
   - Front (Câu hỏi/Khái niệm): ngắn gọn, rõ ràng
   - Back (Đáp án/Giải thích): chi tiết, dễ hiểu
   - Category: phân loại (VD: "Thơ ca", "Văn xuôi", "Kỹ năng", v.v.)
   - Difficulty: "easy", "medium", hoặc "hard"

2. Nội dung PHẢI:
   - Bám sát chương trình Ngữ Văn lớp 10 (nếu có liên quan)
   - Tập trung vào kiến thức quan trọng, thường gặp trong thi
   - Câu hỏi đa dạng: khái niệm, phân tích, so sánh, nhận diện
   - Đáp án chính xác, có giải thích cụ thể

3. Phân bổ độ khó cân đối: 40% easy, 40% medium, 20% hard

Trả về JSON array với format:
[
  {
    "id": "fc1",
    "front": "Câu hỏi hoặc khái niệm",
    "back": "Đáp án chi tiết",
    "category": "Phân loại",
    "difficulty": "easy"
  },
  ...
]

CHỈ TRẢ VỀ JSON, KHÔNG CÓ TEXT THÊM.
`;

    logger.log('Generating flashcards for topic:', topic);

    const response = await retryWithBackoff(() => {
      return ai.models.generateContent({
        model: MODEL_COMPLEX,
        contents: prompt,
      });
    });

    if (!response || !response.text) {
      logger.error("Empty response from API");
      throw new Error("API trả về kết quả rỗng. Vui lòng thử lại.");
    }

    const responseText = response.text.trim();
    logger.log('Raw response length:', responseText.length);
    logger.log('Response preview:', responseText.substring(0, 200));

    // Remove markdown code blocks if present
    const cleanJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let flashcards: Flashcard[];
    try {
      flashcards = JSON.parse(cleanJson) as Flashcard[];
    } catch (parseError) {
      logger.error("JSON parse error:", parseError);
      logger.error("Failed to parse:", cleanJson.substring(0, 500));
      throw new Error("Không thể xử lý kết quả từ AI. Vui lòng thử lại.");
    }

    // Validate response
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      logger.error("Invalid flashcard response format or empty array");
      throw new Error("AI không tạo được flashcards phù hợp. Thử chủ đề khác hoặc đơn giản hóa yêu cầu.");
    }

    logger.log('Successfully generated', flashcards.length, 'flashcards');
    return flashcards;
  } catch (err: any) {
    logger.error("generateFlashcards error", err);

    // Check for specific error types
    if (err?.message?.includes('API key')) {
      logger.error("API key error - check configuration");
    } else if (err?.message?.includes('network') || err?.message?.includes('fetch')) {
      logger.error("Network error - check internet connection");
    }

    // Re-throw with more context if it's our custom error
    if (err?.message && (err.message.includes('API') || err.message.includes('AI'))) {
      throw err;
    }

    return null;
  }
};

// ====== Mindmap Generator ======

export const generateMindmap = async (
  topic: string
): Promise<MindmapNode | null> => {
  try {
    // Validate input
    if (!topic || topic.trim().length === 0) {
      logger.error("Topic is required for mindmap generation");
      return null;
    }

    const prompt = `
Tạo một sơ đồ tư duy (mindmap) về chủ đề: "${topic}"

YÊU CẦU:
1. Cấu trúc phân cấp rõ ràng:
   - Root node: chủ đề chính
   - Main branches (2-4 nhánh): các khía cạnh chính
   - Sub-branches: chi tiết các khía cạnh
   - Có thể có 2-3 cấp độ phân nhánh

2. Mỗi node có:
   - id: unique identifier (VD: "root", "branch1", "sub1-1")
   - label: tên node ngắn gọn
   - category: loại node ("root", "main", "sub", "detail")
   - children: array các node con (nếu có)
   - description: mô tả ngắn (optional, cho node quan trọng)
   - examples: mảng ví dụ cụ thể (optional)

3. Nội dung PHẢI:
   - Logic, có hệ thống
   - Bám sát chương trình Ngữ Văn lớp 10 (nếu liên quan)
   - Bao quát đầy đủ chủ đề
   - Dễ hiểu, dễ học

Trả về JSON object với format:
{
  "id": "root",
  "label": "Tên chủ đề",
  "category": "root",
  "description": "Mô tả tổng quan",
  "children": [
    {
      "id": "branch1",
      "label": "Nhánh chính 1",
      "category": "main",
      "description": "Mô tả",
      "children": [
        {
          "id": "sub1-1",
          "label": "Nhánh con",
          "category": "sub",
          "examples": ["Ví dụ 1", "Ví dụ 2"]
        }
      ]
    }
  ]
}

CHỈ TRẢ VỀ JSON, KHÔNG CÓ TEXT THÊM.
`;

    logger.log('Generating mindmap for topic:', topic);

    const response = await retryWithBackoff(() => {
      return ai.models.generateContent({
        model: MODEL_COMPLEX,
        contents: prompt,
      });
    });

    if (!response || !response.text) {
      logger.error("Empty response from API");
      throw new Error("API trả về kết quả rỗng. Vui lòng thử lại.");
    }

    const responseText = response.text.trim();
    logger.log('Raw response length:', responseText.length);
    logger.log('Response preview:', responseText.substring(0, 200));

    // Remove markdown code blocks if present
    const cleanJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let mindmap: MindmapNode;
    try {
      mindmap = JSON.parse(cleanJson) as MindmapNode;
    } catch (parseError) {
      logger.error("JSON parse error:", parseError);
      logger.error("Failed to parse:", cleanJson.substring(0, 500));
      throw new Error("Không thể xử lý kết quả từ AI. Vui lòng thử lại.");
    }

    // Validate response
    if (!mindmap || !mindmap.id || !mindmap.label) {
      logger.error("Invalid mindmap response format");
      throw new Error("AI không tạo được mindmap phù hợp. Thử chủ đề khác hoặc đơn giản hóa yêu cầu.");
    }

    logger.log('Successfully generated mindmap with root:', mindmap.label);
    return mindmap;
  } catch (err: any) {
    logger.error("generateMindmap error", err);

    // Check for specific error types
    if (err?.message?.includes('API key')) {
      logger.error("API key error - check configuration");
    } else if (err?.message?.includes('network') || err?.message?.includes('fetch')) {
      logger.error("Network error - check internet connection");
    }

    // Re-throw with more context if it's our custom error
    if (err?.message && (err.message.includes('API') || err.message.includes('AI'))) {
      throw err;
    }

    return null;
  }
};

// ====== 7-Day Study Plan Generator ======

// ====== OCR - Extract Text from Image (Handwriting) ======

export const extractTextFromImage = async (
  imageData: string,
  mimeType: string = 'image/jpeg'
): Promise<string | null> => {
  try {
    // Validate input
    if (!imageData || imageData.trim().length === 0) {
      logger.error("Image data is empty");
      return null;
    }

    const prompt = `
Hãy đọc và trích xuất CHÍNH XÁC toàn bộ văn bản từ hình ảnh này.

YÊU CẦU:
1. Đọc cả chữ viết tay (handwriting) và chữ in
2. Giữ nguyên cấu trúc đoạn văn, xuống dòng
3. Nếu có chữ viết tay khó đọc, cố gắng đoán nghĩa từ ngữ cảnh
4. Sửa lỗi chính tả rõ ràng nếu có thể nhận ra
5. Đối với bài văn học sinh, giữ nguyên ý nhưng có thể sửa lỗi đánh máy/viết nhầm

CHỈ TRẢ VỀ VĂN BẢN ĐÃ TRÍCH XUẤT, KHÔNG CÓ GIẢI THÍCH HAY NHẬN XÉT.
Nếu không thể đọc được gì, trả về: "[Không thể đọc được văn bản từ ảnh]"
`;

    // Use retry logic for API call
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: MODEL_FAST,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: imageData,
                },
              },
              { text: prompt },
            ],
          },
        ],
        config: {
          temperature: 0.1, // Low temperature for accurate transcription
        },
      });
    });

    const responseText = response.text;

    if (!responseText || responseText.trim().length === 0) {
      return "[Không thể đọc được văn bản từ ảnh]";
    }

    return responseText.trim();
  } catch (err: any) {
    logger.error("extractTextFromImage error", err);

    // Better error messages based on error type
    if (err?.message?.includes('API key')) {
      return "⚠️ Lỗi API Key. Vui lòng kiểm tra cấu hình.";
    }
    if (err?.message?.includes('quota') || err?.message?.includes('limit')) {
      return "⚠️ Đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau.";
    }

    return null;
  }
};

export const generate7DayStudyPlan = async (
  weaknesses: string[],
  goals: string,
  userName: string,
  options: StudyPlanOptions = DEFAULT_STUDY_PLAN_OPTIONS
): Promise<StudyPlan | null> => {
  try {
    // Validate input
    if (!weaknesses || weaknesses.length === 0) {
      logger.error("No weaknesses provided for study plan");
      return null;
    }

    // Helper function để convert options thành text
    const getDailyTimeText = () => {
      switch (options.dailyStudyTime) {
        case '1h': return '1 giờ';
        case '2h': return '2 giờ';
        case '3h': return '3 giờ';
        case '4h+': return '4 giờ trở lên';
        default: return '2 giờ';
      }
    };

    const getIntensityText = () => {
      switch (options.intensity) {
        case 'light': return 'nhẹ nhàng (ưu tiên sức khỏe, không áp lực)';
        case 'medium': return 'vừa phải (cân bằng giữa học và nghỉ)';
        case 'high': return 'cao (tập trung tối đa, thử thách bản thân)';
        default: return 'vừa phải';
      }
    };

    const getActivityPreferenceText = () => {
      switch (options.preferredActivities) {
        case 'reading': return 'Ưu tiên đọc tài liệu, phân tích văn bản (nhiều hoạt động reading và review)';
        case 'writing': return 'Ưu tiên luyện viết, làm bài tập (nhiều hoạt động practice và exercise)';
        case 'balanced': return 'Cân bằng giữa đọc và viết';
        default: return 'Cân bằng giữa đọc và viết';
      }
    };

    const getRestDaysText = () => {
      if (!options.restDays || options.restDays.length === 0) {
        return 'Không có ngày nghỉ, học đều 7 ngày';
      }
      const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      const restDayNames = options.restDays.map(d => dayNames[d]).join(', ');
      return `Ngày nghỉ: ${restDayNames} - Những ngày này chỉ có hoạt động nhẹ (ôn tập, đọc sách) hoặc nghỉ hoàn toàn`;
    };

    const prompt = `
Tạo một KẾ HOẠCH HỌC TẬP 7 NGÀY chi tiết cho học sinh lớp 10 môn Ngữ Văn.

THÔNG TIN HỌC SINH:
- Tên: ${userName}
- Mục tiêu: ${goals || "Cải thiện điểm số"}
- Điểm yếu cần cải thiện: ${weaknesses.join(", ")}

⏰ TÙY CHỌN THỜI GIAN VÀ CƯỜNG ĐỘ:
- Thời gian học mỗi ngày: ${getDailyTimeText()} (sau giờ học chính khóa)
- Cường độ học tập: ${getIntensityText()}
- Ưu tiên hoạt động: ${getActivityPreferenceText()}
- ${getRestDaysText()}

YÊU CẦU KẾ HOẠCH:
1. Phân bổ hợp lý các điểm yếu vào 7 ngày
2. QUAN TRỌNG: Tổng thời gian các hoạt động mỗi ngày PHẢI PHÙ HỢP với thời gian học đã chọn (${getDailyTimeText()})
3. Mỗi ngày có:
   - Tiêu đề hấp dẫn, tạo động lực
   - Tập trung vào 1-2 điểm yếu cụ thể
   - 2-5 hoạt động học tập cụ thể (số lượng tùy thuộc vào thời gian có)
   - Thời gian mỗi hoạt động hợp lý (tổng = ${getDailyTimeText()})
   - Tips học hiệu quả
   - Mục tiêu kiểm tra cuối ngày

4. CÁC HOẠT ĐỘNG CẦN CÓ:
   - type: "reading" (đọc tài liệu), "exercise" (làm bài tập), "practice" (luyện viết), "review" (ôn lại), "test" (kiểm tra)
   - Cụ thể về tác phẩm lớp 10 trong danh sách sau: ${getAllWorkTitles().slice(0, 10).join(', ')}...
   - Tài liệu tham khảo nếu có

5. NGÀY 7: Tổng kết + Tự đánh giá + Bài thi thử

6. Nếu có ngày nghỉ (isRestDay: true): Chỉ có 1-2 hoạt động nhẹ như đọc sách, xem lại ghi chú, hoặc nghỉ hoàn toàn

7. Thêm câu châm ngôn tạo động lực

Trả về JSON theo cấu trúc:
{
  "title": "Kế hoạch 7 ngày chinh phục [điểm yếu chính]",
  "description": "Mô tả ngắn về kế hoạch (có đề cập thời gian học ${getDailyTimeText()}/ngày)",
  "weaknesses": [...danh sách điểm yếu],
  "days": [
    {
      "day": 1,
      "title": "Ngày 1: [Tiêu đề hấp dẫn]",
      "focus": "Tập trung vào...",
      "isRestDay": false,
      "activities": [
        {
          "type": "reading",
          "title": "Đọc lại...",
          "description": "Chi tiết việc cần làm",
          "duration": "30 phút",
          "resources": ["SGK Ngữ Văn 10 trang..."]
        }
      ],
      "tips": ["Mẹo 1", "Mẹo 2"],
      "goalCheck": "Em có thể tự kiểm tra bằng cách..."
    }
  ],
  "motivationalQuote": "Câu châm ngôn tạo động lực"
}

CHỈ TRẢ VỀ JSON, KHÔNG CÓ TEXT THÊM.
`;

    logger.log('Generating 7-day study plan for weaknesses:', weaknesses);

    const response = await retryWithBackoff(() => {
      return ai.models.generateContent({
        model: MODEL_COMPLEX,
        contents: prompt,
      });
    });

    if (!response || !response.text) {
      logger.error("Empty response from API");
      throw new Error("API trả về kết quả rỗng. Vui lòng thử lại.");
    }

    const responseText = response.text.trim();
    logger.log('Raw response length:', responseText.length);

    // Remove markdown code blocks if present
    const cleanJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let studyPlan: StudyPlan;
    try {
      studyPlan = JSON.parse(cleanJson) as StudyPlan;
    } catch (parseError) {
      logger.error("JSON parse error:", parseError);
      throw new Error("Không thể xử lý kết quả từ AI. Vui lòng thử lại.");
    }

    // Validate response
    if (!studyPlan || !studyPlan.days || studyPlan.days.length === 0) {
      logger.error("Invalid study plan response format");
      throw new Error("AI không tạo được kế hoạch học tập. Vui lòng thử lại.");
    }

    // Add creation timestamp and options
    studyPlan.createdAt = Date.now();
    studyPlan.options = options;

    logger.log('Successfully generated study plan with', studyPlan.days.length, 'days');
    return studyPlan;
  } catch (err: any) {
    logger.error("generate7DayStudyPlan error", err);

    // Re-throw with more context if it's our custom error
    if (err?.message && (err.message.includes('API') || err.message.includes('AI'))) {
      throw err;
    }

    return null;
  }
};
