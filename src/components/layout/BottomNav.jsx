import { NavLink } from 'react-router-dom'
import { Home, Compass, Megaphone, MessageSquare, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'

const items = [
  { to: '/home',      icon: Home,          key: 'nav_home' },
  { to: '/discover',  icon: Compass,       key: 'nav_discover' },
  { to: '/campaigns', icon: Megaphone,     key: 'nav_campaigns' },
  { to: '/messages',  icon: MessageSquare, key: 'nav_messages', dot: true },
  { to: '/profile',   icon: User,          key: 'nav_profile' },
]

export default function BottomNav() {
  const { lang, unread } = useApp()
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border/40 bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/85"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto max-w-2xl grid grid-cols-5">
        {items.map(({ to, icon: Icon, key, dot }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center justify-center gap-1.5 py-3 text-[9px] uppercase tracking-[0.18em] transition-colors duration-200',
                  isActive
                    ? 'text-cognac'
                    : 'text-champagne hover:text-cognac'
                )
              }
            >
              <span className="relative">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {dot && unread > 0 && (
                  <span className="dot-hermes absolute -top-0.5 -right-1.5" />
                )}
              </span>
              <span>{t(lang, key)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
