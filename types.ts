
export enum Sender {
  User = 'user',
  Bot = 'bot'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isLoading?: boolean;
  files?: UploadedFile[]; // Attached files with the message
}

export interface UploadedFile {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export enum AppMode {
  StudyChat = 'STUDY_CHAT',
  ExamGenerator = 'EXAM_GENERATOR',
  Dictionary = 'DICTIONARY',
  WritingWorkshop = 'WRITING_WORKSHOP',
  Roleplay = 'ROLEPLAY',
  Flashcard = 'FLASHCARD',
  Mindmap = 'MINDMAP',
  StudyPlan = 'STUDY_PLAN',
  StudentProfile = 'STUDENT_PROFILE',
  Settings = 'SETTINGS'
}

// User Personalization
export interface ExamHistory {
  id: string; // Unique ID for the exam
  date: number; // timestamp
  topic: string;
  score: number;
  weaknesses: string[];
  // Extended fields for PDF download
  examStructure?: ExamStructure; // Full exam structure
  studentWork?: string; // Student's written work
  gradingResult?: GradingResult; // Full grading feedback
  examType?: ExamType; // Type of exam
  sessionMode?: ExamSessionMode; // Practice or Exam mode
}

export interface UserProfile {
  name: string;
  weaknesses: string[]; // e.g., 'Phân tích thơ', 'Nghị luận xã hội', 'Mở bài'
  goals: string;      // e.g., 'Thi học sinh giỏi', 'Đạt 8.0+'
  examHistory?: ExamHistory[]; // Lịch sử làm bài
  strengths?: string[]; // Điểm mạnh
  knowledgeFiles?: UploadedFile[]; // User's uploaded knowledge base
  preferences?: {
    fontSize?: 'small' | 'medium' | 'large';
    autoSave?: boolean;
    studyReminders?: boolean;
    examSecurityEnabled?: boolean; // Bật/tắt chế độ giám sát thi
    personalizationEnabled?: boolean; // Bật/tắt tính năng tích hợp điểm yếu
    concurrentTasksEnabled?: boolean; // Bật/tắt chế độ chạy nhiều task đồng thời
    maxConcurrentTasks?: number; // Số lượng task tối đa có thể chạy đồng thời (mặc định 1)
  };
}

export enum ExamLevel {
  Standard = 'STANDARD', // Luyện thi bình thường (tích hợp điểm yếu)
  Advanced = 'ADVANCED' // Luyện thi nâng cao (đề khó, không tích hợp điểm yếu)
}

// Loại đề thi theo thời gian và cấu trúc
export enum ExamType {
  QuickTest = 'QUICK_TEST',       // 15 phút - Kiểm tra nhanh
  MidtermExam = 'MIDTERM_EXAM',   // 45 phút - Kiểm tra giữa kỳ
  SemesterExam = 'SEMESTER_EXAM', // 90 phút - Thi học kỳ
  NationalExam = 'NATIONAL_EXAM'  // 120 phút - Thi THPT Quốc gia
}

// Chế độ làm bài
export enum ExamSessionMode {
  Practice = 'PRACTICE', // Luyện tập - không giới hạn thời gian, có gợi ý
  Exam = 'EXAM'          // Thi thử - đếm ngược, có giám sát
}

// Cấu hình cho từng loại đề
export interface ExamTypeConfig {
  type: ExamType;
  name: string;
  duration: number; // phút
  description: string;
  structure: {
    readingQuestions: number;
    hasSocialEssay: boolean;
    hasLiteraryEssay: boolean;
    socialEssayWords?: number;  // Số từ yêu cầu
    literaryEssayWords?: number;
    readingMaterial: { minWords: number; maxWords: number };
  };
  scoring: {
    readingTotal: number;
    socialEssayScore: number;
    literaryEssayScore: number;
  };
}

// Cấu hình mặc định cho các loại đề
export const EXAM_TYPE_CONFIGS: Record<ExamType, ExamTypeConfig> = {
  [ExamType.QuickTest]: {
    type: ExamType.QuickTest,
    name: '⚡ Kiểm tra nhanh',
    duration: 15,
    description: 'Đề nhỏ gọn, kiểm tra kiến thức cơ bản',
    structure: {
      readingQuestions: 2,
      hasSocialEssay: false,
      hasLiteraryEssay: true,
      literaryEssayWords: 200,
      readingMaterial: { minWords: 100, maxWords: 150 }
    },
    scoring: {
      readingTotal: 4,
      socialEssayScore: 0,
      literaryEssayScore: 6
    }
  },
  [ExamType.MidtermExam]: {
    type: ExamType.MidtermExam,
    name: '📝 Kiểm tra giữa kỳ',
    duration: 45,
    description: 'Đề vừa phải, cân bằng đọc hiểu và nghị luận',
    structure: {
      readingQuestions: 3,
      hasSocialEssay: true,
      hasLiteraryEssay: true,
      socialEssayWords: 150,
      literaryEssayWords: 300,
      readingMaterial: { minWords: 150, maxWords: 200 }
    },
    scoring: {
      readingTotal: 3,
      socialEssayScore: 2,
      literaryEssayScore: 5
    }
  },
  [ExamType.SemesterExam]: {
    type: ExamType.SemesterExam,
    name: '📚 Thi học kỳ',
    duration: 90,
    description: 'Đề chuẩn học kỳ, đầy đủ 3 phần',
    structure: {
      readingQuestions: 4,
      hasSocialEssay: true,
      hasLiteraryEssay: true,
      socialEssayWords: 200,
      literaryEssayWords: 400,
      readingMaterial: { minWords: 200, maxWords: 300 }
    },
    scoring: {
      readingTotal: 3,
      socialEssayScore: 2,
      literaryEssayScore: 5
    }
  },
  [ExamType.NationalExam]: {
    type: ExamType.NationalExam,
    name: '🎓 Thi THPT Quốc gia',
    duration: 120,
    description: 'Đề thi chuẩn THPT QG, độ khó cao',
    structure: {
      readingQuestions: 4,
      hasSocialEssay: true,
      hasLiteraryEssay: true,
      socialEssayWords: 200,
      literaryEssayWords: 600,
      readingMaterial: { minWords: 250, maxWords: 400 }
    },
    scoring: {
      readingTotal: 3,
      socialEssayScore: 2,
      literaryEssayScore: 5
    }
  }
};

// Structured Exam Type
export interface ExamStructure {
  title: string;
  subTitle: string; // e.g., "Môn: Ngữ Văn - Lớp 10"
  duration: string;
  examType: ExamType; // Loại đề thi
  readingComprehension: {
    material: string;
    source?: string;
    questions: {
      questionNumber: number;
      level: string; // Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao
      content: string;
      score: number;
    }[];
  };
  socialEssay?: {  // Optional - không có trong QuickTest
    prompt: string;
    score: number;
    wordCount?: number;
  };
  literaryEssay: {
    prompt: string;
    score: number;
    wordCount?: number;
  };
}

export interface QuestionFeedback {
  questionNumber?: number; // For reading comprehension
  score: number;
  maxScore: number;
  feedback: string;
  sampleAnswer: string; // Đáp án mẫu
  rubric?: WritingRubric; // Chi tiết điểm theo rubric (cho bài văn)
}

export interface GradingResult {
  totalScore: number;
  generalComment: string;
  strengths: string[];
  weaknesses: string[];
  readingFeedback: QuestionFeedback[];
  socialFeedback?: QuestionFeedback; // Optional - không có trong QuickTest
  literaryFeedback: QuestionFeedback;
  overallRubric?: WritingRubric; // Tổng điểm rubric cho toàn bài
}

export interface DictionaryEntry {
  term: string;
  definition: string;
  literaryContext: string;
  example: string;
}

export interface WritingRubric {
  logicScore: number;       // Mạch lạc, logic
  vocabularyScore: number;  // Vốn từ
  creativityScore: number;  // Sáng tạo/Cảm xúc
  knowledgeScore: number;   // Kiến thức văn học
}

export interface WritingFeedback {
  rubric: WritingRubric;
  critique: string;
  improvedVersion: string;
  betterVocabulary: string[];
}

export interface CharacterProfile {
  id: string;
  name: string;
  work: string;
  avatarColor: string;
  description: string;
}

// Flashcard & Mindmap Types
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface MindmapNode {
  id: string;
  label: string;
  category: string;
  children?: MindmapNode[];
  description?: string;
  examples?: string[];
}

// Study Plan Options - Tùy chọn khi tạo kế hoạch học tập
export interface StudyPlanOptions {
  dailyStudyTime: '1h' | '2h' | '3h' | '4h+'; // Thời gian học hàng ngày
  intensity: 'light' | 'medium' | 'high'; // Cường độ học tập
  preferredActivities: 'reading' | 'writing' | 'balanced'; // Ưu tiên loại hoạt động
  restDays: number[]; // Các ngày nghỉ (0 = Chủ nhật, 1 = Thứ 2, etc.)
  startDate?: string; // Ngày bắt đầu (optional)
}

// Default options cho study plan
export const DEFAULT_STUDY_PLAN_OPTIONS: StudyPlanOptions = {
  dailyStudyTime: '2h',
  intensity: 'medium',
  preferredActivities: 'balanced',
  restDays: [],
  startDate: undefined
};

// Study Plan for 7 days based on weaknesses
export interface StudyPlanDay {
  day: number;
  title: string;
  focus: string; // What weakness to focus on
  activities: {
    type: 'reading' | 'exercise' | 'practice' | 'review' | 'test';
    title: string;
    description: string;
    duration: string; // e.g., "30 phút", "1 giờ"
    resources?: string[];
  }[];
  tips: string[];
  goalCheck: string; // How to know the day is successful
  isRestDay?: boolean; // Đánh dấu ngày nghỉ
}

export interface StudyPlan {
  title: string;
  description: string;
  createdAt: number;
  weaknesses: string[];
  days: StudyPlanDay[];
  motivationalQuote: string;
  options?: StudyPlanOptions; // Lưu lại options đã chọn
}

// Chat History for saving and restoring conversations
export interface ChatSession {
  id: string;
  title: string; // First message or auto-generated title
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  mode: 'study' | 'roleplay';
  characterId?: string; // For roleplay sessions
}

// ============================================
// WELLNESS & BREAK REMINDER - NHẮC NHỞ NGHỈ NGƠI
// Bảo vệ sức khỏe học sinh khi học trực tuyến
// ============================================

export interface UsageSession {
  sessionStartTime: number;      // Thời điểm bắt đầu session
  lastBreakTime: number;         // Lần nghỉ cuối cùng
  totalMessagesInSession: number; // Tổng số tin nhắn trong session
  totalStudyMinutes: number;     // Tổng thời gian học (phút)
  breaksTaken: number;           // Số lần đã nghỉ
}

export interface BreakReminder {
  shouldRemind: boolean;
  message: string;
  type: 'gentle' | 'moderate' | 'urgent';
  suggestedBreakMinutes: number;
}

export interface WellnessSettings {
  breakReminderEnabled: boolean;   // Bật/tắt nhắc nhở nghỉ ngơi
  breakIntervalMinutes: number;    // Khoảng cách giữa các lần nhắc (mặc định 45 phút)
  maxSessionMinutes: number;       // Thời gian tối đa mỗi phiên (mặc định 120 phút)
  showHealthTips: boolean;         // Hiển thị mẹo sức khỏe
}

export const DEFAULT_WELLNESS_SETTINGS: WellnessSettings = {
  breakReminderEnabled: true,
  breakIntervalMinutes: 45,
  maxSessionMinutes: 120,
  showHealthTips: true
};

// Health tips để hiển thị ngẫu nhiên
export const HEALTH_TIPS = [
  "Nhớ nghỉ ngơi mắt sau mỗi 20 phút học - Nhìn xa 6 mét trong 20 giây!",
  "Uống đủ nước giúp não bộ hoạt động tốt hơn. Em đã uống nước chưa?",
  "Ngồi thẳng lưng và giữ khoảng cách với màn hình ít nhất 50cm nhé!",
  "Vận động nhẹ giữa giờ học giúp máu lưu thông tốt hơn.",
  "Ngủ đủ 8 tiếng mỗi đêm giúp ghi nhớ bài học hiệu quả hơn!",
  "Ăn sáng đầy đủ giúp em tập trung học tốt hơn đó!",
  "Hãy nhờ bố mẹ hoặc thầy cô giúp đỡ nếu gặp bài khó nhé!",
  "Học từng phần nhỏ, nghỉ ngơi xen kẽ hiệu quả hơn học dồn một lúc.",
  "Đừng quên dành thời gian chơi và gặp gỡ bạn bè ngoài đời thực!",
  "Nếu cảm thấy mệt hoặc căng thẳng, hãy dừng lại và thư giãn một chút."
];
