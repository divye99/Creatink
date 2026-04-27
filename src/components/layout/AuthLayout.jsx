import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-bg text-body flex flex-col">
      <header className="px-6 pt-8">
        <Link to="/" className="font-display text-2xl text-slateblue tracking-tight">CREATINK</Link>
        <p className="text-xs text-champagne tracking-[0.18em] font-light mt-0.5">Creator Link</p>
      </header>
      <main className="flex-1 mx-auto w-full max-w-md px-6 py-10 page-enter">
        <Outlet />
      </main>
    </div>
  )
}
