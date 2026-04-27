import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_PROFILE_VIEWS_CR_001, DEMO_BRANDS, DEMO_CREATORS } from '@/lib/demoData'
import { ArrowLeft, Eye } from 'lucide-react'

export default function WhosLooking() {
  const nav = useNavigate()
  const { userType } = useAuth()
  const [window, setWindow] = useState('30')

  const isCreator = userType === 'creator'
  const items = isCreator
    ? DEMO_PROFILE_VIEWS_CR_001
    : DEMO_CREATORS.slice(0, 5).map((c, i) => ({ creator: c, count: 5 - i, last: '2026-04-25' }))

  const insight = isCreator
    ? `${items.length} brands viewed your profile in the last ${window} days but haven't reached out.`
    : `${items.length} creators viewed your campaigns this week but haven't applied.`

  return (
    <div className="space-y-5">
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <header>
        <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Mutual opt-in</p>
        <h1 className="font-display text-4xl mt-1">Who's Looking</h1>
        <p className="text-sm text-muted mt-2 leading-relaxed">Data shown only when both parties have enabled this feature.</p>
      </header>

      <Card className="bg-gradient-to-br from-card to-cognac/15">
        <p className="text-sm">{insight}</p>
      </Card>

      <Tabs value={window} onValueChange={setWindow}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="30">30 days</TabsTrigger>
          <TabsTrigger value="60">60 days</TabsTrigger>
          <TabsTrigger value="90">90 days</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-3">
        {items.map((row, idx) => {
          const target = row.brand || row.creator
          return (
            <Card key={idx} className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={target?.logo_url || target?.photo_url} />
                <AvatarFallback>{target?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base truncate">{target?.name}</p>
                <p className="text-xs text-muted">{row.count} views · last {row.last}</p>
              </div>
              <Badge variant="cognac">{row.count}×</Badge>
              <Button asChild size="sm">
                <Link to={`/pitch/${target?.user_id}`}>{isCreator ? 'Send Pitch' : 'Invite to Apply'}</Link>
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
