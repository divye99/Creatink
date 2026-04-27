import { Card } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare, IndianRupee, Eye, Sparkles } from 'lucide-react'

const ITEMS = [
  { id: 1, icon: MessageSquare, title: 'Saanvi Skincare sent you a pitch', meta: '2h ago', unread: true },
  { id: 2, icon: IndianRupee,   title: 'Payment of ₹14,000 was released', meta: '6h ago', unread: true },
  { id: 3, icon: Eye,           title: '4 new brands viewed your profile', meta: 'yesterday' },
  { id: 4, icon: Sparkles,      title: '2 new campaigns match your niche', meta: '2d ago' },
]

export default function Notifications() {
  const nav = useNavigate()
  return (
    <div className="space-y-5">
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="font-display text-3xl">Notifications</h1>
      <div className="grid gap-2">
        {ITEMS.map(({ id, icon: Icon, title, meta, unread }) => (
          <Card key={id} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-bg/40 flex items-center justify-center text-cognac">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{title}</p>
              <p className="text-xs text-muted">{meta}</p>
            </div>
            {unread && <span className="dot-hermes" />}
          </Card>
        ))}
      </div>
    </div>
  )
}
