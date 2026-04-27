import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_DEALS, DEMO_BRANDS, DEMO_CREATORS, DEMO_MESSAGES } from '@/lib/demoData'
import EmptyState from '@/components/shared/EmptyState'
import { MessageSquare } from 'lucide-react'

export default function Messages() {
  const { userType } = useAuth()

  const threads = DEMO_DEALS.map((d) => {
    const counterparty = userType === 'brand'
      ? DEMO_CREATORS.find((c) => c.user_id === d.creator_id)
      : DEMO_BRANDS.find((b) => b.user_id === d.brand_id)
    const msgs = DEMO_MESSAGES[d.id] || []
    const last = msgs[msgs.length - 1]
    return { dealId: d.id, counterparty, last, unread: d.id === 'd-001' ? 2 : 0 }
  })

  if (threads.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No messages yet"
        description="Chat unlocks once a pitch is mutually accepted."
      />
    )
  }

  return (
    <div className="space-y-4">
      <header><h1 className="font-display text-3xl">Messages</h1></header>
      <div className="grid gap-2 stagger">
        {threads.map((t) => (
          <Link key={t.dealId} to={`/messages/${t.dealId}`}>
            <Card className="flex items-center gap-3 cursor-pointer p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={t.counterparty?.photo_url || t.counterparty?.logo_url} />
                <AvatarFallback>{t.counterparty?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-display text-base truncate">{t.counterparty?.name}</p>
                  {t.unread > 0 && <span className="dot-hermes" />}
                </div>
                <p className="text-xs text-muted truncate">{t.last?.content || 'Tap to start'}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
