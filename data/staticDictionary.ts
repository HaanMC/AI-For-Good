import { DictionaryEntry } from '../types';

/**
 * Static dictionary for common literary terms
 * Provides instant lookup without API calls
 */
export const STATIC_DICTIONARY: Record<string, DictionaryEntry> = {
  'nhân đạo chủ nghĩa': {
    term: 'Nhân đạo chủ nghĩa',
    definition: 'Một tư tưởng văn học - triết học khẳng định giá trị con người, đề cao nhân phẩm, tự do và quyền sống của mỗi cá nhân. Quan tâm đến số phận, khổ đau của con người trong xã hội.',
    literaryContext: 'Thường thể hiện qua việc miêu tả số phận bi thảm của những con người nghèo khổ, bị áp bức; phê phán xã hội bất công và kêu gọi lòng nhân ái, bác ái.',
    example: 'Trong "Chiếc lược ngà" của Nguyễn Quang Sáng, tình cảm nhân đạo thể hiện qua sự đồng cảm sâu sắc với số phận người phụ nữ nghèo bán chiếc lược ngà - vật duy nhất còn lại của mẹ để lo cho con.'
  },

  'chủ nghĩa hiện thực': {
    term: 'Chủ nghĩa hiện thực',
    definition: 'Phương pháp sáng tác văn học phản ánh cuộc sống một cách chân thực, khách quan, toàn diện với những mâu thuẫn và phức tạp của nó. Nhà văn miêu tả hiện thực như nó đang là.',
    literaryContext: 'Tác phẩm hiện thực thường phản ánh đời sống xã hội cụ thể, nhân vật điển hình trong hoàn cảnh điển hình, với những chi tiết chân thực, sinh động.',
    example: 'Truyện ngắn "Chiếc lược ngà" miêu tả chân thực cuộc sống khó khăn của người phụ nữ sau chiến tranh, với những chi tiết cụ thể như việc bán lược ngà, nuôi con nhỏ một mình.'
  },

  'lãng mạn chủ nghĩa': {
    term: 'Lãng mạn chủ nghĩa',
    definition: 'Trào lưu văn học nghệ thuật đề cao cảm xúc, trí tưởng tượng, lý tưởng cao đẹp. Nhấn mạnh vào thế giới nội tâm, khát vọng tự do, vẻ đẹp thiên nhiên và tình yêu lớn lao.',
    literaryContext: 'Thường sử dụng ngôn ngữ giàu hình ảnh, biểu cảm mạnh mẽ, kết hợp hiện thực với tưởng tượng, ca ngợi những giá trị tinh thần cao đẹp.',
    example: 'Thơ "Đây thôn Vỹ Dạ" của Hàn Mặc Tử với hình ảnh "trăng in mặt nước bàu" - vừa chân thực vừa mơ màng, thể hiện tâm hồn lãng mạn nhạy cảm của nhà thơ.'
  },

  'biện chứng phép': {
    term: 'Biện chứng phép',
    definition: 'Phương pháp tư duy và nghệ thuật thể hiện mối quan hệ đối lập, thống nhất giữa các hiện tượng, sự chuyển hóa lẫn nhau và phát triển của sự vật.',
    literaryContext: 'Trong văn học, biện chứng phép giúp thể hiện sự phức tạp, đa chiều của cuộc sống thông qua các mối quan hệ tương phản nhưng gắn bó hữu cơ.',
    example: 'Trong "Tây Tiến" của Quang Dũng: nét đẹp của thiên nhiên "Tây Tiến đoàn binh không mộ bia" đan xen với nỗi buồn chiến tranh, tạo nên vẻ đẹp bi tráng.'
  },

  'ước lệ tượng trưng': {
    term: 'Ước lệ tượng trưng',
    definition: 'Hình ảnh, sự vật, hiện tượng được sử dụng lâu đời trong văn học để biểu trưng cho một ý nghĩa nhất định, trở thành quy ước chung được mọi người hiểu.',
    literaryContext: 'Giúp tăng sức gợi hình gợi cảm, tạo chiều sâu ý nghĩa cho tác phẩm thông qua các biểu tượng quen thuộc trong truyền thống văn hóa dân tộc.',
    example: 'Hình ảnh "cây tre" trong thơ văn Việt Nam thường tượng trưng cho sức sống mãnh liệt, khí phách kiên cường của con người Việt Nam. Trong "Đất nước" của Nguyễn Khoa Điềm: "tre xanh" là biểu tượng của sức sống dân tộc.'
  },

  'điển tích': {
    term: 'Điển tích',
    definition: 'Câu chuyện, sự kiện lịch sử hoặc truyền thuyết được sử dụng trong tác phẩm văn học để ám chỉ, so sánh hoặc tăng thêm sức gợi hình, gợi cảm.',
    literaryContext: 'Dùng điển tích giúp tác phẩm súc tích hơn, gợi liên tưởng đến những giá trị văn hóa, lịch sử lâu đời, tăng chiều sâu ý nghĩa.',
    example: 'Trong "Tràng giang" của Huy Cận, câu "Thuở nào Tản Viên đùa giỡn nước" dùng điển tích thần Tản Viên sơn thần gắn với núi Bà Đen để nói về vẻ đẹp hùng vĩ của thiên nhiên từ xa xưa.'
  },

  'liên ngữ': {
    term: 'Liên ngữ',
    definition: 'Những từ ngữ thường đi liền với nhau trong văn chương cổ điển hoặc thành ngữ tục ngữ, tạo thành một cụm ổn định với ý nghĩa đặc biệt.',
    literaryContext: 'Sử dụng liên ngữ giúp ngôn ngữ văn học súc tích, giàu sức gợi và mang đậm dấu ấn văn hóa dân tộc.',
    example: 'Cụm "non sông" (non - núi, sông - nước) là liên ngữ chỉ đất nước, giang sơn. Trong "Viếng lăng Bác" của Viễn Phương: "Trăm năm non sông chung một lẽ" - non sông ở đây chỉ đất nước Việt Nam.'
  },

  'tu từ': {
    term: 'Tu từ',
    definition: 'Nghệ thuật sử dụng ngôn ngữ một cách khéo léo, tạo sức biểu cảm, gợi hình gợi cảm cho văn bản. Bao gồm nhiều biện pháp nghệ thuật như so sánh, ẩn dụ, nhân hóa, điệp ngữ...',
    literaryContext: 'Tu từ giúp ngôn ngữ văn học sinh động, hình ảnh rõ nét, cảm xúc sâu sắc, tạo ấn tượng mạnh với người đọc.',
    example: 'Trong "Đất nước" của Nguyễn Khoa Điềm dùng nhiều biện pháp tu từ như nhân hóa "non Việt Nam cất tiếng gọi", điệp từ "đất nước" lặp đi lặp lại tạo nhịp điệu và khẳng định chủ đề.'
  },

  'phép nhân hóa': {
    term: 'Phép nhân hóa',
    definition: 'Biện pháp tu từ gán cho sự vật, hiện tượng thiên nhiên những đặc điểm, hành động, tình cảm của con người.',
    literaryContext: 'Giúp hình ảnh sinh động, gần gũi hơn, thể hiện tâm trạng, tình cảm của tác giả qua sự vật được nhân hóa.',
    example: 'Trong "Đất nước" của Nguyễn Khoa Điềm: "Và non Việt Nam cất tiếng gọi" - núi non được nhân hóa như con người biết kêu gọi, thể hiện tiếng gọi thiêng liêng của Tổ quốc.'
  },

  'so sánh ẩn dụ': {
    term: 'So sánh và ẩn dụ',
    definition: 'So sánh: đặt hai sự vật, hiện tượng cạnh nhau để tìm điểm tương đồng (có từ so sánh). Ẩn dụ: gọi sự vật này bằng tên sự vật khác dựa vào nét tương đồng (không có từ so sánh).',
    literaryContext: 'Cả hai biện pháp đều giúp diễn đạt sinh động, hình ảnh hóa, tạo sức gợi cảm mạnh mẽ. Ẩn dụ thường hàm súc, gợi cảm hơn so sánh.',
    example: 'So sánh trong "Vội vàng" của Xuân Diệu: "Mây tím khói hồng như mơ như ảo". Ẩn dụ trong "Đoạn trường tân thanh": "bể dâu" ẩn dụ cho thời gian lâu dài, thế sự thay đổi.'
  },

  'tượng thanh': {
    term: 'Tượng thanh',
    definition: 'Biện pháp tu từ sử dụng âm thanh của từ ngữ để gợi lên hình ảnh, cảm giác về sự vật, hiện tượng. Từ ngữ bắt chước âm thanh tự nhiên.',
    literaryContext: 'Tạo hiệu quả sinh động, gợi cảm, giúp người đọc như nghe thấy âm thanh được miêu tả.',
    example: 'Trong "Lặng lẽ Sa Pa" của Nguyễn Thành Long: "tiếng chim ri rít" - từ "ri rít" bắt chước âm thanh tiếng chim, tạo không khí yên bình của Sa Pa sớm mai.'
  },

  'nghịch ngữ': {
    term: 'Nghịch ngữ',
    definition: 'Biện pháp tu từ nói ngược lại với ý nghĩa thực sự muốn truyền đạt, thường mang tính châm biếm, mỉa mai hoặc tạo hiệu quả hài hước.',
    literaryContext: 'Giúp lời văn hàm súc, sâu sắc, có sức phê phán hoặc gây ấn tượng mạnh thông qua sự trái ngược.',
    example: 'Trong "Bàn luận về phép học" của Lê Quý Đôn có đoạn "người học giỏi lại khó làm quan, người ngu dốt lại dễ thăng tiến" - dùng nghịch ngữ để châm biếm tệ nạn xã hội phong kiến.'
  },

  // === THỂ LOẠI VĂN BẢN ===
  'văn xuôi': {
    term: 'Văn xuôi',
    definition: 'Hình thức văn bản không ràng buộc về vần điệu, nhịp điệu như thơ. Bao gồm truyện ngắn, tiểu thuyết, tùy bút, văn nghị luận...',
    literaryContext: 'Dùng để kể chuyện, miêu tả, biểu cảm hoặc nghị luận một cách tự nhiên, gần gũi với ngôn ngữ đời thường nhưng được chọn lọc, trau chuốt.',
    example: 'Truyện ngắn "Chiếc lược ngà" của Nguyễn Quang Sáng là văn xuôi hiện thực, kể về số phận người phụ nữ nghèo sau chiến tranh.'
  },

  'truyện ngắn': {
    term: 'Truyện ngắn',
    definition: 'Thể loại văn xuôi tự sự có dung lượng nhỏ, tập trung vào một sự kiện, một nhân vật hoặc một khoảnh khắc trong đời sống.',
    literaryContext: 'Thường có cấu trúc gọn, cốt truyện đơn giản, ít nhân vật, tập trung khai thác chiều sâu tâm lý hoặc một khía cạnh của cuộc sống.',
    example: '"Chiếc lược ngà" của Nguyễn Quang Sáng chỉ xoay quanh sự kiện người phụ nữ bán chiếc lược ngà nhưng thể hiện sâu sắc tình mẫu tử và số phận con người.'
  },

  'tiểu thuyết': {
    term: 'Tiểu thuyết',
    definition: 'Thể loại văn xuôi tự sự có dung lượng lớn, cốt truyện phức tạp, nhiều nhân vật, phản ánh bức tranh xã hội rộng lớn.',
    literaryContext: 'Cho phép phát triển nhiều tuyến nhân vật, nhiều sự kiện đan xen, khám phá sâu sắc tâm lý nhân vật và bản chất xã hội.',
    example: 'Tiểu thuyết "Số đỏ" của Vũ Trọng Phụng miêu tả xã hội Hà Nội đầu thế kỷ 20 qua số phận nhiều nhân vật, nhiều tầng lớp xã hội.'
  },

  'tùy bút': {
    term: 'Tùy bút',
    definition: 'Thể loại văn xuôi tự do về đề tài, cấu trúc, phong cách. Tác giả viết theo cảm hứng, suy nghĩ của mình về đời sống, con người, thiên nhiên...',
    literaryContext: 'Mang tính chất trò chuyện, tâm sự, chia sẻ suy tư cá nhân. Ngôn ngữ gần gũi, tự nhiên, có dấu ấn riêng của tác giả.',
    example: 'Các bài tùy bút của Nguyễn Tuân như "Vang bóng một thời" thể hiện tài năng miêu tả sinh động và phong cách độc đáo của ông.'
  },

  'văn nghị luận': {
    term: 'Văn nghị luận',
    definition: 'Thể loại văn bản phân tích, đánh giá, chứng minh một vấn đề, bảo vệ một quan điểm bằng lý lẽ và dẫn chứng.',
    literaryContext: 'Cần có luận điểm rõ ràng, lập luận chặt chẽ, dẫn chứng thuyết phục. Thường dùng trong bài phê bình văn học, tiểu luận.',
    example: 'Bài "Bàn luận về phép học" của Lê Quý Đôn nghị luận về vấn đề giáo dục, phê phán tệ nạn học hành hời hợt, không thực chất.'
  },

  // === CẤU TRÚC TÁC PHẨM ===
  'cốt truyện': {
    term: 'Cốt truyện',
    definition: 'Dòng sự việc, sự kiện chính diễn ra trong tác phẩm tự sự, được sắp xếp theo một trình tự nhất định.',
    literaryContext: 'Cốt truyện bao gồm các giai đoạn: mở đầu, phát triển, cao trào, hồi kết. Giúp tạo nên tính hấp dẫn, logic của tác phẩm.',
    example: 'Cốt truyện "Chiếc lược ngà": người phụ nữ nghèo cần tiền chữa bệnh cho con → bán chiếc lược ngà của mẹ để → tìm lại lược để giữ kỷ niệm.'
  },

  'nhân vật': {
    term: 'Nhân vật',
    definition: 'Những con người được nhà văn sáng tạo ra trong tác phẩm văn học, mang những tính cách, số phận nhất định.',
    literaryContext: 'Nhân vật có thể là nhân vật chính (trung tâm của tác phẩm) hoặc nhân vật phụ (hỗ trợ làm rõ nhân vật chính). Nhân vật điển hình là hình tượng nghệ thuật khái quát được bản chất của một tầng lớp, một thời đại.',
    example: 'Nhân vật người mẹ trong "Chiếc lược ngà" là hình tượng người phụ nữ Việt Nam kiên cường, hy sinh vì con cái.'
  },

  'tình tiết': {
    term: 'Tình tiết',
    definition: 'Từng đoạn, từng bước trong sự phát triển của cốt truyện, thể hiện sự thay đổi trong hoàn cảnh hoặc mối quan hệ giữa các nhân vật.',
    literaryContext: 'Các tình tiết liên kết với nhau tạo thành cốt truyện hoàn chỉnh. Tình tiết quan trọng thường ảnh hưởng đến số phận nhân vật.',
    example: 'Tình tiết người mẹ quyết định bán lược ngà là bước ngoặt quan trọng trong "Chiếc lược ngà", thể hiện tình mẫu tử cao cả.'
  },

  'cao trào': {
    term: 'Cao trào',
    definition: 'Giai đoạn gay cấn, quyết định nhất trong cốt truyện, nơi mâu thuẫn, xung đột phát triển đến đỉnh điểm.',
    literaryContext: 'Cao trào là phần hấp dẫn nhất, thu hút sự chú ý của người đọc, dẫn đến kết cục của tác phẩm.',
    example: 'Cao trào trong "Chí Phèo" là khi Chí Phèo giết Bá Kiến - hành động quyết liệt chống lại số phận và xã hội.'
  },

  // === THƠ CA ===
  'vần điệu': {
    term: 'Vần điệu',
    definition: 'Sự lặp lại có quy luật của âm thanh ở cuối các câu thơ, tạo nên nhịp điệu, âm hưởng du dương.',
    literaryContext: 'Vần điệu là một trong những đặc trưng của thơ, tạo tính chất âm nhạc, dễ nhớ, dễ cảm nhận.',
    example: 'Thơ lục bát có vần điệu xen kẽ: câu 6 chữ vần với câu 8 chữ, tạo nhịp điệu đặc trưng của thơ ca dao Việt Nam.'
  },

  'nhịp điệu': {
    term: 'Nhịp điệu',
    definition: 'Sự lặp lại có quy luật về số lượng tiếng, trọng âm trong câu thơ, tạo nên tiết tấu khi đọc.',
    literaryContext: 'Nhịp điệu kết hợp với vần điệu tạo nên âm nhạc của thơ, làm tăng tính biểu cảm và dễ thuộc.',
    example: 'Thơ thất ngôn tứ tuyệt có nhịp 4-3 ở mỗi câu 7 chữ, tạo nhịp điệu đều đặn, ổn định.'
  },

  'hình ảnh thơ': {
    term: 'Hình ảnh thơ',
    definition: 'Hình ảnh nghệ thuật trong thơ được tạo ra bằng ngôn từ, mang tính gợi cảm, biểu tượng cao, thể hiện tư tưởng, tình cảm của tác giả.',
    literaryContext: 'Hình ảnh thơ khác với hình ảnh đời thường ở chỗ nó được tái tạo qua cảm xúc, trí tưởng tượng của tác giả và mang tính biểu tượng.',
    example: 'Hình ảnh "trăng in mặt nước bàu" trong "Đây thôn Vỹ Dạ" vừa chân thực vừa mơ màng, tượng trưng cho vẻ đẹp tâm hồn nhà thơ.'
  },

  'lục bát': {
    term: 'Lục bát',
    definition: 'Thể thơ truyền thống Việt Nam, mỗi câu đối (cặp) gồm một câu 6 chữ và một câu 8 chữ, vần theo quy luật nhất định.',
    literaryContext: 'Lục bát là thể thơ linh hoạt nhất của Việt Nam, phù hợp với nhiều đề tài, từ trữ tình đến tự sự. Được dùng phổ biến trong ca dao, truyện thơ.',
    example: 'Truyện "Truyện Kiều" của Nguyễn Du viết bằng thể thơ lục bát, kể chuyện Thúy Kiều với 3254 câu.'
  },

  'song thất lục bát': {
    term: 'Song thất lục bát',
    definition: 'Thể thơ kết hợp giữa hai câu thất ngôn (7 chữ) và lục bát, tạo nhịp điệu đa dạng và phong phú.',
    literaryContext: 'Thường dùng trong thơ ca dao, dân ca, tạo sự chuyển đổi nhịp điệu linh hoạt, sinh động.',
    example: 'Nhiều bài ca dao Việt Nam sử dụng thể song thất lục bát để tạo sự đa dạng trong âm điệu.'
  },

  // === BIỆN PHÁP TU TỪ BỔ SUNG ===
  'điệp từ': {
    term: 'Điệp từ / Điệp ngữ',
    definition: 'Biện pháp tu từ lặp lại một từ, một cụm từ hoặc một câu để nhấn mạnh ý nghĩa, tạo nhịp điệu.',
    literaryContext: 'Giúp tăng cường sức mạnh biểu cảm, làm nổi bật chủ đề, tư tưởng chính của tác phẩm.',
    example: 'Trong "Đất nước" của Nguyễn Khoa Điềm, cụm "đất nước" được lặp lại nhiều lần, tạo nhấn mạnh về chủ đề yêu nước.'
  },

  'đối lập': {
    term: 'Đối lập',
    definition: 'Biện pháp tu từ đặt cạnh nhau những sự vật, hiện tượng, khái niệm trái ngược nhau để làm nổi bật đặc điểm của mỗi bên.',
    literaryContext: 'Tạo sự tương phản mạnh mẽ, giúp làm rõ bản chất sự vật, tăng tính nghệ thuật cho tác phẩm.',
    example: 'Trong "Tây Tiến" của Quang Dũng: vẻ đẹp thiên nhiên đối lập với nỗi buồn chiến tranh, tạo nên vẻ đẹp bi tráng.'
  },

  'hoán dụ': {
    term: 'Hoán dụ',
    definition: 'Biện pháp tu từ dùng tên một sự vật để chỉ một sự vật khác có quan hệ mật thiết với nó (nguyên nhân - kết quả, bộ phận - toàn thể, vật chứa - vật được chứa...).',
    literaryContext: 'Giúp lời văn súc tích, gợi cảm và tăng tính hình ảnh.',
    example: 'Nói "đọc Nguyễn Du" thay vì "đọc tác phẩm của Nguyễn Du" - dùng tên tác giả thay cho tác phẩm.'
  },

  'ủy ngôn': {
    term: 'Ủy ngôn / Nói giảm nói tránh',
    definition: 'Biện pháp tu từ dùng cách nói gián tiếp, nhẹ nhàng hơn để nói về điều không hay, không muốn nói trực tiếp.',
    literaryContext: 'Thể hiện sự tế nhị, tôn trọng hoặc tránh gây khó chịu khi đề cập đến vấn đề nhạy cảm.',
    example: 'Nói "đi đời" thay vì "chết", "mất" thay vì "chết" - cách nói nhẹ nhàng, tế nhị hơn.'
  },

  'nhấn mạnh': {
    term: 'Nhấn mạnh',
    definition: 'Biện pháp tu từ làm nổi bật một ý, một chi tiết quan trọng bằng cách lặp lại, đặt vị trí đặc biệt hoặc dùng từ ngữ mạnh.',
    literaryContext: 'Giúp người đọc chú ý đến điểm quan trọng, tăng sức thuyết phục hoặc biểu cảm.',
    example: 'Dùng câu cảm thán "Đất nước tươi đẹp làm sao!" để nhấn mạnh vẻ đẹp đất nước.'
  },

  // === KHÁI NIỆM VĂN HỌC ===
  'chủ đề': {
    term: 'Chủ đề',
    definition: 'Vấn đề chính, cốt lõi mà tác phẩm văn học hướng đến, là ý nghĩa trung tâm xuyên suốt tác phẩm.',
    literaryContext: 'Chủ đề thể hiện quan điểm, thái độ của tác giả về đời sống, con người, xã hội. Một tác phẩm có thể có nhiều đề tài nhưng chỉ một chủ đề chính.',
    example: 'Chủ đề của "Chiếc lược ngà" là tình mẫu tử cao cả và số phận người phụ nữ Việt Nam sau chiến tranh.'
  },

  'đề tài': {
    term: 'Đề tài',
    definition: 'Phạm vi đời sống, lĩnh vực hiện thực mà tác phẩm văn học phản ánh.',
    literaryContext: 'Đề tài có thể là chiến tranh, tình yêu, lao động, quê hương... Một tác phẩm có thể có nhiều đề tài.',
    example: 'Truyện "Chiếc lược ngà" có đề tài về cuộc sống sau chiến tranh, về tình mẫu tử, về số phận phụ nữ.'
  },

  'ý nghĩa': {
    term: 'Ý nghĩa tác phẩm',
    definition: 'Giá trị tư tưởng, nghệ thuật, nhân văn mà tác phẩm mang lại cho người đọc.',
    literaryContext: 'Ý nghĩa có thể là bài học đạo đức, nhận thức về cuộc sống, giá trị thẩm mỹ... được rút ra từ tác phẩm.',
    example: '"Chiếc lược ngà" có ý nghĩa ca ngợi tình mẫu tử, đồng thời gợi suy ngẫm về số phận người phụ nữ nghèo khổ.'
  },

  'phong cách': {
    term: 'Phong cách nghệ thuật',
    definition: 'Nét độc đáo, đặc trưng trong cách thức sáng tạo nghệ thuật của một tác giả hoặc một trường phái.',
    literaryContext: 'Phong cách thể hiện qua ngôn ngữ, kỹ thuật, cách nhìn đời... tạo dấu ấn riêng cho tác giả.',
    example: 'Phong cách Nguyễn Du: uyên bác, hàm súc, giàu triết lý nhân sinh. Phong cách Nguyễn Tuân: giàu hình ảnh, màu sắc, âm thanh.'
  },

  // === NGÔN NGỮ VĂN HỌC ===
  'từ ngữ': {
    term: 'Từ ngữ văn học',
    definition: 'Vốn từ được lựa chọn, sử dụng trong tác phẩm văn học để tạo hiệu quả nghệ thuật.',
    literaryContext: 'Từ ngữ văn học khác từ ngữ đời thường ở chỗ được chọn lọc kỹ càng, mang tính biểu cảm, gợi hình gợi cảm cao.',
    example: 'Trong thơ Xuân Diệu, từ ngữ phong phú, giàu màu sắc: "mây tím khói hồng", "dương liễu mơn mởn".'
  },

  'câu văn': {
    term: 'Câu văn',
    definition: 'Đơn vị cơ bản của văn bản, thể hiện một ý nghĩa tương đối hoàn chỉnh.',
    literaryContext: 'Câu văn trong văn học được xây dựng công phu về cấu trúc, nhịp điệu, âm điệu để tạo hiệu quả nghệ thuật.',
    example: 'Câu văn ngắn gọn tạo nhịp nhanh; câu dài tạo sự trầm tư. "Chiếc lược ngà" dùng nhiều câu ngắn tạo cảm giác gấp gáp, bức bối.'
  },

  // === ĐẶC TRƯNG DÂN TỘC ===
  'tâm hồn dân tộc': {
    term: 'Tâm hồn dân tộc',
    definition: 'Những nét đặc trưng về tính cách, tư tưởng, tình cảm của một dân tộc, được thể hiện trong văn học.',
    literaryContext: 'Văn học Việt Nam thể hiện tâm hồn dân tộc qua tình yêu quê hương, tinh thần đoàn kết, ý chí kiên cường...',
    example: 'Thơ "Đất nước" của Nguyễn Khoa Điềm thể hiện tâm hồn dân tộc: yêu nước, tự hào dân tộc, biết ơn công lao tiền nhân.'
  },

  'bản sắc văn hóa': {
    term: 'Bản sắc văn hóa',
    definition: 'Những nét đặc trưng, riêng có của một nền văn hóa, phân biệt với các nền văn hóa khác.',
    literaryContext: 'Văn học là phương tiện gìn giữ và phát huy bản sắc văn hóa dân tộc qua ngôn ngữ, hình tượng, giá trị truyền thống.',
    example: 'Truyện Kiều mang đậm bản sắc văn hóa Việt Nam: đạo lý "tài hoa gặp vận may", quan niệm nhân quả, chữ hiếu.'
  },

  // === TRƯỜNG PHÁI - TRÀO LƯU ===
  'thực dân': {
    term: 'Văn học thực dân',
    definition: 'Văn học ra đời trong thời kỳ Pháp thuộc, phục vụ cho mục đích thống trị của thực dân Pháp.',
    literaryContext: 'Thường ca ngợi nền văn minh phương Tây, hạ thấp văn hóa bản địa, tuyên truyền tư tưởng nô dịch.',
    example: 'Một số tác phẩm thời kỳ này được viết bằng tiếng Pháp hoặc ca ngợi chế độ thực dân.'
  },

  'duy tân': {
    term: 'Phong trào duy tân',
    definition: 'Phong trào cải cách văn hóa, giáo dục đầu thế kỷ 20, chủ trương học tập văn minh phương Tây để cải tạo xã hội.',
    literaryContext: 'Văn học duy tân hướng tới khai sáng dân trí, cải cách xã hội, đề cao khoa học và dân chủ.',
    example: 'Các nhà văn như Nguyễn Văn Vĩnh, Phạm Quỳnh... với việc dịch thuật, biên soạn sách báo phổ biến tri thức mới.'
  },

  'cách mạng': {
    term: 'Văn học cách mạng',
    definition: 'Văn học gắn liền với cách mạng giải phóng dân tộc và cách mạng xã hội chủ nghĩa, phục vụ sự nghiệp cách mạng.',
    literaryContext: 'Thể hiện tinh thần yêu nước, cách mạng; ca ngợi anh hùng, lao động; phê phán thực dân, phong kiến.',
    example: 'Thơ "Việt Bắc" của Tố Hữu ca ngợi vùng căn cứ địa cách mạng và tình đoàn kết dân - quân.'
  },

  // === GIẢI THÍCH THÊM ===
  'ngôn ngữ hình ảnh': {
    term: 'Ngôn ngữ hình ảnh',
    definition: 'Cách sử dụng từ ngữ để tạo ra những hình ảnh cụ thể, sinh động trong trí tưởng tượng của người đọc.',
    literaryContext: 'Đặc trưng của văn học nghệ thuật, giúp tác phẩm có sức gợi cảm, dễ cảm nhận và ghi nhớ.',
    example: 'Nguyễn Tuân với "gà trống đỏ gay" tạo hình ảnh sinh động về con gà, không chỉ miêu tả mà còn truyền cảm xúc.'
  },

  'biểu cảm': {
    term: 'Biểu cảm',
    definition: 'Khả năng bộc lộ, truyền đạt cảm xúc, tình cảm qua ngôn từ, hình ảnh trong văn học.',
    literaryContext: 'Tác phẩm có sức biểu cảm cao khi làm người đọc cảm nhận được cảm xúc của tác giả hoặc nhân vật.',
    example: 'Thơ "Đây thôn Vỹ Dạ" của Hàn Mặc Tử có sức biểu cảm mạnh với hình ảnh trăng, nước, cảm giác mơ màng, buồn man mác.'
  },

  'gợi cảm': {
    term: 'Gợi cảm',
    definition: 'Khả năng gợi lên cảm xúc, liên tưởng, tưởng tượng trong lòng người đọc.',
    literaryContext: 'Ngôn ngữ văn học có sức gợi cảm cao khi dùng ít lời nhưng khơi gợi nhiều hình ảnh, cảm xúc.',
    example: 'Hình ảnh "cây cầu tre lắt léo" vừa chân thực vừa gợi nên nỗi nhớ quê hương, tuổi thơ.'
  },

  'miêu tả': {
    term: 'Miêu tả',
    definition: 'Phương thức biểu đạt dùng lời văn để tái hiện hình ảnh cụ thể về sự vật, con người, thiên nhiên...',
    literaryContext: 'Miêu tả trong văn học không chỉ tái hiện mà còn mang cảm xúc, thái độ của tác giả, tạo hiệu quả nghệ thuật.',
    example: 'Nguyễn Tuân miêu tả con vẹt: "lông đỏ loé, mỏ cong..." - vừa chính xác vừa giàu cảm xúc.'
  },

  'kể chuyện': {
    term: 'Kể chuyện / Tự sự',
    definition: 'Phương thức biểu đạt dùng lời văn để thuật lại sự việc, sự kiện diễn ra theo thời gian.',
    literaryContext: 'Là phương thức chủ yếu trong truyện ngắn, tiểu thuyết. Kể chuyện có thể theo trình tự thời gian hoặc đảo ngược.',
    example: '"Chiếc lược ngà" kể theo thứ tự: gặp người phụ nữ → nghe câu chuyện → cảm động → tìm lại lược.'
  },

  'biểu cảm tâm trạng': {
    term: 'Biểu cảm tâm trạng',
    definition: 'Phương thức biểu đạt thể hiện tình cảm, suy nghĩ, tâm trạng của tác giả hoặc nhân vật.',
    literaryContext: 'Phương thức chủ yếu trong thơ trữ tình, đoạn độc thoại nội tâm trong truyện.',
    example: 'Thơ "Mùa xuân nho nhỏ" của Thanh Hải: "Mùa xuân nho nhỏ / Của một đứa trẻ nghèo" - biểu cảm niềm vui giản dị của trẻ em.'
  },

  // === THUẬT NGỮ ĐÁNH GIÁ ===
  'giá trị nhân văn': {
    term: 'Giá trị nhân văn',
    definition: 'Những giá trị tốt đẹp về con người: nhân ái, bác ái, trân trọng con người, tôn trọng phẩm giá con người.',
    literaryContext: 'Tác phẩm có giá trị nhân văn khi thể hiện sự quan tâm đến số phận, khổ đau, ước mơ của con người.',
    example: '"Chiếc lược ngà" có giá trị nhân văn cao khi thể hiện tình thương con người, đồng cảm với người nghèo khổ.'
  },

  'giá trị thẩm mỹ': {
    term: 'Giá trị thẩm mỹ',
    definition: 'Vẻ đẹp nghệ thuật của tác phẩm văn học, thể hiện qua ngôn ngữ, hình ảnh, kỹ thuật nghệ thuật.',
    literaryContext: 'Giá trị thẩm mỹ làm nên sức hấp dẫn, sức sống lâu dài của tác phẩm văn học.',
    example: '"Đây thôn Vỹ Dạ" có giá trị thẩm mỹ cao với ngôn ngữ thơ giàu hình ảnh, âm thanh du dương, tạo không gian mơ màng.'
  }
};

/**
 * Remove Vietnamese diacritics for fuzzy matching
 */
export function removeDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Normalize term for case-insensitive lookup
 */
export function normalizeTerm(term: string): string {
  return term.toLowerCase().trim();
}

/**
 * Normalize term without diacritics for fuzzy search
 */
export function normalizeTermFuzzy(term: string): string {
  return removeDiacritics(term.toLowerCase().trim());
}

/**
 * Get dictionary entry from static dictionary with exact match
 */
export function getStaticEntry(term: string): DictionaryEntry | null {
  const normalized = normalizeTerm(term);
  return STATIC_DICTIONARY[normalized] || null;
}

/**
 * Get dictionary entry with fuzzy matching (no diacritics required)
 */
export function getStaticEntryFuzzy(term: string): DictionaryEntry | null {
  const fuzzyInput = normalizeTermFuzzy(term);

  // First try exact match
  const exactMatch = getStaticEntry(term);
  if (exactMatch) return exactMatch;

  // Then try fuzzy matching (without diacritics)
  for (const [key, value] of Object.entries(STATIC_DICTIONARY)) {
    const fuzzyKey = normalizeTermFuzzy(key);
    if (fuzzyKey === fuzzyInput) {
      return value;
    }
  }

  // Try partial matching for better UX
  for (const [key, value] of Object.entries(STATIC_DICTIONARY)) {
    const fuzzyKey = normalizeTermFuzzy(key);
    if (fuzzyKey.includes(fuzzyInput) || fuzzyInput.includes(fuzzyKey)) {
      return value;
    }
  }

  return null;
}

/**
 * Get all terms that match the search query (for autocomplete)
 */
export function searchTerms(query: string, limit: number = 10): string[] {
  if (!query || query.trim().length === 0) return [];

  const fuzzyQuery = normalizeTermFuzzy(query);
  const results: string[] = [];

  // Find matching terms
  for (const [key, value] of Object.entries(STATIC_DICTIONARY)) {
    const fuzzyKey = normalizeTermFuzzy(key);

    // Exact match or contains
    if (fuzzyKey.includes(fuzzyQuery) || fuzzyQuery.includes(fuzzyKey)) {
      results.push(value.term);
    }

    if (results.length >= limit) break;
  }

  return results;
}
