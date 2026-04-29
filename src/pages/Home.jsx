import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import SmartMatchesStack from '@/components/shared/SmartMatchesStack'
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
      .then((rows) => setMatches(rows.slice(0, 4)))
      .catch((e) => { console.error('match error', e); setMatches([]) })
      .finally(() => setMatching(false))
  }, [profile, isBrand])

  // Activity numbers
  const lookingCount = isBrand ? 9 : 4
  const proposalsCount = 2
  const lookingHref = isBrand ? '/whos-looking' : '/whos-looking'
  const lookingCaption = isBrand ? 'creators viewing you' : 'brands viewing you'
  const viewerNoun = isBrand ? 'creators' : 'brands'

  // Footer "X Fashion brands viewed you but haven't pitched yet"
  const topNiche = (isBrand ? profile?.categories : profile?.niches)?.[0] || 'Fashion'

  return (
    <div className="space-y-10">
      {/* Hero greeting */}
      <header className="pt-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Welcome back</p>
        <h1 className="font-display text-[2.6rem] mt-2 leading-[1.02]">Hi, {greetingName}</h1>
      </header>

      {/* Activity card — single rounded container with two stat sub-cards + footer CTA */}
      <section
        className="rounded-3xl px-5 py-5 space-y-5"
        style={{
          border: '1px solid rgba(142, 74, 47, 0.32)',
          background:
            'radial-gradient(120% 90% at 100% 0%, rgba(168, 85, 57,0.08) 0%, rgba(142, 74, 47,0.04) 50%, transparent 80%), linear-gradient(180deg, rgba(22,16,10,0.4) 0%, rgba(8,8,8,0) 100%)',
        }}
      >
        {/* Eyebrow with hermes dot */}
        <div className="flex items-center gap-2">
          <span className="dot-hermes" />
          <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/80">Your activity today</p>
        </div>

        {/* Two stat tiles */}
        <div className="grid grid-cols-2 gap-3">
          <ActivityTile
            href={lookingHref}
            label="Who's Looking"
            value={lookingCount}
            valueTone="champagne"
            trend="+3 this week"
            caption={lookingCaption}
          />
          <ActivityTile
            href="/missed-opportunities"
            label="Proposals"
            value={proposalsCount}
            valueTone="hermes"
            trend="+2 today"
            caption="new in inbox"
          />
        </div>

        {/* Hairline */}
        <div className="h-px bg-cognac/20" />

        {/* Footer CTA row */}
        <Link
          to="/whos-looking"
          className="flex items-center justify-between gap-3 group"
        >
          <p className="text-[13px] text-creme/90 leading-snug max-w-[70%]">
            <span className="text-creme font-medium">4 {topNiche} {viewerNoun}</span>{' '}
            <span className="text-creme/70">viewed you but haven’t pitched yet</span>
          </p>
          <span className="text-[10px] uppercase tracking-[0.22em] text-hermes shrink-0 inline-flex items-center gap-1.5 group-hover:text-hermes/80 transition">
            Pitch <span aria-hidden>→</span>
          </span>
        </Link>
      </section>

      {/* Smart Matches */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slateblue/80">Curated for you</p>
            <h2 className="font-display text-[2rem] mt-2 leading-none italic font-display-italic text-slateblue">Smart Matches</h2>
          </div>
          <Link to="/discover" className="text-[10px] uppercase tracking-[0.22em] text-hermes hover:text-hermes/80 transition">
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
            variant="creator"
            matches={matches}
            onTap={(c) => nav(`/pitch/${c.creator_id || c.user_id}`)}
          />
        ) : (
          <SmartMatchesStack
            variant="campaign"
            matches={matches}
            onTap={(c) => nav(`/campaigns/${c.campaign_id || c.id}`)}
          />
        )}
      </section>

      {/* Brand Studio CTA — only for brands */}
      {isBrand && (
        <section className="border-t border-cognac/20 pt-9">
          <p className="text-[10px] uppercase tracking-[0.22em] text-slateblue/80">Brand Studio</p>
          <h3 className="font-display text-3xl mt-2 leading-tight max-w-md">Ready to launch?</h3>
          <p className="text-sm text-creme/90 mt-3 max-w-md leading-relaxed">
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

/**
 * Activity tile — flat dark sub-card with eyebrow / big serif number / orange trend / muted caption.
 * Matches the v4 reference's "WHO'S LOOKING / PROPOSALS" pair.
 */
function ActivityTile({ href, label, value, valueTone, trend, caption }) {
  // Both tones now read sage — palette wanted more Ironwood in hero numbers.
  const valueClass = 'text-slateblue'
  return (
    <Link
      to={href}
      className="block rounded-2xl px-4 py-4 transition hover:border-cognac/55"
      style={{
        border: '1px solid rgba(142, 74, 47, 0.28)',
        background: 'rgba(11, 9, 7, 0.55)',
      }}
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/75">{label}</p>
      <p className={`font-display text-[3.4rem] leading-none mt-2.5 ${valueClass}`}>{value}</p>
      <p className="text-[11px] mt-3 text-hermes inline-flex items-center gap-1">
        <span aria-hidden>↑</span>
        <span>{trend}</span>
      </p>
      <p className="text-[11px] text-muted mt-1.5 leading-snug">{caption}</p>
    </Link>
  )
}
