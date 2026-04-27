import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Chip } from '@/components/ui/chip'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_CREATORS, DEMO_BRANDS } from '@/lib/demoData'
import { DELIVERABLES, formatINR } from '@/lib/utils'
import { ArrowLeft, ShieldAlert, Send, Lock } from 'lucide-react'

export default function PitchBuilder() {
  const { targetId } = useParams()
  const nav = useNavigate()
  const { profile, userType } = useAuth()
  const target =
    DEMO_CREATORS.find((c) => c.user_id === targetId) ||
    DEMO_BRANDS.find((b) => b.user_id === targetId)

  const [paid, setPaid] = useState(true)
  const [exclusivity, setExclusivity] = useState(false)
  const [deliverables, setDeliverables] = useState([])
  const [rate, setRate] = useState('')
  const [timeline, setTimeline] = useState('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!target) return <p className="text-muted">User not found.</p>

  const toggleD = (d) => setDeliverables((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d])

  // Brand initiating paid partnership requires Contract Vault uploaded
  const brandPaidBlocked = userType === 'brand' && paid && !profile?.contract_vault_url
  const creatorAcceptingPaidBlocked = userType === 'creator' && paid && !profile?.tax_info?.pan

  const valid =
    deliverables.length > 0 &&
    note.trim() &&
    (!paid || rate) &&
    !brandPaidBlocked

  const submit = () => {
    setSubmitted(true)
    setTimeout(() => nav('/messages', { replace: true }), 1400)
  }

  return (
    <div className="space-y-5">
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <header>
        <p className="text-xs uppercase tracking-wider text-muted">Pitch to</p>
        <h1 className="font-display text-2xl">{target.name}</h1>
      </header>

      {brandPaidBlocked && (
        <Card className="border-warning/40 flex items-start gap-3">
          <Lock className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <p className="font-display">Upload a contract template to begin paid collaborations.</p>
            <p className="text-xs text-muted mt-1">Settings → Contract Vault.</p>
          </div>
        </Card>
      )}

      {creatorAcceptingPaidBlocked && (
        <Card className="border-warning/40 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <p className="font-display">Add your tax details before sending paid pitches.</p>
            <p className="text-xs text-muted mt-1">PAN + UPI required for payouts.</p>
          </div>
        </Card>
      )}

      <Card className="space-y-5">
        <label className="flex items-center justify-between rounded-md border border-border bg-bg/40 p-3">
          <div>
            <p className="text-sm">{paid ? 'Paid collaboration' : 'Gifting / Barter'}</p>
            <p className="text-xs text-muted">{paid ? 'Compensation in INR' : 'No payment exchanged'}</p>
          </div>
          <Switch checked={paid} onCheckedChange={setPaid} />
        </label>

        <div>
          <Label>Deliverables</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {DELIVERABLES.map((d) => <Chip key={d} active={deliverables.includes(d)} onClick={() => toggleD(d)}>{d}</Chip>)}
          </div>
        </div>

        {paid && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Rate (₹)</Label>
              <Input type="number" className="mt-2" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="0" />
              {rate && <p className="text-xs text-muted mt-1">{formatINR(Number(rate))}</p>}
            </div>
            <div>
              <Label>Timeline</Label>
              <Input className="mt-2" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="Within 14 days" />
            </div>
          </div>
        )}

        {userType === 'brand' && (
          <label className="flex items-center justify-between rounded-md border border-border bg-bg/40 p-3">
            <div>
              <p className="text-sm">Exclusivity</p>
              <p className="text-xs text-muted">Creator cannot work with competing brands during the campaign.</p>
            </div>
            <Switch checked={exclusivity} onCheckedChange={setExclusivity} />
          </label>
        )}

        <div>
          <Label>Pitch note</Label>
          <Textarea className="mt-2" value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Why are you reaching out? Why is this a fit?" />
        </div>

        {submitted ? (
          <Button disabled className="w-full">Pitch sent — opening messages…</Button>
        ) : (
          <Button onClick={submit} disabled={!valid} className="w-full">
            <Send className="h-4 w-4" /> Send pitch
          </Button>
        )}
      </Card>
    </div>
  )
}
