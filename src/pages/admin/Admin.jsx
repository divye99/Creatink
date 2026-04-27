import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DEMO_CREATORS, DEMO_BRANDS, DEMO_CAMPAIGNS, DEMO_DEALS } from '@/lib/demoData'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { ShieldAlert, Lock, Trash2, Flag, Pause } from 'lucide-react'

const SIGNUPS_TREND = [
  { d: 'Mon', v: 8 }, { d: 'Tue', v: 14 }, { d: 'Wed', v: 22 },
  { d: 'Thu', v: 17 }, { d: 'Fri', v: 31 }, { d: 'Sat', v: 26 }, { d: 'Sun', v: 19 },
]

const DISPUTES = [
  { id: 1, reporter: 'Aanya Kapoor', against: 'Saanvi Skincare', reason: 'Payment delayed past 30 days', status: 'open' },
  { id: 2, reporter: 'TaraTech Audio', against: 'Rohan Iyer', reason: 'Content not delivered on time', status: 'reviewing' },
]

export default function Admin() {
  const [pwd, setPwd] = useState('')
  const [authed, setAuthed] = useState(false)
  const [err, setErr] = useState('')

  const expected = import.meta.env.VITE_ADMIN_PASSWORD || 'creatink-admin'

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-6">
        <Card className="w-full max-w-sm">
          <h1 className="font-display text-2xl flex items-center gap-2"><Lock className="h-5 w-5 text-champagne" /> Admin</h1>
          <p className="text-xs text-muted mt-1">Restricted area. This route is not linked from the main app.</p>
          <Label className="mt-4 block">Password</Label>
          <Input
            type="password" value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="mt-2"
            onKeyDown={(e) => e.key === 'Enter' && (pwd === expected ? setAuthed(true) : setErr('Wrong password.'))}
          />
          {err && <p className="text-error text-xs mt-2 flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> {err}</p>}
          <Button className="w-full mt-4" onClick={() => pwd === expected ? setAuthed(true) : setErr('Wrong password.')}>Enter</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-body">
      <header className="border-b border-border px-6 h-14 flex items-center justify-between">
        <h1 className="font-display text-xl text-slateblue">CREATINK · Admin</h1>
        <Button variant="ghost" size="sm" onClick={() => setAuthed(false)}>Lock</Button>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        <section className="grid grid-cols-4 gap-3">
          {[
            { label: 'Signups (7d)', v: 137 },
            { label: 'Active campaigns', v: DEMO_CAMPAIGNS.length },
            { label: 'Deals completed', v: 24 },
            { label: 'Payouts (₹L)', v: 12.4 },
          ].map((m) => (
            <Card key={m.label}>
              <p className="text-[10px] uppercase tracking-wider text-muted">{m.label}</p>
              <p className="font-display text-2xl mt-1">{m.v}</p>
            </Card>
          ))}
        </section>

        <Card>
          <h2 className="font-display text-lg">Signups per day</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SIGNUPS_TREND}>
              <CartesianGrid stroke="#26221C" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" stroke="#8A8F99" fontSize={11} />
              <YAxis stroke="#8A8F99" fontSize={11} />
              <Tooltip contentStyle={{ background: '#16130F', border: '1px solid #26221C', borderRadius: 8 }} />
              <Line type="monotone" dataKey="v" stroke="#E8D5B0" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted text-xs uppercase tracking-wider">
                  <th className="py-2">User</th><th>Type</th><th>Status</th><th></th>
                </tr></thead>
                <tbody>
                  {[...DEMO_CREATORS.map((c) => ({ ...c, type: 'creator' })),
                    ...DEMO_BRANDS.map((b) => ({ ...b, type: 'brand' }))].map((u) => (
                    <tr key={u.user_id} className="border-t border-border/60">
                      <td className="py-3 flex items-center gap-2">
                        <Avatar className="h-8 w-8"><AvatarImage src={u.photo_url || u.logo_url} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                        {u.name}
                      </td>
                      <td><Badge variant={u.type === 'creator' ? 'slate' : 'cognac'}>{u.type}</Badge></td>
                      <td>{u.verified ? <Badge variant="success">verified</Badge> : <Badge variant="muted">pending</Badge>}</td>
                      <td className="text-right space-x-1">
                        <Button size="sm" variant="ghost"><Flag className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost"><Pause className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-error" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <ul className="divide-y divide-border/60">
                {DEMO_CAMPAIGNS.map((c) => (
                  <li key={c.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-display text-base">{c.title}</p>
                      <p className="text-xs text-muted">{DEMO_BRANDS.find((b) => b.user_id === c.brand_id)?.name}</p>
                    </div>
                    <Badge variant="success">{c.status}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="deals">
            <Card>
              <ul className="divide-y divide-border/60">
                {DEMO_DEALS.map((d) => (
                  <li key={d.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-display text-base">Deal {d.id}</p>
                      <p className="text-xs text-muted">₹{d.terms.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <Badge variant="slate">{d.status}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="disputes">
            <Card>
              <ul className="divide-y divide-border/60">
                {DISPUTES.map((d) => (
                  <li key={d.id} className="py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-display">{d.reporter} ↔ {d.against}</p>
                      <Badge variant={d.status === 'open' ? 'error' : 'warning'}>{d.status}</Badge>
                    </div>
                    <p className="text-xs text-muted mt-1">{d.reason}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
