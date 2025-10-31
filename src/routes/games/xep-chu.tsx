import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";

export const Route = createFileRoute("/games/xep-chu")({
  component: XepChu,
});

// Danh sách từ cho 10 level
const wordsByLevel: Record<number, string[]> = {
  1: ["mèo", "chó", "gà", "bò", "cá", "hoa", "nhà", "cây", "mặt", "sông"],
  2: ["bàn", "ghế", "cửa", "tường", "nền", "mái", "vườn", "ao", "biển", "núi"],
  3: ["thành phố", "động vật", "trái cây", "mặt trời", "sách vở"],
  4: ["trường học", "đồng hồ", "bức tranh", "câu chuyện", "bữa ăn"],
  5: ["giáo dục", "khoa học", "nghệ thuật", "phương tiện", "công nghệ"],
  6: ["du lịch", "thể thao", "âm nhạc", "văn học", "kinh tế"],
  7: ["truyền thông", "môi trường", "xã hội", "văn hóa", "lịch sử"],
  8: ["công nghiệp", "nông nghiệp", "thương mại", "tài chính", "ngân hàng"],
  9: ["kiến trúc", "xây dựng", "giao thông", "viễn thông", "năng lượng"],
  10: ["quốc tế", "ngoại giao", "an ninh", "pháp luật", "tư pháp"],
};

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
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopTimer();
            // Hiển thị "Time up" khi hết thời gian
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
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
    const word = getRandomWord(targetLevel);
    setCurrentWord(word);
    setShuffledLetters(word ? shuffleLetters(word) : []);
    
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

  // Khởi tạo game lần đầu
  useEffect(() => {
    initializeWord();
    
    // Cleanup timer khi unmount
    return () => {
      stopTimer();
    };
  }, []);

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

  // Đánh dấu đáp án đúng/sai
  const markAnswer = (isCorrect: boolean) => {
    const result = isCorrect ? 'correct' : 'incorrect';
    setLevelResults(prev => ({
      ...prev,
      [level]: result
    }));
    setCompletedLevels(prev => new Set(prev).add(level));
    setShowAnswer(true);
    // Dừng timer và reset states
    stopTimer();
    setIsTimeUp(false);
    setTimeLeft(0);
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

  // Chơi lại từ hiện tại
  const handleReset = () => {
    initializeWord();
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
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopTimer();
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
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
            {/* Mark Answer Buttons */}
            {level > 0 && (
              <div className="text-center mb-4 sm:mb-6">
                <div className="flex items-center justify-center gap-3 flex-wrap">
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
                          {letter.toUpperCase()}
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
                          <div className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2 break-words ${
                            isCorrect 
                              ? "text-emerald-200" 
                              : isIncorrect 
                              ? "text-rose-200" 
                              : "text-emerald-200"
                          }`}>
                            {currentWord.toUpperCase()}
                          </div>
                          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                            {!completedLevels.has(level) && (
                              <button
                                onClick={handleReset}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/10 border border-white/20 text-xs sm:text-sm font-medium text-white hover:bg-white/20 transition"
                              >
                                Chơi lại
                              </button>
                            )}
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
