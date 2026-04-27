import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-bg text-body">
      <TopBar />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-4 page-enter">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
