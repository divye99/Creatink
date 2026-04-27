import { NavLink } from 'react-router-dom'
import { Home, Compass, Megaphone, MessageSquare, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/contexts/AppContext'

const items = [
  { to: '/home',      icon: Home,          label: 'Home' },
  { to: '/discover',  icon: Compass,       label: 'Discover' },
  { to: '/campaigns', icon: Megaphone,     label: 'Campaigns' },
  { to: '/messages',  icon: MessageSquare, label: 'Messages', dot: true },
  { to: '/profile',   icon: User,          label: 'Profile' },
]

export default function BottomNav() {
  const { unread } = useApp()
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-black"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto max-w-2xl grid grid-cols-5">
        {items.map(({ to, icon: Icon, label, dot }) => (
          <li key={to}>
            <NavLink
              to={to}
              aria-label={label}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center justify-center py-4 transition-colors duration-200',
                  isActive ? 'text-champagne' : 'text-[#333333] hover:text-champagne/70'
                )
              }
            >
              <span className="relative">
                <Icon className="h-[22px] w-[22px]" strokeWidth={1.5} />
                {dot && unread > 0 && (
                  <span className="dot-hermes absolute -top-0.5 -right-1.5" />
                )}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
