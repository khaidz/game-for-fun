import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/games/duoi-hinh-bat-chu")({
  component: DuoiHinhBatChu,
});

function DuoiHinhBatChu() {
  useEffect(() => {
    document.title = "Đuổi hình bắt chữ | Trò chơi giải trí | KhaiBQ.net";
  }, []);

  const [score] = useState(0);

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
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                🖼️ Đuổi hình bắt chữ
              </h1>
              <p className="text-slate-300 text-sm sm:text-base">
                Xem hình và đoán từ khóa
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Điểm số</div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                {score}
              </div>
            </div>
          </div>
        </header>

        {/* Game Content */}
        <section className="text-center">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-12 md:p-16 min-h-[400px] flex items-center justify-center">
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-linear-to-tr from-cyan-500 via-teal-500 to-green-500 opacity-20 blur-2xl" />
            
            <div className="relative z-10">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4">🎮</div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-200 mb-3">
                Đang phát triển
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
                Game "Đuổi hình bắt chữ" đang được xây dựng. Hãy quay lại sau!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
