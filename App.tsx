
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Send,
  Paperclip,
  FileText,
  GraduationCap,
  Sparkles,
  X,
  Menu,
  MessageSquare,
  Clock,
  BrainCircuit,
  Lightbulb,
  BookA,
  Search,
  CheckCircle2,
  AlertCircle,
  PenTool,
  Users,
  Feather,
  RefreshCw,
  ArrowRight,
  LogOut,
  Timer,
  UserCircle2,
  Settings2,
  Save,
  BarChart3,
  Award,
  FileBadge,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  BookCheck,
  Zap,
  Brain,
  Sun,
  Moon,
  Contrast,
  TrendingUp,
  History,
  Shield,
  ShieldOff,
  Layers,
  RotateCcw,
  Calendar,
  Target,
  BookMarked,
  ClipboardList,
  Plus,
  Download,
  Camera,
  SwitchCamera,
  ImageIcon,
  Trash2,
  Clock
} from 'lucide-react';
import { AppMode, Message, Sender, UploadedFile, ExamStructure, GradingResult, DictionaryEntry, WritingFeedback, CharacterProfile, UserProfile, ExamLevel, ExamType, ExamSessionMode, EXAM_TYPE_CONFIGS, QuestionFeedback, ExamHistory, Flashcard, MindmapNode, StudyPlan, StudyPlanOptions, DEFAULT_STUDY_PLAN_OPTIONS, ChatSession } from './types';
import {
  sendMessageToGemini,
  generateExamPaper,
  gradeStudentWork,
  lookupDictionaryTerm,
  analyzeAndImproveWriting,
  sendMessageAsCharacter,
  generateFlashcards,
  generateMindmap,
  updateConcurrentTaskSettings,
  generate7DayStudyPlan,
  searchTerms,
  extractTextFromImage
} from './services/geminiService';
import logger from './utils/logger';
import {
  GRADE_10_WEAKNESS_OPTIONS,
  GRADE_10_CHARACTERS,
  GRADE_10_EXAM_TOPICS,
  Grade10Character
} from './grade10-literature-knowledge';

// --- PDF Generation Helper ---
const generateExamPDF = (examHistory: ExamHistory) => {
  const { examStructure, studentWork, gradingResult, date, score } = examHistory;
  if (!examStructure || !gradingResult) {
    alert('Không có đủ dữ liệu để tạo PDF. Chỉ có thể tải PDF cho các bài thi mới.');
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${examStructure.title} - Kết quả</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', serif; font-size: 14px; line-height: 1.6; padding: 40px; max-width: 210mm; margin: 0 auto; }
    .header { text-align: center; border-bottom: 2px double #333; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { font-size: 18px; font-weight: bold; margin: 10px 0; }
    .header p { font-size: 12px; color: #666; }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .section-title { font-size: 16px; font-weight: bold; color: #1a365d; border-bottom: 1px solid #1a365d; padding-bottom: 5px; margin-bottom: 15px; }
    .material { background: #f7fafc; padding: 15px; border-left: 4px solid #4299e1; margin-bottom: 15px; font-style: italic; }
    .material-source { text-align: right; font-weight: bold; font-style: normal; margin-top: 10px; }
    .question { margin: 15px 0; }
    .question strong { color: #2d3748; }
    .essay-prompt { background: #faf5ff; padding: 15px; border-left: 4px solid #805ad5; margin: 15px 0; }
    .student-work { background: #fffaf0; padding: 20px; border: 1px dashed #ed8936; margin: 15px 0; white-space: pre-wrap; }
    .student-work-title { color: #c05621; font-weight: bold; margin-bottom: 10px; }
    .feedback { background: #f0fff4; padding: 15px; border-left: 4px solid #48bb78; margin: 15px 0; }
    .feedback-title { color: #276749; font-weight: bold; margin-bottom: 10px; }
    .score-box { display: inline-block; background: #ebf8ff; padding: 5px 15px; border-radius: 20px; color: #2b6cb0; font-weight: bold; }
    .score-good { background: #c6f6d5; color: #276749; }
    .score-medium { background: #fefcbf; color: #975a16; }
    .score-low { background: #fed7d7; color: #c53030; }
    .summary { background: #edf2f7; padding: 20px; border-radius: 8px; margin-top: 30px; }
    .summary h3 { color: #2d3748; margin-bottom: 15px; }
    .strengths { color: #276749; }
    .weaknesses { color: #c53030; }
    .sample-answer { background: #ebf8ff; padding: 15px; border-left: 4px solid #4299e1; margin: 15px 0; }
    .final-score { font-size: 36px; color: #2d3748; text-align: center; margin: 30px 0; }
    .final-score span { font-size: 18px; color: #718096; }
    @media print { body { padding: 20px; } .section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <p>BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
    <h1>${examStructure.title}</h1>
    <p>${examStructure.subTitle}</p>
    <p>Ngày thi: ${new Date(date).toLocaleDateString('vi-VN')} | Thời gian: ${examStructure.duration} phút</p>
  </div>

  <div class="final-score">
    <span>Điểm số:</span> ${score.toFixed(1)}/10
  </div>

  <div class="section">
    <div class="section-title">I. PHẦN ĐỌC HIỂU</div>
    <div class="material">
      ${examStructure.readingComprehension.material}
      ${examStructure.readingComprehension.source ? `<div class="material-source">- ${examStructure.readingComprehension.source} -</div>` : ''}
    </div>
    ${examStructure.readingComprehension.questions.map((q, idx) => `
      <div class="question">
        <strong>Câu ${q.questionNumber} (${q.score} điểm):</strong> ${q.content}
        ${gradingResult.readingFeedback[idx] ? `
          <div class="feedback">
            <div class="feedback-title">Nhận xét: <span class="score-box ${gradingResult.readingFeedback[idx].score >= q.score * 0.8 ? 'score-good' : gradingResult.readingFeedback[idx].score >= q.score * 0.5 ? 'score-medium' : 'score-low'}">${gradingResult.readingFeedback[idx].score}/${q.score}đ</span></div>
            ${gradingResult.readingFeedback[idx].feedback}
            <div class="sample-answer"><strong>Đáp án mẫu:</strong> ${gradingResult.readingFeedback[idx].sampleAnswer}</div>
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>

  ${examStructure.socialEssay ? `
  <div class="section">
    <div class="section-title">II. NGHỊ LUẬN XÃ HỘI (${examStructure.socialEssay.score} điểm)</div>
    <div class="essay-prompt">${examStructure.socialEssay.prompt}</div>
    ${gradingResult.socialFeedback ? `
      <div class="feedback">
        <div class="feedback-title">Nhận xét: <span class="score-box ${gradingResult.socialFeedback.score >= examStructure.socialEssay.score * 0.8 ? 'score-good' : gradingResult.socialFeedback.score >= examStructure.socialEssay.score * 0.5 ? 'score-medium' : 'score-low'}">${gradingResult.socialFeedback.score}/${examStructure.socialEssay.score}đ</span></div>
        ${gradingResult.socialFeedback.feedback}
        <div class="sample-answer"><strong>Bài mẫu:</strong><br>${gradingResult.socialFeedback.sampleAnswer}</div>
      </div>
    ` : ''}
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">${examStructure.socialEssay ? 'III' : 'II'}. NGHỊ LUẬN VĂN HỌC (${examStructure.literaryEssay.score} điểm)</div>
    <div class="essay-prompt">${examStructure.literaryEssay.prompt}</div>
    <div class="feedback">
      <div class="feedback-title">Nhận xét: <span class="score-box ${gradingResult.literaryFeedback.score >= examStructure.literaryEssay.score * 0.8 ? 'score-good' : gradingResult.literaryFeedback.score >= examStructure.literaryEssay.score * 0.5 ? 'score-medium' : 'score-low'}">${gradingResult.literaryFeedback.score}/${examStructure.literaryEssay.score}đ</span></div>
      ${gradingResult.literaryFeedback.feedback}
      <div class="sample-answer"><strong>Bài mẫu:</strong><br>${gradingResult.literaryFeedback.sampleAnswer}</div>
    </div>
  </div>

  ${studentWork ? `
  <div class="section">
    <div class="section-title">BÀI LÀM CỦA HỌC SINH</div>
    <div class="student-work">
      <div class="student-work-title">Nội dung bài làm:</div>
      ${studentWork}
    </div>
  </div>
  ` : ''}

  <div class="summary">
    <h3>NHẬN XÉT TỔNG QUÁT</h3>
    <p><strong>Nhận xét chung:</strong> ${gradingResult.generalComment}</p>
    <p class="strengths"><strong>Điểm mạnh:</strong> ${gradingResult.strengths.join(', ') || 'Không có'}</p>
    <p class="weaknesses"><strong>Cần cải thiện:</strong> ${gradingResult.weaknesses.join(', ') || 'Không có'}</p>
  </div>

  <p style="text-align: center; margin-top: 40px; color: #718096; font-size: 12px;">
    Được tạo bởi AI Hỗ Trợ Học Tập Văn Học - Dự án AI For Good
  </p>
</body>
</html>
  `;

  // Create and trigger download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

// --- Export Exam History as JSON ---
const exportExamHistoryAsJSON = (examHistory: ExamHistory[]) => {
  const dataToExport = examHistory.map(exam => ({
    id: exam.id,
    date: exam.date,
    topic: exam.topic,
    score: exam.score,
    examType: exam.examType,
    sessionMode: exam.sessionMode,
    weaknesses: exam.weaknesses,
    examStructure: exam.examStructure,
    studentWork: exam.studentWork,
    gradingResult: exam.gradingResult
  }));

  const jsonContent = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lich-su-kiem-tra_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// --- Export All App Data as JSON ---
const exportAllDataAsJSON = (data: {
  userProfile: UserProfile | null;
  chatHistory: ChatSession[];
  appVersion?: string;
}) => {
  const { userProfile, chatHistory } = data;

  const exportData = {
    exportedAt: new Date().toISOString(),
    appVersion: '1.0.0',
    appName: 'VanHoc10 AI - Trợ Lý Văn Học',

    // User Profile
    profile: userProfile ? {
      name: userProfile.name,
      grade: userProfile.grade,
      school: userProfile.school,
      strengths: userProfile.strengths,
      weaknesses: userProfile.weaknesses,
      goals: userProfile.goals,
      createdAt: userProfile.createdAt,
      preferences: userProfile.preferences,
      knowledgeFiles: userProfile.knowledgeFiles?.map(f => ({
        name: f.name,
        type: f.type,
        uploadedAt: f.uploadedAt
      }))
    } : null,

    // Exam History
    examHistory: userProfile?.examHistory?.map(exam => ({
      id: exam.id,
      date: exam.date,
      topic: exam.topic,
      score: exam.score,
      examType: exam.examType,
      sessionMode: exam.sessionMode,
      weaknesses: exam.weaknesses,
      examStructure: exam.examStructure,
      studentWork: exam.studentWork,
      gradingResult: exam.gradingResult
    })) || [],

    // Chat History
    chatHistory: chatHistory.map(session => ({
      id: session.id,
      title: session.title,
      mode: session.mode,
      characterId: session.characterId,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messageCount: session.messages.length,
      messages: session.messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp
      }))
    })),

    // Statistics
    statistics: {
      totalExams: userProfile?.examHistory?.length || 0,
      totalChatSessions: chatHistory.length,
      totalChatMessages: chatHistory.reduce((acc, s) => acc + s.messages.length, 0),
      averageExamScore: userProfile?.examHistory?.length
        ? (userProfile.examHistory.reduce((acc, e) => acc + e.score, 0) / userProfile.examHistory.length).toFixed(1)
        : null,
      knowledgeFilesCount: userProfile?.knowledgeFiles?.length || 0
    }
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vanhoc10-backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// --- Generate All Exams PDF ---
const generateAllExamsPDF = (examHistory: ExamHistory[]) => {
  const examsWithData = examHistory.filter(exam => exam.examStructure && exam.gradingResult);

  if (examsWithData.length === 0) {
    alert('Không có bài kiểm tra nào có đủ dữ liệu để tạo PDF.');
    return;
  }

  const examsHTML = examsWithData.map((exam, index) => {
    const { examStructure, studentWork, gradingResult, date, score } = exam;
    if (!examStructure || !gradingResult) return '';

    return `
      <div class="exam-entry" ${index > 0 ? 'style="page-break-before: always;"' : ''}>
        <div class="header">
          <p>BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
          <h1>${examStructure.title}</h1>
          <p>${examStructure.subTitle}</p>
          <p>Ngày thi: ${new Date(date).toLocaleDateString('vi-VN')} | Thời gian: ${examStructure.duration} phút</p>
        </div>

        <div class="final-score">
          <span>Điểm số:</span> ${score.toFixed(1)}/10
        </div>

        <div class="section">
          <div class="section-title">I. PHẦN ĐỌC HIỂU</div>
          <div class="material">
            ${examStructure.readingComprehension.material}
            ${examStructure.readingComprehension.source ? `<div class="material-source">- ${examStructure.readingComprehension.source} -</div>` : ''}
          </div>
          ${examStructure.readingComprehension.questions.map((q, idx) => `
            <div class="question">
              <strong>Câu ${q.questionNumber} (${q.score} điểm):</strong> ${q.content}
              ${gradingResult.readingFeedback[idx] ? `
                <div class="feedback">
                  <div class="feedback-title">Nhận xét: <span class="score-box ${gradingResult.readingFeedback[idx].score >= q.score * 0.8 ? 'score-good' : gradingResult.readingFeedback[idx].score >= q.score * 0.5 ? 'score-medium' : 'score-low'}">${gradingResult.readingFeedback[idx].score}/${q.score}đ</span></div>
                  ${gradingResult.readingFeedback[idx].feedback}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        ${examStructure.socialEssay ? `
        <div class="section">
          <div class="section-title">II. NGHỊ LUẬN XÃ HỘI (${examStructure.socialEssay.score} điểm)</div>
          <div class="essay-prompt">${examStructure.socialEssay.prompt}</div>
          ${gradingResult.socialFeedback ? `
            <div class="feedback">
              <div class="feedback-title">Nhận xét: <span class="score-box ${gradingResult.socialFeedback.score >= examStructure.socialEssay.score * 0.8 ? 'score-good' : gradingResult.socialFeedback.score >= examStructure.socialEssay.score * 0.5 ? 'score-medium' : 'score-low'}">${gradingResult.socialFeedback.score}/${examStructure.socialEssay.score}đ</span></div>
              ${gradingResult.socialFeedback.feedback}
            </div>
          ` : ''}
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">${examStructure.socialEssay ? 'III' : 'II'}. NGHỊ LUẬN VĂN HỌC (${examStructure.literaryEssay.score} điểm)</div>
          <div class="essay-prompt">${examStructure.literaryEssay.prompt}</div>
          <div class="feedback">
            <div class="feedback-title">Nhận xét: <span class="score-box ${gradingResult.literaryFeedback.score >= examStructure.literaryEssay.score * 0.8 ? 'score-good' : gradingResult.literaryFeedback.score >= examStructure.literaryEssay.score * 0.5 ? 'score-medium' : 'score-low'}">${gradingResult.literaryFeedback.score}/${examStructure.literaryEssay.score}đ</span></div>
            ${gradingResult.literaryFeedback.feedback}
          </div>
        </div>

        ${studentWork ? `
        <div class="section">
          <div class="section-title">BÀI LÀM CỦA HỌC SINH</div>
          <div class="student-work">
            <div class="student-work-title">Nội dung bài làm:</div>
            ${studentWork}
          </div>
        </div>
        ` : ''}

        <div class="summary">
          <h3>NHẬN XÉT TỔNG QUÁT</h3>
          <p><strong>Nhận xét chung:</strong> ${gradingResult.generalComment}</p>
          <p class="strengths"><strong>Điểm mạnh:</strong> ${gradingResult.strengths.join(', ') || 'Không có'}</p>
          <p class="weaknesses"><strong>Cần cải thiện:</strong> ${gradingResult.weaknesses.join(', ') || 'Không có'}</p>
        </div>
      </div>
    `;
  }).join('');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Lịch Sử Kiểm Tra - Tổng Hợp</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', serif; font-size: 14px; line-height: 1.6; padding: 40px; max-width: 210mm; margin: 0 auto; }
    .header { text-align: center; border-bottom: 2px double #333; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { font-size: 18px; font-weight: bold; margin: 10px 0; }
    .header p { font-size: 12px; color: #666; }
    .section { margin-bottom: 30px; page-break-inside: avoid; }
    .section-title { font-size: 16px; font-weight: bold; color: #1a365d; border-bottom: 1px solid #1a365d; padding-bottom: 5px; margin-bottom: 15px; }
    .material { background: #f7fafc; padding: 15px; border-left: 4px solid #4299e1; margin-bottom: 15px; font-style: italic; }
    .material-source { text-align: right; font-weight: bold; font-style: normal; margin-top: 10px; }
    .question { margin: 15px 0; }
    .question strong { color: #2d3748; }
    .essay-prompt { background: #faf5ff; padding: 15px; border-left: 4px solid #805ad5; margin: 15px 0; }
    .student-work { background: #fffaf0; padding: 20px; border: 1px dashed #ed8936; margin: 15px 0; white-space: pre-wrap; }
    .student-work-title { color: #c05621; font-weight: bold; margin-bottom: 10px; }
    .feedback { background: #f0fff4; padding: 15px; border-left: 4px solid #48bb78; margin: 15px 0; }
    .feedback-title { color: #276749; font-weight: bold; margin-bottom: 10px; }
    .score-box { display: inline-block; background: #ebf8ff; padding: 5px 15px; border-radius: 20px; color: #2b6cb0; font-weight: bold; }
    .score-good { background: #c6f6d5; color: #276749; }
    .score-medium { background: #fefcbf; color: #975a16; }
    .score-low { background: #fed7d7; color: #c53030; }
    .summary { background: #edf2f7; padding: 20px; border-radius: 8px; margin-top: 30px; }
    .summary h3 { color: #2d3748; margin-bottom: 15px; }
    .strengths { color: #276749; }
    .weaknesses { color: #c53030; }
    .final-score { font-size: 36px; color: #2d3748; text-align: center; margin: 30px 0; }
    .final-score span { font-size: 18px; color: #718096; }
    .exam-entry { margin-bottom: 60px; }
    .cover-page { text-align: center; padding: 100px 40px; page-break-after: always; }
    .cover-page h1 { font-size: 32px; margin-bottom: 20px; color: #1a365d; }
    .cover-page p { font-size: 16px; color: #4a5568; margin: 10px 0; }
    .cover-page .stats { margin-top: 60px; padding: 30px; background: #f7fafc; border-radius: 8px; }
    .cover-page .stats h3 { color: #2d3748; margin-bottom: 20px; }
    @media print { body { padding: 20px; } .section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="cover-page">
    <h1>TỔNG HỢP LỊCH SỬ KIỂM TRA</h1>
    <p>Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
    <div class="stats">
      <h3>Thống Kê</h3>
      <p>Tổng số bài kiểm tra: ${examsWithData.length}</p>
      <p>Điểm trung bình: ${examsWithData.length > 0 ? (examsWithData.reduce((sum, e) => sum + e.score, 0) / examsWithData.length).toFixed(2) : 'N/A'}</p>
      <p>Điểm cao nhất: ${examsWithData.length > 0 ? Math.max(...examsWithData.map(e => e.score)).toFixed(1) : 'N/A'}</p>
      <p>Điểm thấp nhất: ${examsWithData.length > 0 ? Math.min(...examsWithData.map(e => e.score)).toFixed(1) : 'N/A'}</p>
    </div>
  </div>
  ${examsHTML}
  <p style="text-align: center; margin-top: 40px; color: #718096; font-size: 12px;">
    Được tạo bởi AI Hỗ Trợ Học Tập Văn Học - Dự án AI For Good
  </p>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

// --- Helper Components ---

const LoadingDots = () => (
  <div className="flex space-x-1 items-center p-2">
    <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
    <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

interface FilePreviewProps {
  file: UploadedFile;
  onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => (
  <div className="flex items-center gap-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-2 rounded-lg text-xs shadow-sm hover:border-accent/50 transition-colors group">
    <FileText className="w-3.5 h-3.5 text-accent" />
    <span className="truncate max-w-[100px] text-stone-700 dark:text-stone-300 font-medium">{file.name}</span>
    <button onClick={onRemove} className="text-stone-400 hover:text-red-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

// --- Flashcard Component ---
interface FlashcardProps {
  card: Flashcard;
}

const normalizeFlashcardText = (text?: string) =>
  (text || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .trim();

const FlashcardComponent: React.FC<FlashcardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    <div
      className="flashcard-item"
      data-category={card.category}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="relative min-h-[20rem] cursor-pointer perspective-1000">
        <div
          className={`absolute inset-0 transition-all duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 backface-hidden bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 flex flex-col justify-between overflow-y-auto"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  {normalizeFlashcardText(card.category)}
                </span>
                {card.difficulty && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColors[card.difficulty]}`}>
                    {card.difficulty === 'easy' ? 'Dễ' : card.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-stone-800 dark:text-stone-100 leading-relaxed">
                {normalizeFlashcardText(card.front)}
              </p>
            </div>
            <div className="flex items-center justify-center text-stone-400 dark:text-stone-500 text-sm mt-4">
              <RotateCcw className="w-4 h-4 mr-2" />
              Click để xem đáp án
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 backface-hidden bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10 rounded-2xl shadow-lg border-2 border-accent/50 p-6 flex flex-col justify-between overflow-y-auto"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  Đáp án
                </span>
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <p className="text-base text-stone-700 dark:text-stone-200 leading-relaxed">
                {normalizeFlashcardText(card.back)}
              </p>
            </div>
            <div className="flex items-center justify-center text-accent text-sm mt-4">
              <RotateCcw className="w-4 h-4 mr-2" />
              Click để quay lại câu hỏi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Mindmap Component ---
interface MindmapProps {
  data: MindmapNode;
}

const MindmapComponent: React.FC<MindmapProps> = ({ data }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [selectedNode, setSelectedNode] = useState<MindmapNode | null>(null);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      root: 'bg-accent text-white border-accent',
      main: 'bg-blue-500 text-white border-blue-500',
      genre: 'bg-purple-500 text-white border-purple-500',
      skill: 'bg-green-500 text-white border-green-500',
      sub: 'bg-stone-600 dark:bg-stone-700 text-white border-stone-600'
    };
    return colors[category] || 'bg-stone-400 text-white border-stone-400';
  };

  const renderNode = (node: MindmapNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className={`flex flex-col ${level > 0 ? 'ml-8 mt-4' : ''}`}>
        <div className="flex items-start gap-3">
          {/* Node */}
          <div
            onClick={() => {
              if (hasChildren) toggleNode(node.id);
              setSelectedNode(node);
            }}
            className={`
              relative px-4 py-3 rounded-xl shadow-md border-2 font-medium cursor-pointer
              transition-all hover:scale-105 hover:shadow-lg
              ${getCategoryColor(node.category)}
              ${level === 0 ? 'text-xl' : level === 1 ? 'text-lg' : 'text-base'}
            `}
          >
            <div className="flex items-center gap-2">
              {hasChildren && (
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              )}
              <span>{node.label}</span>
            </div>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col mt-2 border-l-2 border-stone-300 dark:border-stone-600 pl-4">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Mindmap Tree */}
      <div className="flex-1 overflow-x-auto">
        {renderNode(data)}
      </div>

      {/* Details Panel */}
      {selectedNode && (
        <div className="lg:w-80 bg-stone-50 dark:bg-stone-900 rounded-xl p-6 border-2 border-accent/30">
          <h4 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            {selectedNode.label}
          </h4>
          {selectedNode.description && (
            <p className="text-stone-600 dark:text-stone-400 text-sm mb-4">
              {selectedNode.description}
            </p>
          )}
          {selectedNode.examples && selectedNode.examples.length > 0 && (
            <div>
              <h5 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wider">
                Ví dụ:
              </h5>
              <ul className="space-y-2">
                {selectedNode.examples.map((example, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-stone-600 dark:text-stone-400 flex items-start gap-2"
                  >
                    <span className="text-accent font-bold">•</span>
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Welcome Screen ---
interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-stone-50 via-accent/5 to-stone-100 dark:from-stone-950 dark:via-accent/10 dark:to-stone-900 flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="max-w-4xl w-full my-8">
        {/* Main Card */}
        <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-700">

          {/* Header Section with Gradient */}
          <div className="relative p-8 md:p-12 bg-gradient-to-r from-accent/90 to-accent text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTIwIDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDIwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <BookOpen className="w-12 h-12 md:w-16 md:h-16" />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif mb-4">
                Chào mừng đến với<br className="md:hidden" /> AI Văn Học
              </h1>
              <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Trợ lý học tập thông minh giúp em chinh phục môn Ngữ Văn lớp 10
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="p-6 md:p-10 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">

              {/* Feature 1 */}
              <div className="group p-5 md:p-6 bg-stone-50 dark:bg-stone-700/50 rounded-2xl border border-stone-200 dark:border-stone-600 hover:border-accent/50 dark:hover:border-accent/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-sm md:text-base">Học Cá Nhân Hóa</h3>
                    <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">AI phân tích điểm mạnh, yếu để tạo lộ trình riêng cho em</p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group p-5 md:p-6 bg-stone-50 dark:bg-stone-700/50 rounded-2xl border border-stone-200 dark:border-stone-600 hover:border-accent/50 dark:hover:border-accent/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-sm md:text-base">Luyện Thi Thông Minh</h3>
                    <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">Tạo đề thi chuẩn, chấm tự động và phản hồi chi tiết</p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group p-5 md:p-6 bg-stone-50 dark:bg-stone-700/50 rounded-2xl border border-stone-200 dark:border-stone-600 hover:border-accent/50 dark:hover:border-accent/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:scale-110 transition-transform">
                    <PenTool className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-sm md:text-base">Phát Triển Kỹ Năng Viết</h3>
                    <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">Hướng dẫn viết văn, phân tích và cải thiện bài luận</p>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group p-5 md:p-6 bg-stone-50 dark:bg-stone-700/50 rounded-2xl border border-stone-200 dark:border-stone-600 hover:border-accent/50 dark:hover:border-accent/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:scale-110 transition-transform">
                    <BookA className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-sm md:text-base">Từ Điển Văn Học</h3>
                    <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">Tra cứu thuật ngữ, biện pháp tu từ nhanh chóng</p>
                  </div>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group p-5 md:p-6 bg-stone-50 dark:bg-stone-700/50 rounded-2xl border border-stone-200 dark:border-stone-600 hover:border-accent/50 dark:hover:border-accent/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-sm md:text-base">Đóng Vai Nhân Vật</h3>
                    <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">Trò chuyện với nhân vật văn học để hiểu sâu tác phẩm</p>
                  </div>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group p-5 md:p-6 bg-stone-50 dark:bg-stone-700/50 rounded-2xl border border-stone-200 dark:border-stone-600 hover:border-accent/50 dark:hover:border-accent/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:scale-110 transition-transform">
                    <Brain className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-sm md:text-base">Flashcard & Mindmap</h3>
                    <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">Ghi nhớ kiến thức hiệu quả với công cụ trực quan</p>
                  </div>
                </div>
              </div>

            </div>

            {/* CTA Button */}
            <div className="text-center space-y-6">
              <button
                onClick={onContinue}
                className="group inline-flex items-center gap-3 bg-accent text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/40 hover:-translate-y-1"
              >
                Bắt Đầu Ngay
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Footer Note */}
              <div className="pt-6 border-t border-stone-200 dark:border-stone-700">
                <p className="text-xs md:text-sm text-stone-400 dark:text-stone-500 italic flex items-center justify-center gap-2 flex-wrap">
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>made by An with love</span>
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Onboarding Modal ---
interface OnboardingModalProps {
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

// ĐIỂM YẾU CỦA HỌC SINH - Import từ knowledge file (CHUẨN CHƯƠNG TRÌNH LỚP 10 - 2018)
const WEAKNESS_OPTIONS = GRADE_10_WEAKNESS_OPTIONS;

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onSave, initialProfile }) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [goals, setGoals] = useState(initialProfile?.goals || '');
  const [weaknesses, setWeaknesses] = useState<string[]>(initialProfile?.weaknesses || []);
  const [customWeakness, setCustomWeakness] = useState('');

  const toggleWeakness = (w: string) => {
    if (weaknesses.includes(w)) {
      setWeaknesses(prev => prev.filter(item => item !== w));
    } else {
      setWeaknesses(prev => [...prev, w]);
    }
  };

  const addCustomWeakness = () => {
    const trimmed = customWeakness.trim();
    if (trimmed && !weaknesses.includes(trimmed)) {
      setWeaknesses(prev => [...prev, trimmed]);
      setCustomWeakness('');
    }
  };

  const removeWeakness = (w: string) => {
    setWeaknesses(prev => prev.filter(item => item !== w));
  };

  const handleSave = () => {
    if (!name.trim()) return alert("Vui lòng nhập tên của em!");
    onSave({ name, weaknesses, goals });
  };

  // Get custom weaknesses (ones not in WEAKNESS_OPTIONS)
  const customWeaknesses = weaknesses.filter(w => !WEAKNESS_OPTIONS.includes(w));

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 dark:border-stone-700 max-h-[90vh] flex flex-col">
        <div className="p-6 bg-paper dark:bg-stone-900 border-b border-[#e5e0d8] dark:border-stone-700 flex items-center gap-4 flex-shrink-0">
           <div className="p-3 bg-accent/10 rounded-full text-accent">
             <UserCircle2 className="w-8 h-8" />
           </div>
           <div>
              <h3 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100">
                {initialProfile ? "Cập Nhật Hồ Sơ Học Tập" : "Thiết Lập Hồ Sơ Cá Nhân"}
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
                AI sẽ cá nhân hóa lộ trình dựa trên thông tin này.
              </p>
           </div>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Họ và tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Văn A"
              className="w-full p-3 border border-stone-300 dark:border-stone-600 rounded-xl focus:ring-2 focus:ring-accent/20 outline-none bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 font-medium placeholder-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
              Điểm cần cải thiện <span className="font-normal text-stone-400 lowercase">(Chọn nhiều hoặc tự viết)</span>
            </label>

            {/* Predefined Options */}
            <div className="flex flex-wrap gap-2 mb-3">
              {WEAKNESS_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => toggleWeakness(opt)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${weaknesses.includes(opt) ? 'bg-accent text-white border-accent shadow-sm' : 'bg-stone-50 dark:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600 hover:border-stone-400'}`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Custom Weakness Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customWeakness}
                onChange={(e) => setCustomWeakness(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomWeakness()}
                placeholder="Hoặc tự viết điểm yếu của em..."
                className="flex-1 p-2.5 text-sm border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-accent/20 outline-none bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400"
              />
              <button
                onClick={addCustomWeakness}
                disabled={!customWeakness.trim()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                Thêm
              </button>
            </div>

            {/* Custom Weaknesses Display */}
            {customWeaknesses.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-2 font-medium">Điểm yếu tự thêm:</p>
                <div className="flex flex-wrap gap-2">
                  {customWeaknesses.map(w => (
                    <span
                      key={w}
                      className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium border border-purple-200 dark:border-purple-800 flex items-center gap-2"
                    >
                      {w}
                      <button
                        onClick={() => removeWeakness(w)}
                        className="p-0.5 hover:bg-purple-200 dark:hover:bg-purple-800 rounded transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Count */}
            {weaknesses.length > 0 && (
              <p className="text-xs text-accent font-medium mt-2">
                Đã chọn {weaknesses.length} điểm yếu
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Mục tiêu học tập</label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="VD: Đạt 8.5 điểm thi cuối kỳ, Thi đỗ chuyên Văn..."
              className="w-full p-3 border border-stone-300 dark:border-stone-600 rounded-xl focus:ring-2 focus:ring-accent/20 outline-none h-24 resize-none bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 font-medium placeholder-stone-400"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-accent text-white py-3.5 rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {initialProfile ? "Lưu Thay Đổi" : "Bắt Đầu Hành Trình"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Confirmation Modal Component ---
interface ConfirmationModalProps {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  isDanger = false
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-stone-900/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-stone-200 dark:border-stone-700 animate-scale-in">
        <div className={`p-6 border-b border-stone-200 dark:border-stone-700 flex items-center gap-4 ${isDanger ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
          <div className={`p-3 rounded-full ${isDanger ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'}`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-stone-800 dark:text-stone-100">
              {title}
            </h3>
          </div>
        </div>

        <div className="p-6">
          <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-6 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-700 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg font-bold transition-all text-sm bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-lg font-bold transition-all text-sm shadow-lg hover:shadow-xl flex items-center gap-2 ${
              isDanger
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-accent hover:bg-accent/90 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Camera Capture Component ---
interface CameraCaptureProps {
  onCapture: (imageData: string, mimeType: string) => void;
  onClose: () => void;
  isProcessing?: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose, isProcessing = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      logger.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Vui lòng cho phép truy cập camera để sử dụng tính năng này.');
      } else if (err.name === 'NotFoundError') {
        setError('Không tìm thấy camera trên thiết bị này.');
      } else {
        setError('Không thể khởi động camera. Hãy thử tải ảnh từ thư viện.');
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
      if (file.size > MAX_FILE_SIZE) {
        alert('Ảnh quá lớn (tối đa 10MB). Vui lòng chọn ảnh khác.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCapturedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmCapture = () => {
    if (capturedImage) {
      // Extract base64 data (remove data:image/jpeg;base64, prefix)
      const base64Data = capturedImage.split(',')[1];
      const mimeType = capturedImage.split(';')[0].split(':')[1] || 'image/jpeg';
      onCapture(base64Data, mimeType);
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <button
          onClick={handleClose}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors font-medium"
        >
          <X className="w-5 h-5" />
          <span>Đóng</span>
        </button>
        <h3 className="text-white font-bold">Chụp ảnh bài viết</h3>
        <button
          onClick={switchCamera}
          className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          disabled={!!capturedImage}
        >
          <SwitchCamera className="w-6 h-6" />
        </button>
      </div>

      {/* Camera/Preview Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-white mb-6">{error}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-accent/90 transition-colors flex items-center gap-2 mx-auto"
            >
              <ImageIcon className="w-5 h-5" />
              Chọn ảnh từ thư viện
            </button>
          </div>
        ) : capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="max-w-full max-h-full object-contain"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Instructions */}
      <div className="bg-black/50 px-4 py-2 text-center">
        <p className="text-white/70 text-sm">
          {capturedImage
            ? 'Xem lại ảnh và xác nhận để AI đọc nội dung'
            : 'Hãy chụp rõ ràng bài viết tay của em'}
        </p>
      </div>

      {/* Controls */}
      <div className="p-4 bg-black/50 flex items-center justify-center gap-6">
        {capturedImage ? (
          <>
            <button
              onClick={retake}
              disabled={isProcessing}
              className="px-6 py-3 bg-stone-700 text-white rounded-xl font-bold hover:bg-stone-600 transition-colors disabled:opacity-50"
            >
              Chụp lại
            </button>
            <button
              onClick={confirmCapture}
              disabled={isProcessing}
              className="px-8 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Đang đọc...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Xác nhận
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 bg-stone-700 text-white rounded-full hover:bg-stone-600 transition-colors"
              title="Chọn ảnh từ thư viện"
            >
              <ImageIcon className="w-6 h-6" />
            </button>
            <button
              onClick={capturePhoto}
              disabled={!!error}
              className="p-6 bg-white rounded-full hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Chụp ảnh"
            >
              <Camera className="w-8 h-8 text-stone-800" />
            </button>
            <button
              onClick={handleClose}
              className="p-4 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
              title="Hủy"
            >
              <X className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [isHighContrast, setIsHighContrast] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('highContrast') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('highContrast', 'false');
    }
  }, [isDarkMode, isHighContrast]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleHighContrast = () => setIsHighContrast(prev => !prev);

  const [mode, setMode] = useState<AppMode>(AppMode.StudyChat);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "Chào em! Thầy là Trợ lý Văn học AI của em. Thầy có thể giúp em ôn tập, phân tích tác phẩm, luyện viết hoặc tạo đề thi thử. Em muốn bắt đầu từ đâu?", 
      sender: Sender.Bot, 
      timestamp: Date.now() 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleGradeExamRef = useRef<(autoSubmit?: boolean) => Promise<void>>();

  // Fast vs Deep Mode - Default to fast mode to avoid rate limit issues
  const [isFastMode, setIsFastMode] = useState(true);

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Exam States
  const [examTopic, setExamTopic] = useState('');
  const [examType, setExamType] = useState<ExamType>(ExamType.QuickTest); // Default to quick test
  const [examSessionMode, setExamSessionMode] = useState<ExamSessionMode>(ExamSessionMode.Practice); // Practice or Exam mode
  const [examLevel, setExamLevel] = useState<ExamLevel>(ExamLevel.Standard);
  const [generatedExam, setGeneratedExam] = useState<ExamStructure | null>(null);
  const [isTakingExam, setIsTakingExam] = useState(false);
  const [studentWork, setStudentWork] = useState('');
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [examError, setExamError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Exam Security States
  const [securityViolations, setSecurityViolations] = useState(0);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [penaltyPoints, setPenaltyPoints] = useState(0); // Điểm bị trừ do vi phạm
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showAutoSubmitNotification, setShowAutoSubmitNotification] = useState(false);

  // Dictionary State
  const [dictTerm, setDictTerm] = useState('');
  const [dictResult, setDictResult] = useState<DictionaryEntry | null>(null);
  const [dictSuggestions, setDictSuggestions] = useState<string[]>([]);
  const [showDictSuggestions, setShowDictSuggestions] = useState(false);

  // Writing Workshop State
  const [writingText, setWritingText] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<WritingFeedback | null>(null);
  const [writingError, setWritingError] = useState<string | null>(null);

  // Flashcard States
  const [flashcardTopic, setFlashcardTopic] = useState('');
  const [flashcardCount, setFlashcardCount] = useState('10');
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[] | null>(null);
  const [flashcardError, setFlashcardError] = useState<string | null>(null);

  // Mindmap States
  const [mindmapTopic, setMindmapTopic] = useState('');
  const [generatedMindmap, setGeneratedMindmap] = useState<MindmapNode | null>(null);
  const [mindmapError, setMindmapError] = useState<string | null>(null);

  // Study Plan States
  const [generatedStudyPlan, setGeneratedStudyPlan] = useState<StudyPlan | null>(null);
  const [studyPlanError, setStudyPlanError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [studyPlanOptions, setStudyPlanOptions] = useState<StudyPlanOptions>(DEFAULT_STUDY_PLAN_OPTIONS);
  const [showStudyPlanOptions, setShowStudyPlanOptions] = useState(true); // Hiển thị form chọn options

  // Roleplay State
  const [selectedChar, setSelectedChar] = useState<CharacterProfile | null>(null);
  const [roleplayMessages, setRoleplayMessages] = useState<Message[]>([]);

  // Chat History State
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Personalization State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'chat' | 'writing'>('chat');
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger'
  });

  // Helper to show confirm dialog
  const showConfirmDialog = (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }) => {
    setConfirmDialog({
      isOpen: true,
      ...options
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Load profile on mount with error handling
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vanhoc10_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate parsed data has required fields with proper type checking
        if (
          parsed &&
          typeof parsed.name === 'string' &&
          parsed.name.trim() !== '' &&
          Array.isArray(parsed.weaknesses) &&
          typeof parsed.goals === 'string'
        ) {
          // Ensure examHistory is also an array if it exists
          if (parsed.examHistory && !Array.isArray(parsed.examHistory)) {
            parsed.examHistory = [];
          }
          // Ensure strengths is also an array if it exists
          if (parsed.strengths && !Array.isArray(parsed.strengths)) {
            parsed.strengths = [];
          }
          setUserProfile(parsed);
        } else {
          logger.warn('Invalid profile data, showing welcome screen');
          setShowWelcomeScreen(true);
        }
      } else {
        setShowWelcomeScreen(true);
      }
    } catch (error) {
      logger.error('Error loading profile:', error);
      setShowWelcomeScreen(true);
    }
  }, []);

  // Update concurrent task settings when profile changes
  useEffect(() => {
    if (userProfile?.preferences) {
      const enabled = userProfile.preferences.concurrentTasksEnabled || false;
      const maxTasks = userProfile.preferences.maxConcurrentTasks || 1;
      updateConcurrentTaskSettings(enabled, maxTasks);
    }
  }, [userProfile?.preferences?.concurrentTasksEnabled, userProfile?.preferences?.maxConcurrentTasks]);

  const handleContinueFromWelcome = () => {
    setShowWelcomeScreen(false);
    setShowProfileModal(true);
  };

  const handleSaveProfile = (profile: UserProfile) => {
    try {
      setUserProfile(profile);
      localStorage.setItem('vanhoc10_profile', JSON.stringify(profile));
      setShowProfileModal(false);
    } catch (error) {
      logger.error('Error saving profile:', error);
      alert('Không thể lưu hồ sơ. Vui lòng thử lại.');
    }
  };

  // Helper function to update and save profile
  const updateProfile = (updater: (profile: UserProfile) => UserProfile) => {
    if (!userProfile) return;
    try {
      const updated = updater(userProfile);
      setUserProfile(updated);
      localStorage.setItem('vanhoc10_profile', JSON.stringify(updated));
    } catch (error) {
      logger.error('Error updating profile:', error);
      alert('Không thể cập nhật hồ sơ. Vui lòng thử lại.');
    }
  };

  // ====== CHAT HISTORY FUNCTIONS ======

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vanhoc10_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setChatHistory(parsed);
        }
      }
    } catch (error) {
      logger.error('Error loading chat history:', error);
    }
  }, []);

  // Ref for auto-save debounce timer
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save chat history to localStorage
  const saveChatHistory = (history: ChatSession[]) => {
    try {
      // Limit to 50 sessions max
      const limitedHistory = history.slice(0, 50);
      localStorage.setItem('vanhoc10_chat_history', JSON.stringify(limitedHistory));
      setChatHistory(limitedHistory);
    } catch (error) {
      logger.error('Error saving chat history:', error);
    }
  };

  // Save or update current chat session
  const saveCurrentChat = (forceNew: boolean = false) => {
    const currentMessages = mode === AppMode.Roleplay ? roleplayMessages : messages;
    if (currentMessages.length <= 1) return; // Don't save empty chats

    const firstUserMsg = currentMessages.find(m => m.sender === Sender.User);
    const title = firstUserMsg
      ? firstUserMsg.text.substring(0, 50) + (firstUserMsg.text.length > 50 ? '...' : '')
      : 'Cuộc trò chuyện mới';

    const currentMode = mode === AppMode.Roleplay ? 'roleplay' : 'study';

    // Check if we're updating an existing session
    if (currentSessionId && !forceNew) {
      const existingSession = chatHistory.find(s => s.id === currentSessionId);
      if (existingSession) {
        // Update the existing session
        const updatedSession: ChatSession = {
          ...existingSession,
          title,
          messages: currentMessages,
          updatedAt: Date.now(),
          mode: currentMode,
          characterId: mode === AppMode.Roleplay && selectedChar ? selectedChar.id : undefined
        };

        const updatedHistory = chatHistory.map(s =>
          s.id === currentSessionId ? updatedSession : s
        );
        saveChatHistory(updatedHistory);
        return currentSessionId;
      }
    }

    // Create a new session
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title,
      messages: currentMessages,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: currentMode,
      characterId: mode === AppMode.Roleplay && selectedChar ? selectedChar.id : undefined
    };

    const updatedHistory = [newSession, ...chatHistory];
    saveChatHistory(updatedHistory);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  // Load a chat session
  const loadChatSession = (session: ChatSession) => {
    if (session.mode === 'roleplay') {
      setMode(AppMode.Roleplay);
      setRoleplayMessages(session.messages);
      if (session.characterId) {
        const char = CHARACTERS.find(c => c.id === session.characterId);
        if (char) setSelectedChar(char);
      }
    } else {
      setMode(AppMode.StudyChat);
      setMessages(session.messages);
    }
    setCurrentSessionId(session.id);
    setShowChatHistory(false);
  };

  // Delete a chat session
  const deleteChatSession = (sessionId: string) => {
    const updatedHistory = chatHistory.filter(s => s.id !== sessionId);
    saveChatHistory(updatedHistory);
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  };

  // Start a new chat
  const startNewChat = () => {
    // Save current chat first if it has meaningful content (more than just the welcome message)
    const currentMessages = mode === AppMode.Roleplay ? roleplayMessages : messages;
    const hasUserMessages = currentMessages.some(m => m.sender === Sender.User);

    if (hasUserMessages) {
      // saveCurrentChat will update if session exists, or create new if not
      saveCurrentChat();
    }

    // Reset to fresh state
    if (mode === AppMode.Roleplay) {
      setRoleplayMessages([]);
      setSelectedChar(null);
    } else {
      setMessages([
        {
          id: '1',
          text: "Chào em! Thầy là Trợ lý Văn học AI của em. Thầy có thể giúp em ôn tập, phân tích tác phẩm, luyện viết hoặc tạo đề thi thử. Em muốn bắt đầu từ đâu?",
          sender: Sender.Bot,
          timestamp: Date.now()
        }
      ]);
    }
    setCurrentSessionId(null);
    setShowChatHistory(false);
  };

  // Auto-save chat when messages change (debounced)
  useEffect(() => {
    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    const currentMessages = mode === AppMode.Roleplay ? roleplayMessages : messages;
    const hasUserMessages = currentMessages.some(m => m.sender === Sender.User);
    const hasLoadingMessage = currentMessages.some(m => m.isLoading);

    // Only auto-save if there are user messages and no loading messages
    if (hasUserMessages && !hasLoadingMessage && !isLoading) {
      autoSaveTimerRef.current = setTimeout(() => {
        saveCurrentChat();
      }, 2000); // 2 second debounce
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, roleplayMessages, mode, isLoading]);

  // ====== RETRY MESSAGE FUNCTIONS ======

  // Retry the last bot message with specific model
  const handleRetryMessage = async (messageId: string, useDeepThinking: boolean = false, useFast: boolean = true) => {
    // Find the message index
    const currentMessages = mode === AppMode.Roleplay ? roleplayMessages : messages;
    const msgIndex = currentMessages.findIndex(m => m.id === messageId);

    if (msgIndex === -1 || currentMessages[msgIndex].sender !== Sender.Bot) return;

    // Find the previous user message
    let userMsgIndex = msgIndex - 1;
    while (userMsgIndex >= 0 && currentMessages[userMsgIndex].sender !== Sender.User) {
      userMsgIndex--;
    }

    if (userMsgIndex < 0) return;

    const userMessage = currentMessages[userMsgIndex];

    // Remove the bot message we're retrying
    const updatedMessages = currentMessages.slice(0, msgIndex);

    if (mode === AppMode.Roleplay) {
      setRoleplayMessages(updatedMessages);
    } else {
      setMessages(updatedMessages);
    }

    setIsLoading(true);

    try {
      // Determine which model to use
      const modelChoice = useDeepThinking ? false : useFast;

      if (mode === AppMode.Roleplay && selectedChar) {
        const history = updatedMessages.slice(0, -1).map(m => ({
          role: m.sender === Sender.User ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));
        const response = await sendMessageAsCharacter(
          userMessage.text,
          history,
          selectedChar.name,
          selectedChar.work,
          modelChoice
        );
        setRoleplayMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: Sender.Bot,
          timestamp: Date.now()
        }]);
      } else {
        const history = updatedMessages.slice(0, -1).map(m => ({
          role: m.sender === Sender.User ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));
        const response = await sendMessageToGemini(
          userMessage.text,
          history,
          userMessage.files || [],
          userProfile || undefined,
          modelChoice
        );
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: Sender.Bot,
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      logger.error('Error retrying message:', error);
      // Restore the original message on error
      if (mode === AppMode.Roleplay) {
        setRoleplayMessages(currentMessages);
      } else {
        setMessages(currentMessages);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // NHÂN VẬT VĂN HỌC LỚP 10 - Import từ knowledge file (CHUẨN CHƯƠNG TRÌNH 2018)
  // Convert Grade10Character sang CharacterProfile để sử dụng trong roleplay
  const CHARACTERS: CharacterProfile[] = GRADE_10_CHARACTERS.map((char: Grade10Character) => ({
    id: char.id,
    name: char.name,
    work: `${char.work} (${char.author})`,
    avatarColor: char.avatarColor,
    description: char.description
  }));

  // Timer logic - Fixed memory leak and stale closure
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isTakingExam && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Use ref to get latest function, avoiding stale closure
            handleGradeExamRef.current?.(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTakingExam, timeLeft]);

  // Exam Security: Force Fullscreen & Prevent Cheating - Only in Exam mode
  useEffect(() => {
    if (!isTakingExam) return;

    // Security only applies in Exam mode (not Practice mode)
    if (examSessionMode !== ExamSessionMode.Exam) {
      logger.log('📘 Chế độ luyện tập - Không áp dụng biện pháp bảo mật');
      return;
    }

    logger.log('🔒 Chế độ thi thử - Áp dụng biện pháp bảo mật đầy đủ');

    const PENALTY_PER_VIOLATION = 0.5; // Mỗi vi phạm trừ 0.5 điểm theo quy chế

    // Force fullscreen - try immediately and on user interaction
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        logger.error('Không thể bật fullscreen:', err);
        // Nếu không bật được ngay, thử lại khi user click
        const retryFullscreen = async () => {
          try {
            if (!document.fullscreenElement) {
              await document.documentElement.requestFullscreen();
              setIsFullscreen(true);
              document.removeEventListener('click', retryFullscreen);
            }
          } catch (e) {
            logger.error('Retry fullscreen failed:', e);
          }
        };
        document.addEventListener('click', retryFullscreen, { once: true });
      }
    };
    enterFullscreen();

    // Helper function to record violation
    const recordViolation = (violationType: string) => {
      setSecurityViolations(prev => prev + 1);
      setPenaltyPoints(prev => Math.min(prev + PENALTY_PER_VIOLATION, 10)); // Max 10 điểm trừ
      setShowSecurityWarning(true);
      setTimeout(() => setShowSecurityWarning(false), 3000);
      logger.warn(`⚠️ Vi phạm quy chế thi: ${violationType}`);
    };

    // Prevent copy/paste/cut
    const preventCopyPaste = (e: Event) => {
      e.preventDefault();
      recordViolation('Sao chép/Dán văn bản');
    };

    // Prevent right-click
    const preventContextMenu = (e: Event) => {
      e.preventDefault();
      recordViolation('Sử dụng menu chuột phải');
    };

    // Detect tab switch / focus loss
    const handleVisibilityChange = () => {
      if (document.hidden && isTakingExam) {
        recordViolation('Chuyển tab/cửa sổ khác');
      }
    };

    // Detect fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isTakingExam) {
        setIsFullscreen(false);
        recordViolation('Thoát chế độ toàn màn hình');
        // Try to re-enter fullscreen
        setTimeout(() => {
          enterFullscreen();
        }, 500);
      }
    };

    // Prevent keyboard shortcuts (F12, Ctrl+Shift+I, etc.)
    const preventDevTools = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        recordViolation('Sử dụng Developer Tools');
      }
    };

    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', preventDevTools);

    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', preventDevTools);

      // Exit fullscreen when exam ends
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => logger.error('Lỗi thoát fullscreen:', err));
      }
      setIsFullscreen(false);
      setSecurityViolations(0);
      setPenaltyPoints(0);
    };
  }, [isTakingExam, userProfile, examSessionMode]);

  // Prevent tab switch when taking exam
  const handleModeChange = (newMode: AppMode) => {
    if (isTakingExam) {
      showConfirmDialog({
        title: 'Thoát bài thi?',
        message: 'Em đang làm bài thi. Nếu thoát bây giờ, bài làm sẽ không được lưu. Em có chắc chắn không?',
        confirmText: 'Thoát',
        cancelText: 'Tiếp tục làm bài',
        variant: 'warning',
        onConfirm: () => {
          // Reset all exam-related states
          setIsTakingExam(false);
          setGeneratedExam(null);
          setStudentWork("");
          setTimeLeft(0);
          setSecurityViolations(0);
          setPenaltyPoints(0);
          setGradingResult(null);
          setMode(newMode);
        }
      });
    } else {
      setMode(newMode);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, roleplayMessages]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
    const oversizedFiles = Array.from(fileList).filter(file => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ');
      alert(`Tệp quá lớn (tối đa 10MB): ${fileNames}`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      // Convert all files to base64 using Promise.all for proper async handling
      const filePromises = Array.from(fileList).map((file: File) => {
        return new Promise<UploadedFile>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              const base64 = (e.target.result as string).split(',')[1];
              resolve({
                name: file.name,
                mimeType: file.type,
                data: base64
              });
            } else {
              reject(new Error(`Failed to read file: ${file.name}`));
            }
          };
          reader.onerror = () => reject(new Error(`Error reading file: ${file.name}`));
          reader.readAsDataURL(file);
        });
      });

      const newFiles = await Promise.all(filePromises);
      setFiles(prev => [...prev, ...newFiles]);

      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      logger.error('Error uploading files:', error);
      alert('Có lỗi khi tải tệp lên. Vui lòng thử lại!');
    }
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && files.length === 0) || isLoading) return;

    const tempFiles = [...files];

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: Sender.User,
      timestamp: Date.now(),
      files: tempFiles.length > 0 ? tempFiles : undefined
    };

    if (mode === AppMode.Roleplay) {
      setRoleplayMessages(prev => [...prev, newMessage]);
    } else {
      setMessages(prev => [...prev, newMessage]);
    }

    setInputMessage('');
    setFiles([]); // Clear files after sending
    setIsLoading(true);

    if (mode === AppMode.Roleplay && selectedChar) {
      const history = roleplayMessages.map(m => ({
        role: m.sender === Sender.User ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      const response = await sendMessageAsCharacter(newMessage.text, history, selectedChar.name, selectedChar.work, isFastMode);
       setRoleplayMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: Sender.Bot,
        timestamp: Date.now()
      }]);
    } else {
      const history = messages.map(m => ({
        role: m.sender === Sender.User ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      const response = await sendMessageToGemini(newMessage.text, history, tempFiles, userProfile || undefined, isFastMode);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: Sender.Bot,
        timestamp: Date.now()
      }]);
    }

    setIsLoading(false);
  };

  // Camera capture handler for OCR
  const handleCameraCapture = async (imageData: string, mimeType: string) => {
    setIsProcessingOCR(true);

    try {
      const extractedText = await extractTextFromImage(imageData, mimeType);

      if (extractedText) {
        if (cameraMode === 'chat') {
          // Add image as file attachment and set extracted text as message
          const imageFile: UploadedFile = {
            name: 'captured-image.jpg',
            mimeType: mimeType,
            data: imageData
          };
          setFiles(prev => [...prev, imageFile]);
          setInputMessage(extractedText);
        } else if (cameraMode === 'writing') {
          // Set extracted text to writing textarea
          setWritingText(prev => prev ? prev + '\n\n' + extractedText : extractedText);
        }
        setShowCamera(false);
      } else {
        alert('Không thể đọc được văn bản từ ảnh. Vui lòng thử chụp lại với ánh sáng tốt hơn.');
      }
    } catch (error) {
      logger.error('OCR error:', error);
      alert('Có lỗi khi xử lý ảnh. Vui lòng thử lại!');
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const openCameraForChat = () => {
    setCameraMode('chat');
    setShowCamera(true);
  };

  const openCameraForWriting = () => {
    setCameraMode('writing');
    setShowCamera(true);
  };

  const handleGenerateExam = async () => {
    if (!examTopic) {
      alert("Vui lòng nhập chủ đề hoặc tác phẩm cần ôn tập!");
      return;
    }
    setIsLoading(true);
    setExamError(null);

    try {
      // Get exam config for duration
      const examConfig = EXAM_TYPE_CONFIGS[examType];
      const result = await generateExamPaper(examTopic, examType, examLevel, files, userProfile || undefined);
      if (result) {
        setGeneratedExam(result);
        setIsTakingExam(true);
        // Safe duration parsing with fallback from config
        const parsedDuration = parseInt(result.duration);
        const safeDuration = !isNaN(parsedDuration) && parsedDuration > 0
          ? parsedDuration
          : examConfig.duration;
        // Only set timer if in Exam mode, otherwise set to 0 (no countdown)
        setTimeLeft(examSessionMode === ExamSessionMode.Exam ? safeDuration * 60 : 0);
        // Reset exam security states
        setSecurityViolations(0);
        setPenaltyPoints(0);
        setFiles([]);
      } else {
        setExamError("Không thể tạo đề thi. Vui lòng thử lại sau!");
      }
    } catch (error: any) {
      // Check for quota error
      if (error?.message?.includes('QUOTA_EXCEEDED')) {
        setExamError('⚠️ Đã vượt quá giới hạn API!\n\nAPI key của bạn đang sử dụng quota miễn phí (free tier) đã hết. Vui lòng:\n1. Kiểm tra API key tại: https://aistudio.google.com/apikey\n2. Đảm bảo API key được liên kết với billing account đã trả phí\n3. Tạo API key mới nếu cần thiết');
      } else {
        setExamError(`Lỗi khi tạo đề thi: ${error?.message || 'Vui lòng thử lại sau!'}`);
      }
    }

    setIsLoading(false);
  };

  const handleGradeExam = async (autoSubmit = false) => {
    if (!generatedExam) return;

    // Check for empty student work
    const hasStudentWork = studentWork.trim().length > 0;

    // If manual submit with empty work, don't allow
    if (!autoSubmit && !hasStudentWork) {
      alert('Vui lòng viết bài làm trước khi nộp!');
      return;
    }

    // Show confirmation modal if not auto-submit
    if (!autoSubmit) {
      setShowSubmitConfirmation(true);
      return;
    }

    // Auto-submit: Show notification to user
    setShowAutoSubmitNotification(true);

    // Proceed with submission
    setIsLoading(true);
    setIsTakingExam(false); // Stop exam mode (timer stops)

    // Handle empty student work for auto-submit (time ran out)
    let result: GradingResult | null;
    if (!hasStudentWork) {
      // Create a zero-score result for empty submission
      result = {
        totalScore: 0,
        generalComment: '⏰ HẾT GIỜ - KHÔNG NỘP BÀI\n\nEm đã không hoàn thành bài làm trong thời gian quy định. Bài thi được tự động nộp với 0 điểm.\n\n💡 Lời khuyên: Hãy quản lý thời gian tốt hơn trong các bài thi tiếp theo. Nên phân bổ thời gian hợp lý cho từng phần và bắt đầu viết ngay khi đã có ý tưởng.',
        strengths: [],
        weaknesses: ['Không hoàn thành bài thi trong thời gian quy định', 'Cần cải thiện kỹ năng quản lý thời gian'],
        readingFeedback: generatedExam.readingComprehension.questions.map((q, i) => ({
          questionNumber: i + 1,
          score: 0,
          maxScore: q.score || 1,
          feedback: 'Không có bài làm - Bài thi đã hết giờ.',
          sampleAnswer: 'Không thể hiển thị đáp án mẫu do không có bài làm.'
        })),
        literaryFeedback: {
          score: 0,
          maxScore: 5,
          feedback: 'Không có bài làm - Cần hoàn thành bài viết trong thời gian quy định.',
          sampleAnswer: 'Không thể hiển thị bài mẫu do không có bài làm.'
        },
        overallRubric: {
          logicScore: 0,
          vocabularyScore: 0,
          creativityScore: 0,
          knowledgeScore: 0
        }
      };
      // Add social essay feedback if exam has one
      if (generatedExam.socialEssay) {
        result.socialFeedback = {
          score: 0,
          maxScore: 2,
          feedback: 'Không có bài làm - Cần hoàn thành bài viết trong thời gian quy định.',
          sampleAnswer: 'Không thể hiển thị đoạn văn mẫu do không có bài làm.'
        };
      }
    } else {
      result = await gradeStudentWork(generatedExam, studentWork);
    }

    // Apply security penalty to total score
    if (result && penaltyPoints > 0) {
      const originalScore = result.totalScore;
      result.totalScore = Math.max(0, result.totalScore - penaltyPoints); // Không cho điểm âm

      // Add penalty info to general comment
      result.generalComment = `⚠️ BỊ TRỪ ${penaltyPoints.toFixed(1)} ĐIỂM do vi phạm quy chế thi (${securityViolations} lần). Điểm gốc: ${originalScore.toFixed(1)}, Điểm sau trừ: ${result.totalScore.toFixed(1)}.\n\n` + result.generalComment;

      // Add violation to weaknesses
      if (securityViolations > 0) {
        result.weaknesses.push('Vi phạm quy chế thi - cần tuân thủ kỷ luật nghiêm túc hơn');
      }
    }

    setGradingResult(result);

    // Update Profile with exam results
    if (result && userProfile && generatedExam) {
       // Add to exam history with final score (after penalty) and full data for PDF
       const newHistory: ExamHistory = {
         id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
         date: Date.now(),
         topic: generatedExam.title,
         score: result.totalScore,
         weaknesses: result.weaknesses,
         // Extended fields for PDF download
         examStructure: generatedExam,
         studentWork: studentWork,
         gradingResult: result,
         examType: examType,
         sessionMode: examSessionMode
       };

       const examHistory = [...(userProfile.examHistory || []), newHistory];

       // Update weaknesses (merge new weaknesses)
       const uniqueWeaknesses = Array.from(new Set([...userProfile.weaknesses, ...result.weaknesses]));

       // Update strengths
       const uniqueStrengths = Array.from(new Set([...(userProfile.strengths || []), ...result.strengths]));

       const updatedProfile = {
         ...userProfile,
         weaknesses: uniqueWeaknesses,
         strengths: uniqueStrengths,
         examHistory
       };
       setUserProfile(updatedProfile);
       localStorage.setItem('vanhoc10_profile', JSON.stringify(updatedProfile));
    }

    setIsLoading(false);
    setShowAutoSubmitNotification(false); // Hide auto-submit notification after grading is complete
  };

  // Keep ref updated with latest handleGradeExam function
  useEffect(() => {
    handleGradeExamRef.current = handleGradeExam;
  });

  const handleDictionaryInputChange = (value: string) => {
    setDictTerm(value);

    // Update autocomplete suggestions
    if (value.trim().length >= 2) {
      const suggestions = searchTerms(value, 8);
      setDictSuggestions(suggestions);
      setShowDictSuggestions(suggestions.length > 0);
    } else {
      setDictSuggestions([]);
      setShowDictSuggestions(false);
    }
  };

  const handleDictionaryLookup = async (term?: string) => {
    const searchTerm = term || dictTerm;
    if (!searchTerm.trim()) return;

    setDictTerm(searchTerm);
    setShowDictSuggestions(false);
    setIsLoading(true);
    const result = await lookupDictionaryTerm(searchTerm);
    setDictResult(result);
    setIsLoading(false);
  };

  const handleWritingImprove = async () => {
    if (!writingText.trim()) return;
    setIsLoading(true);
    setWritingError(null);
    setWritingFeedback(null);

    try {
      const result = await analyzeAndImproveWriting(writingText);
      if (result) {
        setWritingFeedback(result);
      } else {
        setWritingError('Không thể phân tích bài viết. Vui lòng thử lại sau.');
      }
    } catch (error) {
      setWritingError('Đã xảy ra lỗi khi phân tích bài viết. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }

    setIsLoading(false);
  };

  const handleGenerateFlashcards = async () => {
    if (!flashcardTopic.trim()) return;
    setIsLoading(true);
    setGeneratedFlashcards(null);
    setFlashcardError(null);

    try {
      const count = parseInt(flashcardCount) || 10;
      logger.log('Starting flashcard generation...');
      const result = await generateFlashcards(flashcardTopic, count);

      if (result && result.length > 0) {
        logger.log('Flashcards generated successfully:', result.length);
        setGeneratedFlashcards(result);
      } else {
        logger.log('No flashcards returned from API');
        setFlashcardError('❌ API không trả về kết quả. Có thể do:\n\n' +
          '• API key chưa được cấu hình đúng\n' +
          '• Chủ đề quá phức tạp hoặc không rõ ràng\n' +
          '• Vấn đề kết nối mạng\n\n' +
          '💡 Thử: Nhập chủ đề đơn giản hơn (VD: "Thơ Tây Tiến") và kiểm tra console để xem log chi tiết.');
      }
    } catch (error: any) {
      logger.error('Flashcard generation error:', error);
      const errorMessage = error?.message || 'Lỗi không xác định';

      if (errorMessage.includes('API') || errorMessage.includes('AI')) {
        setFlashcardError(`❌ ${errorMessage}\n\n💡 Mẹo: Kiểm tra browser console (F12) để xem log chi tiết.`);
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setFlashcardError('❌ Lỗi kết nối mạng. Vui lòng:\n\n' +
          '• Kiểm tra internet\n' +
          '• Thử lại sau vài giây\n' +
          '• Refresh trang nếu cần');
      } else {
        setFlashcardError('❌ Đã xảy ra lỗi không mong muốn.\n\n' +
          `Chi tiết: ${errorMessage}\n\n` +
          '💡 Mở browser console (F12) để xem thông tin debug.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMindmap = async () => {
    if (!mindmapTopic.trim()) return;
    setIsLoading(true);
    setGeneratedMindmap(null);
    setMindmapError(null);

    try {
      logger.log('Starting mindmap generation...');
      const result = await generateMindmap(mindmapTopic);

      if (result && result.id) {
        logger.log('Mindmap generated successfully:', result.label);
        setGeneratedMindmap(result);
      } else {
        logger.log('No mindmap returned from API');
        setMindmapError('❌ API không trả về kết quả. Có thể do:\n\n' +
          '• API key chưa được cấu hình đúng\n' +
          '• Chủ đề quá phức tạp hoặc không rõ ràng\n' +
          '• Vấn đề kết nối mạng\n\n' +
          '💡 Thử: Nhập chủ đề đơn giản hơn (VD: "Văn học lớp 10") và kiểm tra console để xem log chi tiết.');
      }
    } catch (error: any) {
      logger.error('Mindmap generation error:', error);
      const errorMessage = error?.message || 'Lỗi không xác định';

      if (errorMessage.includes('API') || errorMessage.includes('AI')) {
        setMindmapError(`❌ ${errorMessage}\n\n💡 Mẹo: Kiểm tra browser console (F12) để xem log chi tiết.`);
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setMindmapError('❌ Lỗi kết nối mạng. Vui lòng:\n\n' +
          '• Kiểm tra internet\n' +
          '• Thử lại sau vài giây\n' +
          '• Refresh trang nếu cần');
      } else {
        setMindmapError('❌ Đã xảy ra lỗi không mong muốn.\n\n' +
          `Chi tiết: ${errorMessage}\n\n` +
          '💡 Mở browser console (F12) để xem thông tin debug.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateStudyPlan = async () => {
    if (!userProfile || userProfile.weaknesses.length === 0) {
      alert("Vui lòng cập nhật hồ sơ và thêm điểm yếu cần cải thiện trước khi tạo kế hoạch!");
      return;
    }

    setIsLoading(true);
    setGeneratedStudyPlan(null);
    setStudyPlanError(null);
    setShowStudyPlanOptions(false); // Ẩn form options khi bắt đầu tạo

    try {
      logger.log('Starting study plan generation with options:', studyPlanOptions);
      const result = await generate7DayStudyPlan(
        userProfile.weaknesses,
        userProfile.goals,
        userProfile.name,
        studyPlanOptions
      );

      if (result && result.days) {
        logger.log('Study plan generated successfully:', result.title);
        setGeneratedStudyPlan(result);
        setExpandedDay(1); // Auto-expand day 1
      } else {
        logger.log('No study plan returned from API');
        setStudyPlanError('❌ Không thể tạo kế hoạch học tập. Vui lòng thử lại.');
        setShowStudyPlanOptions(true); // Hiện lại form options nếu lỗi
      }
    } catch (error: any) {
      logger.error('Study plan generation error:', error);
      const errorMessage = error?.message || 'Lỗi không xác định';
      setStudyPlanError(`❌ ${errorMessage}`);
      setShowStudyPlanOptions(true); // Hiện lại form options nếu lỗi
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle ngày nghỉ trong study plan options
  const toggleRestDay = (dayIndex: number) => {
    setStudyPlanOptions(prev => {
      const newRestDays = prev.restDays.includes(dayIndex)
        ? prev.restDays.filter(d => d !== dayIndex)
        : [...prev.restDays, dayIndex];
      return { ...prev, restDays: newRestDays };
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'reading': return <BookMarked className="w-4 h-4 text-blue-500" />;
      case 'exercise': return <PenTool className="w-4 h-4 text-purple-500" />;
      case 'practice': return <Feather className="w-4 h-4 text-green-500" />;
      case 'review': return <RefreshCw className="w-4 h-4 text-amber-500" />;
      case 'test': return <ClipboardList className="w-4 h-4 text-red-500" />;
      default: return <CheckCircle2 className="w-4 h-4 text-stone-400" />;
    }
  };

  const getActivityTypeName = (type: string) => {
    switch (type) {
      case 'reading': return 'Đọc tài liệu';
      case 'exercise': return 'Làm bài tập';
      case 'practice': return 'Luyện viết';
      case 'review': return 'Ôn tập';
      case 'test': return 'Kiểm tra';
      default: return 'Hoạt động';
    }
  };

  const startRoleplay = (char: CharacterProfile) => {
    setSelectedChar(char);
    setRoleplayMessages([{
      id: '0',
      text: `Ta là ${char.name} đây. Ngươi có điều chi muốn hỏi ta chăng?`,
      sender: Sender.Bot,
      timestamp: Date.now()
    }]);
  };

  return (
    <div className={`flex h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-800 dark:text-stone-100 overflow-hidden transition-colors duration-300`}>

      {showWelcomeScreen && (
        <WelcomeScreen onContinue={handleContinueFromWelcome} />
      )}

      {showProfileModal && (
        <OnboardingModal onSave={handleSaveProfile} initialProfile={userProfile || undefined} />
      )}

      {/* Camera Capture Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
          isProcessing={isProcessingOCR}
        />
      )}

      {/* Security Warning Modal */}
      {showSecurityWarning && isTakingExam && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
          <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-red-600 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 animate-pulse" />
            <div>
              <p className="font-bold">⚠️ Cảnh báo vi phạm quy chế thi!</p>
              <p className="text-sm">Hành động không được phép. Vi phạm: {securityViolations} lần | Trừ: {penaltyPoints.toFixed(1)} điểm</p>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Submit Notification */}
      {showAutoSubmitNotification && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200] animate-fade-in">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-8 py-6 rounded-2xl shadow-2xl border-2 border-amber-400 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold mb-2">⏰ Hết Giờ Làm Bài!</h3>
            <p className="text-white/90 mb-4">
              Thời gian làm bài đã kết thúc. Bài làm của em đang được tự động nộp và chấm điểm...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-white/80">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      <ConfirmationModal
        show={showSubmitConfirmation}
        title="Xác nhận nộp bài"
        message="Em có chắc chắn muốn nộp bài không? Bài làm sẽ được chấm điểm ngay lập tức."
        confirmText="Nộp bài"
        cancelText="Tiếp tục làm"
        onConfirm={() => {
          setShowSubmitConfirmation(false);
          handleGradeExam(true); // Pass true to bypass confirmation
        }}
        onCancel={() => setShowSubmitConfirmation(false)}
        isDanger={false}
      />

      {/* Exit Exam Confirmation Modal */}
      <ConfirmationModal
        show={showExitConfirmation}
        title="Xác nhận thoát bài thi"
        message="Em có chắc chắn muốn thoát bài thi? Bài làm sẽ không được lưu và em sẽ phải làm lại từ đầu."
        confirmText="Thoát bài thi"
        cancelText="Tiếp tục làm"
        onConfirm={() => {
          setShowExitConfirmation(false);
          setIsTakingExam(false);
          setGeneratedExam(null);
          setStudentWork("");
          setSecurityViolations(0);
          setPenaltyPoints(0);
        }}
        onCancel={() => setShowExitConfirmation(false)}
        isDanger={true}
      />

      {/* --- Sidebar --- */}
      {!isTakingExam && (
        <>
          {/* Mobile Sidebar Backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-[#fcfaf7] dark:bg-stone-900
            border-r border-[#e5e0d8] dark:border-stone-800
            flex flex-col shadow-sm transition-all duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
          <div className="p-5 border-b border-[#e5e0d8] dark:border-stone-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-accent text-white p-2 rounded-lg shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <h1 className="font-serif font-bold text-xl text-stone-800 dark:text-stone-100">AI Hộ Trợ Học Tập Môn Ngữ Văn - Dự Án AI For Good</h1>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-500 dark:text-stone-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            <button
              onClick={() => { handleModeChange(AppMode.StudyChat); setIsSidebarOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.StudyChat ? 'bg-white dark:bg-stone-800 shadow-md text-accent border border-stone-100 dark:border-stone-700' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <MessageSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Trợ Lý Học Tập</p>
                <p className="text-[10px] opacity-70 leading-tight">Hỏi đáp, giải thích bài học, phân tích văn bản</p>
              </div>
            </button>
            <button
              onClick={() => { handleModeChange(AppMode.Roleplay); setIsSidebarOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.Roleplay ? 'bg-white dark:bg-stone-800 shadow-md text-accent border border-stone-100 dark:border-stone-700' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <Users className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Hóa Thân Nhân Vật</p>
                <p className="text-[10px] opacity-70 leading-tight">Trò chuyện với nhân vật trong tác phẩm</p>
              </div>
            </button>
            <button
              onClick={() => { handleModeChange(AppMode.ExamGenerator); setIsSidebarOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.ExamGenerator ? 'bg-white dark:bg-stone-800 shadow-md text-accent border border-stone-100 dark:border-stone-700' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <GraduationCap className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Luyện Thi Giả Lập</p>
                <p className="text-[10px] opacity-70 leading-tight">Tạo đề thi, đếm giờ, AI chấm điểm chi tiết</p>
              </div>
            </button>
            <button
              onClick={() => { handleModeChange(AppMode.WritingWorkshop); setIsSidebarOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.WritingWorkshop ? 'bg-white dark:bg-stone-800 shadow-md text-accent border border-stone-100 dark:border-stone-700' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <PenTool className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Phòng Luyện Viết</p>
                <p className="text-[10px] opacity-70 leading-tight">Phân tích, chấm rubric, cải thiện bài văn</p>
              </div>
            </button>
            <button
              onClick={() => { handleModeChange(AppMode.Dictionary); setIsSidebarOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.Dictionary ? 'bg-white dark:bg-stone-800 shadow-md text-accent border border-stone-100 dark:border-stone-700' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <BookA className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Từ Điển Văn Học</p>
                <p className="text-[10px] opacity-70 leading-tight">Tra cứu thuật ngữ, biện pháp tu từ</p>
              </div>
            </button>
            <button
              onClick={() => { handleModeChange(AppMode.Flashcard); setIsSidebarOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.Flashcard ? 'bg-white dark:bg-stone-800 shadow-md text-accent border border-stone-100 dark:border-stone-700' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <RotateCcw className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Flashcards</p>
                <p className="text-[10px] opacity-70 leading-tight">Thẻ ghi nhớ theo chủ đề (AI tạo)</p>
              </div>
            </button>
            <button
              onClick={() => { handleModeChange(AppMode.Mindmap); setIsSidebarOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.Mindmap ? 'bg-white dark:bg-stone-800 shadow-md text-accent border border-stone-100 dark:border-stone-700' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <Layers className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Mindmap</p>
                <p className="text-[10px] opacity-70 leading-tight">Sơ đồ tư duy tác phẩm, tác giả</p>
              </div>
            </button>
            <button
              onClick={() => { handleModeChange(AppMode.StudyPlan); setIsSidebarOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.StudyPlan ? 'bg-white dark:bg-stone-800 shadow-md text-accent border border-stone-100 dark:border-stone-700' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Kế Hoạch 7 Ngày</p>
                <p className="text-[10px] opacity-70 leading-tight">Lộ trình học tập dựa trên điểm yếu</p>
              </div>
            </button>
            <div className="my-2 border-t border-stone-200 dark:border-stone-700"></div>
            <button
              onClick={() => { handleModeChange(AppMode.StudentProfile); setIsSidebarOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.StudentProfile ? 'bg-white dark:bg-stone-800 shadow-md text-accent border border-stone-100 dark:border-stone-700' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <UserCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Hồ Sơ Học Sinh</p>
                <p className="text-[10px] opacity-70 leading-tight">Tổng quan học tập, lịch sử thi</p>
              </div>
            </button>
            <button
              onClick={() => { handleModeChange(AppMode.Settings); setIsSidebarOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.Settings ? 'bg-white dark:bg-stone-800 shadow-md text-accent border border-stone-100 dark:border-stone-700' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <Settings2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Cài Đặt & Tài Liệu</p>
                <p className="text-[10px] opacity-70 leading-tight">Preferences, kho tài liệu</p>
              </div>
            </button>
          </nav>

          {/* Mini Profile Widget & Theme Toggle */}
          <div className="p-4 border-t border-[#e5e0d8] dark:border-stone-800 bg-white/50 dark:bg-stone-900/50">
             {/* Theme Toggle Buttons */}
             <div className="mb-3 px-1">
               <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">Giao diện</span>
               <div className="flex items-center gap-2">
                 <button
                   onClick={toggleTheme}
                   className="flex-1 p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-1"
                   title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
                 >
                   {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
                   <span className="text-[10px]">{isDarkMode ? 'Sáng' : 'Tối'}</span>
                 </button>
                 <button
                   onClick={toggleHighContrast}
                   className={`flex-1 p-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                     isHighContrast
                       ? 'bg-accent text-white'
                       : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                   }`}
                   title="Tương phản cao"
                 >
                   <Contrast className="w-3.5 h-3.5" />
                   <span className="text-[10px]">Tương phản</span>
                 </button>
               </div>
             </div>

             {userProfile && (
               <>
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Hồ sơ học viên</span>
                   <button onClick={() => setShowProfileModal(true)} className="text-stone-400 hover:text-accent">
                     <Settings2 className="w-4 h-4" />
                   </button>
                 </div>
                 <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 font-serif font-bold">
                     {userProfile.name.charAt(0)}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-stone-800 dark:text-stone-100">{userProfile.name}</p>
                     <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate max-w-[120px]">{userProfile.goals}</p>
                   </div>
                 </div>
                 {userProfile.weaknesses.length > 0 && (
                   <div className="space-y-1">
                     {userProfile.weaknesses.slice(0, 2).map((w, i) => (
                       <div key={i} className="flex items-center gap-1.5 text-[10px] text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">
                         <AlertCircle className="w-3 h-3" />
                         <span className="truncate">{w}</span>
                       </div>
                     ))}
                     {userProfile.weaknesses.length > 2 && (
                       <p className="text-[10px] text-stone-400 text-center">+ {userProfile.weaknesses.length - 2} điểm khác</p>
                     )}
                   </div>
                 )}
               </>
            )}
          </div>
        </aside>
        </>
      )}

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col relative h-full">

        {/* Global hidden file input for attachments & knowledge base */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept=".txt,.doc,.docx,.pdf,image/*"
        />
        
        {/* Header (Hidden in Exam Mode) */}
        {!isTakingExam && (
          <header className="h-16 bg-white dark:bg-stone-900 border-b border-[#e5e0d8] dark:border-stone-800 flex items-center justify-between px-4 md:px-6 shadow-sm z-10 transition-colors">
             {/* Mobile Menu Button */}
             <button
               onClick={() => setIsSidebarOpen(true)}
               className="lg:hidden p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-600 dark:text-stone-400 mr-2"
             >
               <Menu className="w-6 h-6" />
             </button>

             <h2 className="text-base md:text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
               {mode === AppMode.StudyChat && <><Sparkles className="w-5 h-5 text-accent"/> Trợ Lý Học Tập</>}
               {mode === AppMode.ExamGenerator && <><GraduationCap className="w-5 h-5 text-accent"/> Luyện Thi Giả Lập</>}
               {mode === AppMode.WritingWorkshop && <><PenTool className="w-5 h-5 text-accent"/> Phòng Luyện Viết</>}
               {mode === AppMode.Dictionary && <><BookA className="w-5 h-5 text-accent"/> Từ Điển Văn Học</>}
               {mode === AppMode.Flashcard && <><RotateCcw className="w-5 h-5 text-accent"/> Flashcards</>}
               {mode === AppMode.Mindmap && <><Layers className="w-5 h-5 text-accent"/> Mindmap</>}
               {mode === AppMode.Roleplay && <><Users className="w-5 h-5 text-accent"/> Hóa Thân Nhân Vật</>}
               {mode === AppMode.Settings && <><Settings2 className="w-5 h-5 text-accent"/> Cài Đặt & Tài Liệu</>}
             </h2>

             {/* Model Toggle & Refresh for Chat & Roleplay */}
             {(mode === AppMode.StudyChat || mode === AppMode.Roleplay) && (
               <div className="flex items-center gap-2">
                 <button
                   onClick={() => {
                     showConfirmDialog({
                       title: 'Xóa lịch sử chat?',
                       message: 'Toàn bộ tin nhắn trong cuộc trò chuyện hiện tại sẽ bị xóa. Hành động này không thể hoàn tác.',
                       confirmText: 'Xóa',
                       variant: 'danger',
                       onConfirm: () => {
                         if (mode === AppMode.StudyChat) {
                           setMessages([
                             {
                               id: '1',
                               text: "Chào em! Thầy là Trợ lý Văn học AI của em. Thầy có thể giúp em ôn tập, phân tích tác phẩm, luyện viết hoặc tạo đề thi thử. Em muốn bắt đầu từ đâu?",
                               sender: Sender.Bot,
                               timestamp: Date.now()
                             }
                           ]);
                         } else {
                           setRoleplayMessages([]);
                         }
                         setFiles([]);
                       }
                     });
                   }}
                   className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-500 dark:text-stone-400 transition-colors"
                   title="Làm mới chat"
                 >
                   <RefreshCw className="w-4 h-4" />
                 </button>
                 <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-lg border border-stone-200 dark:border-stone-700">
                   <button
                     onClick={() => setIsFastMode(true)}
                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${isFastMode ? 'bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'}`}
                   >
                     <Zap className="w-3.5 h-3.5" />
                     Trả lời nhanh
                   </button>
                   <button
                     onClick={() => setIsFastMode(false)}
                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${!isFastMode ? 'bg-white dark:bg-stone-700 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'}`}
                   >
                     <Brain className="w-3.5 h-3.5" />
                     Suy nghĩ sâu
                   </button>
                 </div>
               </div>
             )}
          </header>
        )}

        {/* --- STUDY CHAT VIEW --- */}
        {mode === AppMode.StudyChat && (
          <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900 transition-colors">
            <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === Sender.User ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-3 md:p-4 shadow-md transition-all hover:shadow-lg ${
                    msg.sender === Sender.User
                      ? 'bg-gradient-to-br from-accent to-accent/90 text-white rounded-br-none'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-bl-none'
                  }`}>
                    {msg.sender === Sender.Bot && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-stone-100 dark:border-stone-700">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">Trợ Lý AI</span>
                      </div>
                    )}
                    {/* Display attachments if present */}
                    {msg.files && msg.files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {msg.files.map((file, idx) => (
                          <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                            msg.sender === Sender.User
                              ? 'bg-white/20 border border-white/30'
                              : 'bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700'
                          }`}>
                            <FileText className={`w-3.5 h-3.5 ${msg.sender === Sender.User ? 'text-white' : 'text-accent'}`} />
                            <span className={`truncate max-w-[150px] font-medium ${
                              msg.sender === Sender.User ? 'text-white' : 'text-stone-700 dark:text-stone-300'
                            }`}>
                              {file.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                       {msg.text}
                    </div>
                    {/* Retry buttons for bot messages */}
                    {msg.sender === Sender.Bot && !isLoading && (
                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-stone-100 dark:border-stone-700">
                        <button
                          onClick={() => handleRetryMessage(msg.id, false, true)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-stone-500 dark:text-stone-400 hover:text-accent hover:bg-stone-50 dark:hover:bg-stone-700 rounded-md transition-colors"
                          title="Thử lại"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span className="hidden sm:inline">Thử lại</span>
                        </button>
                        <button
                          onClick={() => handleRetryMessage(msg.id, true, false)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-stone-500 dark:text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-md transition-colors"
                          title="Suy nghĩ sâu"
                        >
                          <Brain className="w-3 h-3" />
                          <span className="hidden sm:inline">Suy nghĩ sâu</span>
                        </button>
                        <button
                          onClick={() => handleRetryMessage(msg.id, false, true)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-stone-500 dark:text-stone-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                          title="Nhanh"
                        >
                          <Zap className="w-3 h-3" />
                          <span className="hidden sm:inline">Nhanh</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                   <div className="bg-white dark:bg-stone-800 rounded-2xl rounded-bl-none p-3 md:p-4 border border-stone-200 dark:border-stone-700 shadow-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                        <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">Đang suy nghĩ...</span>
                      </div>
                      <LoadingDots />
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 md:p-4 bg-white dark:bg-stone-900 border-t border-[#e5e0d8] dark:border-stone-800 transition-colors shadow-lg">
               {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 max-w-4xl mx-auto">
                  {files.map((file, idx) => (
                    <FilePreview key={idx} file={file} onRemove={() => setFiles(prev => prev.filter((_, i) => i !== idx))} />
                  ))}
                </div>
               )}
               <div className="flex items-center gap-2 md:gap-3 max-w-4xl mx-auto">
                 {/* Camera Button - Chụp ảnh bài viết */}
                 <button
                   onClick={openCameraForChat}
                   className="p-2 text-stone-400 hover:text-accent hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition-colors shrink-0"
                   title="Chụp ảnh bài viết"
                 >
                   <Camera className="w-5 h-5" />
                 </button>
                 {/* Chat History Button */}
                 <button
                   onClick={() => setShowChatHistory(true)}
                   className="p-2 text-stone-400 hover:text-accent hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition-colors shrink-0 relative"
                   title="Lịch sử trò chuyện"
                 >
                   <History className="w-5 h-5" />
                   {chatHistory.length > 0 && (
                     <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                       {chatHistory.length > 9 ? '9+' : chatHistory.length}
                     </span>
                   )}
                 </button>
                 <div className="w-px h-6 bg-stone-200 dark:bg-stone-700" />
                 <button
                   onClick={() => fileInputRef.current?.click()}
                   className="p-2 text-stone-400 hover:text-accent hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition-colors shrink-0"
                   title="Đính kèm tệp"
                 >
                   <Paperclip className="w-5 h-5" />
                 </button>
                <div className="flex-1 relative">
                   <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    placeholder="Hỏi về tác phẩm, tác giả hoặc gửi ảnh bài tập..."
                    disabled={isLoading}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:bg-white dark:focus:bg-stone-700 focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm md:text-base text-stone-800 dark:text-stone-100 placeholder-stone-400 disabled:opacity-50"
                   />
                   <button
                    onClick={handleSendMessage}
                    disabled={isLoading || (!inputMessage.trim() && files.length === 0)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-all hover:scale-105 active:scale-95"
                    title="Gửi tin nhắn"
                   >
                     <Send className="w-4 h-4" />
                   </button>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* --- EXAM GENERATOR VIEW --- */}
{mode === AppMode.ExamGenerator && (
  <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900 transition-colors">
            {!generatedExam ? (
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto animate-fade-in">
                 <div className="bg-white dark:bg-stone-800 p-6 md:p-8 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 w-full">
                    <div className="text-center mb-6">
                       <div className="bg-accent/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-accent">
                         <GraduationCap className="w-7 h-7" />
                       </div>
                       <h2 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100">Luyện Thi Giả Lập</h2>
                       <p className="text-stone-500 dark:text-stone-400 mt-1 text-sm">Tạo đề thi chuẩn cấu trúc từ kho dữ liệu AI</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-stone-600 dark:text-stone-300 mb-2">Chủ đề / Tác phẩm ôn tập</label>
                        <input
                          type="text"
                          value={examTopic}
                          onChange={(e) => setExamTopic(e.target.value)}
                          placeholder="VD: Bình Ngô đại cáo, Chữ người tử tù, Sử thi Đăm Săn..."
                          className="w-full p-3 border border-stone-300 dark:border-stone-600 rounded-xl focus:ring-2 focus:ring-accent/20 outline-none bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400"
                        />
                        {/* Smart Topic Suggestions - Import từ knowledge file */}
                        <div className="mt-3">
                          <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">Gợi ý nhanh (từ chương trình lớp 10):</p>
                          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                            {GRADE_10_EXAM_TOPICS.slice(0, 15).map(topic => (
                              <button
                                key={topic}
                                onClick={() => setExamTopic(topic)}
                                className="px-2.5 py-1 text-xs bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors border border-stone-200 dark:border-stone-600"
                              >
                                {topic}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Exam Type Selection - Horizontal Cards */}
                      <div>
                        <label className="block text-sm font-bold text-stone-600 dark:text-stone-300 mb-2">Chọn loại đề thi</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.values(EXAM_TYPE_CONFIGS).map((config) => {
                            const isSelected = examType === config.type;
                            return (
                              <button
                                key={config.type}
                                onClick={() => setExamType(config.type)}
                                className={`p-3 rounded-xl border-2 text-left transition-all ${
                                  isSelected
                                    ? 'border-accent bg-accent/10 dark:bg-accent/20 ring-2 ring-accent/30'
                                    : 'border-stone-200 dark:border-stone-700 hover:border-accent/50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-xs text-stone-800 dark:text-stone-100">{config.name}</span>
                                </div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block mb-1.5 ${
                                  isSelected ? 'bg-accent text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                                }`}>
                                  {config.duration} phút
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  <span className="text-[9px] px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                                    {config.structure.readingQuestions} câu ĐH
                                  </span>
                                  {config.structure.hasSocialEssay && (
                                    <span className="text-[9px] px-1 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                                      NLXH
                                    </span>
                                  )}
                                  <span className="text-[9px] px-1 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                                    NLVH {config.structure.literaryEssayWords}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Session Mode & Difficulty Level */}
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold text-stone-600 dark:text-stone-300 mb-2">Chế độ làm bài</label>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setExamSessionMode(ExamSessionMode.Practice)}
                                className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                  examSessionMode === ExamSessionMode.Practice
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-blue-300'
                                }`}
                              >
                                <BookOpen className="w-4 h-4 mx-auto mb-1" />
                                Luyện tập
                              </button>
                              <button
                                onClick={() => setExamSessionMode(ExamSessionMode.Exam)}
                                className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                  examSessionMode === ExamSessionMode.Exam
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-red-300'
                                }`}
                              >
                                <Timer className="w-4 h-4 mx-auto mb-1" />
                                Thi thử
                              </button>
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-stone-600 dark:text-stone-300 mb-2">Độ khó đề</label>
                            <select
                              value={examLevel}
                              onChange={(e) => setExamLevel(e.target.value as ExamLevel)}
                              className="w-full p-3 border border-stone-300 dark:border-stone-600 rounded-xl focus:ring-2 focus:ring-accent/20 outline-none bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100"
                            >
                              <option value={ExamLevel.Standard}>Bình thường</option>
                              <option value={ExamLevel.Advanced}>Nâng cao (HSG)</option>
                            </select>
                         </div>
                      </div>

                      {/* Session Mode Explanation */}
                      <div className={`p-4 rounded-xl border ${
                        examSessionMode === ExamSessionMode.Practice
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      }`}>
                        <div className="text-xs space-y-1">
                          {examSessionMode === ExamSessionMode.Practice ? (
                            <>
                              <p className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" /> Chế độ LUYỆN TẬP
                              </p>
                              <ul className="text-blue-600 dark:text-blue-400 space-y-0.5 ml-4 list-disc">
                                <li>Không giới hạn thời gian</li>
                                <li>Không bật chế độ giám sát</li>
                                <li>Tập trung vào việc học và làm quen dạng đề</li>
                              </ul>
                            </>
                          ) : (
                            <>
                              <p className="font-bold text-red-800 dark:text-red-300 flex items-center gap-1">
                                <Timer className="w-3.5 h-3.5" /> Chế độ THI THỬ
                              </p>
                              <ul className="text-red-600 dark:text-red-400 space-y-0.5 ml-4 list-disc">
                                <li>Đếm ngược thời gian như thi thật</li>
                                <li>Bật chế độ giám sát (fullscreen, chống gian lận)</li>
                                <li>Trừ điểm nếu vi phạm quy chế thi</li>
                              </ul>
                            </>
                          )}
                        </div>
                      </div>

                      {/* User Weakness Info */}
                      {examLevel === ExamLevel.Standard && userProfile && userProfile.weaknesses.length > 0 && userProfile?.preferences?.personalizationEnabled !== false && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-xs">
                              <p className="font-bold text-blue-800 dark:text-blue-300 mb-1">Đề thi sẽ tập trung vào điểm yếu của em:</p>
                              <p className="text-blue-600 dark:text-blue-400">{userProfile.weaknesses.join(", ")}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-2">
                        <label className="block text-sm font-bold text-stone-600 dark:text-stone-300 mb-2">Tài liệu tham khảo (Tùy chọn)</label>
                        <div className="flex items-center gap-3">
                           <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 flex items-center gap-2 text-sm">
                              <Paperclip className="w-4 h-4" /> Tải tệp lên
                           </button>
                           <span className="text-xs text-stone-400">{files.length} tệp đã chọn</span>
                        </div>
                      </div>

                      <button
                        onClick={handleGenerateExam}
                        disabled={isLoading}
                        className={`w-full mt-4 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2 ${
                          examSessionMode === ExamSessionMode.Exam
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                            : 'bg-accent hover:bg-accent/90 text-white shadow-accent/20'
                        }`}
                      >
                        {isLoading ? <LoadingDots /> : (
                          examSessionMode === ExamSessionMode.Exam
                            ? <><Timer className="w-5 h-5" /> Bắt Đầu Thi Thử</>
                            : <><Sparkles className="w-5 h-5" /> Bắt Đầu Luyện Tập</>
                        )}
                      </button>

                      {/* Error message for exam generation */}
                      {examError && (
                        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                              <span className="text-red-500 dark:text-red-400 text-xl">⚠️</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-red-700 dark:text-red-300 mb-1">Lỗi tạo đề thi</p>
                              <p className="text-red-600 dark:text-red-400 text-sm whitespace-pre-line">{examError}</p>
                              {examError.includes('API key') && (
                                <a
                                  href="https://aistudio.google.com/apikey"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  Mở Google AI Studio để kiểm tra API key →
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                 </div>
                </div>
              </div>
            ) : !gradingResult ? (
              // --- TAKING EXAM MODE ---
              <div className="flex h-full flex-col bg-stone-100 dark:bg-stone-900 transition-colors">
                 {/* Exam Toolbar - Enhanced Professional CBT Style */}
                 <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 dark:from-black dark:via-stone-900 dark:to-black text-white h-16 flex items-center justify-between px-8 shadow-2xl z-20 border-b-2 border-accent/30">
                    <div className="flex items-center gap-5">
                       <div className="flex items-center gap-2">
                         <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-lg">
                           <GraduationCap className="w-6 h-6 text-white" />
                         </div>
                         <div>
                           <span className="font-bold text-base text-white">AI Hộ Trợ Học Tập Môn Ngữ Văn - Dự Án AI For Good</span>
                           <div className="text-[10px] text-stone-400 uppercase tracking-wider">Computer-Based Test</div>
                         </div>
                       </div>
                       <div className="h-10 w-px bg-stone-700"></div>
                       <div>
                         <span className="text-xs text-stone-400 uppercase tracking-wider block">Đề thi</span>
                         <span className="text-sm text-white font-semibold truncate max-w-[250px] block">{generatedExam.title}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       {/* Session Mode Badge */}
                       <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                         examSessionMode === ExamSessionMode.Practice
                           ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                           : 'bg-red-500/20 border-red-500 text-red-400'
                       }`}>
                         {examSessionMode === ExamSessionMode.Practice ? (
                           <><BookOpen className="w-4 h-4" /><span className="text-xs font-bold">LUYỆN TẬP</span></>
                         ) : (
                           <><Timer className="w-4 h-4" /><span className="text-xs font-bold">THI THỬ</span></>
                         )}
                       </div>
                       {/* Security Violations & Penalty Indicator - Only in Exam mode */}
                       {examSessionMode === ExamSessionMode.Exam && securityViolations > 0 && (
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500 rounded-lg">
                           <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
                           <div className="text-xs font-bold text-red-400">
                             <div>{securityViolations} Vi phạm</div>
                             <div className="text-[10px]">Trừ: {penaltyPoints.toFixed(1)}đ</div>
                           </div>
                         </div>
                       )}
                       {/* Timer - Only show countdown in Exam mode */}
                       <div className="flex items-center gap-3 px-4 py-2 bg-stone-800/50 rounded-lg border border-stone-700">
                         {examSessionMode === ExamSessionMode.Exam ? (
                           <>
                             <Timer className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                             <div>
                               <div className="text-[9px] text-stone-400 uppercase tracking-wider">Thời gian còn lại</div>
                               <div className={`font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-emerald-400'}`}>
                                 {formatTime(timeLeft)}
                               </div>
                             </div>
                           </>
                         ) : (
                           <>
                             <BookOpen className="w-5 h-5 text-blue-400" />
                             <div>
                               <div className="text-[9px] text-stone-400 uppercase tracking-wider">Chế độ</div>
                               <div className="font-mono text-lg font-bold text-blue-400">
                                 Không giới hạn
                               </div>
                             </div>
                           </>
                         )}
                       </div>
                       {/* Submit Button */}
                       <button
                         onClick={() => handleGradeExam(false)}
                         disabled={isLoading}
                         className="bg-accent hover:bg-accent/90 px-8 py-2.5 rounded-lg font-bold transition-all text-sm shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
                       >
                         <CheckCircle2 className="w-4 h-4" />
                         {isLoading ? "Đang nộp..." : "Nộp Bài"}
                       </button>
                       {/* Exit Exam Button */}
                       <button
                         onClick={() => setShowExitConfirmation(true)}
                         className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
                         title="Thoát bài thi"
                       >
                         <LogOut className="w-5 h-5" />
                       </button>
                    </div>
                 </div>

                 {/* Exam Split View */}
                 <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Left: Question Paper */}
                    <div className="w-full md:w-1/2 bg-white dark:bg-stone-900 border-r-0 md:border-r border-b md:border-b-0 border-stone-300 dark:border-stone-700 overflow-y-auto p-4 md:p-8 shadow-inner">
                       <div className="max-w-3xl mx-auto font-serif text-stone-800 dark:text-stone-200">
                          <div className="text-center mb-8 pb-6 border-b-2 border-double border-stone-800 dark:border-stone-500">
                             <h3 className="uppercase font-bold text-sm text-stone-600 dark:text-stone-400">BỘ GIÁO DỤC VÀ ĐÀO TẠO</h3>
                             <h1 className="text-xl font-bold mt-2 uppercase">{generatedExam.title}</h1>
                             <p className="italic text-stone-600 dark:text-stone-400 mt-1">{generatedExam.subTitle}</p>
                          </div>
                          
                          {/* Part I: Reading */}
                          <div className="mb-8">
                             <h4 className="font-bold text-lg mb-4 text-stone-800 dark:text-stone-100">
                               I. ĐỌC HIỂU ({generatedExam.readingComprehension.questions.reduce((sum, q) => sum + q.score, 0).toFixed(1)} điểm)
                             </h4>
                             <div className="bg-stone-50 dark:bg-stone-800 p-6 rounded-lg border border-stone-200 dark:border-stone-700 mb-6 text-justify leading-relaxed italic text-stone-700 dark:text-stone-300">
                                {generatedExam.readingComprehension.material}
                                {generatedExam.readingComprehension.source && (
                                  <div className="text-right mt-2 text-sm not-italic font-bold text-stone-500 dark:text-stone-400">- {generatedExam.readingComprehension.source} -</div>
                                )}
                             </div>
                             <div className="space-y-4">
                                {generatedExam.readingComprehension.questions.map((q) => (
                                   <div key={q.questionNumber}>
                                      <p className="font-medium text-stone-800 dark:text-stone-200">
                                        <span className="font-bold">Câu {q.questionNumber} ({q.score} điểm):</span> {q.content}
                                      </p>
                                   </div>
                                ))}
                             </div>
                          </div>

                          {/* Part II: Writing */}
                          <div>
                             <h4 className="font-bold text-lg mb-4 text-stone-800 dark:text-stone-100">
                               II. LÀM VĂN ({((generatedExam.socialEssay?.score || 0) + generatedExam.literaryEssay.score).toFixed(1)} điểm)
                             </h4>
                             {generatedExam.socialEssay && (
                               <div className="mb-6">
                                  <p className="font-bold mb-2">Câu 1 ({generatedExam.socialEssay.score} điểm) - Nghị luận xã hội:</p>
                                  <p className="text-stone-700 dark:text-stone-300">{generatedExam.socialEssay.prompt}</p>
                                  {generatedExam.socialEssay.wordCount && (
                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 italic">Viết khoảng {generatedExam.socialEssay.wordCount} từ</p>
                                  )}
                               </div>
                             )}
                             <div>
                                <p className="font-bold mb-2">
                                  Câu {generatedExam.socialEssay ? '2' : '1'} ({generatedExam.literaryEssay.score} điểm) - Nghị luận văn học:
                                </p>
                                <p className="text-stone-700 dark:text-stone-300">{generatedExam.literaryEssay.prompt}</p>
                                {generatedExam.literaryEssay.wordCount && (
                                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 italic">Viết khoảng {generatedExam.literaryEssay.wordCount} từ</p>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Right: Answer Sheet */}
                    <div className="w-full md:w-1/2 bg-[#fdfbf7] dark:bg-stone-950 flex flex-col min-h-[300px] md:min-h-0">
                       <div className="p-2 md:p-3 bg-stone-200 dark:bg-stone-800 border-b border-stone-300 dark:border-stone-700 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 font-bold uppercase">
                          <span>Phiếu Trả Lời</span>
                          <span className="text-[10px] md:text-xs">Số từ: {studentWork.trim().split(/\s+/).filter(w => w.length > 0).length}</span>
                       </div>
                       <textarea
                         value={studentWork}
                         onChange={(e) => setStudentWork(e.target.value)}
                         placeholder="Nhập bài làm của em tại đây..."
                         className="flex-1 w-full p-4 md:p-8 resize-none outline-none font-serif text-base md:text-lg leading-relaxed bg-transparent text-stone-800 dark:text-stone-200 placeholder-stone-400"
                         spellCheck={false}
                       />
                    </div>
                 </div>
              </div>
            ) : (
              // --- EXAM RESULTS VIEW ---
              <div className="flex-1 flex flex-col bg-stone-50 dark:bg-stone-900 font-sans transition-colors overflow-hidden">
                 <div className="flex-1 overflow-y-auto p-4 md:p-8">
                   <div className="max-w-5xl mx-auto">
                    <button onClick={() => { setGradingResult(null); setGeneratedExam(null); setStudentWork(""); setIsTakingExam(false); }} className="mb-6 flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-accent font-medium">
                       <ArrowRight className="w-4 h-4 rotate-180" /> Quay lại màn hình chính
                    </button>

                    {/* Overall Rubric Scores - NEW! */}
                    {gradingResult.overallRubric && (
                      <div className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 shadow-lg">
                        <h3 className="font-bold text-lg text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" /> Đánh Giá Chi Tiết Theo Rubric
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Logic & Mạch lạc', score: gradingResult.overallRubric.logicScore, maxScore: 2.5, color: 'blue', icon: '🧠' },
                            { label: 'Vốn từ ngữ', score: gradingResult.overallRubric.vocabularyScore, maxScore: 2.0, color: 'purple', icon: '📚' },
                            { label: 'Sáng tạo & Cảm xúc', score: gradingResult.overallRubric.creativityScore, maxScore: 1.5, color: 'rose', icon: '✨' },
                            { label: 'Kiến thức văn học', score: gradingResult.overallRubric.knowledgeScore, maxScore: 4.0, color: 'amber', icon: '🎓' },
                          ].map((item, idx) => {
                            const percentage = (item.score / item.maxScore) * 100;
                            const isGood = percentage >= 70;
                            const isMedium = percentage >= 50 && percentage < 70;
                            return (
                              <div key={idx} className={`flex flex-col items-center p-4 bg-white dark:bg-stone-800 rounded-xl border-2 ${isGood ? 'border-emerald-300 dark:border-emerald-700' : isMedium ? 'border-amber-300 dark:border-amber-700' : 'border-red-300 dark:border-red-700'} shadow-sm`}>
                                <span className="text-3xl mb-2">{item.icon}</span>
                                <div className={`text-3xl font-bold mb-1 font-serif ${isGood ? 'text-emerald-600 dark:text-emerald-400' : isMedium ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {item.score}/{item.maxScore}
                                </div>
                                <div className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 text-center">{item.label}</div>
                                <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full mt-3 overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-500 ${isGood ? 'bg-emerald-500' : isMedium ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  />
                                </div>
                                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                                  {percentage >= 70 ? 'Tốt' : percentage >= 50 ? 'Khá' : 'Cần cải thiện'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-center text-stone-500 dark:text-stone-400 mt-4">
                          Tổng điểm rubric: {(
                            gradingResult.overallRubric.logicScore +
                            gradingResult.overallRubric.vocabularyScore +
                            gradingResult.overallRubric.creativityScore +
                            gradingResult.overallRubric.knowledgeScore
                          ).toFixed(1)}/10 điểm
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                       {/* Total Score Card */}
                       <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center text-center">
                          <span className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">Tổng Điểm</span>
                          <div className="text-6xl font-bold text-accent font-serif">{gradingResult.totalScore}</div>
                          <span className="text-stone-400 text-sm mt-1">trên thang điểm 10</span>
                       </div>

                       {/* Strengths */}
                       <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                          <h4 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-3">
                             <CheckCircle2 className="w-5 h-5" /> Điểm Mạnh
                          </h4>
                          <ul className="space-y-2">
                             {gradingResult.strengths.map((s, i) => (
                                <li key={i} className="text-sm text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                                   <span className="mt-1.5 w-1 h-1 bg-emerald-500 rounded-full flex-shrink-0"></span> {s}
                                </li>
                             ))}
                          </ul>
                       </div>

                       {/* Weaknesses */}
                       <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-800">
                          <h4 className="font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-3">
                             <AlertCircle className="w-5 h-5" /> Điểm Cần Cải Thiện
                          </h4>
                          <ul className="space-y-2">
                             {gradingResult.weaknesses.map((w, i) => (
                                <li key={i} className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                                   <span className="mt-1.5 w-1 h-1 bg-red-500 rounded-full flex-shrink-0"></span> {w}
                                </li>
                             ))}
                          </ul>
                       </div>
                    </div>

                    {/* General Comment */}
                    <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 mb-8">
                       <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-2">Nhận Xét Chung</h3>
                       <p className="text-stone-700 dark:text-stone-300 italic border-l-4 border-accent pl-4 py-1">{gradingResult.generalComment}</p>
                    </div>

                    {/* Detailed Grading Breakdown */}
                    <h3 className="font-bold text-xl text-stone-800 dark:text-stone-100 mb-4 border-b dark:border-stone-700 pb-2">Chi Tiết Chấm Điểm & Đáp Án Mẫu</h3>
                    <div className="space-y-6">
                       
                       {/* Reading Section */}
                       <div className="space-y-4">
                          <h4 className="font-bold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 p-2 rounded">I. Đọc Hiểu</h4>
                          {gradingResult.readingFeedback.map((item, idx) => (
                             <div key={idx} className="bg-white dark:bg-stone-800 p-5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                   <span className="font-bold text-stone-800 dark:text-stone-200">Câu {item.questionNumber}</span>
                                   <span className={`font-bold px-3 py-1 rounded-full text-sm ${item.score === item.maxScore ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'}`}>
                                      {item.score}/{item.maxScore} điểm
                                   </span>
                                </div>
                                <p className="text-stone-600 dark:text-stone-400 text-sm mb-4"><span className="font-semibold text-stone-800 dark:text-stone-200">Nhận xét:</span> {item.feedback}</p>
                                <div className="bg-[#fcfaf7] dark:bg-stone-900 border border-[#e5e0d8] dark:border-stone-700 p-4 rounded-lg">
                                   <p className="text-xs font-bold text-accent uppercase mb-1">Đáp Án Mẫu</p>
                                   <p className="text-stone-800 dark:text-stone-300 font-serif text-sm">{item.sampleAnswer}</p>
                                </div>
                             </div>
                          ))}
                       </div>

                       {/* Social Essay - Only show if exam has socialEssay */}
                       {gradingResult.socialFeedback && (
                         <div className="space-y-4">
                            <h4 className="font-bold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 p-2 rounded">II. Nghị Luận Xã Hội</h4>
                            <div className="bg-white dark:bg-stone-800 p-5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
                               <div className="flex justify-between items-center mb-3">
                                  <span className="font-bold text-stone-800 dark:text-stone-200">Câu 1</span>
                                  <span className={`font-bold px-3 py-1 rounded-full text-sm ${gradingResult.socialFeedback.score >= gradingResult.socialFeedback.maxScore * 0.8 ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'}`}>
                                     {gradingResult.socialFeedback.score}/{gradingResult.socialFeedback.maxScore} điểm
                                  </span>
                               </div>
                               <p className="text-stone-600 dark:text-stone-400 text-sm mb-4"><span className="font-semibold text-stone-800 dark:text-stone-200">Nhận xét:</span> {gradingResult.socialFeedback.feedback}</p>
                               <div className="bg-[#fcfaf7] dark:bg-stone-900 border border-[#e5e0d8] dark:border-stone-700 p-4 rounded-lg">
                                  <p className="text-xs font-bold text-accent uppercase mb-1">Dàn ý / Đoạn văn mẫu</p>
                                  <div className="text-stone-800 dark:text-stone-300 font-serif text-sm whitespace-pre-wrap">{gradingResult.socialFeedback.sampleAnswer}</div>
                               </div>
                            </div>
                         </div>
                       )}

                       {/* Literary Essay */}
                       <div className="space-y-4">
                          <h4 className="font-bold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 p-2 rounded">
                            {gradingResult.socialFeedback ? 'III' : 'II'}. Nghị Luận Văn Học
                          </h4>
                          <div className="bg-white dark:bg-stone-800 p-5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
                             <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-stone-800 dark:text-stone-200">
                                  Câu {gradingResult.socialFeedback ? '2' : '1'}
                                </span>
                                <span className={`font-bold px-3 py-1 rounded-full text-sm ${gradingResult.literaryFeedback.score >= gradingResult.literaryFeedback.maxScore * 0.8 ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'}`}>
                                   {gradingResult.literaryFeedback.score}/{gradingResult.literaryFeedback.maxScore} điểm
                                </span>
                             </div>
                             <p className="text-stone-600 dark:text-stone-400 text-sm mb-4"><span className="font-semibold text-stone-800 dark:text-stone-200">Nhận xét:</span> {gradingResult.literaryFeedback.feedback}</p>
                             <div className="bg-[#fcfaf7] dark:bg-stone-900 border border-[#e5e0d8] dark:border-stone-700 p-4 rounded-lg">
                                <p className="text-xs font-bold text-accent uppercase mb-1">Bài làm mẫu</p>
                                <div className="text-stone-800 dark:text-stone-300 font-serif text-sm whitespace-pre-wrap">{gradingResult.literaryFeedback.sampleAnswer}</div>
                             </div>
                          </div>
                       </div>

                    </div>

                   </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* --- WRITING WORKSHOP VIEW --- */}
        {mode === AppMode.WritingWorkshop && (
           <div className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950 p-6 flex flex-col items-center transition-colors">
              <div className="max-w-4xl w-full space-y-6">
                 <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700">
                    <h2 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                      <Feather className="w-5 h-5 text-accent" /> Phòng Luyện Viết
                    </h2>
                    <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">Dán đoạn văn, hoặc <span className="text-accent font-medium">chụp ảnh bài viết tay</span> của em. AI sẽ chấm điểm, nhận xét và đề xuất cách viết hay hơn.</p>

                    {/* Camera capture button */}
                    <button
                      onClick={openCameraForWriting}
                      className="w-full mb-4 p-4 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl bg-stone-50 dark:bg-stone-700/50 hover:border-accent hover:bg-accent/5 dark:hover:bg-accent/10 transition-all flex items-center justify-center gap-3 text-stone-500 dark:text-stone-400 hover:text-accent"
                    >
                      <Camera className="w-6 h-6" />
                      <span className="font-medium">Chụp ảnh bài viết tay</span>
                    </button>

                    <textarea
                       value={writingText}
                       onChange={(e) => setWritingText(e.target.value)}
                       className="w-full h-48 p-4 border border-stone-200 dark:border-stone-600 rounded-xl bg-stone-50 dark:bg-stone-700 focus:bg-white dark:focus:bg-stone-600 focus:ring-2 focus:ring-accent/20 outline-none resize-none font-serif text-stone-800 dark:text-stone-100 placeholder-stone-400"
                       placeholder="Nhập đoạn văn của em hoặc chụp ảnh bài viết tay..."
                    ></textarea>
                    <div className="flex justify-end mt-4">
                       <button
                         onClick={handleWritingImprove}
                         disabled={isLoading || !writingText.trim()}
                         className="bg-accent text-white px-6 py-2 rounded-lg font-bold hover:bg-accent/90 transition-colors flex items-center gap-2"
                       >
                         {isLoading ? <LoadingDots /> : <><RefreshCw className="w-4 h-4" /> Phân Tích & Nâng Cấp</>}
                       </button>
                    </div>
                 </div>

                 {/* Error message */}
                 {writingError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                          <span className="text-red-500 dark:text-red-400 text-xl">⚠️</span>
                       </div>
                       <div>
                          <p className="font-semibold text-red-700 dark:text-red-300">Lỗi phân tích</p>
                          <p className="text-red-600 dark:text-red-400 text-sm">{writingError}</p>
                       </div>
                    </div>
                 )}

                 {writingFeedback && (
                    <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-lg border border-accent/20 animate-slide-up">
                       {/* Rubric Scores */}
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                          {[
                             { label: 'Logic & Mạch lạc', score: writingFeedback.rubric.logicScore, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                             { label: 'Vốn từ ngữ', score: writingFeedback.rubric.vocabularyScore, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                             { label: 'Sáng tạo & Cảm xúc', score: writingFeedback.rubric.creativityScore, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
                             { label: 'Kiến thức văn học', score: writingFeedback.rubric.knowledgeScore, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
                          ].map((item, idx) => (
                             <div key={idx} className="flex flex-col items-center p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-700">
                                <div className="text-2xl font-bold mb-1 font-serif text-stone-800 dark:text-stone-100">{item.score}/10</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider ${item.color}`}>{item.label}</div>
                                <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full mt-2 overflow-hidden">
                                   <div className={`h-full ${item.bg.includes('blue') ? 'bg-blue-500' : item.bg.includes('purple') ? 'bg-purple-500' : item.bg.includes('rose') ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${item.score * 10}%` }}></div>
                                </div>
                             </div>
                          ))}
                       </div>

                       <div className="space-y-6">
                          <div>
                             <h4 className="font-bold text-stone-800 dark:text-stone-200 mb-2 flex items-center gap-2"><Search className="w-4 h-4"/> Nhận Xét Chi Tiết</h4>
                             <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{writingFeedback.critique}</p>
                          </div>
                          
                          <div>
                             <h4 className="font-bold text-accent mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Phiên Bản Nâng Cấp (Văn Mẫu)</h4>
                             <div className="bg-[#fcfaf7] dark:bg-stone-900 p-5 rounded-xl border border-[#e5e0d8] dark:border-stone-700 font-serif text-stone-800 dark:text-stone-300 leading-relaxed italic relative">
                                <div className="absolute top-2 left-2 text-6xl text-accent/10 font-serif leading-none select-none">“</div>
                                {writingFeedback.improvedVersion}
                             </div>
                          </div>

                          <div>
                             <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Gợi Ý Từ Vựng Đắt Giá</h4>
                             <div className="flex flex-wrap gap-2">
                                {writingFeedback.betterVocabulary.map((word, i) => (
                                   <span key={i} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium border border-emerald-100 dark:border-emerald-800">
                                      {word}
                                   </span>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* --- DICTIONARY VIEW --- */}
        {mode === AppMode.Dictionary && (
           <div className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950 p-6 flex flex-col items-center transition-colors">
              <div className="max-w-3xl w-full">
                 <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Từ Điển Văn Học</h2>
                    <p className="text-stone-500 dark:text-stone-400">Tra cứu thuật ngữ, điển cố, điển tích, kỹ nghệ sáng tác chuẩn xác</p>
                 </div>

                 <div className="relative mb-6">
                    <input
                      type="text"
                      value={dictTerm}
                      onChange={(e) => handleDictionaryInputChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleDictionaryLookup()}
                      onFocus={() => {
                        if (dictTerm.trim().length >= 2 && dictSuggestions.length > 0) {
                          setShowDictSuggestions(true);
                        }
                      }}
                      onBlur={() => setTimeout(() => setShowDictSuggestions(false), 200)}
                      placeholder="Nhập thuật ngữ (VD: nhan dao, dien tich, lien ngu...)"
                      className="w-full py-4 pl-6 pr-14 rounded-full border-2 border-stone-200 dark:border-stone-700 shadow-sm focus:shadow-lg focus:border-accent outline-none text-lg bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 transition-all"
                    />
                    <button
                      onClick={() => handleDictionaryLookup()}
                      disabled={isLoading || !dictTerm.trim()}
                      className="absolute right-2 top-2 p-2.5 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                       <Search className="w-5 h-5" />
                    </button>

                    {/* Autocomplete Dropdown */}
                    {showDictSuggestions && dictSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up">
                        {dictSuggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleDictionaryLookup(suggestion)}
                            className="w-full px-6 py-3 text-left hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors border-b border-stone-100 dark:border-stone-700 last:border-0 text-stone-800 dark:text-stone-200 font-medium"
                          >
                            <span className="flex items-center gap-2">
                              <Search className="w-4 h-4 text-accent" />
                              {suggestion}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                 </div>

                 {/* Popular Terms Suggestions */}
                 {!dictResult && !isLoading && (
                   <div className="mb-8">
                     <p className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3 text-center">Thuật ngữ phổ biến</p>
                     <div className="flex flex-wrap gap-2 justify-center">
                       {[
                         'Nhân đạo chủ nghĩa',
                         'Chủ nghĩa hiện thực',
                         'Lãng mạn chủ nghĩa',
                         'Biện chứng phép',
                         'Ước lệ tượng trưng',
                         'Điển tích',
                         'Liên ngữ',
                         'Tu từ',
                         'Phép nhân hóa',
                         'So sánh ẩn dụ',
                         'Tượng thanh',
                         'Nghịch ngữ',
                       ].map((term) => (
                         <button
                           key={term}
                           onClick={() => {
                             setDictTerm(term);
                             setTimeout(() => handleDictionaryLookup(), 100);
                           }}
                           className="px-4 py-2 bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-full text-sm font-medium hover:border-accent hover:text-accent hover:shadow-md transition-all"
                         >
                           {term}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}

                 {isLoading && (
                   <div className="flex flex-col items-center justify-center py-12">
                     <LoadingDots />
                     <p className="text-stone-500 dark:text-stone-400 text-sm mt-4">Đang tra cứu...</p>
                   </div>
                 )}

                 {dictResult && (
                    <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border-2 border-stone-200 dark:border-stone-700 overflow-hidden animate-slide-up text-left">
                       <div className="bg-gradient-to-r from-accent to-accent/80 p-8 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                          <div className="relative">
                            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Thuật ngữ văn học</p>
                            <h3 className="text-3xl font-serif font-bold capitalize">{dictResult.term}</h3>
                          </div>
                       </div>
                       <div className="p-8 space-y-6">
                          <div className="bg-stone-50 dark:bg-stone-900 p-6 rounded-xl border-l-4 border-accent">
                             <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                               <BookOpen className="w-4 h-4"/> Định nghĩa
                             </h4>
                             <p className="text-stone-800 dark:text-stone-200 font-medium text-lg leading-relaxed">{dictResult.definition}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border-2 border-amber-200 dark:border-amber-800 shadow-sm">
                                <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <BookCheck className="w-4 h-4"/> Trong văn học
                                </h4>
                                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{dictResult.literaryContext}</p>
                             </div>
                             <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 p-6 rounded-xl border-2 border-sky-200 dark:border-sky-800 shadow-sm">
                                <h4 className="text-sm font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <Sparkles className="w-4 h-4"/> Ví dụ minh họa
                                </h4>
                                <p className="text-stone-700 dark:text-stone-300 font-serif italic leading-relaxed">"{dictResult.example}"</p>
                             </div>
                          </div>

                          <button
                            onClick={() => { setDictResult(null); setDictTerm(''); }}
                            className="w-full mt-4 px-6 py-3 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl font-bold hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" /> Tra cứu thuật ngữ khác
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* --- ROLEPLAY VIEW --- */}
        {mode === AppMode.Roleplay && (
           <div className="flex-1 flex flex-col bg-[#f3f4f6] dark:bg-stone-950 overflow-hidden transition-colors">
              {!selectedChar ? (
                 <div className="flex-1 p-8 overflow-y-auto">
                    <div className="text-center mb-8">
                       <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100">Hóa Thân Nhân Vật</h2>
                       <p className="text-stone-500 dark:text-stone-400">Trò chuyện với người xưa để thấu hiểu văn học nay</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                       {CHARACTERS.map((char) => (
                          <div 
                            key={char.id} 
                            onClick={() => startRoleplay(char)}
                            className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 hover:shadow-md hover:border-accent/50 transition-all cursor-pointer group"
                          >
                             <div className={`w-16 h-16 rounded-full ${char.avatarColor} dark:bg-opacity-20 flex items-center justify-center text-2xl font-serif font-bold mb-4 group-hover:scale-110 transition-transform`}>
                                {char.name.charAt(0)}
                             </div>
                             <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">{char.name}</h3>
                             <p className="text-xs text-stone-400 uppercase tracking-wider mb-2">{char.work}</p>
                             <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2">{char.description}</p>
                          </div>
                       ))}
                    </div>
                 </div>
              ) : (
                 <>
                    <div className="h-16 bg-white dark:bg-stone-900 border-b border-[#e5e0d8] dark:border-stone-800 flex items-center justify-between px-6 shadow-sm transition-colors">
                       <div className="flex items-center gap-3">
                          <button onClick={() => { setSelectedChar(null); setRoleplayMessages([]); }} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-500 dark:text-stone-400">
                             <ArrowRight className="w-5 h-5 rotate-180" />
                          </button>
                          <div className={`w-10 h-10 rounded-full ${selectedChar.avatarColor} dark:bg-opacity-20 flex items-center justify-center font-bold font-serif`}>
                             {selectedChar.name.charAt(0)}
                          </div>
                          <div>
                             <h3 className="font-bold text-stone-800 dark:text-stone-100">{selectedChar.name}</h3>
                             <p className="text-xs text-stone-500 dark:text-stone-400">{selectedChar.work}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] dark:bg-none">
                       {roleplayMessages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.sender === Sender.User ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                                msg.sender === Sender.User
                                  ? 'bg-stone-800 dark:bg-stone-700 text-white rounded-br-none'
                                  : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-bl-none font-serif italic'
                             }`}>
                                {/* Display attachments if present */}
                                {msg.files && msg.files.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {msg.files.map((file, idx) => (
                                      <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                                        msg.sender === Sender.User
                                          ? 'bg-white/20 border border-white/30'
                                          : 'bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700'
                                      }`}>
                                        <FileText className={`w-3.5 h-3.5 ${msg.sender === Sender.User ? 'text-white' : 'text-accent'}`} />
                                        <span className={`truncate max-w-[150px] font-medium ${
                                          msg.sender === Sender.User ? 'text-white' : 'text-stone-700 dark:text-stone-300'
                                        }`}>
                                          {file.name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {msg.text}
                               {/* Retry buttons for bot messages in roleplay */}
                               {msg.sender === Sender.Bot && !isLoading && (
                                 <div className="flex items-center gap-1 mt-3 pt-3 border-t border-stone-100 dark:border-stone-700 not-italic">
                                   <button
                                     onClick={() => handleRetryMessage(msg.id, false, true)}
                                     className="flex items-center gap-1 px-2 py-1 text-xs text-stone-500 dark:text-stone-400 hover:text-accent hover:bg-stone-50 dark:hover:bg-stone-700 rounded-md transition-colors"
                                     title="Thử lại"
                                   >
                                     <RefreshCw className="w-3 h-3" />
                                     <span className="hidden sm:inline">Thử lại</span>
                                   </button>
                                   <button
                                     onClick={() => handleRetryMessage(msg.id, true, false)}
                                     className="flex items-center gap-1 px-2 py-1 text-xs text-stone-500 dark:text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-md transition-colors"
                                     title="Suy nghĩ sâu"
                                   >
                                     <Brain className="w-3 h-3" />
                                     <span className="hidden sm:inline">Suy nghĩ sâu</span>
                                   </button>
                                   <button
                                     onClick={() => handleRetryMessage(msg.id, false, true)}
                                     className="flex items-center gap-1 px-2 py-1 text-xs text-stone-500 dark:text-stone-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                                     title="Nhanh"
                                   >
                                     <Zap className="w-3 h-3" />
                                     <span className="hidden sm:inline">Nhanh</span>
                                   </button>
                                 </div>
                               )}
                             </div>
                          </div>
                       ))}
                       {isLoading && <div className="flex justify-start"><LoadingDots /></div>}
                       <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white dark:bg-stone-900 border-t border-[#e5e0d8] dark:border-stone-800 transition-colors">
                       <div className="max-w-3xl mx-auto relative">
                          <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={`Trò chuyện với ${selectedChar.name}...`}
                            className="w-full pl-4 pr-12 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:bg-white dark:focus:bg-stone-700 focus:ring-2 focus:ring-accent/20 outline-none transition-all text-stone-800 dark:text-stone-100 placeholder-stone-400"
                          />
                          <button 
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputMessage.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-stone-800 text-white rounded-lg disabled:opacity-50 hover:bg-stone-700 transition-colors"
                          >
                             <Send className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </>
              )}
           </div>
        )}

        {/* --- FLASHCARD GENERATOR --- */}
        {mode === AppMode.Flashcard && (
          <div className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950 p-6 transition-colors">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Flashcards - Thẻ Ghi Nhớ</h2>
                <p className="text-stone-500 dark:text-stone-400">Nhập chủ đề và AI sẽ tự động tạo flashcards để ôn tập hiệu quả</p>
              </div>

              {/* Input Form */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
                      Chủ đề muốn tạo flashcards
                    </label>
                    <input
                      type="text"
                      value={flashcardTopic}
                      onChange={(e) => setFlashcardTopic(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerateFlashcards()}
                      placeholder='VD: "Thơ Tây Tiến của Quang Dũng", "Kỹ năng viết mở bài nghị luận"...'
                      className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-700 focus:border-accent outline-none bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
                    />
                    {/* Quick topic suggestions */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {[
                        'Bình Ngô đại cáo - Nguyễn Trãi',
                        'Chữ người tử tù - Nguyễn Tuân',
                        'Sử thi Đăm Săn',
                        'Thơ Đường luật - Thu hứng',
                        'Xúy Vân giả dại - Chèo'
                      ].map(topic => (
                        <button
                          key={topic}
                          onClick={() => setFlashcardTopic(topic)}
                          className="px-2.5 py-1 text-xs bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
                        Số lượng thẻ
                      </label>
                      <input
                        type="number"
                        value={flashcardCount}
                        onChange={(e) => setFlashcardCount(e.target.value)}
                        min="5"
                        max="20"
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-700 focus:border-accent outline-none bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
                      />
                    </div>
                    <button
                      onClick={handleGenerateFlashcards}
                      disabled={isLoading || !flashcardTopic.trim()}
                      className="mt-7 px-8 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Đang tạo...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Tạo Flashcards
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {flashcardError && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">Không thể tạo flashcards</h4>
                      <p className="text-red-700 dark:text-red-300 text-sm whitespace-pre-line">{flashcardError}</p>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => setFlashcardError(null)}
                          className="px-4 py-2 text-sm bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
                        >
                          Đóng
                        </button>
                        <button
                          onClick={() => {
                            setFlashcardError(null);
                            handleGenerateFlashcards();
                          }}
                          disabled={isLoading}
                          className="px-4 py-2 text-sm bg-stone-600 dark:bg-stone-700 text-white rounded-lg hover:bg-stone-700 dark:hover:bg-stone-800 transition-colors disabled:opacity-50"
                        >
                          Thử lại
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Flashcards */}
              {generatedFlashcards && generatedFlashcards.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                      Đã tạo {generatedFlashcards.length} flashcards
                    </h3>
                    <button
                      onClick={() => {
                        setGeneratedFlashcards(null);
                        setFlashcardError(null);
                      }}
                      className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedFlashcards.map((card) => (
                      <FlashcardComponent key={card.id} card={card} />
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-16">
                  <RefreshCw className="w-16 h-16 mx-auto mb-4 text-accent animate-spin" />
                  <p className="text-lg text-stone-600 dark:text-stone-400">Đang tạo flashcards...</p>
                  <p className="text-sm text-stone-500 dark:text-stone-500 mt-2">Vui lòng đợi trong giây lát</p>
                </div>
              )}

              {/* Empty State */}
              {generatedFlashcards === null && !isLoading && !flashcardError && (
                <div className="text-center py-16 text-stone-500 dark:text-stone-400">
                  <RotateCcw className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nhập chủ đề và click "Tạo Flashcards" để bắt đầu!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- MINDMAP GENERATOR --- */}
        {mode === AppMode.Mindmap && (
          <div className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950 p-6 transition-colors">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Mindmap - Sơ Đồ Tư Duy</h2>
                <p className="text-stone-500 dark:text-stone-400">Nhập chủ đề và AI sẽ tạo sơ đồ tư duy chi tiết để học tập</p>
              </div>

              {/* Input Form */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
                      Chủ đề muốn tạo mindmap
                    </label>
                    <input
                      type="text"
                      value={mindmapTopic}
                      onChange={(e) => setMindmapTopic(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerateMindmap()}
                      placeholder='VD: "Văn học lớp 10", "Kỹ năng viết nghị luận", "Thơ trữ tình"...'
                      className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-700 focus:border-accent outline-none bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
                    />
                    {/* Quick topic suggestions */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {[
                        'Thần thoại và sử thi Việt Nam',
                        'Thơ Đường luật - Đặc điểm nghệ thuật',
                        'Sân khấu dân gian (Chèo, Tuồng)',
                        'Nguyễn Trãi - Cuộc đời và sự nghiệp',
                        'Kỹ năng viết nghị luận văn học'
                      ].map(topic => (
                        <button
                          key={topic}
                          onClick={() => setMindmapTopic(topic)}
                          className="px-2.5 py-1 text-xs bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateMindmap}
                    disabled={isLoading || !mindmapTopic.trim()}
                    className="w-full px-8 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Đang tạo sơ đồ...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Tạo Mindmap
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {mindmapError && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">Không thể tạo mindmap</h4>
                      <p className="text-red-700 dark:text-red-300 text-sm whitespace-pre-line">{mindmapError}</p>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => setMindmapError(null)}
                          className="px-4 py-2 text-sm bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
                        >
                          Đóng
                        </button>
                        <button
                          onClick={() => {
                            setMindmapError(null);
                            handleGenerateMindmap();
                          }}
                          disabled={isLoading}
                          className="px-4 py-2 text-sm bg-stone-600 dark:bg-stone-700 text-white rounded-lg hover:bg-stone-700 dark:hover:bg-stone-800 transition-colors disabled:opacity-50"
                        >
                          Thử lại
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Mindmap */}
              {generatedMindmap && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                      Sơ đồ tư duy: {generatedMindmap.label}
                    </h3>
                    <button
                      onClick={() => {
                        setGeneratedMindmap(null);
                        setMindmapError(null);
                      }}
                      className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                  <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-8">
                    <MindmapComponent data={generatedMindmap} />
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-16">
                  <RefreshCw className="w-16 h-16 mx-auto mb-4 text-accent animate-spin" />
                  <p className="text-lg text-stone-600 dark:text-stone-400">Đang tạo sơ đồ tư duy...</p>
                  <p className="text-sm text-stone-500 dark:text-stone-500 mt-2">Vui lòng đợi trong giây lát</p>
                </div>
              )}

              {/* Empty State */}
              {generatedMindmap === null && !isLoading && !mindmapError && (
                <div className="text-center py-16 text-stone-500 dark:text-stone-400">
                  <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nhập chủ đề và click "Tạo Mindmap" để bắt đầu!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- STUDY PLAN VIEW --- */}
        {mode === AppMode.StudyPlan && (
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900 p-4 md:p-6 transition-colors">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-2xl mb-4 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Kế Hoạch Học Tập 7 Ngày</h2>
                <p className="text-stone-500 dark:text-stone-400">Lập kế hoạch học tập thông minh dựa trên điểm yếu của em</p>
              </div>

              {/* User Weaknesses Info */}
              {userProfile && userProfile.weaknesses.length > 0 ? (
                <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6 mb-6">
                  <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    Điểm yếu cần cải thiện của {userProfile.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {userProfile.weaknesses.map((weakness, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm font-medium border border-red-200 dark:border-red-800"
                      >
                        {weakness}
                      </span>
                    ))}
                  </div>

                  {/* Study Plan Options Form */}
                  {!generatedStudyPlan && showStudyPlanOptions && (
                    <div className="space-y-5 mb-6 pt-4 border-t border-stone-200 dark:border-stone-700">
                      <h4 className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-accent" />
                        Tùy chỉnh kế hoạch học tập
                      </h4>

                      {/* Thời gian học hàng ngày */}
                      <div>
                        <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Thời gian học mỗi ngày (sau giờ học chính khóa)
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {(['1h', '2h', '3h', '4h+'] as const).map((time) => (
                            <button
                              key={time}
                              onClick={() => setStudyPlanOptions(prev => ({ ...prev, dailyStudyTime: time }))}
                              className={`py-3 px-4 rounded-xl font-medium transition-all ${
                                studyPlanOptions.dailyStudyTime === time
                                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                                  : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-accent/10'
                              }`}
                            >
                              {time === '1h' ? '1 giờ' : time === '2h' ? '2 giờ' : time === '3h' ? '3 giờ' : '4+ giờ'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cường độ học tập */}
                      <div>
                        <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
                          <Zap className="w-4 h-4 inline mr-2" />
                          Cường độ học tập
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'light' as const, label: 'Nhẹ nhàng', icon: '🌱', desc: 'Không áp lực' },
                            { value: 'medium' as const, label: 'Vừa phải', icon: '⚡', desc: 'Cân bằng' },
                            { value: 'high' as const, label: 'Cao', icon: '🔥', desc: 'Thử thách' }
                          ].map((intensity) => (
                            <button
                              key={intensity.value}
                              onClick={() => setStudyPlanOptions(prev => ({ ...prev, intensity: intensity.value }))}
                              className={`py-3 px-3 rounded-xl font-medium transition-all text-center ${
                                studyPlanOptions.intensity === intensity.value
                                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                                  : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-accent/10'
                              }`}
                            >
                              <span className="text-lg">{intensity.icon}</span>
                              <div className="text-sm font-bold">{intensity.label}</div>
                              <div className={`text-xs ${studyPlanOptions.intensity === intensity.value ? 'text-white/80' : 'text-stone-400'}`}>{intensity.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Ưu tiên loại hoạt động */}
                      <div>
                        <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
                          <BookOpen className="w-4 h-4 inline mr-2" />
                          Ưu tiên loại hoạt động
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'reading' as const, label: 'Đọc nhiều', icon: '📚', desc: 'Phân tích văn bản' },
                            { value: 'writing' as const, label: 'Viết nhiều', icon: '✍️', desc: 'Luyện viết, làm bài' },
                            { value: 'balanced' as const, label: 'Cân bằng', icon: '⚖️', desc: 'Đọc + Viết' }
                          ].map((pref) => (
                            <button
                              key={pref.value}
                              onClick={() => setStudyPlanOptions(prev => ({ ...prev, preferredActivities: pref.value }))}
                              className={`py-3 px-3 rounded-xl font-medium transition-all text-center ${
                                studyPlanOptions.preferredActivities === pref.value
                                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                                  : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-accent/10'
                              }`}
                            >
                              <span className="text-lg">{pref.icon}</span>
                              <div className="text-sm font-bold">{pref.label}</div>
                              <div className={`text-xs ${studyPlanOptions.preferredActivities === pref.value ? 'text-white/80' : 'text-stone-400'}`}>{pref.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Ngày nghỉ trong tuần */}
                      <div>
                        <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Ngày nghỉ trong tuần (hoạt động nhẹ hoặc nghỉ hoàn toàn)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, idx) => (
                            <button
                              key={idx}
                              onClick={() => toggleRestDay(idx)}
                              className={`w-11 h-11 rounded-full font-medium transition-all ${
                                studyPlanOptions.restDays.includes(idx)
                                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                  : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                        {studyPlanOptions.restDays.length > 0 && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                            Đã chọn {studyPlanOptions.restDays.length} ngày nghỉ - những ngày này sẽ có hoạt động nhẹ hơn
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Button tạo kế hoạch */}
                  {!generatedStudyPlan && (
                    <button
                      onClick={handleGenerateStudyPlan}
                      disabled={isLoading}
                      className="w-full px-6 py-4 bg-gradient-to-r from-accent to-accent/90 text-white rounded-xl font-bold hover:from-accent/90 hover:to-accent/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-accent/20"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Đang tạo kế hoạch...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Tạo Kế Hoạch Học Tập 7 Ngày
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-8 mb-6 text-center">
                  <AlertCircle className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
                  <h3 className="font-bold text-lg text-amber-800 dark:text-amber-200 mb-2">Chưa có thông tin điểm yếu</h3>
                  <p className="text-amber-700 dark:text-amber-300 mb-4">
                    Để tạo kế hoạch học tập cá nhân hóa, em cần cập nhật hồ sơ và thêm các điểm yếu cần cải thiện.
                  </p>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors inline-flex items-center gap-2"
                  >
                    <UserCircle2 className="w-5 h-5" />
                    Cập Nhật Hồ Sơ
                  </button>
                </div>
              )}

              {/* Error Message */}
              {studyPlanError && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">Không thể tạo kế hoạch</h4>
                      <p className="text-red-700 dark:text-red-300 text-sm">{studyPlanError}</p>
                      <button
                        onClick={() => {
                          setStudyPlanError(null);
                          handleGenerateStudyPlan();
                        }}
                        disabled={isLoading}
                        className="mt-4 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        Thử lại
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-6">
                    <RefreshCw className="w-10 h-10 text-accent animate-spin" />
                  </div>
                  <p className="text-lg font-medium text-stone-600 dark:text-stone-400">Đang tạo kế hoạch học tập...</p>
                  <p className="text-sm text-stone-500 dark:text-stone-500 mt-2">AI đang phân tích điểm yếu và lên kế hoạch phù hợp</p>
                </div>
              )}

              {/* Generated Study Plan */}
              {generatedStudyPlan && (
                <div className="space-y-6">
                  {/* Plan Header */}
                  <div className="bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10 rounded-2xl p-6 border border-accent/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 font-serif">{generatedStudyPlan.title}</h3>
                        <p className="text-stone-600 dark:text-stone-400 mt-1">{generatedStudyPlan.description}</p>
                      </div>
                      <button
                        onClick={() => {
                          setGeneratedStudyPlan(null);
                          setExpandedDay(null);
                          setShowStudyPlanOptions(true); // Hiện lại form options
                        }}
                        className="px-4 py-2 text-stone-500 dark:text-stone-400 hover:text-red-500 transition-colors flex items-center gap-2 text-sm"
                      >
                        <X className="w-4 h-4" />
                        Tạo lại
                      </button>
                    </div>
                    {/* Hiển thị options đã chọn */}
                    {generatedStudyPlan.options && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {generatedStudyPlan.options.dailyStudyTime === '1h' ? '1 giờ/ngày' :
                           generatedStudyPlan.options.dailyStudyTime === '2h' ? '2 giờ/ngày' :
                           generatedStudyPlan.options.dailyStudyTime === '3h' ? '3 giờ/ngày' : '4+ giờ/ngày'}
                        </span>
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                          <Zap className="w-3 h-3 inline mr-1" />
                          {generatedStudyPlan.options.intensity === 'light' ? 'Cường độ nhẹ' :
                           generatedStudyPlan.options.intensity === 'medium' ? 'Cường độ vừa' : 'Cường độ cao'}
                        </span>
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                          <BookOpen className="w-3 h-3 inline mr-1" />
                          {generatedStudyPlan.options.preferredActivities === 'reading' ? 'Ưu tiên đọc' :
                           generatedStudyPlan.options.preferredActivities === 'writing' ? 'Ưu tiên viết' : 'Cân bằng'}
                        </span>
                        {generatedStudyPlan.options.restDays.length > 0 && (
                          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                            {generatedStudyPlan.options.restDays.length} ngày nghỉ
                          </span>
                        )}
                      </div>
                    )}
                    {generatedStudyPlan.motivationalQuote && (
                      <div className="bg-white/50 dark:bg-stone-800/50 rounded-xl p-4 border-l-4 border-accent italic text-stone-700 dark:text-stone-300">
                        "{generatedStudyPlan.motivationalQuote}"
                      </div>
                    )}
                  </div>

                  {/* Days Timeline */}
                  <div className="space-y-4">
                    {generatedStudyPlan.days.map((day) => (
                      <div
                        key={day.day}
                        className={`bg-white dark:bg-stone-800 rounded-2xl shadow-sm border-2 overflow-hidden transition-all ${
                          expandedDay === day.day
                            ? 'border-accent shadow-lg'
                            : 'border-stone-200 dark:border-stone-700 hover:border-accent/50'
                        }`}
                      >
                        {/* Day Header */}
                        <button
                          onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                          className="w-full p-4 md:p-6 flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                              day.day === 7
                                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                : 'bg-accent/10 text-accent'
                            }`}>
                              {day.day}
                            </div>
                            <div>
                              <h4 className="font-bold text-stone-800 dark:text-stone-100 text-lg">{day.title}</h4>
                              <p className="text-sm text-stone-500 dark:text-stone-400">{day.focus}</p>
                            </div>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-stone-400 transition-transform ${expandedDay === day.day ? 'rotate-90' : ''}`} />
                        </button>

                        {/* Day Content - Expanded */}
                        {expandedDay === day.day && (
                          <div className="px-4 md:px-6 pb-6 border-t border-stone-100 dark:border-stone-700 pt-4">
                            {/* Activities */}
                            <h5 className="font-bold text-stone-700 dark:text-stone-300 mb-4 flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-accent" />
                              Hoạt động học tập
                            </h5>
                            <div className="space-y-3 mb-6">
                              {day.activities.map((activity, actIdx) => (
                                <div
                                  key={actIdx}
                                  className="bg-stone-50 dark:bg-stone-900 rounded-xl p-4 border border-stone-200 dark:border-stone-700"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-stone-800 dark:text-stone-100">{activity.title}</span>
                                        <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full font-medium">
                                          {activity.duration}
                                        </span>
                                      </div>
                                      <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">{activity.description}</p>
                                      {activity.resources && activity.resources.length > 0 && (
                                        <div className="text-xs text-stone-500 dark:text-stone-500">
                                          <span className="font-medium">Tài liệu:</span> {activity.resources.join(', ')}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Tips */}
                            {day.tips && day.tips.length > 0 && (
                              <div className="mb-6">
                                <h5 className="font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4" />
                                  Mẹo học hiệu quả
                                </h5>
                                <ul className="space-y-2">
                                  {day.tips.map((tip, tipIdx) => (
                                    <li key={tipIdx} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                                      <span className="text-amber-500 mt-1">•</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Goal Check */}
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                              <h5 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Kiểm tra mục tiêu
                              </h5>
                              <p className="text-sm text-emerald-600 dark:text-emerald-300">{day.goalCheck}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- STUDENT PROFILE VIEW --- */}
        {mode === AppMode.StudentProfile && (
          <div className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950 p-6 transition-colors">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Hồ Sơ Học Sinh</h2>
                <p className="text-stone-500 dark:text-stone-400">Theo dõi tiến độ học tập và lịch sử các bài thi</p>
              </div>

              {/* Profile Info Card */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                    <UserCircle2 className="w-5 h-5 text-accent" />
                    Thông Tin Học Viên
                  </h3>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
                  >
                    <Settings2 className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                </div>
                {userProfile && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl">
                      <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">Tên</p>
                      <p className="font-bold text-stone-800 dark:text-stone-100">{userProfile.name}</p>
                    </div>
                    <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl">
                      <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">Mục tiêu</p>
                      <p className="font-medium text-stone-700 dark:text-stone-300 text-sm line-clamp-2">{userProfile.goals || 'Chưa đặt mục tiêu'}</p>
                    </div>
                    <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl">
                      <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">Số bài thi đã làm</p>
                      <p className="font-bold text-accent text-2xl">{userProfile.examHistory?.length || 0}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Student Overview - Learning Analytics - Always visible */}
              {userProfile && (() => {
                // Calculate statistics
                const examHistory = userProfile.examHistory || [];
                const totalExams = examHistory.length;
                const averageScore = totalExams > 0
                  ? (examHistory.reduce((sum, exam) => sum + exam.score, 0) / totalExams).toFixed(1)
                  : 0;
                const goodScoreCount = examHistory.filter(e => e.score >= 8).length;
                const goodScoreRate = totalExams > 0 ? Math.round((goodScoreCount / totalExams) * 100) : 0;

                // Calculate trend (compare last 3 exams vs previous 3)
                const recentExams = examHistory.slice(-3);
                const previousExams = examHistory.slice(-6, -3);
                const recentAvg = recentExams.length > 0
                  ? recentExams.reduce((sum, e) => sum + e.score, 0) / recentExams.length
                  : 0;
                const previousAvg = previousExams.length > 0
                  ? previousExams.reduce((sum, e) => sum + e.score, 0) / previousExams.length
                  : recentAvg;
                const trendDirection = recentAvg > previousAvg + 0.3 ? 'up' : recentAvg < previousAvg - 0.3 ? 'down' : 'stable';

                // Academic status based on average score
                const avgNum = parseFloat(averageScore.toString());
                const academicStatus = avgNum >= 9 ? { label: 'Xuất sắc', color: 'emerald', icon: '🏆' } :
                                       avgNum >= 8 ? { label: 'Giỏi', color: 'blue', icon: '⭐' } :
                                       avgNum >= 6.5 ? { label: 'Khá', color: 'amber', icon: '📚' } :
                                       avgNum >= 5 ? { label: 'Trung bình', color: 'orange', icon: '📝' } :
                                       { label: 'Cần cố gắng', color: 'red', icon: '💪' };

                // Count weakness frequency across all exams
                const weaknessFrequency: Record<string, number> = {};
                examHistory.forEach(exam => {
                  exam.weaknesses?.forEach(w => {
                    weaknessFrequency[w] = (weaknessFrequency[w] || 0) + 1;
                  });
                });
                const sortedWeaknesses = Object.entries(weaknessFrequency)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5);

                // Get last 8 exams for the chart
                const chartData = [...examHistory].slice(-8);
                const maxScore = 10;

                return (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl shadow-sm border border-indigo-200 dark:border-indigo-800 p-6">
                    <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      Tổng Quan Học Tập
                      <span className="ml-2 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full">
                        Student Overview
                      </span>
                    </h3>

                    {totalExams === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <GraduationCap className="w-8 h-8 text-indigo-500" />
                        </div>
                        <p className="text-stone-600 dark:text-stone-400 mb-2">Chưa có bài thi nào</p>
                        <p className="text-sm text-stone-500 dark:text-stone-500">Hãy làm bài thi đầu tiên để xem thống kê học tập!</p>
                        <button
                          onClick={() => handleModeChange(AppMode.ExamGenerator)}
                          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
                        >
                          <GraduationCap className="w-4 h-4" />
                          Bắt đầu làm bài
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                          {/* Average Score */}
                          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700 text-center">
                            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 font-serif">{averageScore}</div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">Điểm TB</p>
                          </div>

                          {/* Total Exams */}
                          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700 text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 font-serif">{totalExams}</div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">Bài thi</p>
                          </div>

                          {/* Good Score Rate */}
                          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700 text-center">
                            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-serif">{goodScoreRate}%</div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">Đạt ≥8.0</p>
                          </div>

                          {/* Trend */}
                          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700 text-center">
                            <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                              trendDirection === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
                              trendDirection === 'down' ? 'text-red-600 dark:text-red-400' :
                              'text-amber-600 dark:text-amber-400'
                            }`}>
                              {trendDirection === 'up' ? '📈' : trendDirection === 'down' ? '📉' : '➡️'}
                              <TrendingUp className={`w-5 h-5 ${trendDirection === 'down' ? 'rotate-180' : trendDirection === 'stable' ? 'rotate-90' : ''}`} />
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">Xu hướng</p>
                          </div>
                        </div>

                        {/* Academic Status Banner */}
                        <div className={`mb-6 p-4 rounded-xl border-2 ${
                          academicStatus.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700' :
                          academicStatus.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' :
                          academicStatus.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' :
                          academicStatus.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700' :
                          'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{academicStatus.icon}</span>
                              <div>
                                <p className="text-sm text-stone-600 dark:text-stone-400">Xếp loại học lực</p>
                                <p className={`text-xl font-bold ${
                                  academicStatus.color === 'emerald' ? 'text-emerald-700 dark:text-emerald-300' :
                                  academicStatus.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                                  academicStatus.color === 'amber' ? 'text-amber-700 dark:text-amber-300' :
                                  academicStatus.color === 'orange' ? 'text-orange-700 dark:text-orange-300' :
                                  'text-red-700 dark:text-red-300'
                                }`}>{academicStatus.label}</p>
                              </div>
                            </div>
                            <Award className={`w-10 h-10 ${
                              academicStatus.color === 'emerald' ? 'text-emerald-500' :
                              academicStatus.color === 'blue' ? 'text-blue-500' :
                              academicStatus.color === 'amber' ? 'text-amber-500' :
                              academicStatus.color === 'orange' ? 'text-orange-500' :
                              'text-red-500'
                            }`} />
                          </div>
                        </div>

                        {/* Performance Chart */}
                        <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700 mb-6">
                          <p className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4 text-indigo-500" />
                            Biểu đồ điểm số (8 bài gần nhất)
                          </p>
                          <div className="flex items-end justify-between gap-2 h-32">
                            {chartData.map((exam, idx) => {
                              const height = (exam.score / maxScore) * 100;
                              const barColor = exam.score >= 8 ? 'bg-emerald-500' :
                                              exam.score >= 6.5 ? 'bg-blue-500' :
                                              exam.score >= 5 ? 'bg-amber-500' : 'bg-red-500';
                              return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                  <span className="text-xs font-bold text-stone-600 dark:text-stone-400">{exam.score}</span>
                                  <div
                                    className={`w-full ${barColor} rounded-t-lg transition-all hover:opacity-80`}
                                    style={{ height: `${height}%`, minHeight: '8px' }}
                                    title={`${exam.topic} - ${new Date(exam.date).toLocaleDateString('vi-VN')}`}
                                  />
                                  <span className="text-[10px] text-stone-400 dark:text-stone-500 truncate w-full text-center">
                                    {new Date(exam.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                  </span>
                                </div>
                              );
                            })}
                            {chartData.length < 8 && Array.from({ length: 8 - chartData.length }).map((_, idx) => (
                              <div key={`empty-${idx}`} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-xs text-stone-300 dark:text-stone-600">-</span>
                                <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-t-lg h-2" />
                                <span className="text-[10px] text-stone-300 dark:text-stone-600">--/--</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Strengths */}
                          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Điểm mạnh
                            </p>
                            {userProfile.strengths && userProfile.strengths.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {userProfile.strengths.slice(0, 5).map((strength, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg">
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                                Tiếp tục làm bài để phát hiện điểm mạnh
                              </p>
                            )}
                          </div>

                          {/* Weaknesses with frequency */}
                          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-red-200 dark:border-red-800">
                            <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Điểm yếu cần cải thiện
                            </p>
                            {sortedWeaknesses.length > 0 ? (
                              <div className="space-y-2">
                                {sortedWeaknesses.map(([weakness, count], idx) => (
                                  <div key={idx} className="flex items-center justify-between">
                                    <span className="text-xs text-stone-700 dark:text-stone-300 truncate flex-1">{weakness}</span>
                                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full ml-2">
                                      {count}x
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : userProfile.weaknesses && userProfile.weaknesses.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {userProfile.weaknesses.slice(0, 5).map((weakness, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-lg">
                                    {weakness}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                                Chưa xác định được điểm yếu
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Learning Insights */}
                        <div className="mt-4 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                          <p className="text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Nhận xét tổng quan
                          </p>
                          <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
                            {avgNum >= 8
                              ? `Tuyệt vời! ${userProfile.name} đang có kết quả học tập rất tốt với điểm trung bình ${averageScore}. Hãy tiếp tục phát huy và thử thách bản thân với các đề khó hơn!`
                              : avgNum >= 6.5
                              ? `${userProfile.name} đang có tiến bộ tốt! Điểm trung bình ${averageScore} cho thấy nền tảng khá vững. Tập trung cải thiện ${sortedWeaknesses[0]?.[0] || 'các điểm yếu'} sẽ giúp em đạt điểm cao hơn.`
                              : avgNum >= 5
                              ? `${userProfile.name} cần cố gắng thêm. Với điểm TB ${averageScore}, em nên tập trung ôn luyện ${sortedWeaknesses.slice(0, 2).map(w => w[0]).join(' và ') || 'kiến thức cơ bản'} để cải thiện kết quả.`
                              : `${userProfile.name} đừng nản lòng! Hãy bắt đầu từ những bài tập cơ bản và sử dụng chế độ Luyện tập để làm quen. AI sẽ hỗ trợ em từng bước!`
                            }
                            {trendDirection === 'up' && ' 📈 Xu hướng điểm đang tăng - rất tốt!'}
                            {trendDirection === 'down' && ' ⚠️ Điểm có xu hướng giảm - cần chú ý hơn!'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Exam History - Always visible */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                    <History className="w-5 h-5 text-accent" />
                    Lịch Sử Thi
                  </h3>
                  {userProfile && userProfile.examHistory && userProfile.examHistory.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => generateAllExamsPDF(userProfile.examHistory)}
                        className="px-3 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
                        title="Tải tất cả bài kiểm tra (PDF)"
                      >
                        <Download className="w-4 h-4" />
                        Tải PDF
                      </button>
                      <button
                        onClick={() => exportExamHistoryAsJSON(userProfile.examHistory)}
                        className="px-3 py-2 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg text-sm font-medium hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors flex items-center gap-2"
                        title="Xuất lịch sử kiểm tra (JSON)"
                      >
                        <FileText className="w-4 h-4" />
                        Xuất JSON
                      </button>
                    </div>
                  )}
                </div>
                {userProfile && userProfile.examHistory && userProfile.examHistory.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {[...userProfile.examHistory].reverse().slice(0, 20).map((exam, idx) => (
                      <div key={idx} className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-stone-800 dark:text-stone-100 truncate">{exam.topic}</p>
                          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                            <span>{new Date(exam.date).toLocaleDateString('vi-VN')}</span>
                            {exam.examType && (
                              <span className="px-1.5 py-0.5 bg-stone-200 dark:bg-stone-700 rounded text-stone-600 dark:text-stone-300">
                                {EXAM_TYPE_CONFIGS[exam.examType]?.name?.replace(/^[^\s]+\s/, '') || exam.examType}
                              </span>
                            )}
                            {exam.sessionMode && (
                              <span className={`px-1.5 py-0.5 rounded ${
                                exam.sessionMode === ExamSessionMode.Exam
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              }`}>
                                {exam.sessionMode === ExamSessionMode.Exam ? 'Thi thử' : 'Luyện tập'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {exam.examStructure && exam.gradingResult && (
                            <button
                              onClick={() => generateExamPDF(exam)}
                              className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors group"
                              title="Tải PDF bài thi"
                            >
                              <Download className="w-5 h-5 text-stone-500 group-hover:text-accent transition-colors" />
                            </button>
                          )}
                          <div className={`text-2xl font-bold font-serif px-4 py-2 rounded-lg ${
                            exam.score >= 8 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                            exam.score >= 5 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}>
                            {exam.score}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <History className="w-8 h-8 text-stone-400" />
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 mb-2">Chưa có lịch sử thi</p>
                    <p className="text-sm text-stone-500 dark:text-stone-500">Hoàn thành bài thi đầu tiên để xem lịch sử!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- SETTINGS VIEW --- */}
        {mode === AppMode.Settings && (
          <div className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950 p-6 transition-colors">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Cài Đặt & Tài Liệu</h2>
                <p className="text-stone-500 dark:text-stone-400">Quản lý preferences và kho tài liệu học tập</p>
              </div>

              {/* Theme Settings Card */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6">
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <Contrast className="w-5 h-5 text-accent" />
                  Giao Diện
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dark/Light Mode */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <label className="block text-sm font-bold text-stone-600 dark:text-stone-300 mb-3">Chế độ màu</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsDarkMode(false)}
                        className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          !isDarkMode
                            ? 'bg-accent text-white shadow-lg'
                            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-accent'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        <span className="text-sm font-medium">Sáng</span>
                      </button>
                      <button
                        onClick={() => setIsDarkMode(true)}
                        className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          isDarkMode
                            ? 'bg-accent text-white shadow-lg'
                            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-accent'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        <span className="text-sm font-medium">Tối</span>
                      </button>
                    </div>
                  </div>

                  {/* High Contrast */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <label className="block text-sm font-bold text-stone-600 dark:text-stone-300 mb-3">Tương phản cao</label>
                    <button
                      onClick={toggleHighContrast}
                      className={`w-full p-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                        isHighContrast
                          ? 'bg-accent text-white shadow-lg'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-accent'
                      }`}
                    >
                      <Contrast className="w-4 h-4" />
                      <span className="text-sm font-medium">{isHighContrast ? 'Đang bật' : 'Tắt'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Link to Student Profile */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl shadow-sm border border-indigo-200 dark:border-indigo-800 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <UserCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">{userProfile?.name || 'Học sinh'}</h3>
                      <p className="text-sm text-stone-500 dark:text-stone-400">Xem tổng quan học tập và lịch sử thi</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleModeChange(AppMode.StudentProfile)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Xem Hồ Sơ
                  </button>
                </div>
              </div>

              {/* Exam Security Preferences */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6">
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  Cài Đặt Thi Cử
                </h3>
                <div className="space-y-4">
                  {/* Personalization Toggle */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 mb-1 flex items-center gap-2">
                          {userProfile?.preferences?.personalizationEnabled !== false ? (
                            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-stone-400" />
                          )}
                          Cá nhân hóa đề thi (Tích hợp điểm yếu)
                        </label>
                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                          {userProfile?.preferences?.personalizationEnabled !== false ? (
                            <>
                              <span className="font-semibold text-blue-600 dark:text-blue-400">✨ Đang bật:</span> Đề thi bình thường sẽ tích hợp câu hỏi về điểm yếu của em
                            </>
                          ) : (
                            <>
                              <span className="font-semibold text-stone-600 dark:text-stone-400">⚪ Đang tắt:</span> Đề thi sẽ không tập trung vào điểm yếu, tạo đề ngẫu nhiên
                            </>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (userProfile) {
                            const newValue = userProfile.preferences?.personalizationEnabled === false;
                            const updated = {
                              ...userProfile,
                              preferences: {
                                ...userProfile.preferences,
                                personalizationEnabled: newValue
                              }
                            };
                            setUserProfile(updated);
                            localStorage.setItem('vanhoc10_profile', JSON.stringify(updated));
                          }
                        }}
                        className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
                          userProfile?.preferences?.personalizationEnabled !== false
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                            : 'bg-stone-600 text-white hover:bg-stone-700 shadow-lg'
                        }`}
                      >
                        {userProfile?.preferences?.personalizationEnabled !== false ? (
                          <>
                            <TrendingUp className="w-4 h-4" />
                            BẬT
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4" />
                            TẮT
                          </>
                        )}
                      </button>
                    </div>

                    {/* Info Box */}
                    <div className={`mt-3 p-3 rounded-lg border ${
                      userProfile?.preferences?.personalizationEnabled !== false
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-stone-50 dark:bg-stone-900/20 border-stone-200 dark:border-stone-700'
                    }`}>
                      <p className={`text-xs ${
                        userProfile?.preferences?.personalizationEnabled !== false
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-stone-700 dark:text-stone-300'
                      }`}>
                        {userProfile?.preferences?.personalizationEnabled !== false ? (
                          <>
                            <strong>💡 Lợi ích:</strong> AI sẽ tạo câu hỏi tập trung vào điểm yếu của em (như Phân tích thơ, Nghị luận xã hội...) để giúp em cải thiện nhanh hơn.
                          </>
                        ) : (
                          <>
                            <strong>ℹ️ Lưu ý:</strong> Đề thi sẽ được tạo ngẫu nhiên theo chủ đề, không ưu tiên điểm yếu. Phù hợp khi muốn thử thách đa dạng hơn.
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Concurrent Tasks Toggle */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 mb-1 flex items-center gap-2">
                          {userProfile?.preferences?.concurrentTasksEnabled ? (
                            <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <Zap className="w-4 h-4 text-stone-400" />
                          )}
                          Chế độ xử lý đồng thời (Concurrent Tasks)
                        </label>
                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                          {userProfile?.preferences?.concurrentTasksEnabled ? (
                            <>
                              <span className="font-semibold text-amber-600 dark:text-amber-400">⚡ Đang bật:</span> Cho phép chạy nhiều tác vụ AI cùng lúc
                            </>
                          ) : (
                            <>
                              <span className="font-semibold text-stone-600 dark:text-stone-400">⚪ Đang tắt:</span> Chạy từng tác vụ tuần tự (phù hợp với Free/Basic tier)
                            </>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (userProfile) {
                            const newValue = !userProfile.preferences?.concurrentTasksEnabled;
                            const updated = {
                              ...userProfile,
                              preferences: {
                                ...userProfile.preferences,
                                concurrentTasksEnabled: newValue,
                                maxConcurrentTasks: newValue ? 3 : 1
                              }
                            };
                            setUserProfile(updated);
                            localStorage.setItem('vanhoc10_profile', JSON.stringify(updated));
                          }
                        }}
                        className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
                          userProfile?.preferences?.concurrentTasksEnabled
                            ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg'
                            : 'bg-stone-600 text-white hover:bg-stone-700 shadow-lg'
                        }`}
                      >
                        {userProfile?.preferences?.concurrentTasksEnabled ? (
                          <>
                            <Zap className="w-4 h-4" />
                            BẬT
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            TẮT
                          </>
                        )}
                      </button>
                    </div>

                    {/* Info Box */}
                    <div className={`mt-3 p-3 rounded-lg border ${
                      userProfile?.preferences?.concurrentTasksEnabled
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                        : 'bg-stone-50 dark:bg-stone-900/20 border-stone-200 dark:border-stone-700'
                    }`}>
                      <p className={`text-xs ${
                        userProfile?.preferences?.concurrentTasksEnabled
                          ? 'text-amber-700 dark:text-amber-300'
                          : 'text-stone-700 dark:text-stone-300'
                      }`}>
                        {userProfile?.preferences?.concurrentTasksEnabled ? (
                          <>
                            <strong>🚀 Tốc độ cao:</strong> Xử lý nhiều request AI cùng lúc (tối đa {userProfile?.preferences?.maxConcurrentTasks || 3} tasks).
                          </>
                        ) : (
                          <>
                            <strong>ℹ️ Chế độ thông thường:</strong> Xử lý tuần tự, tránh lỗi rate limit với Free API tier.
                          </>
                        )}
                      </p>
                    </div>

                    {/* Max Tasks Selector (only shown when concurrent is enabled) */}
                    {userProfile?.preferences?.concurrentTasksEnabled && (
                      <div className="mt-3 p-3 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
                        <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                          Số task đồng thời tối đa:
                        </label>
                        <select
                          value={userProfile?.preferences?.maxConcurrentTasks || 3}
                          onChange={(e) => {
                            if (userProfile) {
                              const updated = {
                                ...userProfile,
                                preferences: {
                                  ...userProfile.preferences,
                                  maxConcurrentTasks: parseInt(e.target.value)
                                }
                              };
                              setUserProfile(updated);
                              localStorage.setItem('vanhoc10_profile', JSON.stringify(updated));
                            }
                          }}
                          className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-amber-500/20 outline-none bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 text-sm"
                        >
                          <option value="2">2 tasks (An toàn)</option>
                          <option value="3">3 tasks (Khuyến nghị)</option>
                          <option value="4">4 tasks (Nhanh)</option>
                          <option value="5">5 tasks (Tối đa)</option>
                        </select>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                          ⚠️ Nếu gặp lỗi rate limit, hãy giảm số lượng task hoặc tắt chế độ này.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Download Data Section - Always visible */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6">
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-accent" />
                  Tải Xuống Dữ Liệu
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                  Tải xuống bài kiểm tra và lịch sử học tập của bạn để lưu trữ hoặc in ấn.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Download All Exams as PDF */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <FileBadge className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-800 dark:text-stone-100">Tải Bài Kiểm Tra (PDF)</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400">Tất cả bài thi với điểm số và nhận xét</p>
                      </div>
                    </div>
                    <button
                      onClick={() => userProfile?.examHistory && generateAllExamsPDF(userProfile.examHistory)}
                      disabled={!userProfile?.examHistory || userProfile.examHistory.length === 0}
                      className={`w-full mt-3 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        userProfile?.examHistory && userProfile.examHistory.length > 0
                          ? 'bg-accent text-white hover:bg-accent/90'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      {userProfile?.examHistory && userProfile.examHistory.length > 0
                        ? `Tải PDF (${userProfile.examHistory.length} bài)`
                        : 'Chưa có bài kiểm tra'}
                    </button>
                  </div>

                  {/* Export All Data as JSON */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <Save className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-800 dark:text-stone-100">Sao Lưu Toàn Bộ (JSON)</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400">Hồ sơ, lịch sử thi, lịch sử chat, cài đặt</p>
                      </div>
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mb-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        <span>{userProfile?.examHistory?.length || 0} bài kiểm tra</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>{chatHistory.length} cuộc trò chuyện</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>{userProfile?.knowledgeFiles?.length || 0} tài liệu</span>
                      </div>
                    </div>
                    <button
                      onClick={() => exportAllDataAsJSON({ userProfile, chatHistory })}
                      disabled={!userProfile}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                        userProfile
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      {userProfile ? 'Tải File Sao Lưu' : 'Chưa có dữ liệu'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Knowledge Base Upload */}
              <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6">
                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Kho Tài Liệu Cá Nhân
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                  Tải lên tài liệu học tập, sách giáo khoa, bài giảng... AI sẽ sử dụng để hỗ trợ em học tập tốt hơn.
                </p>

                <div className="space-y-4">
                  {/* Upload Button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-colors flex items-center gap-2 shadow-lg"
                    >
                      <Paperclip className="w-5 h-5" />
                      Tải Tài Liệu Lên
                    </button>
                    <span className="text-sm text-stone-500 dark:text-stone-400">
                      Hỗ trợ: PDF, DOCX, TXT
                    </span>
                  </div>

                  {/* Knowledge Files List */}
                  {userProfile && userProfile.knowledgeFiles && userProfile.knowledgeFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-bold text-stone-600 dark:text-stone-300 mb-2">
                        Tài liệu đã tải lên ({userProfile.knowledgeFiles.length})
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {userProfile.knowledgeFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700">
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-accent" />
                              <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate max-w-[200px]">
                                {file.name}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                if (userProfile) {
                                  const updated = {
                                    ...userProfile,
                                    knowledgeFiles: userProfile.knowledgeFiles?.filter((_, i) => i !== idx)
                                  };
                                  setUserProfile(updated);
                                  localStorage.setItem('vanhoc10_profile', JSON.stringify(updated));
                                }
                              }}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Temporary upload preview */}
                  {files.length > 0 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
                          Tài liệu đang chờ lưu ({files.length})
                        </p>
                        <button
                          onClick={() => {
                            if (userProfile) {
                              const updated = {
                                ...userProfile,
                                knowledgeFiles: [...(userProfile.knowledgeFiles || []), ...files]
                              };
                              setUserProfile(updated);
                              localStorage.setItem('vanhoc10_profile', JSON.stringify(updated));
                              setFiles([]);
                              alert('✅ Đã lưu tài liệu vào kho!');
                            }
                          }}
                          className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                        >
                          Lưu vào kho
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {files.map((file, idx) => (
                          <FilePreview key={idx} file={file} onRemove={() => setFiles(prev => prev.filter((_, i) => i !== idx))} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-sm border-2 border-red-200 dark:border-red-800 p-6">
                <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Vùng Nguy Hiểm
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                  Các thao tác này sẽ xóa dữ liệu vĩnh viễn và không thể khôi phục.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      showConfirmDialog({
                        title: 'Xóa lịch sử thi?',
                        message: 'Toàn bộ lịch sử các bài thi đã làm sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.',
                        confirmText: 'Xóa lịch sử',
                        variant: 'danger',
                        onConfirm: () => {
                          if (userProfile) {
                            const updated = { ...userProfile, examHistory: [] };
                            setUserProfile(updated);
                            localStorage.setItem('vanhoc10_profile', JSON.stringify(updated));
                          }
                        }
                      });
                    }}
                    className="px-4 py-2 bg-white dark:bg-stone-800 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Xóa Lịch Sử Thi
                  </button>
                  <button
                    onClick={() => {
                      showConfirmDialog({
                        title: 'Xóa toàn bộ tài khoản?',
                        message: 'Tất cả dữ liệu bao gồm hồ sơ, lịch sử thi, và cài đặt sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.',
                        confirmText: 'Xóa tài khoản',
                        variant: 'danger',
                        onConfirm: () => {
                          localStorage.removeItem('vanhoc10_profile');
                          setUserProfile(null);
                          setShowWelcomeScreen(true);
                        }
                      });
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Xóa Toàn Bộ Tài Khoản
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CHAT HISTORY MODAL --- */}
        {showChatHistory && (
          <div className="fixed inset-0 z-[9999] bg-stone-900/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in font-sans">
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border-2 border-stone-200 dark:border-stone-700 animate-scale-in flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <History className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-serif text-stone-800 dark:text-stone-100">Lịch Sử Trò Chuyện</h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{chatHistory.length} cuộc trò chuyện đã lưu</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatHistory(false)}
                  className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
                    <p className="text-stone-500 dark:text-stone-400 font-medium">Chưa có cuộc trò chuyện nào được lưu</p>
                    <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">Các cuộc trò chuyện sẽ được tự động lưu khi bạn bắt đầu cuộc hội thoại mới</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatHistory.map((session) => (
                      <div
                        key={session.id}
                        className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                          currentSessionId === session.id
                            ? 'bg-accent/10 border-accent/50'
                            : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:border-accent/30'
                        }`}
                        onClick={() => loadChatSession(session)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {session.mode === 'roleplay' ? (
                                <Users className="w-4 h-4 text-purple-500" />
                              ) : (
                                <MessageSquare className="w-4 h-4 text-accent" />
                              )}
                              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                {session.mode === 'roleplay' ? 'Nhập vai' : 'Trò chuyện'}
                              </span>
                              {currentSessionId === session.id && (
                                <span className="px-2 py-0.5 text-[10px] bg-accent text-white rounded-full font-bold">Đang mở</span>
                              )}
                            </div>
                            <h3 className="font-bold text-stone-800 dark:text-stone-100 truncate">{session.title}</h3>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                              {new Date(session.createdAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })} • {session.messages.length} tin nhắn
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showConfirmDialog({
                                title: 'Xóa cuộc trò chuyện?',
                                message: `Cuộc trò chuyện "${session.title}" sẽ bị xóa vĩnh viễn.`,
                                confirmText: 'Xóa',
                                variant: 'danger',
                                onConfirm: () => {
                                  deleteChatSession(session.id);
                                }
                              });
                            }}
                            className="p-2 opacity-60 md:opacity-0 md:group-hover:opacity-100 hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-all shrink-0"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (chatHistory.length > 0) {
                      showConfirmDialog({
                        title: 'Xóa toàn bộ lịch sử?',
                        message: `Tất cả ${chatHistory.length} cuộc trò chuyện đã lưu sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.`,
                        confirmText: 'Xóa tất cả',
                        variant: 'danger',
                        onConfirm: () => {
                          saveChatHistory([]);
                          setCurrentSessionId(null);
                        }
                      });
                    }
                  }}
                  disabled={chatHistory.length === 0}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa tất cả
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={startNewChat}
                    className="px-4 py-2 bg-accent text-white rounded-lg font-bold hover:bg-accent/90 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Cuộc trò chuyện mới
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Confirm Dialog */}
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={closeConfirmDialog}
            />

            {/* Dialog */}
            <div className="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
              {/* Header */}
              <div className={`px-6 py-4 ${
                confirmDialog.variant === 'danger'
                  ? 'bg-red-50 dark:bg-red-900/20'
                  : confirmDialog.variant === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-900/20'
                  : 'bg-blue-50 dark:bg-blue-900/20'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    confirmDialog.variant === 'danger'
                      ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                      : confirmDialog.variant === 'warning'
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                  }`}>
                    {confirmDialog.variant === 'danger' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : confirmDialog.variant === 'warning' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
                    {confirmDialog.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-stone-50 dark:bg-stone-900/50 flex items-center justify-end gap-3">
                <button
                  onClick={closeConfirmDialog}
                  className="px-4 py-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl font-medium transition-colors"
                >
                  {confirmDialog.cancelText || 'Hủy'}
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    closeConfirmDialog();
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 ${
                    confirmDialog.variant === 'danger'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : confirmDialog.variant === 'warning'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {confirmDialog.confirmText || 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
