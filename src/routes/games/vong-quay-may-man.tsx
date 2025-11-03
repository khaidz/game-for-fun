import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useMemo } from "react";

export const Route = createFileRoute("/games/vong-quay-may-man")({
  component: VongQuayMayMan,
});

// Danh sách phần thưởng theo sự kiện
const rewardLists: Record<string, string[]> = {
  default: ["May mắn lần sau", "500 điểm", "1000 điểm", "2000 điểm", "5000 điểm", "10.000 điểm"],
  "8-3": ["Hoa hồng", "Kem dưỡng da", "Son môi", "Túi xách", "Đồng hồ", "Voucher 500k"],
  tet: ["Lì xì 50k", "Lì xì 100k", "Lì xì 200k", "Lì xì 500k", "Vàng 1 chỉ", "Xe máy"],
  birthday: ["Bánh sinh nhật", "Nến thơm", "Quà bí mật", "1000 điểm", "5000 điểm", "Voucher spa"],
};

function VongQuayMayMan() {
  useEffect(() => {
    document.title = "Vòng quay may mắn | Trò chơi giải trí | KhaiBQ.net";
  }, []);

  const [selectedEvent, setSelectedEvent] = useState<string>("default");
  const [rewards, setRewards] = useState<string[]>(rewardLists.default);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
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

  // Cập nhật phần thưởng khi chọn sự kiện
  useEffect(() => {
    setRewards(rewardLists[selectedEvent] || rewardLists.default);
    setResult(null);
    // Reset vòng quay về vị trí ban đầu
    if (wheelRef.current) {
      const element = wheelRef.current;
      element.style.transition = "none";
      element.style.transform = "rotate(0deg)";
    }
  }, [selectedEvent]);

  // Hàm quay vòng
  const spinWheel = () => {
    if (isSpinning || rewards.length === 0) return;

    setIsSpinning(true);
    setResult(null);

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
            {/* Event Selection Dropdown */}
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              disabled={isSpinning}
              className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#1e293b",
              }}
            >
              {Object.keys(rewardLists).map((event) => (
                <option
                  key={event}
                  value={event}
                  style={{
                    backgroundColor: "#1e293b",
                    color: "#e2e8f0",
                  }}
                >
                  {event === "default" && "Mặc định"}
                  {event === "8-3" && "Mùng 8-3"}
                  {event === "tet" && "Tết"}
                  {event === "birthday" && "Sinh nhật"}
                </option>
              ))}
            </select>
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
                    const colorIndex = index % 6;
                    const colors = [
                      "#f97316", // orange-500
                      "#ec4899", // pink-500
                      "#a855f7", // purple-500
                      "#3b82f6", // blue-500
                      "#22c55e", // green-500
                      "#eab308", // yellow-500
                    ];

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

          {/* Result Display */}
          {result && (
            <div className="mt-4 rounded-2xl border border-emerald-500/50 bg-emerald-500/20 backdrop-blur-sm px-8 py-4 text-center">
              <div className="text-sm text-emerald-300 mb-2">🎉 Chúc mừng!</div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-200">
                {result}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
