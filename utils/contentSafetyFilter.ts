/**
 * CONTENT SAFETY FILTER - BỘ LỌC AN TOÀN NỘI DUNG
 * Phát hiện và xử lý nội dung tiêu cực, bảo vệ sức khỏe tâm lý học sinh
 */

export interface SafetyCheckResult {
  isSafe: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  category?: SafetyCategory;
  message?: string;
  shouldEscalate?: boolean;
  suggestedResponse?: string;
}

export type SafetyCategory =
  | 'self_harm'        // Tự gây thương tích
  | 'violence'         // Bạo lực
  | 'bullying'         // Bắt nạt
  | 'depression'       // Trầm cảm/lo âu
  | 'inappropriate'    // Nội dung không phù hợp
  | 'academic_stress'  // Áp lực học tập quá mức
  | 'family_issues'    // Vấn đề gia đình
  | 'none';

// Từ khóa phát hiện rủi ro - chia theo mức độ
const CRITICAL_KEYWORDS = [
  // Tự gây thương tích
  'tự tử', 'muốn chết', 'không muốn sống', 'kết thúc cuộc sống',
  'tự làm đau', 'cắt tay', 'tự hại', 'nhảy lầu', 'uống thuốc độc',
  // Bạo lực nghiêm trọng
  'giết', 'đánh chết', 'trả thù', 'hủy diệt'
];

const HIGH_RISK_KEYWORDS = [
  // Trầm cảm nặng
  'chán sống', 'vô vọng', 'không còn ý nghĩa', 'mệt mỏi với cuộc sống',
  'không ai quan tâm', 'cô đơn quá', 'không chịu nổi nữa',
  // Bắt nạt
  'bị đánh', 'bị bắt nạt', 'bị cô lập', 'bị ghét', 'không ai chơi cùng',
  // Áp lực gia đình
  'bố mẹ đánh', 'bị bạo hành', 'gia đình tan vỡ'
];

const MEDIUM_RISK_KEYWORDS = [
  // Lo âu học tập
  'áp lực quá', 'học không nổi', 'thi trượt', 'thất bại', 'điểm kém',
  'sợ thi', 'lo lắng quá', 'căng thẳng quá',
  // Tâm trạng tiêu cực
  'buồn quá', 'khóc hoài', 'không vui', 'chán nản', 'mất ngủ',
  // Mâu thuẫn
  'cãi nhau', 'ghét bạn', 'không muốn đi học'
];

const LOW_RISK_KEYWORDS = [
  // Khó khăn thông thường
  'khó hiểu', 'không hiểu', 'bài khó quá', 'không làm được',
  'mệt', 'buồn ngủ', 'chán học'
];

// Phản hồi hỗ trợ theo từng loại
const SUPPORTIVE_RESPONSES: Record<SafetyCategory, string> = {
  self_harm: `Em ơi, cô/thầy rất lo lắng khi nghe em chia sẻ điều này.
Cảm xúc của em rất quan trọng và em không đơn độc.
Hãy nói chuyện ngay với người lớn mà em tin tưởng (bố mẹ, thầy cô, hoặc người thân).
Nếu cần hỗ trợ khẩn cấp, hãy gọi đường dây nóng: 1800 599 920 (miễn phí, 24/7).`,

  depression: `Cô/thầy hiểu em đang trải qua giai đoạn khó khăn.
Những cảm xúc này là bình thường và có thể được hỗ trợ.
Em hãy thử chia sẻ với bố mẹ, thầy cô tư vấn tâm lý ở trường, hoặc người mà em tin tưởng.
Đường dây tư vấn tâm lý: 1800 599 920 (miễn phí).`,

  bullying: `Cô/thầy rất tiếc khi biết em đang gặp tình huống này.
Bị bắt nạt không phải là lỗi của em. Em xứng đáng được an toàn và tôn trọng.
Hãy báo ngay cho thầy cô giám thị hoặc bố mẹ để được bảo vệ.
Em có thể gọi: 111 (Tổng đài bảo vệ trẻ em).`,

  violence: `Cô/thầy lo lắng về điều em vừa chia sẻ.
Nếu em hoặc ai đó đang gặp nguy hiểm, hãy báo ngay cho người lớn.
Đường dây khẩn cấp: 113 (Công an) hoặc 111 (Bảo vệ trẻ em).`,

  academic_stress: `Cô/thầy hiểu áp lực học tập có thể rất nặng nề.
Điểm số không phải là tất cả - sức khỏe và hạnh phúc của em mới quan trọng nhất.
Hãy thử:
- Nghỉ ngơi đầy đủ
- Chia nhỏ bài học thành phần nhỏ
- Nói chuyện với thầy cô về khó khăn của em
Cô/thầy ở đây để hỗ trợ em học tập theo cách phù hợp với em.`,

  family_issues: `Cô/thầy hiểu vấn đề gia đình có thể ảnh hưởng nhiều đến em.
Em không cần phải chịu đựng một mình.
Hãy chia sẻ với thầy cô tư vấn ở trường hoặc gọi: 111 (Tổng đài bảo vệ trẻ em).`,

  inappropriate: `Câu hỏi này không phù hợp với nội dung học tập Ngữ văn.
Hãy tập trung vào bài học nhé! Cô/thầy sẵn sàng hỗ trợ em về kiến thức văn học.`,

  none: ''
};

/**
 * Kiểm tra nội dung có an toàn không
 */
export function checkContentSafety(text: string): SafetyCheckResult {
  const lowerText = text.toLowerCase();

  // Kiểm tra mức CRITICAL
  for (const keyword of CRITICAL_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      const category = getCategoryFromKeyword(keyword);
      return {
        isSafe: false,
        riskLevel: 'critical',
        category,
        message: `Phát hiện nội dung cần hỗ trợ khẩn cấp: "${keyword}"`,
        shouldEscalate: true,
        suggestedResponse: SUPPORTIVE_RESPONSES[category]
      };
    }
  }

  // Kiểm tra mức HIGH
  for (const keyword of HIGH_RISK_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      const category = getCategoryFromKeyword(keyword);
      return {
        isSafe: false,
        riskLevel: 'high',
        category,
        message: `Phát hiện dấu hiệu cần quan tâm: "${keyword}"`,
        shouldEscalate: true,
        suggestedResponse: SUPPORTIVE_RESPONSES[category]
      };
    }
  }

  // Kiểm tra mức MEDIUM
  for (const keyword of MEDIUM_RISK_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      const category = getCategoryFromKeyword(keyword);
      return {
        isSafe: true, // Vẫn cho phép nhưng theo dõi
        riskLevel: 'medium',
        category,
        message: `Phát hiện dấu hiệu stress: "${keyword}"`,
        shouldEscalate: false,
        suggestedResponse: SUPPORTIVE_RESPONSES[category]
      };
    }
  }

  // Kiểm tra mức LOW
  for (const keyword of LOW_RISK_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return {
        isSafe: true,
        riskLevel: 'low',
        category: 'academic_stress',
        message: `Học sinh có thể cần hỗ trợ học tập`
      };
    }
  }

  return {
    isSafe: true,
    riskLevel: 'none',
    category: 'none'
  };
}

/**
 * Xác định category từ keyword
 */
function getCategoryFromKeyword(keyword: string): SafetyCategory {
  const selfHarmKeywords = ['tự tử', 'muốn chết', 'không muốn sống', 'kết thúc cuộc sống',
    'tự làm đau', 'cắt tay', 'tự hại', 'nhảy lầu', 'uống thuốc độc'];
  const violenceKeywords = ['giết', 'đánh chết', 'trả thù', 'hủy diệt'];
  const bullyingKeywords = ['bị đánh', 'bị bắt nạt', 'bị cô lập', 'bị ghét', 'không ai chơi cùng'];
  const depressionKeywords = ['chán sống', 'vô vọng', 'không còn ý nghĩa', 'mệt mỏi với cuộc sống',
    'không ai quan tâm', 'cô đơn quá', 'không chịu nổi nữa', 'buồn quá', 'khóc hoài'];
  const familyKeywords = ['bố mẹ đánh', 'bị bạo hành', 'gia đình tan vỡ'];

  if (selfHarmKeywords.some(k => keyword.includes(k))) return 'self_harm';
  if (violenceKeywords.some(k => keyword.includes(k))) return 'violence';
  if (bullyingKeywords.some(k => keyword.includes(k))) return 'bullying';
  if (depressionKeywords.some(k => keyword.includes(k))) return 'depression';
  if (familyKeywords.some(k => keyword.includes(k))) return 'family_issues';

  return 'academic_stress';
}

/**
 * Tạo thông báo an toàn cho học sinh
 */
export function getSafetyReminder(): string {
  const reminders = [
    "Nhớ nghỉ ngơi mắt sau mỗi 20 phút học nhé!",
    "Đừng quên uống nước và vận động nhẹ giữa giờ học!",
    "Sức khỏe là quan trọng nhất - hãy ngủ đủ giấc!",
    "Nếu cảm thấy mệt, hãy nghỉ ngơi một chút rồi học tiếp.",
    "Học đều đặn mỗi ngày hiệu quả hơn học dồn một lúc!"
  ];
  return reminders[Math.floor(Math.random() * reminders.length)];
}

/**
 * Kiểm tra thời gian sử dụng và đề xuất nghỉ ngơi
 */
export interface UsageTracking {
  sessionStartTime: number;
  lastBreakTime: number;
  totalMessagesInSession: number;
}

export function checkUsageAndSuggestBreak(usage: UsageTracking): {
  shouldSuggestBreak: boolean;
  breakMessage?: string;
} {
  const now = Date.now();
  const sessionDuration = (now - usage.sessionStartTime) / 1000 / 60; // phút
  const timeSinceLastBreak = (now - usage.lastBreakTime) / 1000 / 60; // phút

  // Sau 45 phút liên tục, đề xuất nghỉ ngơi
  if (timeSinceLastBreak >= 45) {
    return {
      shouldSuggestBreak: true,
      breakMessage: `Em đã học được ${Math.round(timeSinceLastBreak)} phút rồi!
Hãy nghỉ ngơi 5-10 phút, vươn vai, đi lại và uống nước nhé.
Nghỉ ngơi giúp não bộ ghi nhớ tốt hơn đó!`
    };
  }

  // Sau 90 phút tổng cộng, nhắc nhở mạnh hơn
  if (sessionDuration >= 90 && timeSinceLastBreak >= 30) {
    return {
      shouldSuggestBreak: true,
      breakMessage: `Em đã học khá lâu rồi (${Math.round(sessionDuration)} phút).
Để bảo vệ mắt và sức khỏe, em nên nghỉ ngơi ít nhất 15 phút.
Có thể ra ngoài hít thở không khí trong lành hoặc làm việc nhà giúp bố mẹ!`
    };
  }

  return { shouldSuggestBreak: false };
}

/**
 * Danh sách đường dây nóng hỗ trợ
 */
export const HOTLINES = {
  childProtection: {
    name: 'Tổng đài bảo vệ trẻ em',
    number: '111',
    available: '24/7',
    free: true
  },
  mentalHealth: {
    name: 'Đường dây tư vấn tâm lý',
    number: '1800 599 920',
    available: '24/7',
    free: true
  },
  police: {
    name: 'Công an',
    number: '113',
    available: '24/7',
    free: true
  },
  emergency: {
    name: 'Cấp cứu y tế',
    number: '115',
    available: '24/7',
    free: true
  }
};
