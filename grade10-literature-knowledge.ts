/**
 * KIẾN THỨC CHUẨN NGỮ VĂN LỚP 10 - CHƯƠNG TRÌNH 2018
 * Đây là cơ sở kiến thức đầy đủ về tác phẩm, tác giả, và yêu cầu đánh giá
 */

export interface LiteraryWork {
  id: string;
  title: string;
  author: string;
  genre: string; // Thể loại: Thơ, Văn, Truyện
  period: string; // Thời kỳ văn học
  semester: 1 | 2;
  themes: string[]; // Chủ đề chính
  artisticFeatures: string[]; // Đặc điểm nghệ thuật
  keyQuotes: string[]; // Câu trích dẫn quan trọng
  analysisPoints: string[]; // Điểm phân tích quan trọng
  comparisonWorks?: string[]; // Tác phẩm có thể so sánh
}

export interface Grade10Author {
  name: string;
  lifespan?: string;
  period: string;
  style: string;
  notableWorks: string[];
  contribution: string;
}

// ============================================
// DANH SÁCH TÁC PHẨM HỌC KỲ 1
// ============================================

export const SEMESTER_1_WORKS: LiteraryWork[] = [
  {
    id: "doan-truong-tan-thanh",
    title: "Đoạn trường tân thanh",
    author: "Nguyễn Du",
    genre: "Thơ",
    period: "Văn học trung đại",
    semester: 1,
    themes: [
      "Tài năng và số phận",
      "Lý tưởng sống cao đẹp",
      "Chủ nghĩa nhân đạo"
    ],
    artisticFeatures: [
      "Thơ lục bát truyền thống",
      "Giọng điệu trữ tình sâu lắng",
      "Hình ảnh thơ giàu chất triết lý",
      "Kết hợp tự sự và trữ tình"
    ],
    keyQuotes: [
      "Trăm năm trong cõi người ta / Chừng có tài ba chừng có số phận",
      "Thiên thu thư sử thật phong lưu / Truyện này hay lắm đủ điều hay sao",
      "Phải chi ta được làm con gái / Thì thân ta chẳng đến nông nầy"
    ],
    analysisPoints: [
      "Quan niệm về tài và mệnh",
      "Giá trị con người qua hình tượng Thúy Kiều",
      "Thái độ của tác giả với nhân vật",
      "Nghệ thuật trữ tình trong đoạn thơ"
    ],
    comparisonWorks: ["Văn tế nghĩa sĩ Cần Giuộc"]
  },
  {
    id: "tieng-hat-con-tau",
    title: "Tiếng hát con tàu",
    author: "Chế Lan Viên",
    genre: "Thơ",
    period: "Văn học hiện đại - Kháng chiến chống Mỹ",
    semester: 1,
    themes: [
      "Lòng yêu nước",
      "Niềm tự hào dân tộc",
      "Khát vọng hòa bình"
    ],
    artisticFeatures: [
      "Thơ tự do hiện đại",
      "Hình ảnh thơ độc đáo, bất ngờ",
      "Cách điệu hóa hiện thực",
      "Âm hưởng hùng tráng, lãng mạn"
    ],
    keyQuotes: [
      "Trên sông biển của tổ quốc mình / Không còn một bóng quân thù nào",
      "Tiếng hát con tàu vang lên khắp bến bờ / Như lời ca ngợi đất nước ngày mở cửa"
    ],
    analysisPoints: [
      "Hình ảnh con tàu và ý nghĩa biểu tượng",
      "Không gian thơ và cảm xúc tác giả",
      "Nghệ thuật so sánh, nhân hóa",
      "Giá trị nhân văn của tác phẩm"
    ]
  },
  {
    id: "day-thon-vy-da",
    title: "Đây thôn Vỹ Dạ",
    author: "Hàn Mạc Tử",
    genre: "Thơ",
    period: "Thơ mới - Trước Cách mạng 1945",
    semester: 1,
    themes: [
      "Tình yêu quê hương",
      "Vẻ đẹp thiên nhiên",
      "Niềm vui giản dị"
    ],
    artisticFeatures: [
      "Thơ tự do",
      "Nghệ thuật miêu tả sinh động",
      "Kết hợp giác quan (thị giác, thính giác, khứu giác)",
      "Màu sắc tươi sáng, âm thanh trong trẻo"
    ],
    keyQuotes: [
      "Đây thôn Vỹ Dạ đẹp nhất là tà sương",
      "Gió theo lối gió, mây đường mây / Dòng sông uốn khúc vắt qua trùng điệp",
      "Những chiếc thuyền nan nhỏ đưa nhau / Về với đêm trong giấc ngủ hơi nghiêng"
    ],
    analysisPoints: [
      "Không gian thơ và cảm xúc",
      "Nghệ thuật sử dụng màu sắc",
      "Hình ảnh thơ đặc sắc",
      "Vẻ đẹp thiên nhiên qua cảm thụ cá nhân"
    ]
  },
  {
    id: "voi-vang",
    title: "Vội vàng",
    author: "Xuân Diệu",
    genre: "Thơ",
    period: "Thơ mới - Trước Cách mạng 1945",
    semester: 1,
    themes: [
      "Thời gian và tuổi trẻ",
      "Niềm vui sống",
      "Lạc quan yêu đời"
    ],
    artisticFeatures: [
      "Thơ tự do, nhịp điệu nhanh",
      "Dãy liên tưởng phong phú",
      "Cảm giác vội vã, hối hả",
      "So sánh độc đáo"
    ],
    keyQuotes: [
      "Mười tám năm là tuổi gì / Là tuổi mộng mơ, là tuổi thi ca",
      "Vội làm giàu nhanh lên đi / Cho còn tuổi trẻ vui chơi hết mùa",
      "Gieo neo xuống một chỗ gì / Rồi ta làm cửa đón trời về nhà"
    ],
    analysisPoints: [
      "Chủ đề thời gian trong thơ Xuân Diệu",
      "Hình ảnh và nhịp điệu thơ",
      "Triết lý sống của tác giả",
      "Nghệ thuật lặp từ và so sánh"
    ]
  },
  {
    id: "trang-giang",
    title: "Tràng giang",
    author: "Huy Cận",
    genre: "Thơ",
    period: "Thơ mới - Trước Cách mạng 1945",
    semester: 1,
    themes: [
      "Tâm trạng cô đơn",
      "Nỗi buồn ly biệt",
      "Khát vọng hội ngộ"
    ],
    artisticFeatures: [
      "Thơ năm chữ",
      "Giọng thơ sầu muộn, trầm lắng",
      "Cảnh vật hòa quyện tâm trạng",
      "Biểu tượng âm nhạc sáo diều"
    ],
    keyQuotes: [
      "Sóng gió cuộc đời vùi dập tài năng / Đất lạnh lùng học trò nghẹn ngào",
      "Trải thuở làm người trong cơn mộng / Như tiếng sáo ai lạc giữa trùng khơi",
      "Biết đâu nguồn cội của khúc hát / Mà dạt dào trong miệng má hồng"
    ],
    analysisPoints: [
      "Tâm trạng cô đơn trong cuộc đời",
      "Biểu tượng sáo diều",
      "Không gian và cảm xúc",
      "Nghệ thuật dùng từ"
    ]
  },
  {
    id: "vieng-lang-bac",
    title: "Viếng lăng Bác",
    author: "Viễn Phương",
    genre: "Thơ",
    period: "Văn học hiện đại - Sau 1975",
    semester: 1,
    themes: [
      "Lòng thành kính với Bác Hồ",
      "Truyền thống dân tộc",
      "Trách nhiệm với thế hệ sau"
    ],
    artisticFeatures: [
      "Thơ tự do",
      "Giọng điệu trang nghiêm, xúc động",
      "Hình ảnh có sức gợi",
      "Kết hợp tự sự và biểu cảm"
    ],
    keyQuotes: [
      "Bác nằm trong lăng kính / Giữa mồ hôi nước mắt của muôn người",
      "Cả đời người hiến dâng cho nước / Nay về lại với đất mẹ",
      "Bác yên nghỉ / Chúng con vẫn đi"
    ],
    analysisPoints: [
      "Hình tượng Hồ Chủ tịch",
      "Tình cảm của thế hệ trẻ",
      "Nghệ thuật tạo hình",
      "Thông điệp về trách nhiệm"
    ]
  },
  {
    id: "tay-tien",
    title: "Tây Tiến",
    author: "Quang Dũng",
    genre: "Thơ",
    period: "Văn học hiện đại - Kháng chiến chống Pháp",
    semester: 1,
    themes: [
      "Anh hùng và bi hùng",
      "Tình cảm đồng đội",
      "Khát vọng tự do"
    ],
    artisticFeatures: [
      "Thơ tự do",
      "Kết hợp trữ tình và tự sự",
      "Hình ảnh đối lập mạnh",
      "Âm hưởng bi tráng"
    ],
    keyQuotes: [
      "Tây Tiến quân đi không trở lại / Rừng có tiếng bàn chua biệt ly",
      "Trời xanh bốn mặt cồn cào nổi / Sông thẳm hai hàng súng nằm mơ",
      "Tây Tiến đoàn quân không mọc tóc / Quân xô quân ngã một hàng ngang"
    ],
    analysisPoints: [
      "Vẻ đẹp anh hùng - bi hùng",
      "Không gian núi rừng Tây Bắc",
      "Tình cảm chiến đấu",
      "Nghệ thuật tạo hình tượng"
    ]
  },
  {
    id: "dat-nuoc",
    title: "Đất nước",
    author: "Nguyễn Khoa Điềm",
    genre: "Thơ",
    period: "Văn học hiện đại - Sau 1975",
    semester: 1,
    themes: [
      "Tình yêu đất nước",
      "Truyền thống dân tộc",
      "Ý thức lịch sử"
    ],
    artisticFeatures: [
      "Thơ tự do",
      "Kết hợp cụ thể và triết lý",
      "Hình ảnh thơ đa dạng",
      "Giọng điệu trang trọng"
    ],
    keyQuotes: [
      "Đất nước đã từng được / Nhiều người dâng hiến / Để còn đó cho người",
      "Khi còn có đất nước / Thì còn có chúng ta",
      "Người ta yêu nhau bằng những chiều hoàng hôn / Yêu đất nước phải bằng cả cuộc đời"
    ],
    analysisPoints: [
      "Quan niệm về đất nước",
      "Trách nhiệm thế hệ",
      "Nghệ thuật lập luận trong thơ",
      "Giá trị nhân văn"
    ]
  },
  {
    id: "rung-xa-nu",
    title: "Rừng xà nu",
    author: "Nguyễn Trung Thành",
    genre: "Thơ",
    period: "Văn học hiện đại - Kháng chiến chống Mỹ",
    semester: 1,
    themes: [
      "Thiên nhiên hùng vĩ",
      "Sinh mệnh và sức sống",
      "Con người và thiên nhiên"
    ],
    artisticFeatures: [
      "Thơ tự do",
      "Miêu tả tỉ mỉ, sinh động",
      "Biểu tượng rừng cây",
      "Kết hợp yếu tố triết lý"
    ],
    keyQuotes: [
      "Rừng xà nu dậy khắp trời mây đen / Như biển động gào lên tiếng nước lên",
      "Thân cây già nứt bị vỡ / Mà vẫn còn in dấu bảo tồn"
    ],
    analysisPoints: [
      "Hình tượng rừng xà nu",
      "Sức sống mãnh liệt",
      "Nghệ thuật miêu tả",
      "Ý nghĩa biểu tượng"
    ]
  },
  {
    id: "lang-le-sa-pa",
    title: "Lặng lẽ Sa Pa",
    author: "Nguyễn Thành Long",
    genre: "Thơ",
    period: "Văn học hiện đại - Sau 1975",
    semester: 1,
    themes: [
      "Vẻ đẹp thiên nhiên",
      "Không gian núi rừng",
      "Tâm trạng trầm lắng"
    ],
    artisticFeatures: [
      "Thơ tự do",
      "Giọng điệu trầm, sâu lắng",
      "Màu sắc đặc trưng",
      "Nghệ thuật tạo không khí"
    ],
    keyQuotes: [
      "Như sơn nữ sống nơi cung trắng tuyết / Phủ khăn mù sương mờ vào chiều",
      "Sa Pa lặng lẽ như chưa xuôi tay / Để cho người thưởng thức vẻ thanh tao"
    ],
    analysisPoints: [
      "Không gian và cảm xúc",
      "Vẻ đẹp Sa Pa",
      "Nghệ thuật tạo hình",
      "Thái độ của tác giả"
    ]
  },
  {
    id: "chiec-luoc-nga",
    title: "Chiếc lược ngà",
    author: "Nguyễn Quang Sáng",
    genre: "Truyện ngắn",
    period: "Văn học hiện đại - Kháng chiến chống Mỹ",
    semester: 1,
    themes: [
      "Tình người trong chiến tranh",
      "Phẩm chất cao đẹp",
      "Sự hy sinh thầm lặng"
    ],
    artisticFeatures: [
      "Truyện ngắn hiện đại",
      "Cốt truyện đơn giản, ý nghĩa sâu sắc",
      "Kỹ thuật tạo bất ngờ",
      "Chi tiết tượng trưng"
    ],
    keyQuotes: [
      "Chiếc lược ngà như một kỷ niệm đẹp",
      "Những con người bình dị có tấm lòng cao cả"
    ],
    analysisPoints: [
      "Hình tượng nhân vật",
      "Ý nghĩa chiếc lược ngà",
      "Giá trị nhân văn",
      "Nghệ thuật xây dựng cốt truyện"
    ]
  }
];

// ============================================
// DANH SÁCH TÁC PHẨM HỌC KỲ 2
// ============================================

export const SEMESTER_2_WORKS: LiteraryWork[] = [
  {
    id: "chuyen-nguoi-con-gai-nam-xuong",
    title: "Chuyện người con gái Nam Xương",
    author: "Nguyễn Dữ",
    genre: "Thơ",
    period: "Văn học trung đại",
    semester: 2,
    themes: [
      "Tài năng người phụ nữ",
      "Lòng yêu nước",
      "Trách nhiệm xã hội"
    ],
    artisticFeatures: [
      "Thơ Nôm lục bát",
      "Kết hợp tự sự và biểu cảm",
      "Nghệ thuật tạo hình tượng",
      "Giọng điệu tự hào, ca ngợi"
    ],
    keyQuotes: [
      "Cái tài con gái sao mà hay / Giúp nước được một khi nguy cấp",
      "Người con gái trẻ tuổi / Mà tài trí phi thường"
    ],
    analysisPoints: [
      "Hình tượng người con gái Nam Xương",
      "Giá trị của phụ nữ",
      "Tinh thần yêu nước",
      "Thái độ của tác giả"
    ]
  },
  {
    id: "tuc-canh-pac-bo",
    title: "Tức cảnh Pác Bó",
    author: "Hồ Chí Minh",
    genre: "Thơ",
    period: "Văn học hiện đại - Cách mạng",
    semester: 2,
    themes: [
      "Tâm trạng người cách mạng",
      "Tình cảm với đất nước",
      "Niềm tin chiến thắng"
    ],
    artisticFeatures: [
      "Thơ Đường luật",
      "Giản dị, dung dị",
      "Kết hợp cảnh với tình",
      "Biểu cảm sâu lắng"
    ],
    keyQuotes: [
      "Nước trong như lòng ta thanh khiết / Non cao thấy chí tôi vẹn toàn",
      "Đêm khuya ngồi đọc sách / Rút khí vọng quê nhà"
    ],
    analysisPoints: [
      "Tâm hồn Bác Hồ",
      "Cảnh Pác Bó",
      "Nghệ thuật thơ Đường",
      "Ý nghĩa lịch sử"
    ]
  },
  {
    id: "nhung-doi-hoa-sim",
    title: "Những đồi hoa sim",
    author: "Thế Lữ",
    genre: "Thơ",
    period: "Thơ mới - Trước Cách mạng 1945",
    semester: 2,
    themes: [
      "Tình yêu quê hương",
      "Kỷ niệm tuổi thơ",
      "Nỗi nhớ xa xứ"
    ],
    artisticFeatures: [
      "Thơ tự do",
      "Giọng điệu trữ tình sâu lắng",
      "Hình ảnh thơ giản dị",
      "Liên tưởng phong phú"
    ],
    keyQuotes: [
      "Những đồi hoa sim tím / Nắng mơ màng trên đó / Vào những buổi trưa hè",
      "Ôi! những đồi hoa sim / Ngày xưa tôi mơ ước"
    ],
    analysisPoints: [
      "Hình ảnh hoa sim",
      "Tình cảm với quê hương",
      "Nghệ thuật gợi nhớ",
      "Không gian và tâm trạng"
    ]
  },
  {
    id: "vuot-song",
    title: "Vượt sông",
    author: "Hữu Mai",
    genre: "Thơ",
    period: "Văn học hiện đại - Kháng chiến chống Pháp",
    semester: 2,
    themes: [
      "Ý chí chiến đấu",
      "Tinh thần lạc quan",
      "Khát vọng thắng lợi"
    ],
    artisticFeatures: [
      "Thơ tự do",
      "Giọng điệu hào hùng",
      "Hình ảnh sinh động",
      "Nhịp điệu nhanh, mạnh"
    ],
    keyQuotes: [
      "Lội dòng sông không cầu không bè / Giang san gấm vóc đứng lên tơi bời",
      "Muôn dặm quan san vượt bước đi / Sông dầu sâu, ta bơi qua"
    ],
    analysisPoints: [
      "Khí thế chiến đấu",
      "Hình ảnh vượt sông",
      "Lòng tin chiến thắng",
      "Nghệ thuật tạo hình"
    ]
  },
  {
    id: "ban-luan-ve-phep-hoc",
    title: "Bàn luận về phép học",
    author: "Lê Quý Đôn",
    genre: "Văn nghị luận",
    period: "Văn học trung đại",
    semester: 2,
    themes: [
      "Phương pháp học tập",
      "Tầm quan trọng của học vấn",
      "Tinh thần cầu tiến"
    ],
    artisticFeatures: [
      "Văn nghị luận Hán",
      "Lập luận chặt chẽ",
      "Dẫn chứng phong phú",
      "Văn phong giản dị"
    ],
    keyQuotes: [
      "Học như gái chèo ngược dòng / Một lần lơi tay thì lùi ngàn dặm",
      "Học không biết chán mới có thể tiến bộ"
    ],
    analysisPoints: [
      "Quan điểm về học tập",
      "Phương pháp nghị luận",
      "Giá trị hiện thực",
      "Nghệ thuật lập luận"
    ]
  },
  {
    id: "hien-tai",
    title: "Hiền tài",
    author: "Nguyễn Thiếp",
    genre: "Văn nghị luận",
    period: "Văn học trung đại",
    semester: 2,
    themes: [
      "Giá trị của nhân tài",
      "Trách nhiệm của người cầm quyền",
      "Đạo làm người"
    ],
    artisticFeatures: [
      "Văn nghị luận Hán",
      "Lập luận sắc bén",
      "Dùng ẩn dụ, so sánh",
      "Văn phong mạnh mẽ"
    ],
    keyQuotes: [
      "Hiền tài là nguyên khí của quốc gia",
      "Không có hiền tài thì nước không thể tồn tại"
    ],
    analysisPoints: [
      "Quan điểm về nhân tài",
      "Nghệ thuật lập luận",
      "Giá trị hiện thực",
      "Tư tưởng tiến bộ"
    ]
  },
  {
    id: "nguoi-lai-do-song-da",
    title: "Người lái đò Sông Đà",
    author: "Nguyễn Tuân",
    genre: "Kỹ ký",
    period: "Văn học hiện đại - Trước Cách mạng 1945",
    semester: 2,
    themes: [
      "Con người lao động",
      "Sức sống mãnh liệt",
      "Vẻ đẹp nhân cách"
    ],
    artisticFeatures: [
      "Kỹ ký văn học",
      "Miêu tả sinh động",
      "Ngôn ngữ giàu hình ảnh",
      "Kết hợp nhiều giác quan"
    ],
    keyQuotes: [
      "Người lái đò Sông Đà như một hiện thân của sức mạnh",
      "Cơ thể anh như một tượng đài sống"
    ],
    analysisPoints: [
      "Hình tượng người lái đò",
      "Vẻ đẹp con người lao động",
      "Nghệ thuật miêu tả",
      "Giá trị nhân văn"
    ]
  },
  {
    id: "ai-da-dat-ten-cho-dong-song",
    title: "Ai đã đặt tên cho dòng sông",
    author: "Hoàng Phủ Ngọc Tường",
    genre: "Truyện ngắn",
    period: "Văn học hiện đại - Sau 1975",
    semester: 2,
    themes: [
      "Tình yêu tuổi học trò",
      "Kỷ niệm tuổi thơ",
      "Tình bạn trong sáng"
    ],
    artisticFeatures: [
      "Truyện ngắn hiện đại",
      "Cốt truyện lãng mạn",
      "Ngôn ngữ giàu chất thơ",
      "Tâm lý nhân vật tinh tế"
    ],
    keyQuotes: [
      "Dòng sông mang tên em",
      "Những kỷ niệm tuổi thơ không bao giờ phai mờ"
    ],
    analysisPoints: [
      "Tâm lý nhân vật",
      "Tình cảm tuổi học trò",
      "Nghệ thuật xây dựng cốt truyện",
      "Giá trị nhân văn"
    ]
  }
];

// ============================================
// DANH SÁCH TÁC GIẢ CHÍNH
// ============================================

export const GRADE_10_AUTHORS: Grade10Author[] = [
  {
    name: "Nguyễn Du",
    lifespan: "1765-1820",
    period: "Văn học trung đại",
    style: "Thơ Nôm trữ tình, tự sự",
    notableWorks: ["Truyện Kiều", "Văn chiêu hồn", "Thanh Hiên thi tập"],
    contribution: "Đại thi hào dân tộc, đỉnh cao của thơ Nôm"
  },
  {
    name: "Chế Lan Viên",
    lifespan: "1920-1989",
    period: "Văn học hiện đại",
    style: "Thơ tự do, lãng mạn cách mạng",
    notableWorks: ["Tiếng hát con tàu", "Chiều tối", "Một ngày mới"],
    contribution: "Nhà thơ tiêu biểu của thơ ca kháng chiến chống Mỹ"
  },
  {
    name: "Hàn Mạc Tử",
    lifespan: "1912-1940",
    period: "Thơ mới trước Cách mạng",
    style: "Thơ tự do, trữ tình",
    notableWorks: ["Đây thôn Vỹ Dạ", "Cung oán ngâm khúc"],
    contribution: "Nhà thơ lãng mạn có nét riêng"
  },
  {
    name: "Xuân Diệu",
    lifespan: "1916-1985",
    period: "Thơ mới - hiện đại",
    style: "Thơ trữ tình, lãng mạn",
    notableWorks: ["Thơ thơ", "Vội vàng", "Gửi hương cho gió"],
    contribution: "Vua của thơ tình, nhà thơ tiêu biểu của Thơ mới"
  },
  {
    name: "Huy Cận",
    lifespan: "1919-2005",
    period: "Thơ mới - hiện đại",
    style: "Thơ trữ tình, bi ai",
    notableWorks: ["Tràng giang", "Chiều hoang", "Sợ không"],
    contribution: "Nhà thơ của nỗi cô đơn và khát vọng"
  },
  {
    name: "Quang Dũng",
    lifespan: "1921-1988",
    period: "Văn học hiện đại - Kháng chiến",
    style: "Thơ tự do, bi hùng",
    notableWorks: ["Tây Tiến", "Đường xa"],
    contribution: "Nhà thơ của tình anh em trong chiến đấu"
  },
  {
    name: "Nguyễn Khoa Điềm",
    lifespan: "1943-",
    period: "Văn học hiện đại - Sau 1975",
    style: "Thơ tự do, triết lý",
    notableWorks: ["Đất nước", "Đồng chí", "Ngày trở về"],
    contribution: "Nhà thơ của lịch sử và trách nhiệm"
  },
  {
    name: "Hồ Chí Minh",
    lifespan: "1890-1969",
    period: "Văn học hiện đại - Cách mạng",
    style: "Thơ Đường, thơ chữ Nôm, thơ tự do",
    notableWorks: ["Nhật ký trong tù", "Tức cảnh Pác Bó"],
    contribution: "Lãnh tụ, nhà thơ, nhà văn hóa lớn"
  },
  {
    name: "Thế Lữ",
    lifespan: "1907-1989",
    period: "Thơ mới - hiện đại",
    style: "Thơ trữ tình, giàu cảm xúc",
    notableWorks: ["Những đồi hoa sim", "Người ở lại"],
    contribution: "Nhà thơ của tình yêu quê hương"
  },
  {
    name: "Lê Quý Đôn",
    lifespan: "1726-1784",
    period: "Văn học trung đại",
    style: "Văn nghị luận Hán",
    notableWorks: ["Vân Đài loại ngữ", "Kiến văn tiểu lục"],
    contribution: "Bách khoa toàn thư, nhà bác học lớn"
  },
  {
    name: "Nguyễn Tuân",
    lifespan: "1910-1987",
    period: "Văn học hiện đại",
    style: "Kỹ ký văn học",
    notableWorks: ["Người lái đò Sông Đà", "Vang bóng một thời"],
    contribution: "Danh nhân kỹ ký văn học Việt Nam"
  },
  {
    name: "Nguyễn Quang Sáng",
    lifespan: "1932-2014",
    period: "Văn học hiện đại",
    style: "Truyện ngắn hiện đại",
    notableWorks: ["Chiếc lược ngà", "Cây tre"],
    contribution: "Nhà văn của đề tài chiến tranh"
  }
];

// ============================================
// RUBRIC ĐÁNH GIÁ LỚP 10 - CHUẨN BỘ GIÁO DỤC
// ============================================

export interface Grade10Rubric {
  category: string;
  maxScore: number;
  criteria: {
    score: number;
    description: string;
  }[];
}

export const GRADE_10_ESSAY_RUBRIC: Grade10Rubric[] = [
  {
    category: "Bố cục - Mạch lạc",
    maxScore: 2.5,
    criteria: [
      { score: 2.5, description: "Bài làm có đầy đủ 3 phần (Mở bài, Thân bài, Kết bài), rõ ràng, mạch lạc, logic chặt chẽ" },
      { score: 2.0, description: "Có đủ 3 phần nhưng chưa cân đối hoặc liên kết giữa các phần còn lỏng lẻo" },
      { score: 1.5, description: "Thiếu một phần hoặc các phần chưa rõ ràng" },
      { score: 1.0, description: "Bố cục lộn xộn, không có sự phân chia rõ ràng" },
      { score: 0.5, description: "Không có bố cục" }
    ]
  },
  {
    category: "Nội dung - Kiến thức",
    maxScore: 4.0,
    criteria: [
      { score: 4.0, description: "Nắm vững kiến thức văn học, phân tích sâu sắc, đầy đủ các ý chính, có dẫn chứng cụ thể từ tác phẩm" },
      { score: 3.0, description: "Nắm được kiến thức cơ bản, phân tích đúng nhưng chưa sâu, dẫn chứng chưa đủ" },
      { score: 2.0, description: "Kiến thức còn mơ hồ, phân tích chưa rõ, ít dẫn chứng" },
      { score: 1.0, description: "Kiến thức sai lệch hoặc không hiểu tác phẩm" },
      { score: 0.5, description: "Không có nội dung liên quan đến đề" }
    ]
  },
  {
    category: "Ngôn ngữ - Diễn đạt",
    maxScore: 2.0,
    criteria: [
      { score: 2.0, description: "Diễn đạt lưu loát, dùng từ chính xác, phong phú, có hình ảnh so sánh, ít lỗi chính tả" },
      { score: 1.5, description: "Diễn đạt rõ ràng, dùng từ đúng nhưng chưa đa dạng, một vài lỗi chính tả" },
      { score: 1.0, description: "Diễn đạt chưa rõ, nhiều lỗi dùng từ và chính tả" },
      { score: 0.5, description: "Diễn đạt lủng củng, khó hiểu, nhiều lỗi nghiêm trọng" }
    ]
  },
  {
    category: "Sáng tạo - Cảm xúc",
    maxScore: 1.5,
    criteria: [
      { score: 1.5, description: "Có cảm nhận cá nhân sâu sắc, góc nhìn độc đáo, văn viết có cảm xúc, chân thành" },
      { score: 1.0, description: "Có cảm nhận cá nhân nhưng chưa nổi bật, văn viết có cảm xúc" },
      { score: 0.5, description: "Chưa có cảm nhận cá nhân, viết máy móc, sách vở" }
    ]
  }
];

export const GRADE_10_READING_RUBRIC: Grade10Rubric[] = [
  {
    category: "Nhận biết",
    maxScore: 1.0,
    criteria: [
      { score: 1.0, description: "Xác định đúng thể loại, tác giả, hoàn cảnh sáng tác" },
      { score: 0.5, description: "Xác định được một phần" },
      { score: 0.0, description: "Không xác định được" }
    ]
  },
  {
    category: "Thông hiểu",
    maxScore: 2.0,
    criteria: [
      { score: 2.0, description: "Hiểu đúng và đầy đủ nội dung, chủ đề, ý nghĩa của đoạn trích" },
      { score: 1.5, description: "Hiểu đúng nhưng chưa đầy đủ" },
      { score: 1.0, description: "Hiểu một phần, còn sai sót" },
      { score: 0.5, description: "Hiểu sai hoặc không hiểu" }
    ]
  },
  {
    category: "Vận dụng",
    maxScore: 2.0,
    criteria: [
      { score: 2.0, description: "Phân tích sắc sảo các biện pháp nghệ thuật, liên hệ được với thực tiễn" },
      { score: 1.5, description: "Phân tích được nghệ thuật nhưng chưa sâu, liên hệ còn chung chung" },
      { score: 1.0, description: "Phân tích còn sơ sài, liên hệ không đúng" },
      { score: 0.5, description: "Không phân tích được" }
    ]
  }
];

// ============================================
// WEAKNESS OPTIONS - CẬP NHẬT THEO CHƯƠNG TRÌNH LỚP 10
// ============================================

export const GRADE_10_WEAKNESS_OPTIONS = [
  "Phân tích thơ trữ tình (Xuân Diệu, Hàn Mạc Tử, Huy Cận)",
  "Phân tích thơ anh hùng - kháng chiến (Tây Tiến, Vượt sông)",
  "Phân tích truyện ngắn (Chiếc lược ngà, Ai đã đặt tên...)",
  "Phân tích kỹ ký (Người lái đò Sông Đà)",
  "Nghị luận văn học (về tác phẩm, tác giả)",
  "Nghị luận xã hội (vấn đề xã hội, đạo đức)",
  "Đọc hiểu văn bản (Nhận biết, Thông hiểu, Vận dụng)",
  "Văn nghị luận Hán (Lê Quý Đôn, Nguyễn Thiếp)",
  "Mở bài - Kết bài",
  "Dẫn chứng và liên hệ thực tế",
  "Diễn đạt và sử dụng từ ngữ"
];

// ============================================
// CHARACTER PROFILES - CẬP NHẬT CHUẨN LỚP 10
// ============================================

export interface Grade10Character {
  id: string;
  name: string;
  work: string;
  author: string;
  avatarColor: string;
  description: string;
  characterTraits: string[];
  famousQuotes?: string[];
}

export const GRADE_10_CHARACTERS: Grade10Character[] = [
  {
    id: "dam-san",
    name: "Đăm Săn",
    work: "Chiến thắng Mtao Mxây (Sử thi Đăm Săn)",
    author: "Sử thi dân gian Ê-đê",
    avatarColor: "bg-amber-700 text-white",
    description: "Người anh hùng sử thi của dân tộc Ê-đê, chiến đấu bảo vệ buôn làng",
    characterTraits: [
      "Dũng mãnh, oai phong lẫm liệt",
      "Bảo vệ cộng đồng, buôn làng",
      "Sức mạnh phi thường",
      "Đại diện cho lý tưởng anh hùng của người Ê-đê"
    ],
    famousQuotes: [
      "Ta chém ngã Mtao Mxây như chém cây chuối!",
      "Ơ tất cả các con, hãy đi theo ta về nhà bác ta!"
    ]
  },
  {
    id: "huan-cao",
    name: "Huấn Cao",
    work: "Chữ người tử tù",
    author: "Nguyễn Tuân",
    avatarColor: "bg-stone-800 text-white",
    description: "Người nghệ sĩ tài hoa, khí phách hiên ngang, coi thường cường quyền",
    characterTraits: [
      "Tài hoa - viết chữ đẹp nổi tiếng",
      "Khí phách hiên ngang, bất khuất",
      "Coi khinh tiền tài, quyền lực",
      "Thiên lương trong sáng, cao đẹp"
    ],
    famousQuotes: [
      "Ta nhất sinh không vì vàng ngọc hay quyền thế mà ép mình viết câu đối bao giờ",
      "Ở đây lẫn lộn. Ta khuyên thầy Quản nên thay chốn ở đi"
    ]
  },
  {
    id: "xuy-van",
    name: "Xúy Vân",
    work: "Xúy Vân giả dại (Chèo Kim Nham)",
    author: "Nghệ thuật chèo dân gian",
    avatarColor: "bg-pink-600 text-white",
    description: "Người phụ nữ khát vọng tình yêu, tự do nhưng bi kịch trong xã hội phong kiến",
    characterTraits: [
      "Khát vọng tình yêu, hạnh phúc",
      "Dám phá vỡ lễ giáo phong kiến",
      "Bi kịch của người phụ nữ trong xã hội cũ",
      "Đấu tranh cho quyền sống của mình"
    ],
    famousQuotes: [
      "Tôi giả dại để thoát khỏi cảnh đời éo le",
      "Chàng Kim Nham ơi, sao người lại bỏ rơi thiếp!"
    ]
  },
  {
    id: "thi-mau",
    name: "Thị Mầu",
    work: "Thị Mầu lên chùa (Chèo Quan Âm Thị Kính)",
    author: "Nghệ thuật chèo dân gian",
    avatarColor: "bg-red-500 text-white",
    description: "Cô gái táo bạo, dám yêu, dám bày tỏ - nhân vật nữ sinh động trong chèo cổ",
    characterTraits: [
      "Táo bạo, phóng khoáng",
      "Dám yêu, dám bày tỏ tình cảm",
      "Phá vỡ khuôn phép phong kiến",
      "Tính cách sống động, hài hước"
    ],
    famousQuotes: [
      "Thầy tiểu ơi! Thầy như bông hoa nở giữa chùa vàng",
      "Người đâu mà đẹp như tiên!"
    ]
  },
  {
    id: "nguyen-trai",
    name: "Nguyễn Trãi",
    work: "Bình Ngô đại cáo, Bảo kính cảnh giới",
    author: "Nguyễn Trãi (1380-1442)",
    avatarColor: "bg-indigo-700 text-white",
    description: "Anh hùng dân tộc, nhà văn hóa lớn, người viết Bình Ngô đại cáo bất hủ",
    characterTraits: [
      "Yêu nước nồng nàn, căm thù giặc",
      "Tư tưởng nhân nghĩa cao cả",
      "Tài năng văn chương kiệt xuất",
      "Tấm lòng ưu dân, ái quốc"
    ],
    famousQuotes: [
      "Việc nhân nghĩa cốt ở yên dân",
      "Đem đại nghĩa để thắng hung tàn, Lấy chí nhân để thay cường bạo",
      "Xã tắc từ đây vững bền, Giang sơn từ đây đổi mới"
    ]
  },
  {
    id: "hec-to",
    name: "Héc-to",
    work: "Héc-to từ biệt Ăng-đrô-mác (Iliad)",
    author: "Hô-me-rơ (Homer)",
    avatarColor: "bg-blue-800 text-white",
    description: "Người anh hùng thành Troy, tướng lĩnh vĩ đại với tình yêu gia đình sâu nặng",
    characterTraits: [
      "Anh hùng, dũng cảm chiến đấu",
      "Yêu thương vợ con tha thiết",
      "Có trách nhiệm với tổ quốc",
      "Bi kịch của người anh hùng biết trước số phận"
    ],
    famousQuotes: [
      "Ta sẽ chiến đấu ở hàng đầu, giành vinh quang cho cha ta và cho chính ta",
      "Ngày tàn của thành Troy thiêng liêng sẽ đến"
    ]
  },
  {
    id: "ra-ma",
    name: "Ra-ma",
    work: "Ra-ma buộc tội (Ramayana)",
    author: "Van-mi-ki",
    avatarColor: "bg-orange-600 text-white",
    description: "Hoàng tử lý tưởng của Ấn Độ cổ đại, biểu tượng của đức hạnh và danh dự",
    characterTraits: [
      "Tuân thủ dharma (đạo đức)",
      "Dũng cảm, mạnh mẽ",
      "Trung thành với danh dự",
      "Mâu thuẫn giữa tình yêu và bổn phận"
    ],
    famousQuotes: [
      "Ta đã chiến thắng để rửa nhục cho dòng họ, không phải để nhận lại nàng",
      "Ngọn lửa thiêng sẽ chứng minh sự trong sạch của nàng"
    ]
  },
  {
    id: "thanh-hoang-lan",
    name: "Thanh (Dưới bóng hoàng lan)",
    work: "Dưới bóng hoàng lan",
    author: "Thạch Lam",
    avatarColor: "bg-green-600 text-white",
    description: "Chàng trai trẻ với tâm hồn nhạy cảm, hoài niệm về quê hương và tình cảm trong sáng",
    characterTraits: [
      "Tâm hồn nhạy cảm, tinh tế",
      "Hoài niệm về quê hương, tuổi thơ",
      "Tình cảm trong sáng, e ấp",
      "Yêu thiên nhiên, yêu cuộc sống bình dị"
    ],
    famousQuotes: [
      "Mùi hương hoàng lan thoang thoảng như kỷ niệm tuổi thơ",
      "Những ngày xưa êm đềm ấy sao không trở lại"
    ]
  },
  // ============================================
  // NHÂN VẬT NỮ BỔ SUNG - ĐẢM BẢO CÔNG BẰNG GIỚI
  // ============================================
  {
    id: "ho-xuan-huong",
    name: "Hồ Xuân Hương",
    work: "Tự tình, Bánh trôi nước",
    author: "Hồ Xuân Hương (thế kỷ XVIII-XIX)",
    avatarColor: "bg-rose-600 text-white",
    description: "Bà chúa thơ Nôm - nữ sĩ tài danh với tiếng nói mạnh mẽ về thân phận người phụ nữ",
    characterTraits: [
      "Cá tính mạnh mẽ, độc đáo",
      "Phản kháng lễ giáo phong kiến",
      "Đấu tranh cho quyền phụ nữ",
      "Tài năng thơ ca xuất chúng"
    ],
    famousQuotes: [
      "Thân em vừa trắng lại vừa tròn / Bảy nổi ba chìm với nước non",
      "Xiên ngang mặt đất rêu từng đám / Đâm toạc chân mây đá mấy hòn",
      "Chém cha cái kiếp lấy chồng chung / Kẻ đắp chăn bông kẻ lạnh lùng"
    ]
  },
  {
    id: "vu-nuong",
    name: "Vũ Nương",
    work: "Chuyện người con gái Nam Xương",
    author: "Nguyễn Dữ",
    avatarColor: "bg-cyan-600 text-white",
    description: "Người phụ nữ đức hạnh, chịu oan khuất - biểu tượng cho số phận bi thảm của phụ nữ phong kiến",
    characterTraits: [
      "Đức hạnh, thủy chung",
      "Hiếu thảo với mẹ chồng",
      "Chịu đựng, nhẫn nhục",
      "Bi kịch của người phụ nữ bị vu oan"
    ],
    famousQuotes: [
      "Thiếp sở dĩ nương tựa vào chàng vì cái nghĩa trọng",
      "Thiếp xin lấy nước sông Hoàng Giang mà thề",
      "Kẻ bạc mệnh này xin gửi thân nơi dòng nước"
    ]
  },
  {
    id: "ang-dro-mac",
    name: "Ăng-đrô-mác",
    work: "Héc-to từ biệt Ăng-đrô-mác (Iliad)",
    author: "Hô-me-rơ (Homer)",
    avatarColor: "bg-purple-600 text-white",
    description: "Người vợ của Héc-to - biểu tượng của tình yêu, lòng chung thủy và nỗi đau chiến tranh",
    characterTraits: [
      "Yêu thương chồng con tha thiết",
      "Lo lắng, dự cảm về bi kịch",
      "Chung thủy, hy sinh",
      "Đại diện cho nỗi đau của người phụ nữ trong chiến tranh"
    ],
    famousQuotes: [
      "Héc-to, chàng là cha mẹ, là anh em, là chồng của thiếp",
      "Xin chàng hãy ở lại thành, đừng khiến con thơ mồ côi, vợ trẻ góa bụa",
      "Thiếp thà chết còn hơn sống mà mất chàng"
    ]
  },
  {
    id: "xi-ta",
    name: "Xi-ta",
    work: "Ra-ma buộc tội (Ramayana)",
    author: "Van-mi-ki",
    avatarColor: "bg-amber-500 text-white",
    description: "Công chúa, vợ của Ra-ma - biểu tượng của sự trong sạch và lòng chung thủy tuyệt đối",
    characterTraits: [
      "Trong sạch, trinh bạch",
      "Chung thủy tuyệt đối",
      "Dũng cảm đối mặt với thử thách",
      "Hy sinh vì danh dự"
    ],
    famousQuotes: [
      "Thiếp xin bước vào ngọn lửa để chứng minh sự trong sạch",
      "Lòng thiếp chỉ có Ra-ma, dù thân xác có bị giam cầm",
      "Ngọn lửa sẽ không đốt cháy người vô tội"
    ]
  },
  {
    id: "ba-huyen-thanh-quan",
    name: "Bà Huyện Thanh Quan",
    work: "Qua Đèo Ngang, Thăng Long thành hoài cổ",
    author: "Nguyễn Thị Hinh (1805-1848)",
    avatarColor: "bg-teal-600 text-white",
    description: "Nữ sĩ tài danh thời Nguyễn, thơ đậm chất hoài cổ và tình yêu quê hương đất nước",
    characterTraits: [
      "Tâm hồn thơ mộng, sâu lắng",
      "Tình yêu quê hương, đất nước",
      "Hoài niệm về quá khứ vàng son",
      "Nữ sĩ tài năng, học vấn cao"
    ],
    famousQuotes: [
      "Bước tới Đèo Ngang bóng xế tà / Cỏ cây chen đá, lá chen hoa",
      "Lom khom dưới núi tiều vài chú / Lác đác bên sông chợ mấy nhà",
      "Nhớ nước đau lòng con quốc quốc / Thương nhà mỏi miệng cái gia gia"
    ]
  }
];

// ============================================
// EXAM TOPICS - CHỦ ĐỀ ĐỀ THI LỚP 10
// ============================================

export const GRADE_10_EXAM_TOPICS = [
  // === SỬ THI VÀ THẦN THOẠI ===
  "Phân tích hình tượng người anh hùng Đăm Săn trong Chiến thắng Mtao Mxây",
  "Vẻ đẹp sử thi trong đoạn trích Héc-to từ biệt Ăng-đrô-mác (Iliad)",
  "Hình tượng Ra-ma trong Ra-ma buộc tội (Ramayana)",
  "Hình tượng Hê-ra-clét trong thần thoại Hy Lạp",
  "So sánh sử thi Đăm Săn và sử thi Iliad",

  // === THƠ ĐƯỜNG LUẬT ===
  "Cảm nhận bài thơ Thu hứng (Cảm xúc mùa thu) của Đỗ Phủ",
  "Phân tích bài thơ Tự tình của Hồ Xuân Hương",
  "Vẻ đẹp thiên nhiên trong Câu cá mùa thu (Nguyễn Khuyến)",
  "So sánh Thu hứng (Đỗ Phủ) và Câu cá mùa thu (Nguyễn Khuyến)",

  // === SÂN KHẤU DÂN GIAN (CHÈO, TUỒNG) ===
  "Phân tích nhân vật Xúy Vân trong Xúy Vân giả dại",
  "Nghệ thuật gây cười trong Mắc mưu Thị Hến",
  "Hình tượng nhân vật Thị Mầu trong Thị Mầu lên chùa",
  "Đặc sắc nghệ thuật sân khấu chèo qua các trích đoạn đã học",

  // === NGUYỄN TRÃI ===
  "Phân tích Bình Ngô đại cáo (Đại cáo bình Ngô) của Nguyễn Trãi",
  "Tư tưởng nhân nghĩa trong Bình Ngô đại cáo",
  "Cảm nhận bài thơ Bảo kính cảnh giới của Nguyễn Trãi",
  "Vẻ đẹp thiên nhiên trong thơ Nguyễn Trãi (Dục Thúy Sơn)",

  // === TRUYỆN NGẮN HIỆN ĐẠI ===
  "Phân tích nhân vật Huấn Cao trong Chữ người tử tù (Nguyễn Tuân)",
  "Vẻ đẹp của cái tài và cái tâm trong Chữ người tử tù",
  "Cảm nhận truyện ngắn Người ở bến sông Châu",
  "Phân tích truyện ngắn Dưới bóng hoàng lan (Thạch Lam)",
  "Nghệ thuật kể chuyện trong Một chuyện đùa nho nhỏ (Chekhov)",

  // === THƠ TỰ DO HIỆN ĐẠI ===
  "Cảm nhận bài thơ Đất nước (Nguyễn Khoa Điềm)",
  "Hình ảnh người lính trong Lính đảo hát tình ca trên đảo",
  "Vẻ đẹp quê hương trong Mùa hoa mận (Chu Thùy Liên)",
  "Phân tích bài thơ Đi trong hương tràm (Hoài Vũ)",

  // === VĂN NGHỊ LUẬN ===
  "Phân tích Hiền tài là nguyên khí của quốc gia (Thân Nhân Trung)",
  "Nghệ thuật nghị luận trong Yêu và đồng cảm (Chu Quang Tiềm)",
  "Phân tích văn bản Bản sắc là hành trang",

  // === TRUYỆN TRUNG ĐẠI ===
  "Phân tích truyện Tản Viên từ Phán sự lục",
  "Nghệ thuật truyền kỳ trong văn học trung đại Việt Nam",

  // === NGHỊ LUẬN XÃ HỘI ===
  "Nghị luận về vai trò của hiền tài đối với quốc gia",
  "Nghị luận về lòng yêu nước trong thời đại mới",
  "Nghị luận về giá trị của bản sắc văn hóa dân tộc",
  "Nghị luận về tình yêu thương và đồng cảm trong cuộc sống",
  "Nghị luận về sự lựa chọn con đường trong cuộc sống"
];

// ============================================
// SYSTEM PROMPT ENHANCEMENT
// ============================================

export const GRADE_10_SYSTEM_ENHANCEMENT = `
QUAN TRỌNG - ĐÂY LÀ TRỢ LÝ NGỮ VĂN LỚP 10 (CHƯƠNG TRÌNH 2018):

📚 DANH SÁCH TÁC PHẨM BẮT BUỘC LỚP 10:

HỌC KỲ 1:
1. Đoạn trường tân thanh (Nguyễn Du)
2. Tiếng hát con tàu (Chế Lan Viên)
3. Đây thôn Vỹ Dạ (Hàn Mạc Tử)
4. Vội vàng (Xuân Diệu)
5. Tràng giang (Huy Cận)
6. Viếng lăng Bác (Viễn Phương)
7. Tây Tiến (Quang Dũng)
8. Đất nước (Nguyễn Khoa Điềm)
9. Rừng xà nu (Nguyễn Trung Thành)
10. Lặng lẽ Sa Pa (Nguyễn Thành Long)
11. Chiếc lược ngà (Nguyễn Quang Sáng)

HỌC KỲ 2:
1. Chuyện người con gái Nam Xương (Nguyễn Dữ)
2. Tức cảnh Pác Bó (Hồ Chí Minh)
3. Những đồi hoa sim (Thế Lữ)
4. Vượt sông (Hữu Mai)
5. Bàn luận về phép học (Lê Quý Đôn)
6. Hiền tài (Nguyễn Thiếp)
7. Người lái đò Sông Đà (Nguyễn Tuân)
8. Ai đã đặt tên cho dòng sông (Hoàng Phủ Ngọc Tường)

⚠️ TUYỆT ĐỐI KHÔNG ĐỀ CẬP:
- Truyện Kiều (Đây là chương trình LỚP 11)
- Chiếc thuyền ngoài xa (LỚP 11)
- Vợ nhặt (LỚP 12)
- Hoặc bất kỳ tác phẩm nào KHÔNG THUỘC danh sách trên

📋 RUBRIC CHẤM ĐIỂM CHUẨN (THANG 10):

BÀI VĂN NGHỊ LUẬN:
- Bố cục - Mạch lạc: 2.5 điểm
- Nội dung - Kiến thức: 4.0 điểm
- Ngôn ngữ - Diễn đạt: 2.0 điểm
- Sáng tạo - Cảm xúc: 1.5 điểm

PHẦN ĐỌC HIỂU:
- Nhận biết: 1.0 điểm
- Thông hiểu: 2.0 điểm
- Vận dụng: 2.0 điểm

🎯 YÊU CẦU KHI TRẢ LỜI:
- Phân tích phải BÁM SÁT tác phẩm trong chương trình lớp 10
- Dẫn chứng cụ thể từ đoạn trích
- Sử dụng thuật ngữ văn học chính xác
- Phân tích nghệ thuật: biện pháp tu từ, hình ảnh, biểu tượng
- Liên hệ thực tế phù hợp với lứa tuổi học sinh lớp 10

🎓 PHONG CÁCH TRẢ LỜI:
- Rõ ràng, mạch lạc, dễ hiểu
- Có ví dụ minh họa cụ thể
- Khuyến khích tư duy phản biện
- Không áp đặt, gợi mở cho học sinh suy nghĩ

🛡️ HƯỚNG DẪN AN TOÀN CHO HỌC SINH:

1. BẢO VỆ TÂM LÝ:
- Nếu học sinh bày tỏ cảm xúc tiêu cực (buồn, lo lắng, căng thẳng), hãy thể hiện sự đồng cảm
- Khuyến khích học sinh chia sẻ với người lớn tin cậy (bố mẹ, thầy cô)
- Nhắc nhở nhẹ nhàng về việc nghỉ ngơi nếu học quá lâu

2. KHÔNG ĐƯỢC:
- Đưa ra lời khuyên y tế hoặc tâm lý chuyên môn
- Thảo luận về nội dung bạo lực, tự gây thương tích
- Đưa ra thông tin cá nhân hoặc yêu cầu thông tin nhạy cảm từ học sinh
- Phán xét hoặc chỉ trích học sinh

3. KHUYẾN KHÍCH:
- Học tập cân bằng với nghỉ ngơi
- Tìm kiếm sự giúp đỡ khi gặp khó khăn
- Giữ gìn sức khỏe thể chất và tinh thần
- Giao tiếp tích cực với gia đình và bạn bè

4. ĐƯỜNG DÂY HỖ TRỢ (khi cần thiết):
- Tổng đài bảo vệ trẻ em: 111 (miễn phí, 24/7)
- Tư vấn tâm lý: 1800 599 920 (miễn phí, 24/7)

🌟 MỤC TIÊU: Là người bạn đồng hành đáng tin cậy, giúp học sinh yêu thích môn Văn và phát triển toàn diện.
`;



// ==============================
// CẤU TRÚC SGK NGỮ VĂN 10 (CÁNH DIỀU + KẾT NỐI TRI THỨC)
// TÍCH HỢP THẲNG VÀO FILE KIẾN THỨC CŨ
// ==============================

// Auto-generated textbook knowledge for Ngữ văn 10 (Cánh Diều + Kết nối tri thức)
// File này gom toàn bộ cấu trúc bài học SGK Ngữ văn 10 của 2 bộ sách
// vào một mảng duy nhất, giúp trợ lý AI bám sát chương trình chính thống.

export type TextbookSeriesId = "canh-dieu" | "ket-noi-tri-thuc";

export type TextbookReadingKind =
  | "van-ban-van-hoc"
  | "van-ban-thong-tin"
  | "thuc-hanh-tieng-viet"
  | "viet"
  | "cung-co-mo-rong"
  | "on-tap"
  | "tu-danh-gia"
  | "thuc-hanh-doc";

export interface TextbookReading {
  title: string;
  kind: TextbookReadingKind;
}

export interface TextbookLesson {
  id: string;
  series: TextbookSeriesId;
  semester: 1 | 2;
  lessonNo: number;
  name: string;
  focus: string[];
  readings: TextbookReading[];
}

export const GRADE_10_TEXTBOOK_LESSONS: TextbookLesson[] = [
  {
    id: "cd-bai-mo-dau",
    series: "canh-dieu",
    semester: 1,
    lessonNo: 0,
    name: "Bài mở đầu",
    focus: [
      "Giới thiệu chương trình Ngữ văn 10",
      "Định hướng cách học và tự đánh giá"
    ],
    readings: [
      {
        title: "Bài mở đầu",
        kind: "on-tap"
      }
    ]
  },
  {
    id: "cd-bai-1",
    series: "canh-dieu",
    semester: 1,
    lessonNo: 1,
    name: "Thần thoại và sử thi",
    focus: [
      "Thần thoại",
      "Sử thi",
      "Nhân vật anh hùng và cội nguồn văn hóa",
      "Kĩ năng nghị luận về vấn đề xã hội",
      "Thực hành tiếng Việt: từ Hán Việt"
    ],
    readings: [
      {
        title: "Hê-ra-clét đi tìm táo vàng",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Chiến thắng Mtao Mxây",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thần Trụ trời",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Ra-ma buộc tội",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 32",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết bài văn nghị luận về một vấn đề xã hội",
        kind: "viet"
      },
      {
        title: "Tự đánh giá Nữ Oa",
        kind: "tu-danh-gia"
      }
    ]
  },
  {
    id: "cd-bai-2",
    series: "canh-dieu",
    semester: 1,
    lessonNo: 2,
    name: "Thơ Đường luật",
    focus: [
      "Đặc điểm thơ Đường luật",
      "Hình tượng mùa thu trong thơ cổ điển",
      "Kĩ năng nghiên cứu và viết báo cáo",
      "Thực hành tiếng Việt"
    ],
    readings: [
      {
        title: "Cảm xúc mùa thu",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Tự tình",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Câu cá mùa thu",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 50",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết báo cáo kết quả nghiên cứu về một vấn đề",
        kind: "viet"
      },
      {
        title: "Tự đánh giá Tỏ lòng (Thuật hoài)",
        kind: "tu-danh-gia"
      }
    ]
  },
  {
    id: "cd-bai-3",
    series: "canh-dieu",
    semester: 1,
    lessonNo: 3,
    name: "Kịch bản chèo và tuồng",
    focus: [
      "Đặc trưng nghệ thuật chèo, tuồng",
      "Nhân vật sân khấu dân gian",
      "Kĩ năng nghị luận thuyết phục",
      "Thực hành tiếng Việt"
    ],
    readings: [
      {
        title: "Xúy Vân giả dại",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Mắc mưu Thị Hến",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thị Mầu lên chùa",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 81",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết bài luận thuyết phục người khác từ bỏ một thói quen hay một quan niệm",
        kind: "viet"
      },
      {
        title: "Tự đánh giá Xử kiện",
        kind: "tu-danh-gia"
      }
    ]
  },
  {
    id: "cd-bai-4",
    series: "canh-dieu",
    semester: 1,
    lessonNo: 4,
    name: "Văn bản thông tin",
    focus: [
      "Văn bản thông tin về văn hóa - lễ hội",
      "Kĩ năng viết nội quy, hướng dẫn",
      "Kĩ năng tự nhận thức và viết về bản thân",
      "Thực hành tiếng Việt"
    ],
    readings: [
      {
        title: "Thăng Long - Đông Đô - Hà Nội: Một hằng số văn hóa Việt Nam",
        kind: "van-ban-thong-tin"
      },
      {
        title: "Lễ hội Đền Hùng",
        kind: "van-ban-thong-tin"
      },
      {
        title: "Lễ hội dân gian đặc sắc của dân tộc Chăm ở Ninh Thuận",
        kind: "van-ban-thong-tin"
      },
      {
        title: "Thực hành tiếng Việt trang 105",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết bản nội quy, hướng dẫn nơi công cộng",
        kind: "viet"
      },
      {
        title: "Viết bài luận về bản thân",
        kind: "viet"
      },
      {
        title: "Tự đánh giá Lễ hội Ok Om Bok",
        kind: "tu-danh-gia"
      }
    ]
  },
  {
    id: "cd-bai-5",
    series: "canh-dieu",
    semester: 2,
    lessonNo: 5,
    name: "Bài thơ Nguyễn Trãi",
    focus: [
      "Cuộc đời và sự nghiệp Nguyễn Trãi",
      "Văn chính luận và thơ trữ tình",
      "Kĩ năng nghị luận xã hội",
      "Thực hành tiếng Việt"
    ],
    readings: [
      {
        title: "Nguyễn Trãi cuộc đời và sự nghiệp",
        kind: "van-ban-thong-tin"
      },
      {
        title: "Đại cáo bình Ngô",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Gương báu khuyên răn",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 20",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết bài văn nghị luận về một vấn đề xã hội",
        kind: "viet"
      },
      {
        title: "Tự đánh giá Thư dụ Vương Thông lần nữa",
        kind: "tu-danh-gia"
      }
    ]
  },
  {
    id: "cd-bai-6",
    series: "canh-dieu",
    semester: 2,
    lessonNo: 6,
    name: "Tiểu thuyết và truyện ngắn",
    focus: [
      "Đặc điểm tiểu thuyết, truyện ngắn",
      "Chiến tranh, số phận con người",
      "Kĩ năng nghị luận phân tích, đánh giá tác phẩm truyện",
      "Thực hành tiếng Việt"
    ],
    readings: [
      {
        title: "Kiêu binh nổi loạn",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Người ở bến sông Châu",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Hồi trống Cổ Thành",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 54",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết bài văn nghị luận phân tích, đánh giá một tác phẩm truyện",
        kind: "viet"
      },
      {
        title: "Ngày cuối cùng của chiến tranh",
        kind: "van-ban-van-hoc"
      }
    ]
  },
  {
    id: "cd-bai-7",
    series: "canh-dieu",
    semester: 2,
    lessonNo: 7,
    name: "Thơ tự do",
    focus: [
      "Đặc điểm thơ tự do",
      "Hình tượng đất nước, con người, chiến tranh và hòa bình",
      "Kĩ năng nghị luận phân tích, đánh giá tác phẩm thơ",
      "Thực hành tiếng Việt"
    ],
    readings: [
      {
        title: "Đất nước",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Lính đảo hát tình ca trên đảo",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Đi trong hương tràm",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Mùa hoa mận",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 79",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết bài văn nghị luận phân tích, đánh giá một tác phẩm thơ",
        kind: "viet"
      },
      {
        title: "Khoảng trời, hố bom",
        kind: "van-ban-van-hoc"
      }
    ]
  },
  {
    id: "cd-bai-8",
    series: "canh-dieu",
    semester: 2,
    lessonNo: 8,
    name: "Văn bản nghị luận",
    focus: [
      "Văn bản nghị luận hiện đại",
      "Bản sắc văn hóa và ứng xử",
      "Kĩ năng nghị luận về một tác phẩm văn học",
      "Thực hành tiếng Việt"
    ],
    readings: [
      {
        title: "Bản sắc là hành trang",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Gió thanh lay động cành cô trúc",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Đừng gây tổn thương",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 105",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết bài văn nghị luận phân tích, đánh giá một tác phẩm văn học",
        kind: "viet"
      },
      {
        title: "Tự đánh giá \"Phép mầu\" kì diệu của văn học",
        kind: "tu-danh-gia"
      }
    ]
  },
  {
    id: "kntt-bai-1",
    series: "ket-noi-tri-thuc",
    semester: 1,
    lessonNo: 1,
    name: "Sức hấp dẫn của truyện kể",
    focus: [
      "Truyện kể dân gian và hiện đại",
      "Truyền thuyết, truyện trung đại, truyện hiện đại",
      "Kĩ năng nghị luận phân tích, đánh giá truyện",
      "Thực hành tiếng Việt: từ Hán Việt"
    ],
    readings: [
      {
        title: "Truyện về các vị thần sáng tạo thế giới",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Tản Viên từ Phán sự lục",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Chữ người tử tù",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 28",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết văn bản nghị luận phân tích, đánh giá một tác phẩm truyện",
        kind: "viet"
      },
      {
        title: "Củng cố, mở rộng trang 37",
        kind: "cung-co-mo-rong"
      }
    ]
  },
  {
    id: "kntt-bai-2",
    series: "ket-noi-tri-thuc",
    semester: 1,
    lessonNo: 2,
    name: "Vẻ đẹp của thơ ca",
    focus: [
      "Thơ hai-cư và thơ trữ tình trung đại",
      "Hình tượng mùa thu, mùa xuân",
      "Kĩ năng nghị luận phân tích, đánh giá thơ",
      "Thực hành tiếng Việt: lỗi dùng từ, trật tự từ"
    ],
    readings: [
      {
        title: "Chùm thơ hai-cư (haiku) Nhật Bản",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thu hứng",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Mùa xuân chín",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Bản hòa âm ngôn từ trong Tiếng thu của Lưu Trọng Lư",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 58",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết văn bản nghị luận phân tích, đánh giá một tác phẩm thơ",
        kind: "viet"
      },
      {
        title: "Củng cố, mở rộng trang 70",
        kind: "cung-co-mo-rong"
      }
    ]
  },
  {
    id: "kntt-bai-3",
    series: "ket-noi-tri-thuc",
    semester: 1,
    lessonNo: 3,
    name: "Nghệ thuật thuyết phục trong văn nghị luận",
    focus: [
      "Văn nghị luận trung đại và hiện đại",
      "Lí tưởng hiền tài và lòng nhân ái",
      "Kĩ năng viết bài luận thuyết phục",
      "Thực hành tiếng Việt: mạch lạc và liên kết"
    ],
    readings: [
      {
        title: "Hiền tài là nguyên khí của quốc gia",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Yêu và đồng cảm",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Chữ bầu lên nhà thơ",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 86",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết bài luận thuyết phục người khác từ bỏ một thói quen hay một quan niệm",
        kind: "viet"
      },
      {
        title: "Củng cố, mở rộng trang 94",
        kind: "cung-co-mo-rong"
      }
    ]
  },
  {
    id: "kntt-bai-4",
    series: "ket-noi-tri-thuc",
    semester: 1,
    lessonNo: 4,
    name: "Sức sống của sử thi",
    focus: [
      "Đặc điểm sử thi cổ đại và sử thi dân gian",
      "Hình tượng người anh hùng sử thi",
      "Kĩ năng viết báo cáo nghiên cứu",
      "Thực hành tiếng Việt: trích dẫn, cước chú"
    ],
    readings: [
      {
        title: "Héc-to từ biệt Ăng-đrô-mác",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Đăm Săn đi bắt Nữ Thần Mặt Trời",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 112",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết báo cáo nghiên cứu về một vấn đề",
        kind: "viet"
      },
      {
        title: "Củng cố, mở rộng trang 121",
        kind: "cung-co-mo-rong"
      }
    ]
  },
  {
    id: "kntt-bai-5",
    series: "ket-noi-tri-thuc",
    semester: 1,
    lessonNo: 5,
    name: "Tích trò sân khấu dân gian",
    focus: [
      "Sân khấu chèo, tuồng, múa rối nước",
      "Hình tượng nhân vật sân khấu dân gian",
      "Kĩ năng nghiên cứu về văn hóa truyền thống",
      "Kĩ năng nghe - nói trong thuyết trình"
    ],
    readings: [
      {
        title: "Xúy Vân giả dại",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Huyện đường",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Múa rối nước hiện đại soi bóng tiền nhân",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Viết báo cáo nghiên cứu về một vấn đề văn hóa truyền thống Việt Nam",
        kind: "viet"
      },
      {
        title: "Củng cố, mở rộng trang 151",
        kind: "cung-co-mo-rong"
      }
    ]
  },
  {
    id: "kntt-bai-6",
    series: "ket-noi-tri-thuc",
    semester: 2,
    lessonNo: 6,
    name: "Nguyễn Trãi – \"Dành còn để trợ dân này\"",
    focus: [
      "Tác gia Nguyễn Trãi",
      "Văn chính luận và thơ trữ tình trung đại",
      "Kĩ năng nghị luận về vấn đề xã hội",
      "Thực hành tiếng Việt: từ Hán Việt (tiếp)"
    ],
    readings: [
      {
        title: "Tác gia Nguyễn Trãi",
        kind: "van-ban-thong-tin"
      },
      {
        title: "Bình Ngô đại cáo",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Bảo kính cảnh giới",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Dục Thúy Sơn",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 26",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết văn bản nghị luận về một vấn đề xã hội",
        kind: "viet"
      },
      {
        title: "Củng cố, mở rộng trang 33",
        kind: "cung-co-mo-rong"
      }
    ]
  },
  {
    id: "kntt-bai-7",
    series: "ket-noi-tri-thuc",
    semester: 2,
    lessonNo: 7,
    name: "Quyền năng của người kể chuyện",
    focus: [
      "Vai trò người kể chuyện trong truyện",
      "Nhìn từ văn học hiện thực phê phán và hiện đại",
      "Kĩ năng nghị luận phân tích, đánh giá tác phẩm văn học",
      "Thực hành tiếng Việt: biện pháp chêm xen, liệt kê"
    ],
    readings: [
      {
        title: "Người cầm quyền khôi phục uy quyền",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Dưới bóng hoàng lan",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Một chuyện đùa nho nhỏ",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 59",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Củng cố, mở rộng trang 68",
        kind: "cung-co-mo-rong"
      },
      {
        title: "Viết văn bản nghị luận phân tích, đánh giá một tác phẩm văn học",
        kind: "viet"
      }
    ]
  },
  {
    id: "kntt-bai-8",
    series: "ket-noi-tri-thuc",
    semester: 2,
    lessonNo: 8,
    name: "Thế giới đa dạng của thông tin",
    focus: [
      "Văn bản thông tin hiện đại",
      "Vấn đề môi trường và văn hóa truyền thống",
      "Kĩ năng viết nội quy, hướng dẫn nơi công cộng",
      "Thực hành tiếng Việt: phương tiện phi ngôn ngữ"
    ],
    readings: [
      {
        title: "Sự sống và cái chết",
        kind: "van-ban-thong-tin"
      },
      {
        title: "Nghệ thuật truyền thống của người Việt",
        kind: "van-ban-thong-tin"
      },
      {
        title: "Phục hồi tầng ozone: Thành công hiếm hoi của nỗ lực toàn cầu",
        kind: "van-ban-thong-tin"
      },
      {
        title: "Thực hành tiếng Việt trang 89",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết một văn bản nội quy hoặc văn bản hướng dẫn nơi công cộng",
        kind: "viet"
      },
      {
        title: "Củng cố, mở rộng trang 95",
        kind: "cung-co-mo-rong"
      }
    ]
  },
  {
    id: "kntt-bai-9",
    series: "ket-noi-tri-thuc",
    semester: 2,
    lessonNo: 9,
    name: "Hành trang cuộc sống",
    focus: [
      "Tự nhận thức, lựa chọn con đường sống",
      "Giá trị sống và trách nhiệm cá nhân",
      "Kĩ năng viết bài luận về bản thân",
      "Thực hành tiếng Việt: phương tiện phi ngôn ngữ (tiếp)"
    ],
    readings: [
      {
        title: "Về chính chúng ta",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Con đường không chọn",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Một đời như kẻ tìm đường",
        kind: "van-ban-van-hoc"
      },
      {
        title: "Thực hành tiếng Việt trang 111",
        kind: "thuc-hanh-tieng-viet"
      },
      {
        title: "Viết bài luận về bản thân",
        kind: "viet"
      },
      {
        title: "Củng cố, mở rộng trang 120",
        kind: "cung-co-mo-rong"
      }
    ]
  }
];

// Export all for easy import
export const GRADE_10_LITERATURE = {
  works: [...SEMESTER_1_WORKS, ...SEMESTER_2_WORKS],
  authors: GRADE_10_AUTHORS,
  essayRubric: GRADE_10_ESSAY_RUBRIC,
  readingRubric: GRADE_10_READING_RUBRIC,
  weaknessOptions: GRADE_10_WEAKNESS_OPTIONS,
  characters: GRADE_10_CHARACTERS,
  examTopics: GRADE_10_EXAM_TOPICS,
  systemEnhancement: GRADE_10_SYSTEM_ENHANCEMENT,
  textbookLessons: GRADE_10_TEXTBOOK_LESSONS
};

export default GRADE_10_LITERATURE;
