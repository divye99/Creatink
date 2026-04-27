import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CreatorStatCard from '@/components/shared/CreatorStatCard'
import CampaignCard from '@/components/shared/CampaignCard'
import { matchCreatorsForBrand, matchCampaignsForCreator } from '@/lib/match'

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
    <div className="space-y-10">
      <header className="pt-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Welcome back</p>
        <h1 className="font-display text-4xl mt-2">Hi, {greetingName}</h1>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <Link to="/whos-looking" className="block">
          <Card className="cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted">Who's Looking</span>
              <span className="dot-hermes" />
            </div>
            <p className="font-display text-3xl mt-3">{isBrand ? 9 : 4}</p>
            <p className="text-xs text-muted/90 mt-1">
              {isBrand ? 'visiting your campaigns' : 'visiting your profile'}
            </p>
          </Card>
        </Link>
        <Link to="/missed-opportunities" className="block">
          <Card className="cursor-pointer">
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted">Invitations</span>
            <p className="font-display text-3xl mt-3">2</p>
            <p className="text-xs text-muted/90 mt-1">new in your inbox</p>
          </Card>
        </Link>
      </section>

      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Curated for you</p>
            <h2 className="font-display text-2xl mt-1">Smart Matches</h2>
          </div>
          <Link to="/discover" className="text-[11px] uppercase tracking-[0.18em] text-champagne hover:underline">
            See all
          </Link>
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
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">In motion this week</p>
          <h2 className="font-display text-2xl mt-1">Trending</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Beauty','Tech','Food','Travel','Fitness'].map((n, i) => (
            <Badge key={n} variant={i < 2 ? 'hermes' : 'slate'}>{n}</Badge>
          ))}
        </div>
      </section>

      {isBrand && (
        <section>
          <Card variant="paper" className="text-center py-10 px-6">
            <p className="text-[10px] uppercase tracking-[0.22em] text-bg/60">Brand Studio</p>
            <h3 className="font-display text-2xl mt-2 text-bg">Ready to launch?</h3>
            <p className="text-sm text-bg/75 mt-2 max-w-sm mx-auto leading-relaxed">
              Post a brief, get matched with creators in your niche, and run end-to-end.
            </p>
            <Button variant="secondary" className="mt-5" asChild>
              <Link to="/campaigns/new">Create campaign</Link>
            </Button>
          </Card>
        </section>
      )}
    </div>
  )
}
