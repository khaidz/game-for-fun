import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useMemo } from "react";

export const Route = createFileRoute("/games/vong-quay-may-man")({
  component: VongQuayMayMan,
});

function VongQuayMayMan() {
  useEffect(() => {
    document.title = "Vòng quay may mắn | Trò chơi giải trí | KhaiBQ.net";
  }, []);

  const [rewards, setRewards] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [customRewards, setCustomRewards] = useState<string[]>([]);
  const [newRewardInput, setNewRewardInput] = useState("");
  const [removeRewardAfterSpin, setRemoveRewardAfterSpin] = useState(false);
  const [removedRewardIndexes, setRemovedRewardIndexes] = useState<Set<number>>(new Set());
  const [willRemoveReward, setWillRemoveReward] = useState<string | null>(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const wheelRef = useRef<SVGGElement>(null);

  // Audio URLs
  const audioUrlSpinning = useMemo(
    () => new URL("../../assets/music/wheel-spinning.wav", import.meta.url).href,
    []
  );
  const audioUrlMagic = useMemo(
    () => new URL("../../assets/music/magic.mp3", import.meta.url).href,
    []
  );

  // Audio refs
  const audioSpinningRef = useRef<HTMLAudioElement | null>(null);
  const audioMagicRef = useRef<HTMLAudioElement | null>(null);

  // Khởi tạo audio
  useEffect(() => {
    // Load nhạc quay
    audioSpinningRef.current = new Audio(audioUrlSpinning);
    audioSpinningRef.current.volume = 0.7;
    audioSpinningRef.current.preload = "auto";

    // Load nhạc magic
    audioMagicRef.current = new Audio(audioUrlMagic);
    audioMagicRef.current.volume = 0.7;
    audioMagicRef.current.preload = "auto";

    // Cleanup audio khi unmount
    return () => {
      if (audioSpinningRef.current) {
        audioSpinningRef.current.pause();
        audioSpinningRef.current = null;
      }
      if (audioMagicRef.current) {
        audioMagicRef.current.pause();
        audioMagicRef.current = null;
      }
    };
  }, [audioUrlSpinning, audioUrlMagic]);

  // Cập nhật phần thưởng khi customRewards thay đổi
  useEffect(() => {
    // Lọc các phần thưởng theo index (chỉ loại bỏ những index đã bị đánh dấu)
    const availableRewards = customRewards.filter(
      (_, index) => !removedRewardIndexes.has(index)
    );
    setRewards(availableRewards);
    setResult(null);
    // Reset vòng quay về vị trí ban đầu
    if (wheelRef.current) {
      const element = wheelRef.current;
      element.style.transition = "none";
      element.style.transform = "rotate(0deg)";
    }
  }, [customRewards, removedRewardIndexes]);

  // Hàm thêm phần thưởng
  const handleAddReward = () => {
    if (newRewardInput.trim()) {
      setCustomRewards([...customRewards, newRewardInput.trim()]);
      setNewRewardInput("");
    }
  };

  // Hàm xóa phần thưởng
  const handleRemoveReward = (index: number) => {
    // Xóa phần thưởng khỏi danh sách
    setCustomRewards(customRewards.filter((_, i) => i !== index));
    
    // Điều chỉnh lại các index đã bị loại bỏ (giảm index của các phần tử sau phần tử bị xóa)
    setRemovedRewardIndexes((prev) => {
      const newSet = new Set<number>();
      prev.forEach((removedIndex) => {
        if (removedIndex < index) {
          // Index phía trước không đổi
          newSet.add(removedIndex);
        } else if (removedIndex > index) {
          // Index phía sau giảm đi 1
          newSet.add(removedIndex - 1);
        }
        // Index bằng index bị xóa thì không thêm vào (đã bị xóa rồi)
      });
      return newSet;
    });
  };

  // Hàm reset lại tất cả phần thưởng đã bị loại bỏ
  const handleResetRemovedRewards = () => {
    setRemovedRewardIndexes(new Set());
  };

  // Hàm quay vòng
  const spinWheel = () => {
    if (isSpinning || rewards.length === 0) return;

    // Nếu chế độ loại bỏ được bật và có phần thưởng từ lần quay trước, loại bỏ phần tử đầu tiên có giá trị đó
    if (removeRewardAfterSpin && result) {
      // Tìm index đầu tiên của phần thưởng được quay trong danh sách customRewards chưa bị loại bỏ
      const availableIndexes = customRewards
        .map((reward, index) => ({ reward, index }))
        .filter(({ index }) => !removedRewardIndexes.has(index));
      
      const targetReward = availableIndexes.find(({ reward }) => reward === result);
      if (targetReward) {
        setRemovedRewardIndexes((prev) => new Set(prev).add(targetReward.index));
      }
    }

    setIsSpinning(true);
    setResult(null);
    setWillRemoveReward(null); // Reset khi bắt đầu quay mới

    // Dừng nhạc magic nếu đang phát
    if (audioMagicRef.current) {
      audioMagicRef.current.pause();
      audioMagicRef.current.currentTime = 0;
    }

    // Phát nhạc quay khi bắt đầu
    if (audioSpinningRef.current) {
      audioSpinningRef.current.currentTime = 0;
      audioSpinningRef.current.play().catch(() => {
        // Autoplay may be blocked
      });
    }

    if (wheelRef.current) {
      const element = wheelRef.current;
      element.style.transition = "none";
      element.style.transform = "rotate(0deg)";
    }

    setTimeout(() => {
      if (!wheelRef.current) return;

      const fullRotations = 10; // 10 vòng
      const totalDegrees = fullRotations * 360;

      // Chọn phần thưởng
      const randomIndex = Math.floor(Math.random() * rewards.length);
      const selectedReward = rewards[randomIndex];

      // Tính góc: random trong slice để mũi tên không luôn ở giữa
      const sliceAngle = 360 / rewards.length;
      // Random offset từ -40% đến +40% của slice (tránh quá gần biên)
      const randomOffset = (Math.random() - 0.5) * sliceAngle * 0.8;
      const targetAngle =
        randomIndex * sliceAngle + sliceAngle / 2 + randomOffset; // độ (0..360)

      // Muốn điểm random trong slice dừng ở vị trí mũi tên (top = -90deg).
      // Khi tính theo hệ dùng ở đây, công thức đơn giản là:
      const angleToPointer = (360 - targetAngle) % 360;

      const finalRotation = totalDegrees + angleToPointer;

      const element = wheelRef.current;
      // thời gian/ easing giống bạn trước, tùy chỉnh nếu muốn
      element.style.transition =
        "transform 6s cubic-bezier(0.17, 0.67, 0.12, 0.99)";
      element.style.transform = `rotate(${finalRotation}deg)`;

      setTimeout(() => {
        // Dừng nhạc quay
        if (audioSpinningRef.current) {
          audioSpinningRef.current.pause();
          audioSpinningRef.current.currentTime = 0;
        }

        // Phát nhạc magic khi kết thúc
        if (audioMagicRef.current) {
          audioMagicRef.current.currentTime = 0;
          audioMagicRef.current.play().catch(() => {
            // Autoplay may be blocked
          });
        }

        setResult(selectedReward);
        setIsSpinning(false);

        // Nếu chế độ loại bỏ phần thưởng được bật, đánh dấu để hiển thị thông báo (sẽ xóa khi quay lần sau)
        if (removeRewardAfterSpin) {
          setWillRemoveReward(selectedReward); // Đánh dấu phần thưởng sẽ bị loại bỏ ở lần quay tiếp theo
        }
      }, 6000);
    }, 10);
  };


  const sliceAngle = 360 / rewards.length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              ← Trang chủ
            </Link>
            <div className="flex items-center gap-3">
              {/* Button mở cài đặt */}
              <button
                onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                disabled={isSpinning}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>⚙️</span>
                <span>Tùy chọn</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                🎡 Vòng quay may mắn
              </h1>
              <p className="text-slate-300 text-sm sm:text-base">
                Quay vòng và nhận phần thưởng
              </p>
            </div>
          </div>
        </header>

        {/* Custom Mode Panel */}
        {showSettingsPanel && (
          <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-200">
                ⚙️ Tùy chọn phần thưởng
              </h2>
              <button
                onClick={() => setShowSettingsPanel(false)}
                className="text-slate-400 hover:text-slate-200 transition"
                title="Đóng"
              >
                ✕
              </button>
            </div>

            {/* Toggle Remove Reward After Spin */}
            <div className="mb-4 flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeRewardAfterSpin}
                  onChange={(e) => setRemoveRewardAfterSpin(e.target.checked)}
                  disabled={isSpinning}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-sm text-slate-300">
                  Loại bỏ phần thưởng sau khi quay
                </span>
              </label>
            </div>

            {/* Add Reward Input */}
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newRewardInput}
                onChange={(e) => setNewRewardInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddReward();
                  }
                }}
                placeholder="Nhập phần thưởng mới..."
                disabled={isSpinning}
                className="flex-1 rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
              />
              <button
                onClick={handleAddReward}
                disabled={isSpinning || !newRewardInput.trim()}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thêm
              </button>
            </div>

            {/* Rewards List */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  Danh sách phần thưởng ({customRewards.length})
                </span>
                {removedRewardIndexes.size > 0 && (
                  <button
                    onClick={handleResetRemovedRewards}
                    disabled={isSpinning}
                    className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                  >
                    Khôi phục tất cả
                  </button>
                )}
              </div>
              {customRewards.length === 0 ? (
                <p className="text-sm text-slate-400 italic">
                  Chưa có phần thưởng nào. Hãy thêm phần thưởng ở trên.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {customRewards.map((reward, index) => {
                    const isRemoved = removedRewardIndexes.has(index);
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                          isRemoved
                            ? "border-slate-600 bg-slate-800/50 opacity-50"
                            : "border-slate-700 bg-slate-800"
                        }`}
                      >
                        <span
                          className={`flex-1 truncate ${
                            isRemoved ? "text-slate-500" : "text-slate-200"
                          }`}
                        >
                          {reward}
                        </span>
                        <button
                          onClick={() => handleRemoveReward(index)}
                          disabled={isSpinning}
                          className="ml-2 text-red-400 hover:text-red-300 disabled:opacity-50"
                          title="Xóa"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Removed Rewards Info */}
            {removedRewardIndexes.size > 0 && (
              <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
                <p className="text-xs text-orange-300">
                  ⚠️ Có {removedRewardIndexes.size} phần thưởng đã bị loại bỏ. Chúng
                  sẽ không xuất hiện trong lần quay tiếp theo.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Wheel Section */}
        <section className="flex flex-col items-center gap-8">
          {/* Wheel Container */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px]">
            {/* Pointer at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-orange-400" />
            </div>

            {/* Wheel */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-slate-700 shadow-2xl">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 200 200"
              >
                <g
                  ref={wheelRef}
                  style={{
                    transformOrigin: "50% 50%",
                  }}
                >
                  {rewards.map((reward, index) => {
                    const rotation = index * sliceAngle;
                    const colors = [
                      "#f97316", // orange-500
                      "#ec4899", // pink-500
                      "#a855f7", // purple-500
                      "#3b82f6", // blue-500
                      "#22c55e", // green-500
                      "#eab308", // yellow-500
                      "#ef4444", // red-500
                      "#06b6d4", // cyan-500
                      "#84cc16", // lime-500
                      "#f59e0b", // amber-500
                      "#8b5cf6", // violet-500
                      "#14b8a6", // teal-500
                      "#f43f5e", // rose-500
                      "#10b981", // emerald-500
                      "#6366f1", // indigo-500
                      "#fb923c", // orange-400
                      "#d946ef", // fuchsia-500
                      "#0ea5e9", // sky-500
                      "#65a30d", // lime-600
                      "#dc2626", // red-600
                    ];
                    const colorIndex = index % colors.length;

                    // Tính toán cho SVG path
                    const centerX = 100;
                    const centerY = 100;
                    const radius = 100;
                    
                    // Góc bắt đầu và kết thúc (tính từ trên cùng -90 độ)
                    const startAngle = ((rotation - 90) * Math.PI) / 180;
                    const endAngle = ((rotation + sliceAngle - 90) * Math.PI) / 180;
                    
                    // Tính điểm trên cung tròn
                    const x1 = centerX + radius * Math.cos(startAngle);
                    const y1 = centerY + radius * Math.sin(startAngle);
                    const x2 = centerX + radius * Math.cos(endAngle);
                    const y2 = centerY + radius * Math.sin(endAngle);
                    
                    const largeArc = sliceAngle > 180 ? 1 : 0;

                    // Tính vị trí text (giữa mỗi slice)
                    const textAngle = ((rotation + sliceAngle / 2 - 90) * Math.PI) / 180;
                    const textRadius = radius * 0.7;
                    const textX = centerX + textRadius * Math.cos(textAngle);
                    const textY = centerY + textRadius * Math.sin(textAngle);

                    return (
                      <g key={index}>
                        <path
                          d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={colors[colorIndex]}
                          opacity={0.9}
                        />
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="7"
                          fontWeight="bold"
                          className="select-none pointer-events-none"
                          style={{
                            filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.8))",
                          }}
                        >
                          {reward.length > 12 ? (
                            <>
                              {reward.split(" ").map((word, i, words) => {
                                if (i === 0) {
                                  return (
                                    <tspan key={i} x={textX} dy={words.length > 1 ? "-0.6em" : "0"}>
                                      {word}
                                    </tspan>
                                  );
                                }
                                return (
                                  <tspan key={i} x={textX} dy="1.2em">
                                    {word}
                                  </tspan>
                                );
                              })}
                            </>
                          ) : (
                            reward
                          )}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Center Button */}
            <button
              onClick={spinWheel}
              disabled={isSpinning || rewards.length === 0}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSpinning ? "..." : "QUAY"}
            </button>
          </div>

          {/* No Rewards Warning */}
          {rewards.length === 0 && (
            <div className="mt-4 rounded-2xl border border-red-500/50 bg-red-500/20 backdrop-blur-sm px-8 py-4 text-center">
              <div className="text-sm text-red-300 mb-2">⚠️ Cảnh báo</div>
              <div className="text-lg sm:text-xl font-semibold text-red-200">
                Không còn phần thưởng nào để quay!
              </div>
              {removedRewardIndexes.size > 0 && (
                <button
                  onClick={handleResetRemovedRewards}
                  className="mt-3 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition"
                >
                  Khôi phục tất cả phần thưởng
                </button>
              )}
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="mt-4 rounded-2xl border border-emerald-500/50 bg-emerald-500/20 backdrop-blur-sm px-8 py-4 text-center">
              <div className="text-sm text-emerald-300 mb-2">🎉 Chúc mừng!</div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-200">
                {result}
              </div>
              {willRemoveReward && willRemoveReward === result && (
                <div className="mt-3 text-xs text-orange-300 animate-pulse">
                  ⚠️ Phần thưởng này sẽ bị loại bỏ khi quay lần tiếp theo
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
