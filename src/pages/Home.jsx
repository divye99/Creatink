import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CreatorStatCard from '@/components/shared/CreatorStatCard'
import CampaignCard from '@/components/shared/CampaignCard'
import { matchCreatorsForBrand, matchCampaignsForCreator } from '@/lib/match'
import { Sparkles, TrendingUp, Eye, Inbox } from 'lucide-react'

export default function Home() {
  const { profile, userType } = useAuth()
  const nav = useNavigate()

  const isBrand = userType === 'brand'
  const greetingName = profile?.name?.split(' ')[0] || 'there'

  const [matches, setMatches] = useState([])
  const [matching, setMatching] = useState(false)

  useEffect(() => {
    if (!profile) return
    const id = profile.user_id || profile.id
    setMatching(true)
    const fetcher = isBrand
      ? matchCreatorsForBrand(id, profile.categories || [])
      : matchCampaignsForCreator(id, profile.niches || [])
    fetcher
      .then((rows) => setMatches(rows.slice(0, 3)))
      .catch((e) => { console.error('match error', e); setMatches([]) })
      .finally(() => setMatching(false))
  }, [profile, isBrand])

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-muted">Welcome back</p>
        <h1 className="font-display text-3xl mt-1">Hi, {greetingName}</h1>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <Link to="/whos-looking" className="block">
          <Card className="cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-wider">
                <Eye className="h-3.5 w-3.5" /> Who's Looking
              </div>
              <span className="dot-hermes" />
            </div>
            <p className="font-display text-2xl mt-2">{isBrand ? 9 : 4}</p>
            <p className="text-xs text-muted">{isBrand ? 'creators viewed your campaigns' : 'brands viewed your profile'}</p>
          </Card>
        </Link>
        <Link to="/missed-opportunities" className="block">
          <Card className="cursor-pointer">
            <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-wider">
              <Inbox className="h-3.5 w-3.5" /> Missed
            </div>
            <p className="font-display text-2xl mt-2">2</p>
            <p className="text-xs text-muted">opportunities found in email</p>
          </Card>
        </Link>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cognac" /> Smart Matches
          </h2>
          <Link to="/discover" className="text-xs text-champagne">See all</Link>
        </div>

        {matching && matches.length === 0 ? (
          <p className="text-xs text-muted">Finding your best matches…</p>
        ) : matches.length === 0 ? (
          <p className="text-xs text-muted">
            {isBrand
              ? 'Add categories to your brand profile to see matched creators.'
              : 'Add niches to your profile to see matched campaigns.'}
          </p>
        ) : isBrand ? (
          <div className="grid gap-3">
            {matches.map((c) => (
              <CreatorStatCard
                key={c.creator_id || c.user_id}
                creator={c}
                onClick={() => nav(`/pitch/${c.creator_id || c.user_id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {matches.map((c) => (
              <CampaignCard
                key={c.campaign_id || c.id}
                campaign={c}
                brandName={c.brand_name}
                onClick={() => nav(`/campaigns/${c.campaign_id || c.id}`)}
                trending={c.score >= 90}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cognac" /> Trending Niches
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Beauty','Tech','Food','Travel','Fitness'].map((n, i) => (
            <Badge key={n} variant={i < 2 ? 'hermes' : 'slate'}>
              {n} {i < 2 && '· hot'}
            </Badge>
          ))}
        </div>
      </section>

      {isBrand && (
        <section>
          <Card className="bg-gradient-to-br from-card to-cognac/10">
            <h3 className="font-display text-lg">Ready to launch a campaign?</h3>
            <p className="text-sm text-muted mt-1">
              Post a brief, get matched with creators in your niche, and run end-to-end on Creatink.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/campaigns/new">Create campaign</Link>
            </Button>
          </Card>
        </section>
      )}
    </div>
  )
}
