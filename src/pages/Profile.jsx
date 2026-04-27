import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import {
  AvailabilityBadge,
  CastinkLinkedBadge,
  ContractReadyBadge,
  RegisteredBusinessBadge,
  TaxReadyBadge,
  UnverifiedBadge,
  VerifiedCreatorBadge,
} from '@/components/shared/VerifiedBadges'
import { engagementColor, formatFollowers, formatINR } from '@/lib/utils'
import { Edit, LogOut, Settings, Users, TrendingUp, ReceiptText, FileSignature } from 'lucide-react'

export default function Profile() {
  const { profile, userType, signOut } = useAuth()
  const isCreator = userType === 'creator'

  if (!profile) {
    return <p className="text-muted">Loading profile…</p>
  }

  const taxComplete = isCreator && profile.tax_info?.pan && profile.tax_info?.upi_id
  const contractUploaded = !isCreator && profile.contract_vault_url

  return (
    <div className="space-y-5">
      <header className="flex items-start gap-4">
        <Avatar className={isCreator ? 'h-20 w-20' : 'h-20 w-20 rounded-md'}>
          <AvatarImage src={isCreator ? profile.photo_url : profile.logo_url} />
          <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl truncate">{profile.name || 'Your name'}</h1>
          {isCreator && profile.handle && <p className="text-sm text-muted">{profile.handle}</p>}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {profile.verified ? (
              isCreator ? <VerifiedCreatorBadge /> : <RegisteredBusinessBadge />
            ) : <UnverifiedBadge />}
            {isCreator && taxComplete && <TaxReadyBadge />}
            {!isCreator && contractUploaded && <ContractReadyBadge />}
            {isCreator && profile.castink_linked && <CastinkLinkedBadge />}
          </div>
        </div>
      </header>

      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1"><Link to="/profile/edit"><Edit className="h-4 w-4" />Edit</Link></Button>
        <Button asChild variant="outline" size="sm" className="flex-1"><Link to="/settings"><Settings className="h-4 w-4" />Settings</Link></Button>
        <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
      </div>

      {isCreator ? (
        <>
          <section className="grid grid-cols-2 gap-3">
            <Card>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted">
                <Users className="h-3 w-3" /> Followers
              </div>
              <p className="font-display text-3xl mt-1">{formatFollowers(profile.follower_count)}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted">
                <TrendingUp className="h-3 w-3" /> Engagement
              </div>
              <p className={`font-display text-3xl mt-1 ${engagementColor(profile.engagement_rate)}`}>
                {profile.engagement_rate != null ? `${Number(profile.engagement_rate).toFixed(1)}%` : '—'}
              </p>
            </Card>
          </section>

          <Card>
            <p className="text-sm text-muted">Bio</p>
            <p className="text-sm mt-1 leading-relaxed">{profile.bio || 'No bio yet.'}</p>
          </Card>

          <Card>
            <p className="text-sm text-muted mb-2">Niches</p>
            <div className="flex flex-wrap gap-1.5">
              {(profile.niches || []).map((n) => <Badge key={n} variant="slate">{n}</Badge>)}
            </div>
          </Card>

          <Card>
            <p className="text-sm text-muted mb-2 flex items-center gap-1.5"><AvailabilityBadge availability={profile.availability} /></p>
            <h3 className="font-display text-lg">Rate card</h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {Object.entries(profile.rate_card || {}).map(([k, v]) => (
                <li key={k} className="flex justify-between border-b border-border/50 py-1.5 last:border-0">
                  <span className="capitalize text-muted">{k.replace(/_/g, ' ')}</span>
                  <span>{v ? formatINR(v) : '—'}</span>
                </li>
              ))}
            </ul>
          </Card>

          {!taxComplete && (
            <Card className="border-warning/40">
              <div className="flex items-start gap-3">
                <ReceiptText className="h-5 w-5 text-warning mt-0.5" />
                <div className="flex-1">
                  <p className="font-display">Complete your tax details to accept paid partnerships.</p>
                  <p className="text-xs text-muted mt-1">PAN, UPI, and optional GST are required for payouts.</p>
                  <Button size="sm" asChild className="mt-3"><Link to="/profile/edit#tax">Add tax info</Link></Button>
                </div>
              </div>
            </Card>
          )}
        </>
      ) : (
        <>
          <Card>
            <p className="text-sm text-muted">About</p>
            <p className="text-sm mt-1 leading-relaxed">{profile.description || 'No description yet.'}</p>
          </Card>
          <Card>
            <p className="text-sm text-muted mb-2">Categories</p>
            <div className="flex flex-wrap gap-1.5">
              {(profile.categories || []).map((c) => <Badge key={c} variant="slate">{c}</Badge>)}
            </div>
          </Card>
          {!contractUploaded && (
            <Card className="border-warning/40">
              <div className="flex items-start gap-3">
                <FileSignature className="h-5 w-5 text-warning mt-0.5" />
                <div className="flex-1">
                  <p className="font-display">Upload a contract template to begin paid collaborations.</p>
                  <Button size="sm" asChild className="mt-3"><Link to="/profile/edit#contract">Upload contract</Link></Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
