import ImageBo from "@/assets/images/animal-challenge/bo.jpg";
import ImageCa from "@/assets/images/animal-challenge/ca.jpg";
import ImageChim from "@/assets/images/animal-challenge/chim.jpg";
import ImageCho from "@/assets/images/animal-challenge/cho.jpg";
import ImageChuot from "@/assets/images/animal-challenge/chuot.jpg";
import ImageDe from "@/assets/images/animal-challenge/de.jpg";
import ImageGa from "@/assets/images/animal-challenge/ga.jpg";
import ImageGau from "@/assets/images/animal-challenge/gau.jpg";
import ImageLon from "@/assets/images/animal-challenge/lon.jpg";
import ImageMeo from "@/assets/images/animal-challenge/meo.jpg";
import ImageNgua from "@/assets/images/animal-challenge/ngua.jpg";
import ImageTom from "@/assets/images/animal-challenge/tom.jpg";
import ImageRua from "@/assets/images/animal-challenge/rua.jpg";
import ImageRan from "@/assets/images/animal-challenge/ran.jpg";
import ImageVit from "@/assets/images/animal-challenge/vit.jpg";
import ImageVoi from "@/assets/images/animal-challenge/voi.jpg";
import ImageQuestion from "@/assets/images/animal-challenge/question.jpg";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/games/animal-challenge")({
  component: AnimalChallenge,
});

function AnimalChallenge() {
  useEffect(() => {
    document.title = "Animal Challenge | Trò chơi giải trí | KhaiBQ.net";
  }, []);
  const totalRounds = 10;
  const highlightDurationMs = 2640;
  // Base round schedule in seconds (using decimal notation like 6.22 = 6.22s)
  const baseRoundSchedule = useMemo(
    () => [
      { start: 0.0, end: 6.58, effectStart: 4.00 }, //1
      { start: 6.58, end: 11.95, effectStart: 9.2 }, //2
      { start: 11.95, end: 17.0, effectStart: 14.45 }, //3
      { start: 17.0, end: 22.35, effectStart: 19.7 }, //4
      { start: 22.35, end: 27.61, effectStart: 24.97 }, //5
      { start: 27.61, end: 32.6, effectStart: 29.95 }, //6
      { start: 32.6, end: 38.0, effectStart: 35.2 }, //7
      { start: 38.0, end: 43.14, effectStart: 40.4 }, //8
      { start: 43.14, end: 48.3, effectStart: 45.6 }, //9
      { start: 48.3, end: 54.0, effectStart: 50.9 }, //10
    ],
    []
  );

  // State for delay adjustment
  const [delayAdjustment, setDelayAdjustment] = useState(0);
  const [delayInputValue, setDelayInputValue] = useState('');
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Calculate adjusted round schedule based on delay
  const roundSchedule = useMemo(() => {
    if (delayAdjustment === 0) return baseRoundSchedule;

    const adjusted: typeof baseRoundSchedule = [];
    for (let i = 0; i < baseRoundSchedule.length; i++) {
      const base = baseRoundSchedule[i];
      if (i === 0) {
        // First round: start stays the same, end and effectStart add delay
        adjusted.push({
          start: base.start,
          end: base.end + delayAdjustment,
          effectStart: base.effectStart + delayAdjustment,
        });
      } else {
        // Subsequent rounds: start = previous round's end, end and effectStart add delay
        adjusted.push({
          start: adjusted[i - 1].end,
          end: base.end + delayAdjustment,
          effectStart: base.effectStart + delayAdjustment,
        });
      }
    }
    return adjusted;
  }, [baseRoundSchedule, delayAdjustment]);

  const animals = useMemo(
    () => [
      { id: "cho", name: "Chó", image: ImageCho },
      { id: "meo", name: "Mèo", image: ImageMeo },
      { id: "pig", name: "Lợn", image: ImageLon },
      { id: "ga", name: "Gà", image: ImageGa },
      { id: "ngua", name: "Ngựa", image: ImageNgua },
      { id: "bo", name: "Bò", image: ImageBo },
      { id: "chim", name: "Chim", image: ImageChim },
      { id: "gau", name: "Gấu", image: ImageGau },
      { id: "ca", name: "Cá", image: ImageCa },
      { id: "chuot", name: "Chuột", image: ImageChuot },
      { id: "de", name: "De", image: ImageDe },
      { id: "rua", name: "Ruồi", image: ImageRua },
      { id: "vit", name: "Vịt", image: ImageVit },
      { id: "tom", name: "Tôm", image: ImageTom },
      { id: "ran", name: "Rắn", image: ImageRan },
      { id: "voi", name: "Voi", image: ImageVoi },
    ],
    []
  );

  // Preload all animal images once to avoid loading delays between rounds
  const preloadedImagesRef = useRef<Record<string, HTMLImageElement>>({});
  useEffect(() => {
    const cache = preloadedImagesRef.current;
    animals.forEach((a) => {
      const key = String(a.image);
      if (!cache[key]) {
        const img = new Image();
        img.src = String(a.image);
        img.decoding = "async";
        img.loading = "eager";
        cache[key] = img;
      }
    });
  }, [animals]);

  const getLevel = (round: number) => {
    if (round <= 3) return "Dễ";
    if (round <= 6) return "Trung bình";
    if (round <= 9) return "Khó";
    return "Rất khó";
  };

  const getLevelAnimals = (round: number) => {
    if (round <= 3)
      return animals.filter((a) =>
        ["cho", "meo", "ga", "lon", "bo"].includes(a.id)
      );
    if (round <= 6)
      return animals.filter((a) =>
        ["cho", "meo", "ga", "lon", "bo", "ngua", "gau", "chuot"].includes(a.id)
      );
    return animals; // level khó: dùng toàn bộ
  };

  const [currentRound, setCurrentRound] = useState(1);
  const generateGrid = (round = currentRound) => {
    const pool = getLevelAnimals(round);
    if (round === 10) {
      // Round 10: 8 unique animals without duplicates
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(8, shuffled.length));
    }
    // Rounds 1-9: 8 cells, may repeat
    return Array.from(
      { length: 8 },
      () => pool[Math.floor(Math.random() * pool.length)]
    );
  };
  const [grid, setGrid] = useState(generateGrid());
  const [isFinished, setIsFinished] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [isHighlightActive, setIsHighlightActive] = useState(false);
  // Hint cloud state for level 10 interference text
  const [hintCloud, setHintCloud] = useState<
    Array<{
      id: number;
      text: string;
      colorClass: string;
      x: number;
      y: number;
      rotation: number;
      opacity: number;
      scale: number;
    }>
  >([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const highlightIntervalRef = useRef<number | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);
  const roundHighlightScheduleRef = useRef<number | null>(null);
  const gridSectionRef = useRef<HTMLDivElement | null>(null);
  const notificationTimeoutRef = useRef<number | null>(null);

  // Resolve audio URL via Vite so it works from src/assets
  const audioUrl = useMemo(
    () =>
      new URL("../../assets/music/animal-challenge.mp3", import.meta.url).href,
    []
  );

  useEffect(() => {
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7; // Set volume to 70%
    // Preload audio to avoid delay on first play
    audioRef.current.preload = "auto";
    try {
      audioRef.current.load();
      // Warm the browser cache as a fallback
      fetch(audioUrl, { cache: "force-cache" }).catch(() => {});
    } catch {}
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (notificationTimeoutRef.current) {
        window.clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [audioUrl]);

  const reshuffleGrid = (round = currentRound) => setGrid(generateGrid(round));

  function clearHighlightTimers() {
    if (highlightIntervalRef.current) {
      cancelAnimationFrame(highlightIntervalRef.current);
      highlightIntervalRef.current = null;
    }
    if (highlightTimeoutRef.current) {
      window.clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
  }

  function runSingleHighlight() {
    setIsHighlightActive(true);
    setHighlightIndex(0);
    // Level 10: interference text handled per tick
    const stepMs = Math.max(1, Math.floor(highlightDurationMs / 8));
    
    // Use performance.now() for accurate timing across devices (fixes mobile timer drift)
    const highlightStartTime = performance.now();
    
    // helper to (re)generate the hint cloud immediately
    const regenerateHintCloud = () => {
      const pool = getLevelAnimals(currentRound);
      const colors = [
        "text-amber-300",
        "text-rose-300",
        "text-emerald-300",
        "text-sky-300",
        "text-fuchsia-300",
        "text-indigo-300",
      ];
      const cloud = [] as Array<{
        id: number;
        text: string;
        colorClass: string;
        x: number;
        y: number;
        rotation: number;
        opacity: number;
        scale: number;
      }>;
      const count = 20;
      for (let i = 0; i < count; i += 1) {
        const name = pool[Math.floor(Math.random() * pool.length)]?.name ?? "";
        const colorClass = colors[Math.floor(Math.random() * colors.length)];
        const x = 5 + Math.random() * 90;
        const y = 5 + Math.random() * 90;
        const rotation = -10 + Math.random() * 20;
        const opacity = 0.40 + Math.random() * 0.4;
        const scale = 0.85 + Math.random() * 0.5;
        cloud.push({
          id: i,
          text: name,
          colorClass,
          x,
          y,
          rotation,
          opacity,
          scale,
        });
      }
      setHintCloud(cloud);
    };

    // Show hint cloud immediately at effect start for level 10
    if (currentRound === 10) {
      regenerateHintCloud();
    }
    // Use requestAnimationFrame with performance.now() for accurate timing across devices
    let lastIdx = -1;
    const updateHighlight = () => {
      const elapsed = performance.now() - highlightStartTime;
      const currentIdx = Math.min(7, Math.floor(elapsed / stepMs));
      
      // Only update state when index changes to avoid unnecessary re-renders
      if (currentIdx !== lastIdx) {
        setHighlightIndex(currentIdx);
        lastIdx = currentIdx;
        
        // Update hint cloud per tick (only when index changes) for level 10
        if (currentRound === 10) {
          regenerateHintCloud();
        }
      }
      
      // Wait until we've passed the full duration (8 cells * stepMs) before stopping
      if (elapsed >= highlightDurationMs) {
        setIsHighlightActive(false);
        setHintCloud([]);
        highlightIntervalRef.current = null;
        return;
      }
      
      highlightIntervalRef.current = requestAnimationFrame(updateHighlight) as unknown as number;
    };
    
    if (highlightIntervalRef.current) {
      cancelAnimationFrame(highlightIntervalRef.current);
    }
    highlightIntervalRef.current = requestAnimationFrame(updateHighlight) as unknown as number;
  }

  useEffect(() => {
    if (isFinished || !isRunning) return undefined;

    const cfg = roundSchedule[currentRound - 1];
    const roundDurationMs = Math.round((cfg.end - cfg.start) * 1000);
    const effectDelayMs = Math.max(
      0,
      Math.round((cfg.effectStart - cfg.start) * 1000)
    );

    // Generate grid dùng đúng pool cho từng round
    setIsHighlightActive(false);
    setHighlightIndex(null);
    setGrid(generateGrid(currentRound));
    if (roundHighlightScheduleRef.current)
      window.clearTimeout(roundHighlightScheduleRef.current);
    roundHighlightScheduleRef.current = window.setTimeout(() => {
      if (!isRunning || isFinished) return;
      runSingleHighlight();
    }, effectDelayMs);

    // Schedule round end
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (currentRound >= totalRounds) {
        setIsFinished(true);
        setIsRunning(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        clearHighlightTimers();
        return;
      }
      setCurrentRound((r) => r + 1);
      reshuffleGrid();
    }, roundDurationMs);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (roundHighlightScheduleRef.current)
        window.clearTimeout(roundHighlightScheduleRef.current);
      if (highlightIntervalRef.current)
        cancelAnimationFrame(highlightIntervalRef.current);
    };
  }, [currentRound, isFinished, isRunning, roundSchedule]);

  const handleStart = async () => {
    setIsFinished(false);
    setIsRunning(true);
    reshuffleGrid();
    try {
      await audioRef.current?.play();
    } catch {
      // autoplay may be blocked; user must interact again
    }
    // Per-round schedule handled in effect based on currentRound
    clearHighlightTimers();
    setHighlightIndex(null);
    setIsHighlightActive(false);
    // Auto scroll to grid on small/tall-limited screens
    window.setTimeout(() => {
      const el = gridSectionRef.current;
      if (!el) return;
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      // If viewport height is small or grid is not fully in view, scroll to it
      const rect = el.getBoundingClientRect();
      const needsScroll =
        viewportH < 750 || rect.top < 0 || rect.bottom > viewportH;
      if (needsScroll) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  const handleStop = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    clearHighlightTimers();
    if (roundHighlightScheduleRef.current) {
      window.clearTimeout(roundHighlightScheduleRef.current);
      roundHighlightScheduleRef.current = null;
    }
    // Reset to round 1 and stay stopped
    setCurrentRound(1);
    setIsFinished(false);
    reshuffleGrid();
    setIsRunning(false);
    setHighlightIndex(null);
    setIsHighlightActive(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleRestart = async () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    clearHighlightTimers();
    if (roundHighlightScheduleRef.current) {
      window.clearTimeout(roundHighlightScheduleRef.current);
      roundHighlightScheduleRef.current = null;
    }
    setCurrentRound(1);
    setIsFinished(false);
    reshuffleGrid();
    setIsRunning(true);
    setHighlightIndex(null);
    setIsHighlightActive(false);
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch {}
    }
    // Auto scroll to grid on small/tall-limited screens (mobile)
    window.setTimeout(() => {
      const el = gridSectionRef.current;
      if (!el) return;
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      const rect = el.getBoundingClientRect();
      const needsScroll =
        viewportH < 750 || rect.top < 0 || rect.bottom > viewportH;
      if (needsScroll) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Global hint overlay across the entire screen */}
      {currentRound === 10 && isHighlightActive && hintCloud.length ? (
        <div className="pointer-events-none fixed inset-0 z-20">
          {hintCloud.map((h) => (
            <span
              key={`cloud-overlay-${h.id}`}
              className={`absolute ${h.colorClass} text-xl sm:text-5xl font-extrabold tracking-wide select-none`}
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                transform: `translate(-50%, -50%) rotate(${h.rotation}deg) scale(${h.scale})`,
                opacity: h.opacity,
                textShadow: "0 2px 6px rgba(0,0,0,0.35)",
              }}
            >
              {h.text}
            </span>
          ))}
        </div>
      ) : null}
      {/* Notification toast */}
      {notificationMessage && (
        <div className="fixed top-4 right-4 z-30 transition-all duration-300 ease-in-out">
          <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-emerald-200 shadow-lg">
            {notificationMessage}
          </div>
        </div>
      )}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            ← Trang chủ
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                placeholder="Delay"
                value={delayInputValue}
                onChange={(e) => {
                  setDelayInputValue(e.target.value);
                }}
                className="w-20 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={() => {
                  // Clear any existing notification timeout
                  if (notificationTimeoutRef.current) {
                    window.clearTimeout(notificationTimeoutRef.current);
                  }
                  
                  const val = parseFloat(delayInputValue);
                  if (!isNaN(val)) {
                    setDelayAdjustment(val);
                    // Stop the game when setting delay
                    handleStop();
                    // Show notification
                    const sign = val >= 0 ? '+' : '';
                    setNotificationMessage(`Đã set delay: ${sign}${val}s`);
                    // Clear notification after 3 seconds
                    notificationTimeoutRef.current = window.setTimeout(() => {
                      setNotificationMessage(null);
                      notificationTimeoutRef.current = null;
                    }, 3000);
                  } else {
                    setDelayAdjustment(0);
                    setDelayInputValue('');
                    // Stop the game
                    handleStop();
                    // Show notification
                    setNotificationMessage('Đã reset delay về 0');
                    // Clear notification after 3 seconds
                    notificationTimeoutRef.current = window.setTimeout(() => {
                      setNotificationMessage(null);
                      notificationTimeoutRef.current = null;
                    }, 3000);
                  }
                }}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Set
              </button>
            </div>
          </div>
        </div>

        <header className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs sm:text-sm text-slate-200 backdrop-blur">
            <span>🐾 Animal Challenge</span>
            <span className="text-white/40">•</span>
            <span>Thử thách động vật</span>
            <span className="ml-4 inline-flex items-center px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-xs font-semibold">
              Level: {getLevel(currentRound)}
            </span>
          </div>
          <h1 className="mt-4 text-xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Vòng {isFinished ? totalRounds : currentRound}/{totalRounds}
          </h1>
          <p className="mt-2 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
            Bắt đầu chơi để bắt đầu thử thách.
          </p>
          {!isFinished && (
            <div className="mt-4 relative">
              <div className="flex items-center justify-center gap-3">
                {!isRunning ? (
                  <button
                    type="button"
                    onClick={handleStart}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-medium text-white shadow-inner transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    Bắt đầu
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    Stop
                  </button>
                )}
              </div>
              {/* hintCloud now rendered in global overlay */}
            </div>
          )}
        </header>

        {!isFinished ? (
          <section ref={gridSectionRef} className="mt-10">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 md:p-6">
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-linear-to-tr from-amber-500 via-lime-500 to-emerald-500 opacity-20 blur-2xl" />

              <div className="relative z-10">
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                  {grid.map((animal, idx) => (
                    <div
                      key={`${currentRound}-${idx}-${animal.id}`}
                      className={`aspect-square grid place-items-center rounded-sm md:rounded-xl bg-white/10 text-4xl sm:text-6xl shadow-inner transition-shadow ${
                        isHighlightActive && highlightIndex === idx
                          ? "ring-2 md:ring-4 ring-amber-500 ring-offset-2 ring-offset-white/10 shadow-4xl shadow-amber-400/60 scale-105"
                          : ""
                      }`}
                      title={isRunning ? animal.name : 'Ready'}
                    >
                      <img
                        src={isRunning ? animal.image : ImageQuestion}
                        alt={isRunning ? animal.name : 'Ready'}
                        className="object-contain rounded-lg shadow"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-10">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-linear-to-tr from-emerald-500 via-teal-500 to-cyan-500 opacity-20 blur-2xl" />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold">Hoàn thành!</h2>
                <p className="mt-2 text-slate-300">
                  Bạn đã hoàn thành 10 vòng.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-medium text-white shadow-inner transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    Chơi lại
                  </button>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    Trang chủ
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
