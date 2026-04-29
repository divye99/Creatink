import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_DEALS, DEMO_BRANDS, DEMO_CREATORS, DEMO_MESSAGES } from '@/lib/demoData'

export default function Messages() {
  const { userType } = useAuth()
  const isBrand = userType === 'brand'

  const threads = DEMO_DEALS.map((d) => {
    const counterparty = isBrand
      ? DEMO_CREATORS.find((c) => c.user_id === d.creator_id)
      : DEMO_BRANDS.find((b) => b.user_id === d.brand_id)
    const msgs = DEMO_MESSAGES[d.id] || []
    const last = msgs[msgs.length - 1]
    return { dealId: d.id, counterparty, last, unread: d.id === 'd-001' ? 1 : 0 }
  })

  // Suggested rows pulled from creators not yet in active threads
  const activeIds = new Set(threads.map((t) => t.counterparty?.user_id))
  const suggestionPool = (isBrand ? DEMO_CREATORS : DEMO_BRANDS).filter(
    (p) => !activeIds.has(p.user_id),
  )

  const suggestions = [
    { person: suggestionPool[0], action: 'Say hi',  copy: 'Viewed your campaign — say hello' },
    { person: suggestionPool[1], action: 'Pitch',   copy: '87% match · Travel · hasn’t applied yet' },
    { person: suggestionPool[2], action: 'Review',  copy: 'Applied to your open campaign' },
    { person: suggestionPool[3], action: 'View',    copy: 'Fitness · 200K · viewed your profile' },
  ].filter((s) => s.person)

  return (
    <div className="space-y-8">
      {/* Editorial header */}
      <header className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Inbox</p>
        <h1 className="font-display text-[2.6rem] leading-none">Messages</h1>
      </header>

      {/* Active threads */}
      <div className="grid gap-3 stagger">
        {threads.map((t) => (
          <Link
            key={t.dealId}
            to={`/messages/${t.dealId}`}
            className="block rounded-2xl border border-cognac/25 hover:border-cognac/55 transition px-4 py-3.5"
          >
            <div className="flex items-center gap-3.5">
              <Avatar className="h-11 w-11 ring-1 ring-cognac/20 shrink-0">
                <AvatarImage src={t.counterparty?.photo_url || t.counterparty?.logo_url} />
                <AvatarFallback className="font-display bg-cognac/15">
                  {initials(t.counterparty?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-lg leading-none truncate">{t.counterparty?.name}</p>
                  {t.unread > 0 && <span className="dot-hermes shrink-0" />}
                </div>
                <p className="text-xs text-muted truncate mt-1.5">
                  {t.last?.content || 'Tap to start the conversation.'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Suggested divider */}
      {suggestions.length > 0 && (
        <>
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 h-px bg-cognac/20" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Suggested</span>
            <div className="flex-1 h-px bg-cognac/20" />
          </div>

          <div className="grid gap-2.5 stagger">
            {suggestions.map((s, i) => (
              <SuggestionRow key={s.person.user_id} suggestion={s} />
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="text-center pt-4 space-y-1">
        <p className="text-xs text-champagne/85">All caught up</p>
        <p className="text-[11px] text-muted">Messages unlock after a pitch is accepted</p>
      </div>
    </div>
  )
}

function SuggestionRow({ suggestion }) {
  const { person, action, copy } = suggestion
  return (
    <div
      className="flex items-center gap-3.5 rounded-2xl px-4 py-3"
      style={{ border: '1.25px dashed rgba(184, 110, 79, 0.45)' }}
    >
      <Avatar className="h-10 w-10 shrink-0 ring-1 ring-cognac/15">
        <AvatarImage src={person.photo_url || person.logo_url} />
        <AvatarFallback className="font-display bg-cognac/15 text-sm">
          {initials(person.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-display text-base leading-none truncate">{person.name}</p>
        <p className="text-[11px] text-muted mt-1.5 truncate">{copy}</p>
      </div>
      <button
        type="button"
        className="text-[10px] uppercase tracking-[0.22em] text-hermes hover:text-hermes/80 transition shrink-0 inline-flex items-center gap-1.5"
      >
        {action} <span aria-hidden>→</span>
      </button>
    </div>
  )
}

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('')
}
