import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import { Camera, ArrowLeft, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  'Beauty','Fashion','Wellness','Food & Bev','Tech','Home','Travel','Finance',
  'Education','Apparel','Footwear','Jewellery','Auto','Lifestyle','Health',
]
const STEPS = ['Brand', 'Business', 'Audience']

export default function OnboardingBrand() {
  const nav = useNavigate()
  const { session, completeSignup } = useAuth()
  const phone = session?.user?.phone || ''

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [logo, setLogo] = useState(null)
  const [gstPan, setGstPan] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState([])
  const [target, setTarget] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [busy, setBusy] = useState(false)

  const onLogo = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = (ev) => setLogo(ev.target.result)
    reader.readAsDataURL(f)
  }

  const toggleCat = (c) => setCategories((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]))

  const canAdvance = () => {
    if (step === 0) return name.trim() && logo
    if (step === 1) return gstPan.trim() && description.trim()
    if (step === 2) return categories.length > 0 && target.trim()
    return true
  }

  const finish = async () => {
    setBusy(true)
    await completeSignup({
      phone,
      user_type: 'brand',
      name,
      logo_url: logo,
      gst_pan: gstPan,
      description,
      categories,
      target_audience: target,
      budget_range: { min: budgetMin ? Number(budgetMin) : null, max: budgetMax ? Number(budgetMax) : null, currency: 'INR' },
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
        <div className="space-y-4">
          <Card className="text-center py-8">
            <label htmlFor="logo" className="cursor-pointer inline-flex flex-col items-center gap-3">
              {logo ? (
                <img src={logo} alt="" className="h-28 w-28 rounded-md object-cover ring-2 ring-champagne" />
              ) : (
                <div className="h-28 w-28 rounded-md bg-slateblue/15 border-2 border-dashed border-border flex items-center justify-center">
                  <Camera className="h-7 w-7 text-muted" />
                </div>
              )}
              <span className="text-sm text-cognac">{logo ? 'Change logo' : 'Upload brand logo'}</span>
              <input id="logo" type="file" accept="image/*" className="hidden" onChange={onLogo} />
            </label>
          </Card>
          <div>
            <Label>Brand name</Label>
            <Input className="mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Saanvi Skincare" />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label>GST or Business PAN (self-declared)</Label>
            <Input className="mt-2" value={gstPan} onChange={(e) => setGstPan(e.target.value.toUpperCase())} placeholder="07ABCDE1234F1Z5" />
            <p className="text-xs text-muted mt-1">Not validated. Used to award the Registered Business badge.</p>
          </div>
          <div>
            <Label>Brand description</Label>
            <Textarea className="mt-2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does your brand sell, and what's your story?" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <Label>Product categories</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map((c) => <Chip key={c} active={categories.includes(c)} onClick={() => toggleCat(c)}>{c}</Chip>)}
            </div>
          </div>
          <div>
            <Label>Target audience</Label>
            <Textarea className="mt-2" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. Women 22-35, urban India, value-conscious" />
          </div>
          <div>
            <Label>Typical campaign budget (INR)</Label>
            <div className="flex gap-2 mt-2">
              <Input type="number" placeholder="Min" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
              <Input type="number" placeholder="Max" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
            </div>
          </div>
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
          <Button disabled={!canAdvance() || busy} onClick={finish} className="flex-1">
            {busy ? 'Creating…' : 'Go live'}
          </Button>
        )}
      </div>
    </div>
  )
}
