import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import StatusPipeline from '@/components/shared/StatusPipeline'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_DEALS, DEMO_KPIS, DEMO_CREATORS, DEMO_BRANDS } from '@/lib/demoData'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, LineChart, Line,
} from 'recharts'
import { ArrowLeft, FileDown, Star, IndianRupee } from 'lucide-react'

const FIELDS = [
  ['reach', 'Reach'], ['impressions', 'Impressions'], ['likes', 'Likes'],
  ['comments', 'Comments'], ['shares', 'Shares'], ['saves', 'Saves'],
  ['story_views', 'Story Views'], ['link_clicks', 'Link Clicks'],
  ['promo_redemptions', 'Promo Redemptions'],
]

export default function KPIDashboard() {
  const { dealId } = useParams()
  const nav = useNavigate()
  const { userType } = useAuth()
  const deal = DEMO_DEALS.find((d) => d.id === dealId)
  const initial = DEMO_KPIS[dealId] || { deal_id: dealId, ...Object.fromEntries(FIELDS.map(([k]) => [k, 0])) }
  const [kpi, setKpi] = useState(initial)
  const [proof, setProof] = useState(initial.proof_url || '')
  const [rating, setRating] = useState(initial.brand_rating || 0)
  const [note, setNote]     = useState(initial.brand_note || '')

  if (!deal) return <p className="text-muted">Deal not found.</p>

  const update = (k, v) => setKpi((p) => ({ ...p, [k]: Number(v) || 0 }))

  const counterparty = userType === 'brand'
    ? DEMO_CREATORS.find((c) => c.user_id === deal.creator_id)
    : DEMO_BRANDS.find((b) => b.user_id === deal.brand_id)

  const chartData = [
    { name: 'Likes',    value: kpi.likes },
    { name: 'Comments', value: kpi.comments },
    { name: 'Shares',   value: kpi.shares },
    { name: 'Saves',    value: kpi.saves },
    { name: 'Clicks',   value: kpi.link_clicks },
    { name: 'Redeems',  value: kpi.promo_redemptions },
  ]

  const trend = [
    { d: 'D1', v: Math.round(kpi.reach * 0.20) },
    { d: 'D2', v: Math.round(kpi.reach * 0.45) },
    { d: 'D3', v: Math.round(kpi.reach * 0.70) },
    { d: 'D4', v: Math.round(kpi.reach * 0.85) },
    { d: 'D5', v: Math.round(kpi.reach * 0.95) },
    { d: 'D6', v: kpi.reach },
  ]

  return (
    <div className="space-y-5">
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cognac/70">{counterparty?.name}</p>
          <h1 className="font-display text-2xl">KPI Dashboard</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => alert('PDF exported')}>
          <FileDown className="h-4 w-4" /> Export PDF
        </Button>
      </header>

      <Card><StatusPipeline status={deal.status} /></Card>

      <Card>
        <h3 className="font-display text-lg mb-3">Reach trend (6 days)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={trend}>
            <CartesianGrid stroke="#BFA47C" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="d" stroke="#6B5D4F" fontSize={11} />
            <YAxis stroke="#6B5D4F" fontSize={11} />
            <Tooltip contentStyle={{ background: '#F2E7D3', border: '1px solid #BFA47C', color: '#1A1410', borderRadius: 8 }} />
            <Line type="monotone" dataKey="v" stroke="#8E4A2F" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="font-display text-lg mb-3">Engagement breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid stroke="#BFA47C" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#6B5D4F" fontSize={11} />
            <YAxis stroke="#6B5D4F" fontSize={11} />
            <Tooltip contentStyle={{ background: '#F2E7D3', border: '1px solid #BFA47C', color: '#1A1410', borderRadius: 8 }} />
            <Bar dataKey="value" fill="#8E4A2F" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="font-display text-lg mb-3">Log metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map(([k, label]) => (
            <div key={k}>
              <Label>{label}</Label>
              <Input type="number" value={kpi[k]} onChange={(e) => update(k, e.target.value)} className="mt-2" />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Label>Proof of delivery (URL or upload)</Label>
          <Input className="mt-2" value={proof} onChange={(e) => setProof(e.target.value)} placeholder="https://instagram.com/p/..." />
        </div>
      </Card>

      {userType === 'brand' && deal.status !== 'applied' && (
        <Card>
          <h3 className="font-display text-lg mb-2">Rate this collab</h3>
          <div className="flex gap-2">
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => setRating(n)} className="text-2xl">
                <Star className={`h-7 w-7 ${n <= rating ? 'fill-cognac text-cognac' : 'text-border'}`} />
              </button>
            ))}
          </div>
          <Textarea
            value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="What worked, what didn't?" className="mt-3"
          />
        </Card>
      )}

      <Button asChild className="w-full"><Link to={`/deals/${dealId}/pay`}><IndianRupee className="h-4 w-4" /> Open payment tracker</Link></Button>
    </div>
  )
}
