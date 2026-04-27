import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DEMO_CAMPAIGNS, DEMO_BRANDS, DEMO_CREATORS } from '@/lib/demoData'
import { useAuth } from '@/contexts/AuthContext'
import { formatINR, dayDelta } from '@/lib/utils'
import { ArrowLeft, Calendar, Tag, Lock, Users } from 'lucide-react'
import CreatorStatCard from '@/components/shared/CreatorStatCard'

export default function CampaignDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { userType } = useAuth()
  const c = DEMO_CAMPAIGNS.find((x) => x.id === id)
  const brand = DEMO_BRANDS.find((b) => b.user_id === c?.brand_id)

  if (!c) {
    return <p className="text-muted">Campaign not found.</p>
  }

  return (
    <div className="space-y-5">
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Card>
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 rounded-md">
            <AvatarImage src={brand?.logo_url} /><AvatarFallback>{brand?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted">{brand?.name}</p>
            <h1 className="font-display text-2xl mt-0.5">{c.title}</h1>
          </div>
        </div>

        <p className="text-sm text-body/90 leading-relaxed mt-4">{c.brief}</p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="rounded-md bg-slateblue/15 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted flex items-center gap-1">
              <Tag className="h-3 w-3" /> Budget
            </div>
            <p className="font-display text-lg mt-1">{c.budget != null ? formatINR(c.budget) : 'Barter'}</p>
          </div>
          <div className="rounded-md bg-slateblue/15 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Timeline
            </div>
            <p className="text-sm mt-1">{c.timeline?.start} → {c.timeline?.end}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {c.deliverables.map((d) => <Badge key={d} variant="cognac">{d}</Badge>)}
          {c.exclusivity && <Badge variant="warning"><Lock className="h-3 w-3" /> Exclusive</Badge>}
        </div>

        <div className="mt-5 flex gap-2">
          {userType === 'creator' && (
            <Button asChild className="flex-1"><Link to={`/pitch/${c.brand_id}`}>Apply with pitch</Link></Button>
          )}
          {userType === 'brand' && (
            <Button asChild className="flex-1"><Link to="/discover">Find creators</Link></Button>
          )}
          <Button variant="outline" asChild>
            <Link to={`/campaigns/${id}/applicants`}>Applicants</Link>
          </Button>
        </div>

        <p className="text-xs text-muted mt-4">Posted {dayDelta(c.created_at)}</p>
      </Card>

      <section>
        <h2 className="font-display text-xl flex items-center gap-2 mb-3">
          <Users className="h-5 w-5 text-cognac" /> Suggested creators
        </h2>
        <div className="grid gap-3">
          {DEMO_CREATORS.slice(0, 3).map((cr) => (
            <CreatorStatCard key={cr.user_id} creator={cr} onClick={() => nav(`/pitch/${cr.user_id}`)} />
          ))}
        </div>
      </section>
    </div>
  )
}
