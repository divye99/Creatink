import { Link } from 'react-router-dom'
import { Bell, Settings, Globe } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { LANGS } from '@/lib/i18n'

export default function TopBar({ title }) {
  const { lang, changeLang } = useApp()
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <div className="mx-auto max-w-2xl flex items-center justify-between px-4 h-14">
        <Link to="/home" className="font-display text-xl text-body tracking-tight">
          {title || 'CREATINK'}
        </Link>
        <div className="flex items-center gap-1">
          <select
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            className="bg-transparent text-xs font-semibold text-muted focus:outline-none cursor-pointer pr-2"
            aria-label="Language"
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code} className="bg-card">{l.label}</option>
            ))}
          </select>
          <Link to="/notifications" className="p-2 text-body/50 hover:text-cognac relative">
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
            <span className="dot-hermes absolute top-1.5 right-1.5" />
          </Link>
          <Link to="/settings" className="p-2 text-body/50 hover:text-cognac">
            <Settings className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  )
}
