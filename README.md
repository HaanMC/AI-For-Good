# Trợ Lý AI Học Văn Lớp 10

Ứng dụng AI hỗ trợ học sinh lớp 10 học tập và ôn luyện môn Ngữ Văn theo chương trình 2018.

## Tính năng chính

### 1. Trợ Lý Học Tập (Study Chat)
- Chat AI thông minh hỗ trợ giải đáp mọi thắc mắc về Ngữ Văn
- Hỗ trợ upload ảnh/file để phân tích
- Nhận diện và giải đáp dựa trên điểm yếu của học sinh

### 2. Hóa Thân Nhân Vật (Roleplay)
- Trò chuyện trực tiếp với các nhân vật văn học
- 6 nhân vật có sẵn: Từ Hải, Thúy Kiều, Nguyễn Trãi, Trạng Quỳnh, Tố Hữu, Chí Phèo

### 3. Luyện Thi Giả Lập (Exam Generator)
- 4 loại đề thi: 15 phút, Giữa kỳ, Cuối kỳ, THPT Quốc gia
- 2 mức độ: Cơ bản và Nâng cao
- Chế độ thi thử với giám sát bảo mật (fullscreen, theo dõi tab switching)
- Chấm điểm tự động với phản hồi chi tiết

### 4. Phòng Luyện Viết (Writing Workshop)
- Phân tích và chấm điểm bài văn
- Đánh giá theo rubric chuẩn
- Gợi ý từ vựng và cách cải thiện

### 5. Từ Điển Văn Học (Dictionary)
- 100+ thuật ngữ văn học có sẵn
- Tìm kiếm thông minh với autocomplete
- Cache kết quả để truy cập nhanh

### 6. Flashcards
- Tạo flashcard tự động từ AI
- Các mức độ khó: Dễ, Trung bình, Khó
- Hỗ trợ học theo chủ đề

### 7. Mindmap
- Tạo sơ đồ tư duy cho các chủ đề
- Hiển thị trực quan các mối liên hệ

### 8. Kế Hoạch 7 Ngày (Study Plan)
- Tạo kế hoạch học tập cá nhân hóa
- Dựa trên điểm yếu và mục tiêu của học sinh
- Hỗ trợ tùy chọn ngày nghỉ

### 9. Cài Đặt
- Chế độ sáng/tối
- Chế độ tương phản cao (accessibility)
- Quản lý hồ sơ người dùng
- Lịch sử chat
- Xuất dữ liệu backup

## Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (@google/genai)
- **Icons**: Lucide React

## Cài đặt và chạy

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd AI-For-Good-V0
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình API Key
Tạo file `.env` trong thư mục gốc:
```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### Bước 4: Chạy development server
```bash
npm run dev
```

### Bước 5: Build production
```bash
npm run build
```

### Bước 6: Preview production build
```bash
npm run preview
```

## Cấu trúc dự án

```
├── App.tsx                    # Component chính
├── types.ts                   # Type definitions
├── index.tsx                  # Entry point
├── index.css                  # Global styles
├── services/
│   └── geminiService.ts       # Google Gemini API integration
├── data/
│   └── staticDictionary.ts    # Từ điển văn học offline
├── utils/
│   └── logger.ts              # Debug logger
├── grade10-literature-knowledge.ts  # Knowledge base
└── GRADE10-LITERATURE-GUIDE.md      # Documentation
```

## Lưu trữ dữ liệu

Ứng dụng sử dụng localStorage để lưu:
- `vanhoc10_profile`: Hồ sơ người dùng
- `vanhoc10_chat_history`: Lịch sử chat (tối đa 50 sessions)
- `theme`: Chế độ sáng/tối
- `highContrast`: Chế độ tương phản cao
- `literary_dictionary_cache`: Cache từ điển (7 ngày)

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo Pull Request hoặc Issue.

## License

MIT License

---

**Version**: 1.0.0
**Developed for**: AI For Good Competition
