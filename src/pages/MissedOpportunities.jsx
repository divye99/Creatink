import { useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_MISSED, DEMO_BRANDS } from '@/lib/demoData'
import { ArrowLeft, Inbox } from 'lucide-react'

export default function MissedOpportunities() {
  const nav = useNavigate()
  const { userType } = useAuth()

  return (
    <div className="space-y-5">
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <header>
        <h1 className="font-display text-3xl flex items-center gap-2"><Inbox className="h-7 w-7 text-cognac" />
          {userType === 'brand' ? "Creator Outreach You Missed" : "Missed Opportunities"}
        </h1>
        <p className="text-sm text-muted mt-1">AI-summarised collaboration emails. Raw email content is never stored.</p>
      </header>

      <div className="grid gap-3">
        {DEMO_MISSED.map((m) => {
          const brand = DEMO_BRANDS.find((b) => b.user_id === m.creatink_profile_id)
          return (
            <Card key={m.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">{m.sender_name}</p>
                  <h3 className="font-display text-lg">{m.brand_name}</h3>
                </div>
                <p className="text-xs text-muted">{m.date_received}</p>
              </div>
              <p className="text-sm text-body/90 leading-relaxed">{m.summary}</p>
              <div className="flex items-center gap-2">
                {brand ? (
                  <>
                    <Badge variant="success">On Creatink</Badge>
                    <Button asChild size="sm" className="ml-auto">
                      <Link to={`/pitch/${brand.user_id}`}>Pitch now</Link>
                    </Button>
                  </>
                ) : (
                  <Badge variant="muted">Not yet on Creatink</Badge>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
