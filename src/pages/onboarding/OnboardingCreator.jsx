import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { NICHES } from '@/lib/utils'
import { connectInstagram, connectYouTube, connectTwitter } from '@/lib/oauth'
import { Instagram, Youtube, Twitter, Camera, Check, ArrowRight, ArrowLeft } from 'lucide-react'

const STEPS = ['Connect', 'Niches', 'Photo', 'Rates', 'Bio']

export default function OnboardingCreator() {
  const nav = useNavigate()
  const { session, completeSignup } = useAuth()
  const phone = session?.user?.phone || ''

  const [step, setStep] = useState(0)
  const [oauth, setOauth] = useState({ instagram: null, youtube: null, twitter: null })
  const [busyPlatform, setBusyPlatform] = useState(null)
  const [niches, setNiches] = useState([])
  const [photo, setPhoto] = useState(null)
  const [rates, setRates] = useState({ reel: '', story: '', static_post: '', youtube_video: '', custom_package: '' })
  const [availability, setAvailability] = useState('available')
  const [bio, setBio] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  const totalConnected = Object.values(oauth).filter(Boolean).length
  const followerSum = Object.values(oauth).reduce((s, x) => s + (x?.follower_count || 0), 0)
  const engAvg = totalConnected
    ? Object.values(oauth).filter(Boolean).reduce((s, x) => s + x.engagement_rate, 0) / totalConnected
    : 0

  const handleConnect = async (platform) => {
    setBusyPlatform(platform)
    const fn = { instagram: connectInstagram, youtube: connectYouTube, twitter: connectTwitter }[platform]
    const data = await fn()
    setOauth((o) => ({ ...o, [platform]: data }))
    setBusyPlatform(null)
  }

  const toggleNiche = (n) => {
    setNiches((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]))
  }

  const onPhoto = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(f)
  }

  const canAdvance = () => {
    if (step === 0) return totalConnected >= 1 && name.trim().length > 1
    if (step === 1) return niches.length >= 1
    if (step === 2) return Boolean(photo)
    if (step === 3) return Object.values(rates).some(Boolean)
    if (step === 4) return bio.trim().length > 0
    return true
  }

  const handleFinish = async () => {
    setBusy(true)
    const handle =
      oauth.instagram?.handle || oauth.youtube?.handle || oauth.twitter?.handle || null
    await completeSignup({
      phone,
      user_type: 'creator',
      name,
      handle,
      photo_url: photo,
      bio,
      niches,
      follower_count: followerSum,
      engagement_rate: Number(engAvg.toFixed(2)),
      rate_card: Object.fromEntries(
        Object.entries(rates).map(([k, v]) => [k, v ? Number(v) : null])
      ),
      availability,
      oauth_handles: Object.fromEntries(
        Object.entries(oauth).filter(([, v]) => v).map(([k, v]) => [k, v.handle])
      ),
    })
    setBusy(false)
    nav('/home', { replace: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">Step {step + 1} of {STEPS.length}</p>
        <h1 className="font-display text-2xl mt-1">{STEPS[step]}</h1>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mt-3" />
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <Card>
            <Label>Your name (as shown on profile)</Label>
            <Input className="mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aanya Kapoor" />
          </Card>

          <Card>
            <p className="text-sm text-body">Connect at least one platform to verify your reach.</p>
            <div className="grid gap-3 mt-4">
              {[
                { k: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400' },
                { k: 'youtube',   label: 'YouTube',   icon: Youtube,   color: 'text-red-400' },
                { k: 'twitter',   label: 'Twitter',   icon: Twitter,   color: 'text-sky-400' },
              ].map(({ k, label, icon: Icon, color }) => (
                <button
                  key={k}
                  onClick={() => handleConnect(k)}
                  disabled={busyPlatform === k}
                  className="flex items-center justify-between p-3 rounded-md border border-border hover:border-cognac/60 transition"
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className="text-sm">{label}</span>
                  </span>
                  {oauth[k] ? (
                    <span className="flex items-center gap-2 text-success text-xs">
                      <Check className="h-4 w-4" /> {oauth[k].handle} · {oauth[k].follower_count.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-xs text-cognac">{busyPlatform === k ? 'Connecting…' : 'Connect'}</span>
                  )}
                </button>
              ))}
            </div>
            {totalConnected > 0 && (
              <div className="mt-4 p-3 rounded-md bg-slateblue/15 text-sm flex items-center justify-between">
                <span className="text-muted">Total reach</span>
                <span className="font-display text-lg">{followerSum.toLocaleString('en-IN')} · {engAvg.toFixed(1)}%</span>
              </div>
            )}
          </Card>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="text-sm text-muted mb-4">Pick all that apply. This drives your match suggestions.</p>
          <div className="flex flex-wrap gap-2">
            {NICHES.map((n) => (
              <Chip key={n} active={niches.includes(n)} onClick={() => toggleNiche(n)}>{n}</Chip>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <Card className="text-center py-10">
          <label htmlFor="photo" className="cursor-pointer inline-flex flex-col items-center gap-3">
            {photo ? (
              <img src={photo} alt="" className="h-32 w-32 rounded-full object-cover ring-2 ring-champagne" />
            ) : (
              <div className="h-32 w-32 rounded-full bg-slateblue/15 border-2 border-dashed border-border flex items-center justify-center">
                <Camera className="h-8 w-8 text-muted" />
              </div>
            )}
            <span className="text-sm text-cognac">{photo ? 'Change photo' : 'Upload profile photo'}</span>
            <input id="photo" type="file" accept="image/*" className="hidden" onChange={onPhoto} />
          </label>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <p className="text-sm text-muted">Set your rate card in INR. Leave blank what doesn't apply.</p>
          {[
            ['reel', 'Reel'], ['story', 'Story'], ['static_post', 'Static Post'],
            ['youtube_video', 'YouTube Video'], ['custom_package', 'Custom Package'],
          ].map(([k, label]) => (
            <div key={k} className="flex items-center gap-3">
              <Label className="w-32">{label}</Label>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-muted">₹</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={rates[k]}
                  onChange={(e) => setRates({ ...rates, [k]: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
          ))}
          <div className="pt-3">
            <Label>Availability</Label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="not_taking">Not Taking Collabs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-2">
          <Label htmlFor="bio">Short bio (max 280 chars)</Label>
          <Textarea
            id="bio"
            value={bio}
            maxLength={280}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Mumbai-based fashion + lifestyle creator. Honest reviews, calm aesthetics."
          />
          <p className="text-xs text-muted text-right">{bio.length}/280</p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button disabled={!canAdvance()} onClick={() => setStep(step + 1)} className="flex-1">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={!canAdvance() || busy} onClick={handleFinish} className="flex-1">
            {busy ? 'Creating…' : 'Go live'}
          </Button>
        )}
      </div>
    </div>
  )
}
