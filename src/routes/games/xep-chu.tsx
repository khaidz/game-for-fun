import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/games/xep-chu")({
  component: XepChu,
});

// Danh sách từ cho 10 level
// Hàm capitalize chữ cái đầu của mỗi từ
const capitalizeWords = (str: string): string => {
  return str
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const wordsByLevelRaw: Record<number, string[]> = {
  1: [
    "con mèo", "con chó", "con gà", "con cá", "con trâu", "con bò", "con vịt", "con chim", "con chuột", "con dê",
    "cái bàn", "cái ghế", "cái nồi", "cái bát", "cái chén", "cái cốc", "cái muỗng", "cái kéo", "cái thước", "cái đèn",
    "ngôi nhà", "khu vườn", "bờ sông", "ngọn núi", "dòng suối", "bầu trời", "mặt trời", "mặt trăng", "đám mây", "cánh đồng",
    "bông hoa", "trái cây", "bát cơm", "ly nước", "nồi canh", "bức tranh", "quyển sách", "tờ báo", "cây bút", "chiếc áo",
    "đôi dép", "đôi giày", "chiếc mũ", "bức tranh", "chiếc gối", "cái quạt", "tivi", "điện thoại", "máy tính", "xe đạp"
  ],
  2: [
    "ngôi trường", "phòng học", "bảng đen", "cây phấn", "quyển vở", "bút chì", "bút mực", "bàn giáo viên", "sân trường", "giờ học",
    "ngôi chợ", "quầy hàng", "sạp rau", "cửa hàng", "nhà bếp", "bữa cơm", "bát phở", "đĩa cơm", "nồi cơm", "ly cà phê",
    "con đường", "cây cầu", "hàng cây", "ngôi đình", "lũy tre", "giếng nước", "cánh diều", "ánh đèn", "bóng đèn", "âm thanh",
    "mùa xuân", "mùa hè", "mùa thu", "mùa đông", "ngày lễ", "buổi sáng", "buổi tối", "bữa sáng", "bữa tối", "bữa trưa",
    "đôi mắt", "bàn tay", "khuôn mặt", "nụ cười", "tiếng cười", "ngôi làng", "con phố", "góc phố", "khu chợ", "nhà sàn"
  ],
  3: [
    "thành phố", "nhà cao", "xe buýt", "ga tàu", "trạm xe", "siêu thị", "quán cà phê", "nhà hàng", "công viên", "bãi biển",
    "khu phố", "chung cư", "tòa nhà", "khu nghỉ", "khách sạn", "hướng dẫn", "sân bay", "phòng chờ", "bến xe", "đèn đường",
    "điện thoại", "máy ảnh", "máy tính", "nghênh ngang", "mạng xã hội", "ứng dụng", "tin nhắn", "email", "phần mềm", "trò chơi",
    "video trực tuyến", "màn hình", "âm nhạc", "thẻ ngân hàng", "máy rút", "hóa đơn", "tài khoản", "mật khẩu", "giao dịch", "mã QR",
    "cửa hàng", "sản phẩm", "đơn hàng", "vận chuyển", "giao hàng", "kho hàng", "nhân viên", "khách hàng", "dịch vụ", "chính sách"
  ],
  4: [
    "buổi họp", "kế hoạch", "lịch trình", "báo cáo", "dự án", "phòng họp", "văn phòng", "máy in", "máy fax", "giấy tờ",
    "quản lý", "nhân sự", "cấp trên", "đồng nghiệp", "thư ký", "công ty", "chi nhánh", "trụ sở", "hợp đồng", "chữ ký",
    "sản phẩm", "nhãn hiệu", "quảng cáo", "doanh thu", "lợi nhuận", "chi phí", "giá vốn", "thị trường", "người tiêu dùng", "bảng giá",
    "cuộc họp", "bản tin", "thông báo", "biên bản", "tài liệu", "phòng ban", "bộ phận", "kế toán", "pháp nhân", "ngân quỹ",
    "máy in", "máy photo", "bàn làm việc", "máy lạnh", "hồ sơ", "bìa hồ sơ", "giấy phép", "con dấu", "hóa đơn", "phiếu thu"
  ],
  5: [
    "trường đại học", "giảng viên", "sinh viên", "thư viện", "phòng thí nghiệm", "giáo trình", "môn học", "bài giảng", "kỳ thi", "bằng cấp",
    "nghiên cứu", "đề tài", "kết quả", "số liệu", "thống kê", "dữ liệu", "bảng biểu", "biểu đồ", "mẫu vật", "học bổng",
    "giáo dục", "đào tạo", "chương trình", "bài tập", "trường lớp", "học kỳ", "giáo án", "thi cử", "bảng điểm", "học sinh",
    "bệnh viện", "bác sĩ", "y tá", "bệnh nhân", "phòng khám", "thuốc men", "giường bệnh", "sức khỏe", "dịch bệnh", "vắc xin",
    "chăm sóc", "khẩu trang", "nhiệt kế", "máy đo", "máu huyết", "tim mạch", "hô hấp", "não bộ", "xương khớp", "hệ thần kinh"
  ],
  6: [
    "du khách", "hướng dẫn viên", "địa điểm", "bản đồ", "vé máy bay", "sân bay", "khu du lịch", "phòng khách", "khách sạn", "nhà nghỉ",
    "bữa sáng", "nhà hàng", "thực đơn", "đồ uống", "đặc sản", "hóa đơn", "tiền mặt", "thẻ tín dụng", "máy tính bảng", "máy ảnh số",
    "thời tiết", "nhiệt độ", "bầu không khí", "gió mùa", "biển xanh", "núi rừng", "sông suối", "đảo nhỏ", "vùng biển", "khu sinh thái",
    "văn hóa", "truyền thống", "phong tục", "tập quán", "lễ hội", "trang phục", "ẩm thực", "nghệ thuật", "di sản", "danh lam",
    "bảo tàng", "nhà hát", "sân khấu", "bức tượng", "bức tranh", "kiến trúc", "công trình", "cổng thành", "điện thờ", "ngôi đền"
  ],
  7: [
    "nền kinh tế", "thị trường", "ngân hàng", "tài chính", "đầu tư", "doanh nghiệp", "cổ phiếu", "lợi nhuận", "vốn điều lệ", "thuế suất",
    "bộ luật", "hệ thống", "chính sách", "cơ quan", "người dân", "chính phủ", "quốc hội", "hội đồng", "ủy ban", "văn bản",
    "báo cáo", "thống kê", "kết quả", "chỉ số", "tăng trưởng", "sản lượng", "doanh thu", "ngân sách", "chi tiêu", "xuất khẩu",
    "truyền thông", "báo chí", "phóng viên", "tin tức", "trang mạng", "phản hồi", "thông tin", "quảng bá", "diễn đàn", "bài viết",
    "môi trường", "khí hậu", "rừng cây", "nguồn nước", "chất thải", "năng lượng", "tái chế", "ô nhiễm", "bảo tồn", "thiên nhiên"
  ],
  8: [
    "công nghiệp", "nông nghiệp", "lâm nghiệp", "thủy sản", "chăn nuôi", "trồng trọt", "nhà máy", "xí nghiệp", "dây chuyền", "khu công nghiệp",
    "công nhân", "kỹ sư", "quản đốc", "máy móc", "thiết bị", "công nghệ", "robot tự động", "sản phẩm", "nguyên liệu", "vật liệu",
    "thương mại", "xuất khẩu", "nhập khẩu", "vận tải", "giao nhận", "hóa đơn", "đơn hàng", "hợp đồng", "kho bãi", "giao dịch",
    "tài chính", "ngân hàng", "chứng khoán", "cổ phần", "trái phiếu", "quỹ đầu tư", "tín dụng", "bảo hiểm", "doanh thu", "lợi nhuận",
    "kế toán", "kiểm toán", "ngân sách", "chi phí", "giá trị", "thị phần", "tăng trưởng", "đổi mới", "hiệu quả", "chiến lược"
  ],
  9: [
    "công trình", "kiến trúc", "xây dựng", "thiết kế", "vật liệu", "bản vẽ", "kỹ sư", "giám sát", "nhà thầu", "công trường",
    "giao thông", "đường bộ", "đường sắt", "đường thủy", "đường hàng không", "xe container", "cầu vượt", "hầm đường", "biển báo", "tín hiệu",
    "năng lượng", "điện gió", "điện mặt trời", "nhiên liệu", "trạm điện", "máy phát", "điện áp", "công suất", "lưới điện", "pin lưu trữ",
    "viễn thông", "trạm phát", "vệ tinh", "tín hiệu", "mạng cáp", "thiết bị", "điện thoại", "máy chủ", "máy tính", "dữ liệu",
    "an ninh", "phòng cháy", "cứu hộ", "bảo vệ", "kiểm tra", "giấy phép", "quy chuẩn", "an toàn", "giám định", "chứng nhận"
  ],
  10: [
    "ngôi nhà nhỏ", "bữa ăn sáng", "chuyến xe bus", "bữa tiệc nhỏ", "bộ bàn ghế",
    "phòng khách lớn", "chiếc xe máy", "người bạn thân", "tấm ảnh cũ", "bức tường trắng",
    "cửa sổ kính", "khu vườn nhỏ", "bãi biển đẹp", "ly cà phê", "tủ quần áo",
    "đèn bàn học", "sân chơi trẻ", "giỏ hoa tươi", "chậu cây cảnh", "món ăn ngon",
    "bộ quần áo", "tòa nhà cao", "bữa cơm tối", "ngôi trường làng", "bến xe buýt",
    "công viên xanh", "bộ phim hay", "cuốn sách mới", "gian bếp nhỏ", "bức tranh treo",
    "tủ lạnh lớn", "chiếc giày mới", "sân thượng rộng", "điện thoại cũ", "chiếc cặp sách",
    "tấm gương soi", "đĩa trái cây", "món quà nhỏ", "chiếc balo đen", "bộ ấm chén",
    "phòng ngủ nhỏ", "ly nước cam", "chiếc nồi cơm", "bộ đồ ăn", "kệ sách gỗ",
    "cây đàn piano", "chậu hoa lan", "đèn trần sáng", "chiếc ghế gỗ", "người hàng xóm"
  ]
};


// Áp dụng capitalize cho tất cả các từ
const wordsByLevel: Record<number, string[]> = Object.fromEntries(
  Object.entries(wordsByLevelRaw).map(([level, words]) => [
    level,
    words.map(capitalizeWords),
  ])
) as Record<number, string[]>;

function XepChu() {
  useEffect(() => {
    document.title = "Xếp chữ | Trò chơi giải trí | KhaiBQ.net";
  }, []);

  const [currentWord, setCurrentWord] = useState("");
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [level, setLevel] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [levelResults, setLevelResults] = useState<Record<number, 'correct' | 'incorrect' | null>>({});
  const timerRef = useRef<number | null>(null);
  
  // Audio URLs
  const audioUrlCorrect = useMemo(
    () => new URL("../../assets/music/xepchu-dung.mp3", import.meta.url).href,
    []
  );
  const audioUrlIncorrect = useMemo(
    () => new URL("../../assets/music/xepchu-sai.mp3", import.meta.url).href,
    []
  );
  const audioUrlCountdown = useMemo(
    () => new URL("../../assets/music/demnguoc.mp3", import.meta.url).href,
    []
  );
  const audioUrl5sRemaining = useMemo(
    () => new URL("../../assets/music/5s-remaining.mp3", import.meta.url).href,
    []
  );
  const audioUrlMagic = useMemo(
    () => new URL("../../assets/music/magic.mp3", import.meta.url).href,
    []
  );
  
  // Audio refs
  const audioCorrectRef = useRef<HTMLAudioElement | null>(null);
  const audioIncorrectRef = useRef<HTMLAudioElement | null>(null);
  const audioCountdownRef = useRef<HTMLAudioElement | null>(null);
  const audio5sRemainingRef = useRef<HTMLAudioElement | null>(null);
  const audioMagicRef = useRef<HTMLAudioElement | null>(null);

  // Lấy thời gian theo level
  const getTimeByLevel = (currentLevel: number): number => {
    if (currentLevel === 0) return 0;
    if (currentLevel >= 1 && currentLevel <= 3) return 15;
    if (currentLevel >= 4 && currentLevel <= 6) return 20;
    if (currentLevel >= 7 && currentLevel <= 10) return 30;
    return 15;
  };

  // Lấy từ ngẫu nhiên dựa trên level
  const getRandomWord = (currentLevel: number) => {
    if (currentLevel === 0) return "";
    const wordList = wordsByLevel[currentLevel] || wordsByLevel[1];
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  };

  // Bỏ dấu tiếng Việt
  const removeVietnameseDiacritics = (str: string): string => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // Randomize uppercase/lowercase
  const randomizeCase = (str: string): string => {
    return str
      .split("")
      .map((char) => {
        if (char === " ") return char;
        return Math.random() < 0.5 ? char.toUpperCase() : char.toLowerCase();
      })
      .join("");
  };

  // Xáo trộn chữ cái
  const shuffleLetters = (word: string) => {
    const letters = word.split("").filter((char) => char !== " ");
    return letters.sort(() => Math.random() - 0.5);
  };

  // Dừng timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Dừng nhạc đếm ngược
    if (audioCountdownRef.current) {
      audioCountdownRef.current.pause();
      audioCountdownRef.current.currentTime = 0;
    }
    // Dừng nhạc 5s còn lại
    if (audio5sRemainingRef.current) {
      audio5sRemainingRef.current.pause();
      audio5sRemainingRef.current.currentTime = 0;
    }
  };

  // Bắt đầu timer
  const startTimer = (targetLevel: number) => {
    stopTimer();
    setIsTimeUp(false);
    
    // Nếu level đã hoàn thành, không đếm ngược
    if (completedLevels.has(targetLevel)) {
      setTimeLeft(0);
      return;
    }
    
    const time = getTimeByLevel(targetLevel);
    if (time > 0) {
      setTimeLeft(time);
      
      // Phát nhạc đếm ngược
      if (audioCountdownRef.current) {
        audioCountdownRef.current.currentTime = 0;
        audioCountdownRef.current.play().catch(() => {
          // Autoplay may be blocked
        });
      }
      
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Khi còn 4 giây, chuyển sang nhạc 5s-remaining
          if (prev === 5 && newTime === 4) {
            // Dừng nhạc đếm ngược
            if (audioCountdownRef.current) {
              audioCountdownRef.current.pause();
              audioCountdownRef.current.currentTime = 0;
            }
            // Phát nhạc 5s-remaining
            if (audio5sRemainingRef.current) {
              audio5sRemainingRef.current.currentTime = 0;
              audio5sRemainingRef.current.play().catch(() => {
                // Autoplay may be blocked
              });
            }
          }
          
          if (newTime <= 0) {
            stopTimer();
            // Hiển thị "Time up" khi hết thời gian
            setIsTimeUp(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      setTimeLeft(0);
      setIsTimeUp(false);
    }
  };

  // Khởi tạo từ mới
  const initializeWord = (newLevel?: number) => {
    const targetLevel = newLevel !== undefined ? newLevel : level;
    let word = getRandomWord(targetLevel);
    let displayWord = word;
    
    if (targetLevel === 3 || targetLevel === 4) {
      displayWord = word.toLowerCase();
    }
    // Màn 5,6: uppercase hết
    else if (targetLevel ===5 || targetLevel === 6) {
      displayWord = word.toUpperCase();
    }
    // Màn 7,8: bỏ dấu
    else if (targetLevel === 7 || targetLevel === 8) {
      displayWord = removeVietnameseDiacritics(word);
    }
    // Màn 9,10: bỏ dấu + randomize uppercase/lowercase
    else if (targetLevel === 9 || targetLevel === 10) {
      displayWord = randomizeCase(removeVietnameseDiacritics(word));
    }
    
    setCurrentWord(word); // Lưu từ gốc để hiển thị đáp án
    setShuffledLetters(displayWord ? shuffleLetters(displayWord) : []);
    
    // Nếu level đã hoàn thành, hiển thị đáp án ngay
    if (completedLevels.has(targetLevel)) {
      setShowAnswer(true);
      setIsTimeUp(false);
    } else {
      setShowAnswer(false);
      setIsTimeUp(false);
    }
    
    // Bắt đầu timer nếu level > 0
    if (targetLevel > 0) {
      startTimer(targetLevel);
    } else {
      stopTimer();
      setTimeLeft(0);
    }
  };

  // Khởi tạo game lần đầu và audio
  useEffect(() => {
    initializeWord();
    
    // Khởi tạo và preload tất cả audio
    const loadAudios = async () => {
      // Load nhạc đúng
      audioCorrectRef.current = new Audio(audioUrlCorrect);
      audioCorrectRef.current.volume = 0.7;
      audioCorrectRef.current.preload = "auto";
      
      // Load nhạc sai
      audioIncorrectRef.current = new Audio(audioUrlIncorrect);
      audioIncorrectRef.current.volume = 0.5;
      audioIncorrectRef.current.preload = "auto";
      
      // Load nhạc đếm ngược
      audioCountdownRef.current = new Audio(audioUrlCountdown);
      audioCountdownRef.current.volume = 0.7;
      audioCountdownRef.current.preload = "auto";
      
      // Load nhạc 5s còn lại
      audio5sRemainingRef.current = new Audio(audioUrl5sRemaining);
      audio5sRemainingRef.current.volume = 0.7;
      audio5sRemainingRef.current.preload = "auto";
      
      // Load nhạc magic
      audioMagicRef.current = new Audio(audioUrlMagic);
      audioMagicRef.current.volume = 0.7;
      audioMagicRef.current.preload = "auto";
      
      // Force load tất cả audio để tránh delay khi phát
      const loadPromises = [
        new Promise<void>((resolve) => {
          if (audioCorrectRef.current) {
            audioCorrectRef.current.addEventListener('canplaythrough', () => resolve(), { once: true });
            audioCorrectRef.current.load();
          } else {
            resolve();
          }
        }),
        new Promise<void>((resolve) => {
          if (audioIncorrectRef.current) {
            audioIncorrectRef.current.addEventListener('canplaythrough', () => resolve(), { once: true });
            audioIncorrectRef.current.load();
          } else {
            resolve();
          }
        }),
        new Promise<void>((resolve) => {
          if (audioCountdownRef.current) {
            audioCountdownRef.current.addEventListener('canplaythrough', () => resolve(), { once: true });
            audioCountdownRef.current.load();
          } else {
            resolve();
          }
        }),
        new Promise<void>((resolve) => {
          if (audio5sRemainingRef.current) {
            audio5sRemainingRef.current.addEventListener('canplaythrough', () => resolve(), { once: true });
            audio5sRemainingRef.current.load();
          } else {
            resolve();
          }
        }),
        new Promise<void>((resolve) => {
          if (audioMagicRef.current) {
            audioMagicRef.current.addEventListener('canplaythrough', () => resolve(), { once: true });
            audioMagicRef.current.load();
          } else {
            resolve();
          }
        }),
      ];
      
      // Đợi tất cả audio load xong (với timeout để không block quá lâu)
      await Promise.race([
        Promise.all(loadPromises),
        new Promise(resolve => setTimeout(resolve, 5000)), // Timeout 5s
      ]);
    };
    
    loadAudios();
    
    // Cleanup timer và audio khi unmount
    return () => {
      stopTimer();
      if (audioCorrectRef.current) {
        audioCorrectRef.current.pause();
        audioCorrectRef.current = null;
      }
      if (audioIncorrectRef.current) {
        audioIncorrectRef.current.pause();
        audioIncorrectRef.current = null;
      }
      if (audioCountdownRef.current) {
        audioCountdownRef.current.pause();
        audioCountdownRef.current = null;
      }
      if (audio5sRemainingRef.current) {
        audio5sRemainingRef.current.pause();
        audio5sRemainingRef.current = null;
      }
      if (audioMagicRef.current) {
        audioMagicRef.current.pause();
        audioMagicRef.current = null;
      }
    };
  }, [audioUrlCorrect, audioUrlIncorrect, audioUrlCountdown, audioUrl5sRemaining, audioUrlMagic]);

  // Kiểm tra level có được unlock không
  const isLevelUnlocked = (lvl: number) => {
    if (lvl === 0 || lvl === 1) return true;
    return completedLevels.has(lvl - 1);
  };

  // Chuyển level
  const handleChangeLevel = (newLevel: number) => {
    // Không cho phép chuyển nếu đang chơi một level chưa hoàn thành
    if (level > 0 && !completedLevels.has(level) && level !== newLevel) {
      return;
    }
    
    // Chỉ cho phép chọn level đã unlock hoặc đã hoàn thành
    if (!isLevelUnlocked(newLevel) && !completedLevels.has(newLevel)) {
      return;
    }
    setLevel(newLevel);
    initializeWord(newLevel);
  };

  // Hiển thị đáp án
  const handleShowAnswer = () => {
    setShowAnswer(true);
    // Dừng timer và nhạc đếm ngược
    stopTimer();
    setIsTimeUp(false);
    
    // Phát nhạc magic
    if (audioMagicRef.current) {
      audioMagicRef.current.currentTime = 0;
      audioMagicRef.current.play().catch(() => {
        // Autoplay may be blocked
      });
    }
  };

  // Đánh dấu đáp án đúng/sai
  const markAnswer = (isCorrect: boolean) => {
    const result = isCorrect ? 'correct' : 'incorrect';
    setLevelResults(prev => ({
      ...prev,
      [level]: result
    }));
    setCompletedLevels(prev => new Set(prev).add(level));
    setShowAnswer(true);
    
    // Dừng timer và nhạc đếm ngược trước khi phát nhạc đúng/sai
    stopTimer();
    setIsTimeUp(false);
    setTimeLeft(0);
    
    // Phát nhạc báo (sau khi đã dừng nhạc đếm ngược)
    if (isCorrect && audioCorrectRef.current) {
      audioCorrectRef.current.currentTime = 0;
      audioCorrectRef.current.play().catch(() => {
        // Autoplay may be blocked
      });
    } else if (!isCorrect && audioIncorrectRef.current) {
      audioIncorrectRef.current.currentTime = 0;
      audioIncorrectRef.current.play().catch(() => {
        // Autoplay may be blocked
      });
    }
  };

  // Chuyển sang từ tiếp theo (chỉ khi đã hoàn thành level hiện tại)
  const handleNext = () => {
    if (!completedLevels.has(level)) {
      return;
    }
    
    const nextLevel = level < 10 ? level + 1 : 1;
    if (isLevelUnlocked(nextLevel)) {
      setLevel(nextLevel);
      initializeWord(nextLevel);
    }
  };

  // Reset toàn bộ và bắt đầu từ level 1
  const handleStart = () => {
    stopTimer();
    
    // Reset tất cả states
    setCompletedLevels(new Set());
    setLevelResults({});
    setCurrentWord("");
    setShuffledLetters([]);
    setIsTimeUp(false);
    setShowAnswer(false);
    setTimeLeft(0);
    setLevel(1);
    
    // Khởi tạo từ mới cho level 1 với completedLevels đã được reset
    const word = getRandomWord(1);
    setCurrentWord(word);
    setShuffledLetters(word ? shuffleLetters(word) : []);
    setShowAnswer(false);
    setIsTimeUp(false);
    
    // Bắt đầu timer cho level 1
    const time = getTimeByLevel(1);
    if (time > 0) {
      setTimeLeft(time);
      
      // Phát nhạc đếm ngược
      if (audioCountdownRef.current) {
        audioCountdownRef.current.currentTime = 0;
        audioCountdownRef.current.play().catch(() => {
          // Autoplay may be blocked
        });
      }
      
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Khi còn 4 giây, chuyển sang nhạc 5s-remaining
          if (prev === 5 && newTime === 4) {
            // Dừng nhạc đếm ngược
            if (audioCountdownRef.current) {
              audioCountdownRef.current.pause();
              audioCountdownRef.current.currentTime = 0;
            }
            // Phát nhạc 5s-remaining
            if (audio5sRemainingRef.current) {
              audio5sRemainingRef.current.currentTime = 0;
              audio5sRemainingRef.current.play().catch(() => {
                // Autoplay may be blocked
              });
            }
          }
          
          if (newTime <= 0) {
            stopTimer();
            setIsTimeUp(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
  };


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            ← Trang chủ
          </Link>
        </div>

        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs sm:text-sm text-slate-200 backdrop-blur mb-4">
            <span>🔤 Xếp chữ</span>
            <span className="text-white/40">•</span>
            <span>Word Puzzle</span>
            <span className="ml-4 inline-flex items-center px-2 py-0.5 rounded bg-blue-400/20 text-blue-300 text-xs font-semibold">
              Level: {level}/10
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Sắp xếp các chữ cái
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Quan sát các chữ cái và đoán từ có nghĩa
          </p>
        </header>

        {/* Level selector */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => handleChangeLevel(0)}
            disabled={level > 0 && !completedLevels.has(level)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              level === 0
                ? "bg-slate-500 text-white shadow-lg"
                : level > 0 && !completedLevels.has(level)
                ? "bg-white/5 opacity-50 text-slate-400 cursor-not-allowed"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
            title={level > 0 && !completedLevels.has(level) ? "Hoàn thành màn hiện tại trước" : ""}
          >
            0
          </button>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((lvl) => {
            const isUnlocked = isLevelUnlocked(lvl);
            const isCompleted = completedLevels.has(lvl);
            const result = levelResults[lvl];
            const isCurrentlyPlaying = level > 0 && !completedLevels.has(level);
            const canChange = !isCurrentlyPlaying || lvl === level || isCompleted;
            
            let bgColor = "bg-white/5";
            let textColor = "text-slate-300";
            let hoverClass = "hover:bg-white/10";
            let isDisabled = false;
            let titleText = "";
            
            if (!isUnlocked && !isCompleted) {
              bgColor = "bg-white/5 opacity-30";
              textColor = "text-slate-500";
              hoverClass = "cursor-not-allowed";
              isDisabled = true;
              titleText = "Chưa mở khóa";
            } else if (isCurrentlyPlaying && lvl !== level && !isCompleted) {
              bgColor = "bg-white/5 opacity-50";
              textColor = "text-slate-400";
              hoverClass = "cursor-not-allowed";
              isDisabled = true;
              titleText = "Hoàn thành màn hiện tại trước";
            } else if (isCompleted) {
              if (result === 'correct') {
                bgColor = "bg-emerald-500/30";
                textColor = "text-emerald-300";
              } else if (result === 'incorrect') {
                bgColor = "bg-rose-500/30";
                textColor = "text-rose-300";
              }
            }
            
            if (level === lvl) {
              bgColor = "bg-blue-500";
              textColor = "text-white";
            }
            
            return (
              <button
                key={lvl}
                onClick={() => handleChangeLevel(lvl)}
                disabled={isDisabled || !canChange}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition shadow-lg ${bgColor} ${textColor} ${hoverClass} ${
                  (isDisabled || !canChange) ? "cursor-not-allowed" : ""
                }`}
                title={titleText || ""}
              >
                {lvl}
              </button>
            );
          })}
        </div>

        {/* Empty State for Level 0 */}
        {level === 0 ? (
          <section className="mb-6">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-12 md:p-16 min-h-[300px]">
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-linear-to-tr from-slate-500 via-slate-400 to-slate-600 opacity-20 blur-2xl" />
              
              <div className="relative z-10 text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-4">🔤</div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-200 mb-3">
                  Chọn level để bắt đầu
                </h2>
                <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-6">
                  Nhấn vào các số từ 1 đến 10 để chơi. Mỗi level có thời gian giới hạn khác nhau.
                </p>
                <button
                  onClick={handleStart}
                  className="px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-blue-500/20 border border-blue-400/50 text-blue-200 text-base sm:text-lg font-medium hover:bg-blue-500/30 transition shadow-lg"
                >
                  Bắt đầu
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Show Answer and Mark Answer Buttons */}
            {level > 0 && (
              <div className="text-center mb-4 sm:mb-6">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button
                    onClick={handleShowAnswer}
                    disabled={completedLevels.has(level) || showAnswer}
                    className="px-4 py-2 sm:px-5 sm:py-3 rounded-xl bg-blue-500/20 border border-blue-400/50 text-blue-200 text-sm sm:text-base font-medium hover:bg-blue-500/30 transition shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    👁️ Hiển thị đáp án
                  </button>
                  <button
                    onClick={() => markAnswer(true)}
                    disabled={completedLevels.has(level)}
                    className="px-4 py-2 sm:px-5 sm:py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-sm sm:text-base font-medium hover:bg-emerald-500/30 transition shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ✓ Đúng
                  </button>
                  <button
                    onClick={() => markAnswer(false)}
                    disabled={completedLevels.has(level)}
                    className="px-4 py-2 sm:px-5 sm:py-3 rounded-xl bg-rose-500/20 border border-rose-400/50 text-rose-200 text-sm sm:text-base font-medium hover:bg-rose-500/30 transition shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ✗ Sai
                  </button>
                </div>
              </div>
            )}

            {/* Letters and Answer Section */}
            <section className="mb-6">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-8 h-[320px] sm:h-[350px]">
                <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-linear-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-2xl" />
                
                <div className="relative z-10">
                  {/* Letters Display */}
                  <div
                    className={`transition-all duration-500 ${
                      showAnswer
                        ? "opacity-50 scale-85 transform -translate-y-1 sm:-translate-y-2"
                        : "opacity-100 scale-100"
                    }`}
                  >
                    <p className="text-xs sm:text-sm text-slate-400 mb-1 sm:mb-1.5 text-center">
                      Các chữ cái:
                    </p>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap min-h-[60px] sm:min-h-[80px]">
                      {shuffledLetters.map((letter, index) => (
                        <span
                          key={`${letter}-${index}`}
                          className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-lg sm:text-xl md:text-2xl font-bold rounded-lg sm:rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/30 text-blue-200 shadow-lg transition-all duration-500"
                        >
                          {letter}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timer / Time Up Message */}
                  {level > 0 && (
                    <div className="text-center mt-2 mb-4">
                      {isTimeUp ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-300 text-sm sm:text-base font-semibold animate-pulse">
                          <span>⏰</span>
                          <span>Time up!</span>
                        </div>
                      ) : timeLeft > 0 ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-400/20 border border-green-400/50 text-blue-200 text-sm sm:text-base font-semibold">
                          <span>⏱️</span>
                          <span>{timeLeft}s</span>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Answer Display */}
                  <div
                    className={`text-center mt-1 sm:mt-2 transition-all duration-500 ease-out ${
                      showAnswer
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                  >
                    {(() => {
                      const result = levelResults[level];
                      const isCorrect = result === 'correct';
                      const isIncorrect = result === 'incorrect';
                      
                      return (
                        <>
                          <p className="text-xs sm:text-sm mb-2">
                            <span className={isCorrect ? "text-emerald-300" : isIncorrect ? "text-rose-300" : "text-emerald-300"}>
                              Đáp án:
                            </span>
                            {result && (
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                                isCorrect 
                                  ? "bg-emerald-500/20 text-emerald-300" 
                                  : "bg-rose-500/20 text-rose-300"
                              }`}>
                                {isCorrect ? "✓ Đúng" : "✗ Sai"}
                              </span>
                            )}
                          </p>
                          <div className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2 wrap-break-word ${
                            isCorrect 
                              ? "text-emerald-200" 
                              : isIncorrect 
                              ? "text-rose-200" 
                              : "text-emerald-200"
                          }`}>
                            {currentWord.toUpperCase()}
                          </div>
                          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                            <button
                              onClick={handleNext}
                              disabled={!completedLevels.has(level)}
                              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-blue-500/20 border border-blue-400/50 text-xs sm:text-sm font-medium text-blue-200 hover:bg-blue-500/30 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Tiếp theo →
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </section>

            {/* Hint */}
            <div className="text-center text-xs text-slate-400">
              💡 Gợi ý: Từ có {currentWord.replace(/\s/g, "").length} chữ cái
            </div>
          </>
        )}
      </div>
    </div>
  );
}
