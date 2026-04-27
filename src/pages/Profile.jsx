import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import {
  AvailabilityBadge,
  ContractReadyBadge,
  RegisteredBusinessBadge,
  TaxReadyBadge,
  UnverifiedBadge,
  VerifiedCreatorBadge,
} from '@/components/shared/VerifiedBadges'
import { engagementColor, formatFollowers, formatINR } from '@/lib/utils'

export default function Profile() {
  const { profile, userType, signOut } = useAuth()
  const isCreator = userType === 'creator'

  if (!profile) {
    return <p className="text-muted">Loading profile…</p>
  }

  const taxComplete = isCreator && profile.tax_info?.pan && profile.tax_info?.upi_id
  const contractUploaded = !isCreator && profile.contract_vault_url

  return (
    <div className="space-y-12">
      {/* Hero header */}
      <header className="space-y-5">
        <div className="flex items-start gap-5">
          <Avatar
            className={
              isCreator
                ? 'h-20 w-20 ring-1 ring-cognac/20'
                : 'h-20 w-20 rounded-md ring-1 ring-cognac/20'
            }
          >
            <AvatarImage src={isCreator ? profile.photo_url : profile.logo_url} />
            <AvatarFallback className="text-3xl">{profile.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">
              {isCreator ? 'Creator profile' : 'Brand profile'}
            </p>
            <h1 className="font-display text-5xl mt-2 leading-none truncate">
              {profile.name || 'Your name'}
            </h1>
            {isCreator && profile.handle && (
              <p className="text-sm text-muted mt-2">{profile.handle}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {profile.verified ? (
            isCreator ? <VerifiedCreatorBadge /> : <RegisteredBusinessBadge />
          ) : <UnverifiedBadge />}
          {isCreator && taxComplete && <TaxReadyBadge />}
          {!isCreator && contractUploaded && <ContractReadyBadge />}
          {isCreator && <AvailabilityBadge availability={profile.availability} />}
        </div>

        <div className="flex items-center gap-5 pt-2 border-t border-cognac/20 text-[10px] uppercase tracking-[0.22em]">
          <Link to="/profile/edit" className="text-cognac hover:underline">Edit profile</Link>
          <span className="text-cognac/30">/</span>
          <Link to="/settings" className="text-muted hover:text-cognac transition-colors">Settings</Link>
          <span className="text-cognac/30">/</span>
          <button onClick={signOut} className="text-muted hover:text-cognac transition-colors">Sign out</button>
        </div>
      </header>

      {isCreator ? (
        <CreatorSections profile={profile} taxComplete={taxComplete} />
      ) : (
        <BrandSections profile={profile} contractUploaded={contractUploaded} />
      )}
    </div>
  )
}

/** Unboxed editorial section — no card chrome, just typography on canvas. */
function Section({ eyebrow, title, action, children }) {
  return (
    <section className="border-t border-cognac/15 pt-6">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">{eyebrow}</p>
          <h2 className="font-display text-3xl mt-2 leading-none">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function CreatorSections({ profile, taxComplete }) {
  const pastCollabs = profile.past_collabs?.length
    ? profile.past_collabs
    : MOCK_CREATOR_COLLABS
  const memberSince = profile.created_at
    ? new Date(profile.created_at)
    : new Date('2026-03-01')

  return (
    <>
      <Section eyebrow="At a glance" title="Reach">
        <div className="grid grid-cols-2 divide-x divide-cognac/15">
          <div className="pr-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Followers</p>
            <p className="font-display text-5xl mt-2 leading-none">
              {formatFollowers(profile.follower_count)}
            </p>
          </div>
          <div className="pl-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Engagement</p>
            <p className={`font-display text-5xl mt-2 leading-none ${engagementColor(profile.engagement_rate)}`}>
              {profile.engagement_rate != null ? `${Number(profile.engagement_rate).toFixed(1)}%` : '—'}
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="In their words" title="Bio">
        <p className="text-sm leading-relaxed text-champagne max-w-prose">
          {profile.bio || <span className="italic text-muted">No bio yet.</span>}
        </p>
      </Section>

      <Section eyebrow="Categories" title="Niches">
        <div className="flex flex-wrap gap-1.5">
          {(profile.niches || []).length === 0
            ? <p className="text-sm italic text-muted">No niches selected.</p>
            : profile.niches.map((n) => <Badge key={n} variant="cognac">{n}</Badge>)}
        </div>
      </Section>

      <Section eyebrow="Pricing" title="Rate card">
        <div className="divide-y divide-cognac/15">
          {Object.entries(profile.rate_card || {}).map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between py-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted capitalize">
                {k.replace(/_/g, ' ')}
              </span>
              <span className="font-display text-xl">
                {v ? formatINR(v) : <span className="text-muted/60">—</span>}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="History" title="Past collaborations">
        <CollabList items={pastCollabs} primaryKey="brand" />
      </Section>

      <Section eyebrow="Spoken" title="Languages">
        <div className="flex flex-wrap gap-1.5">
          {(profile.languages || ['English', 'Hindi']).map((l) => (
            <Badge key={l} variant="cognac">{l}</Badge>
          ))}
        </div>
      </Section>

      <Section eyebrow="On Creatink" title="Member since">
        <p className="font-display text-3xl leading-none">
          {memberSince.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted mt-3">{profile.city || 'India'}</p>
      </Section>

      {!taxComplete && (
        <ActionCard
          eyebrow="Required for paid deals"
          title="Complete your tax details"
          body="PAN, UPI, and optional GST are required before you can accept paid partnerships."
          cta="Add tax info"
          to="/profile/edit#tax"
        />
      )}
    </>
  )
}

const MOCK_CREATOR_COLLABS = [
  { brand: 'Saanvi Skincare', campaign: 'Monsoon Glow Launch · Reel × 2',  date: 'Apr 2026' },
  { brand: 'Khoya Kitchen',   campaign: 'Diwali Sweet Box · Stories',       date: 'Nov 2025' },
  { brand: 'Vellum Fitness',  campaign: '90-Day Transformation · YouTube',  date: 'Jul 2025' },
]

const MOCK_BRAND_COLLABS = [
  { creator: 'Aanya Kapoor', campaign: 'Monsoon Glow Launch',  date: 'Apr 2026' },
  { creator: 'Mira Sen',     campaign: 'Diwali Recipe Series',  date: 'Oct 2025' },
  { creator: 'Tara Mehta',   campaign: 'Goa Travel Diary',     date: 'Jun 2025' },
]

function BrandSections({ profile, contractUploaded }) {
  const budgetRange =
    profile.budget_range?.min || profile.budget_range?.max
      ? `${formatINR(profile.budget_range.min || 0)} – ${formatINR(profile.budget_range.max || 0)}`
      : null

  return (
    <>
      <Section eyebrow="The story" title="About">
        <p className="text-sm leading-relaxed text-champagne max-w-prose">
          {profile.description || <span className="italic text-muted">No description yet.</span>}
        </p>
      </Section>

      <Section eyebrow="Categories" title="Verticals">
        <div className="flex flex-wrap gap-1.5">
          {(profile.categories || []).length === 0
            ? <p className="text-sm italic text-muted">No categories selected.</p>
            : profile.categories.map((c) => <Badge key={c} variant="cognac">{c}</Badge>)}
        </div>
      </Section>

      {profile.target_audience && (
        <Section eyebrow="Target audience" title="Customer">
          <p className="text-sm leading-relaxed text-champagne max-w-prose">
            {profile.target_audience}
          </p>
        </Section>
      )}

      {budgetRange && (
        <Section eyebrow="Typical budget" title="Range">
          <p className="font-display text-4xl leading-none">{budgetRange}</p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted mt-3">per campaign</p>
        </Section>
      )}

      <Section
        eyebrow="Compliance"
        title="Contract Vault"
        action={contractUploaded ? <Badge variant="cognac">Uploaded</Badge> : null}
      >
        {contractUploaded ? (
          <p className="text-sm text-champagne leading-relaxed max-w-prose">
            Your standard collaboration contract is on file. Creators acknowledge a copy at deal confirmation.
          </p>
        ) : (
          <div className="space-y-4 max-w-prose">
            <p className="text-sm text-champagne leading-relaxed">
              Upload a contract template to begin paid collaborations. Creators tap-acknowledge it at deal confirmation — not a legal e-signature, just a record of receipt.
            </p>
            <Button size="sm" asChild><Link to="/profile/edit#contract">Upload contract</Link></Button>
          </div>
        )}
      </Section>

      <Section eyebrow="Activity" title="Brand Studio">
        <div className="grid grid-cols-3 gap-2">
          <LeatherStat label="Active" value="3" accent="↗ +1" />
          <LeatherStat label="Completed" value="12" />
          <LeatherStat label="Avg. Rating" value="4.8" />
        </div>
      </Section>

      <Section eyebrow="Past partnerships" title="Featured collaborations">
        <CollabList items={MOCK_BRAND_COLLABS} primaryKey="creator" />
      </Section>

      <Section eyebrow="On Creatink" title="Member since">
        <p className="font-display text-3xl leading-none">March 2026</p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted mt-3">India</p>
      </Section>
    </>
  )
}

function ActionCard({ eyebrow, title, body, cta, to }) {
  return (
    <Card className="border-l-2 border-l-cognac">
      <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">{eyebrow}</p>
      <h3 className="font-display text-2xl mt-2">{title}</h3>
      <p className="text-sm text-cognac/85 mt-3 leading-relaxed">{body}</p>
      <Button size="sm" asChild className="mt-4"><Link to={to}>{cta}</Link></Button>
    </Card>
  )
}

/** Mini leather-gradient stat pill — same material as DynamicStatCard, scaled down. */
function LeatherStat({ label, value, accent }) {
  return (
    <div
      className="relative overflow-hidden p-3 text-champagne flex flex-col"
      style={{
        borderRadius: '14px 2px 14px 2px',
        backgroundImage: 'linear-gradient(135deg, #9C6B47 0%, #7B5232 55%, #5F3E25 100%)',
        boxShadow: '0 10px 24px -16px rgba(139, 94, 60, 0.55)',
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent 0, transparent 6px, #F2E7D3 6px, #F2E7D3 7px)',
        }}
      />
      <p className="relative text-[9px] uppercase tracking-[0.22em] text-champagne/65">{label}</p>
      <p className="relative font-display text-3xl mt-1 leading-none">{value}</p>
      {accent && (
        <p className="relative text-[9px] tracking-[0.18em] uppercase text-hermes/95 mt-2">{accent}</p>
      )}
    </div>
  )
}

/** Editorial divided list with index numerals + hover lift. */
function CollabList({ items, primaryKey }) {
  return (
    <div className="divide-y divide-cognac/15">
      {items.map((it, i) => (
        <div
          key={i}
          className="flex items-baseline justify-between py-3 group transition-all duration-300 hover:pl-2"
        >
          <div className="flex items-baseline gap-3">
            <span className="font-display italic text-[12px] text-cognac/35 tracking-[0.18em] w-6">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="font-display text-lg leading-none">{it[primaryKey]}</p>
              <p className="text-[11px] text-champagne/85 mt-1.5">{it.campaign}</p>
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted shrink-0 ml-3">
            {it.date}
          </span>
        </div>
      ))}
    </div>
  )
}
