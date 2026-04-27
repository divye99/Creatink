import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Chip } from '@/components/ui/chip'
import { DELIVERABLES } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

export default function CreateCampaign() {
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [brief, setBrief] = useState('')
  const [budget, setBudget] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [exclusivity, setExclusivity] = useState(false)
  const [audience, setAudience] = useState('')
  const [deliverables, setDeliverables] = useState([])
  const toggleD = (d) => setDeliverables((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d])

  const submit = () => {
    // In live mode would insert into supabase.from('campaigns')
    nav('/campaigns', { replace: true })
  }

  const valid = title.trim() && brief.trim() && deliverables.length

  return (
    <div className="space-y-5">
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="font-display text-3xl">New campaign</h1>
      <Card className="space-y-4">
        <div><Label>Campaign title</Label><Input className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Monsoon Glow Launch" /></div>
        <div><Label>Brief</Label><Textarea className="mt-2" value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Describe the campaign, the product, the vibe…" /></div>
        <div>
          <Label>Deliverables</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {DELIVERABLES.map((d) => <Chip key={d} active={deliverables.includes(d)} onClick={() => toggleD(d)}>{d}</Chip>)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Budget (₹)</Label><Input className="mt-2" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="75000" /></div>
          <div><Label>Target audience</Label><Input className="mt-2" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Women 22-35, urban" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Start</Label><Input className="mt-2" type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
          <div><Label>End</Label><Input className="mt-2" type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
        </div>
        <label className="flex items-center justify-between rounded-md border border-border bg-slateblue/15 p-3">
          <div>
            <p className="text-sm">Exclusivity required</p>
            <p className="text-xs text-muted">Creator cannot work with competing brands during the campaign.</p>
          </div>
          <Switch checked={exclusivity} onCheckedChange={setExclusivity} />
        </label>
        <Button onClick={submit} disabled={!valid} className="w-full">Publish campaign</Button>
      </Card>
    </div>
  )
}
