import { Link, Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </>
  ),
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 w-full text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs sm:text-sm text-slate-200 backdrop-blur">
          <span>🚧 Page Not Found</span>
          <span className="text-white/40">•</span>
          <span>Mất đường rồi!</span>
        </div>

        <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight">404</h1>
        <p className="mt-2 text-lg text-slate-300">Trang bạn tìm không tồn tại hoặc đã được di chuyển.</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-white shadow-inner transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            ← Về trang chủ
          </Link>
          <a
            href="mailto:contact@example.com"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Báo lỗi
          </a>
        </div>
      </div>
    </div>
  )
}
