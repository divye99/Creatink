import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CampaignCard from '@/components/shared/CampaignCard'
import SmartMatchesStack from '@/components/shared/SmartMatchesStack'
import { matchCreatorsForBrand, matchCampaignsForCreator } from '@/lib/match'
import { cn } from '@/lib/utils'

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
      .then((rows) => setMatches(rows.slice(0, 4)))
      .catch((e) => { console.error('match error', e); setMatches([]) })
      .finally(() => setMatching(false))
  }, [profile, isBrand])

  return (
    <div className="space-y-12">
      {/* Hero greeting */}
      <header className="pt-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Welcome back</p>
        <h1 className="font-display text-5xl mt-3 leading-none">Hi, {greetingName}</h1>
      </header>

      {/* Champagne stat tiles */}
      <section className="grid grid-cols-2 gap-3 stagger">
        <Link to="/whos-looking" className="block h-full">
          <Card className="cursor-pointer h-full flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Who's Looking</p>
              <span className="dot-hermes" />
            </div>
            <p className="font-display text-4xl mt-3 leading-none">{isBrand ? 9 : 4}</p>
            <p className="text-[11px] text-muted/85 mt-2 leading-relaxed">
              {isBrand ? 'visiting your campaigns' : 'visiting your profile'}
            </p>
          </Card>
        </Link>
        <Link to="/missed-opportunities" className="block h-full">
          <Card className="cursor-pointer h-full flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Invitations</p>
              <span className="opacity-0 dot-hermes" aria-hidden />
            </div>
            <p className="font-display text-4xl mt-3 leading-none">2</p>
            <p className="text-[11px] text-muted/85 mt-2 leading-relaxed">new in your inbox</p>
          </Card>
        </Link>
      </section>

      {/* Smart Matches — alternating editorial layout */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Curated for you</p>
            <h2 className="font-display text-3xl mt-2 leading-none">Smart Matches</h2>
          </div>
          <Link to="/discover" className="text-[10px] uppercase tracking-[0.22em] text-cognac hover:underline">
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
          <SmartMatchesStack
            matches={matches}
            onTap={(c) => nav(`/pitch/${c.creator_id || c.user_id}`)}
          />
        ) : (
          <div className="space-y-6 stagger">
            {matches.map((c, i) => {
              const flushLeft = i % 2 === 0
              return (
                <div
                  key={c.campaign_id || c.id}
                  className={cn(
                    'max-w-sm transition-transform duration-500',
                    flushLeft ? 'mr-auto' : 'ml-auto',
                  )}
                >
                  <CampaignCard
                    campaign={c}
                    brandName={c.brand_name}
                    onClick={() => nav(`/campaigns/${c.campaign_id || c.id}`)}
                    trending={c.score >= 90}
                  />
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Trending — unboxed */}
      <section>
        <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">In motion this week</p>
        <h2 className="font-display text-3xl mt-2 leading-none">Trending</h2>
        <div className="flex flex-wrap gap-1.5 mt-5">
          {['Beauty','Tech','Food','Travel','Fitness'].map((n, i) => (
            <Badge key={n} variant={i < 2 ? 'hermes' : 'cognac'}>{n}</Badge>
          ))}
        </div>
      </section>

      {/* Brand Studio CTA — only for brands */}
      {isBrand && (
        <section className="border-t border-cognac/20 pt-10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Brand Studio</p>
          <h3 className="font-display text-3xl mt-2 leading-tight max-w-md">Ready to launch?</h3>
          <p className="text-sm text-muted mt-3 max-w-md leading-relaxed">
            Post a brief, get matched with creators in your niche, and run end-to-end.
          </p>
          <Button className="mt-5" asChild>
            <Link to="/campaigns/new">Create campaign</Link>
          </Button>
        </section>
      )}
    </div>
  )
}
