import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { engagementColor, formatFollowers, formatINR, cn } from '@/lib/utils'
import { FileText } from 'lucide-react'

export default function Profile() {
  const { profile, userType, signOut, updateProfile } = useAuth()
  const isCreator = userType === 'creator'

  if (!profile) {
    return <p className="text-muted">Loading profile…</p>
  }

  const taxComplete = isCreator && profile.tax_info?.pan && profile.tax_info?.upi_id
  const contractUploaded = !isCreator && profile.contract_vault_url
  const verified = profile.verified

  return (
    <div className="space-y-10">
      {/* Editorial hero — avatar + brand-profile eyebrow + serif name */}
      <header className="space-y-5">
        <div className="flex items-start gap-5">
          <Avatar
            className={
              isCreator
                ? 'h-16 w-16 ring-1 ring-cognac/30 shrink-0'
                : 'h-16 w-16 rounded-xl ring-1 ring-cognac/30 shrink-0 bg-gradient-to-br from-cognac/40 to-cognac/10'
            }
          >
            <AvatarImage src={isCreator ? profile.photo_url : profile.logo_url} />
            <AvatarFallback className="text-2xl font-display bg-transparent">{profile.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">
              {isCreator ? 'Creator profile' : 'Brand profile'}
            </p>
            <h1 className="font-display text-[2.6rem] mt-1.5 leading-[1] truncate">
              {profile.name || 'Your name'}
            </h1>
            {isCreator && profile.handle && (
              <p className="text-sm text-muted mt-2">{profile.handle}</p>
            )}
          </div>
        </div>

        {/* Verification status pill — full-width orange-tinted on unverified */}
        {!verified ? (
          <div
            className="flex items-center gap-2.5 rounded-full px-4 py-2.5 border border-hermes/40"
            style={{
              background:
                'radial-gradient(120% 200% at 0% 50%, rgba(142, 74, 47,0.18) 0%, rgba(142, 74, 47,0.06) 60%, transparent 100%)',
            }}
          >
            <span className="dot-urgent" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-hermes">
              Unverified — complete your profile
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-full px-4 py-2.5 border border-slateblue/40 bg-slateblue/10">
            <span className="h-1.5 w-1.5 rounded-full bg-slateblue" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-slateblue">
              {isCreator ? 'Verified creator' : 'Registered business'}
            </span>
          </div>
        )}

        {/* Action pill row */}
        <div className="grid grid-cols-3 gap-2">
          <PillButton to="/profile/edit">Edit profile</PillButton>
          <PillButton to="/settings">Settings</PillButton>
          <PillButton onClick={signOut}>Sign out</PillButton>
        </div>
      </header>

      {isCreator ? (
        <CreatorSections profile={profile} taxComplete={taxComplete} updateProfile={updateProfile} />
      ) : (
        <BrandSections profile={profile} contractUploaded={contractUploaded} />
      )}
    </div>
  )
}

/** Unboxed editorial section — no card chrome, just typography on canvas. */
function Section({ eyebrow, title, action, tone = 'clay', children }) {
  const toneClass = tone === 'sage' ? 'text-slateblue/80' : 'text-cognac/70'
  return (
    <section className="border-t border-cognac/15 pt-6">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className={`text-[10px] uppercase tracking-[0.22em] ${toneClass}`}>{eyebrow}</p>
          <h2 className="font-display text-3xl mt-2 leading-none">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function CreatorSections({ profile, taxComplete, updateProfile }) {
  const pastCollabs = profile.past_collabs?.length
    ? profile.past_collabs
    : MOCK_CREATOR_COLLABS
  const memberSince = profile.created_at
    ? new Date(profile.created_at)
    : new Date('2026-03-01')

  const showPastCollabs = profile.show_past_collabs !== false
  const togglePastCollabs = (v) => updateProfile?.({ show_past_collabs: v })

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

      <Section eyebrow="In their words" title="Bio" tone="sage">
        <p className="text-sm leading-relaxed text-creme/95 max-w-prose">
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

      <Section eyebrow="Activity" title="Creator Studio" tone="sage">
        <div className="grid grid-cols-3 gap-2">
          <LeatherStat label="Active" value="2" accent="↗ +1" />
          <LeatherStat label="Completed" value="9" />
          <LeatherStat label="Avg. Rating" value="4.9" />
        </div>
      </Section>

      <Section
        eyebrow="History"
        title="Past collaborations"
        action={
          <label className="flex items-center gap-2.5 cursor-pointer">
            <span className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">
              {showPastCollabs ? 'Visible to brands' : 'Hidden from brands'}
            </span>
            <Switch checked={showPastCollabs} onCheckedChange={togglePastCollabs} />
          </label>
        }
      >
        {showPastCollabs ? (
          <CollabList items={pastCollabs} primaryKey="brand" />
        ) : (
          <p className="text-sm italic text-muted">
            Hidden from brands. Toggle on to share your collaboration history.
          </p>
        )}
      </Section>

      <Section eyebrow="Spoken" title="Languages" tone="sage">
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
  const memberSince = profile.created_at
    ? new Date(profile.created_at)
    : new Date('2026-03-01')
  const memberLabel = memberSince.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })

  const campaignCount = profile.active_campaigns ?? 0
  const creatorCount = profile.connected_creators ?? 0

  const budgetMid = profile.budget_range?.min ?? 0
  const selectedBudget = pickBudgetBand(budgetMid, profile.budget_range?.max ?? 0)

  return (
    <>
      {/* At a glance — three pills */}
      <PillSection eyebrow="At a glance">
        <StatPill value={campaignCount} label="Campaigns" />
        <StatPill value={creatorCount} label="Creators" />
        <StatPill value={`Since ${memberLabel}`} />
      </PillSection>

      {/* About */}
      <EyebrowSection eyebrow="About" tone="sage">
        <p className="text-base leading-relaxed text-creme/95">
          {profile.description || <span className="italic text-muted">No description yet.</span>}
        </p>
      </EyebrowSection>

      {/* Categories */}
      <EyebrowSection eyebrow="Categories">
        <div className="flex flex-wrap gap-2">
          {(profile.categories || []).length === 0
            ? <p className="text-sm italic text-muted">No categories selected.</p>
            : profile.categories.map((c) => <CategoryPill key={c}>{c}</CategoryPill>)}
        </div>
      </EyebrowSection>

      {/* Typical budget — selectable pill row */}
      <EyebrowSection eyebrow="Typical budget" tone="sage">
        <div className="flex flex-wrap gap-2">
          {BUDGET_BANDS.map((b) => (
            <BudgetPill key={b.label} active={b.label === selectedBudget}>{b.label}</BudgetPill>
          ))}
        </div>
      </EyebrowSection>

      {/* Open campaigns — dotted-border empty state */}
      <EyebrowSection eyebrow="Open campaigns">
        <div
          className="rounded-2xl px-6 py-7 text-center"
          style={{
            border: '1.5px dashed rgba(168, 85, 57, 0.45)',
          }}
        >
          <p className="text-sm text-creme/90">No campaigns yet.</p>
          <p className="text-sm text-creme/75 mt-1">Post a brief to start finding creators.</p>
          <Link
            to="/campaigns/new"
            className="inline-flex items-center justify-center mt-5 rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-hermes border border-hermes/45 hover:bg-hermes/10 transition"
          >
            + Post a brief
          </Link>
        </div>
      </EyebrowSection>

      {/* Compliance — Contract Vault row */}
      <EyebrowSection eyebrow="Compliance" tone="sage">
        <div className="flex items-center gap-3 rounded-2xl border border-cognac/25 px-4 py-3.5">
          <div className="h-10 w-10 rounded-md bg-cognac/15 border border-cognac/25 flex items-center justify-center shrink-0">
            <FileText className="h-4.5 w-4.5 text-champagne/80" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-lg leading-none">Contract Vault</p>
            <p className="text-xs text-muted mt-1.5">
              {contractUploaded ? 'On file — creators acknowledge at deal confirmation' : 'Upload to unlock paid deals'}
            </p>
          </div>
          <Link
            to="/profile/edit#contract"
            className="rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-champagne border border-cognac/40 hover:border-cognac/80 transition shrink-0"
          >
            {contractUploaded ? 'Replace' : 'Upload'}
          </Link>
        </div>
      </EyebrowSection>

      {/* Activity */}
      <EyebrowSection eyebrow="Activity">
        <div className="grid grid-cols-3 gap-2">
          <LeatherStat label="Active" value="3" accent="↗ +1" />
          <LeatherStat label="Completed" value="12" />
          <LeatherStat label="Avg. Rating" value="4.8" />
        </div>
      </EyebrowSection>

      {/* Past partnerships */}
      <EyebrowSection eyebrow="Past partnerships" tone="sage">
        <CollabList items={MOCK_BRAND_COLLABS} primaryKey="creator" />
      </EyebrowSection>
    </>
  )
}

const BUDGET_BANDS = [
  { label: 'Under ₹50K',  min: 0,        max: 50000 },
  { label: '₹50K–₹2L',    min: 50000,    max: 200000 },
  { label: '₹2L–₹10L',    min: 200000,   max: 1000000 },
  { label: '₹10L+',        min: 1000000,  max: Infinity },
]

function pickBudgetBand(min, max) {
  const mid = max ? (min + max) / 2 : min
  if (!mid) return '₹50K–₹2L'
  if (mid < 50000) return 'Under ₹50K'
  if (mid < 200000) return '₹50K–₹2L'
  if (mid < 1000000) return '₹2L–₹10L'
  return '₹10L+'
}

/** Editorial section — small caps eyebrow above flat content (no card chrome). */
function EyebrowSection({ eyebrow, tone = 'clay', children }) {
  const toneClass = tone === 'sage' ? 'text-slateblue/80' : 'text-cognac/70'
  return (
    <section className="space-y-3.5">
      <p className={`text-[10px] uppercase tracking-[0.22em] ${toneClass}`}>{eyebrow}</p>
      {children}
    </section>
  )
}

/** Same idea but for inline pill row. */
function PillSection({ eyebrow, tone = 'clay', children }) {
  const toneClass = tone === 'sage' ? 'text-slateblue/80' : 'text-cognac/70'
  return (
    <section className="space-y-3.5">
      <p className={`text-[10px] uppercase tracking-[0.22em] ${toneClass}`}>{eyebrow}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  )
}

function StatPill({ value, label }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-full border border-cognac/30 bg-cognac/5 px-3.5 py-1.5">
      <span className="font-display text-[15px] leading-none text-champagne">{value}</span>
      {label && <span className="text-[11px] text-muted">{label}</span>}
    </span>
  )
}

function CategoryPill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-cognac/35 px-3.5 py-1.5 text-[12px] text-champagne">
      {children}
    </span>
  )
}

function BudgetPill({ active, children }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center rounded-full px-3.5 py-1.5 text-[12px] transition',
        active
          ? 'border border-slateblue/55 bg-slateblue/15 text-creme'
          : 'border border-slateblue/30 bg-transparent text-creme/85 hover:border-slateblue/60'
      )}
    >
      {children}
    </button>
  )
}

function PillButton({ to, onClick, children }) {
  const cls =
    'inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-champagne border border-cognac/30 hover:border-cognac/70 transition'
  return to ? (
    <Link to={to} className={cls}>{children}</Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>{children}</button>
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

/** Glowy editorial stat tile — matches the Home Activity card pattern.
 *  Mesa Clay border + dark translucent base + soft Mesa Clay radial glow. */
function LeatherStat({ label, value, accent }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-3.5 flex flex-col transition hover:border-cognac/55"
      style={{
        border: '1px solid rgba(168, 85, 57, 0.30)',
        background:
          'radial-gradient(120% 110% at 100% 0%, rgba(142, 74, 47, 0.10) 0%, rgba(168, 85, 57, 0.05) 55%, transparent 85%), rgba(11, 9, 7, 0.55)',
      }}
    >
      <p className="text-[9px] uppercase tracking-[0.22em] text-cognac/75">{label}</p>
      <p className="font-display text-[2rem] leading-none mt-2 text-slateblue">{value}</p>
      {accent && (
        <p className="text-[9px] tracking-[0.18em] uppercase text-hermes mt-2.5 inline-flex items-center gap-1">
          {accent}
        </p>
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
              <p className="text-[11px] text-creme/85 mt-1.5">{it.campaign}</p>
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
