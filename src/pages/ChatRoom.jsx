import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Paperclip, Send, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_DEALS, DEMO_BRANDS, DEMO_CREATORS, DEMO_MESSAGES } from '@/lib/demoData'
import { cn, dayDelta } from '@/lib/utils'

export default function ChatRoom() {
  const { dealId } = useParams()
  const nav = useNavigate()
  const { userType, profile } = useAuth()

  const deal = DEMO_DEALS.find((d) => d.id === dealId)
  const counterparty = deal && (userType === 'brand'
    ? DEMO_CREATORS.find((c) => c.user_id === deal.creator_id)
    : DEMO_BRANDS.find((b) => b.user_id === deal.brand_id))

  const [msgs, setMsgs] = useState(DEMO_MESSAGES[dealId] || [])
  const [text, setText] = useState('')

  const me = userType === 'brand' ? deal?.brand_id : deal?.creator_id

  const send = () => {
    if (!text.trim()) return
    setMsgs((m) => [...m, {
      id: 'm' + Date.now(), deal_id: dealId, sender_id: me,
      content: text, created_at: new Date().toISOString(),
    }])
    setText('')
  }

  if (!deal) return <p className="text-muted">Conversation not found.</p>

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)]">
      <header className="flex items-center gap-3 pb-3 border-b border-border">
        <button onClick={() => nav(-1)} className="text-muted hover:text-body"><ArrowLeft className="h-5 w-5" /></button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={counterparty?.photo_url || counterparty?.logo_url} />
          <AvatarFallback>{counterparty?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-display text-base">{counterparty?.name}</p>
          <p className="text-xs text-muted">Deal · ₹{deal.terms.amount.toLocaleString('en-IN')}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        <div className="rounded-md bg-card border border-border p-3 text-xs text-muted flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 mt-0.5 text-warning shrink-0" />
          <span>Personal contact details are hidden by both parties unless explicitly shared in this chat.</span>
        </div>

        {msgs.map((m) => {
          const mine = m.sender_id === me
          return (
            <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                  mine ? 'bg-cognac text-champagne' : 'bg-card border border-border'
                )}
              >
                {m.attachment_url && (
                  <p className="text-xs mb-1 opacity-80 underline">{m.attachment_url.split('/').pop()}</p>
                )}
                <p>{m.content}</p>
                <p className={cn('text-[10px] mt-1', mine ? 'text-champagne/70' : 'text-muted')}>{dayDelta(m.created_at)}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-3 border-t border-border flex items-center gap-2">
        <button className="text-muted hover:text-body p-2"><Paperclip className="h-4 w-4" /></button>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Write a message…"
        />
        <Button size="icon" onClick={send}><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  )
}
