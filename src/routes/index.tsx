import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  useEffect(() => {
    document.title = 'Trang chủ | Game For Fun | KhaiBQ.net'
  }, [])
  const games = [
    {
      id: 'animal-challenge',
      name: 'Animal Challenge',
      emoji: '🐾',
      to: '/games/animal-challenge',
      colors: 'from-amber-500 via-lime-500 to-emerald-500',
    },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex flex-col items-center text-center gap-4 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs sm:text-sm text-slate-200 backdrop-blur">
            <span>🎮 Game For Fun</span>
            <span className="text-white/40">•</span>
            <span>Thư viện mini game</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Chọn trò chơi để bắt đầu
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            Bộ sưu tập game giải trí nhẹ nhàng. Giao diện đẹp, chạy mượt trên mọi thiết bị.
          </p>
        </header>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {games.map((game) => (
              <Link
                key={game.id}
                to={game.to}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition-transform duration-200 hover:-translate-y-1 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <div className={`absolute -right-24 -top-24 h-48 w-48 rounded-full bg-linear-to-tr ${game.colors} opacity-20 blur-2xl`} />

                <div className="relative z-10 flex items-center gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white/10 shadow-inner text-3xl">
                    <span className="drop-shadow">{game.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold leading-tight">
                      {game.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-300">
                      Nhấp để chơi ngay
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-4 flex items-center justify-between text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Trực tuyến
                  </span>
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                    Bắt đầu →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-12 text-center text-xs text-slate-400">
          Gợi ý: Thêm game mới bằng cách mở rộng danh sách ở trang này.
        </footer>
      </div>
    </div>
  )
}
