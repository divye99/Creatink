import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_DEALS, DEMO_BRANDS, DEMO_CREATORS } from '@/lib/demoData'
import { formatINR } from '@/lib/utils'
import { initiateRazorpayPayout } from '@/lib/razorpay'
import { downloadInvoice } from '@/components/Invoice'
import { ArrowLeft, FileDown, IndianRupee, ShieldAlert } from 'lucide-react'

const statusVariant = {
  paid: 'success', processing: 'warning', pending: 'muted', failed: 'error',
}

export default function PaymentTracker() {
  const { dealId } = useParams()
  const nav = useNavigate()
  const { userType, profile } = useAuth()
  const [deal, setDeal] = useState(DEMO_DEALS.find((d) => d.id === dealId))
  const [busy, setBusy] = useState(false)

  if (!deal) return <p className="text-muted">Deal not found.</p>

  const brand = DEMO_BRANDS.find((b) => b.user_id === deal.brand_id)
  const creator = DEMO_CREATORS.find((c) => c.user_id === deal.creator_id)

  const totalPaid = deal.payment_schedule
    .filter((s) => s.status === 'paid')
    .reduce((sum, s) => sum + (deal.terms.amount * s.pct) / 100, 0)
  const totalDue = deal.terms.amount - totalPaid

  const releaseInstalment = async (idx) => {
    setBusy(true)
    const inst = deal.payment_schedule[idx]
    const amount = (deal.terms.amount * inst.pct) / 100
    const res = await initiateRazorpayPayout({
      amount,
      dealRef: deal.id,
      payeeName: creator?.name,
      upi: creator?.tax_info?.upi_id,
    })
    if (res.ok) {
      const next = { ...deal }
      next.payment_schedule = next.payment_schedule.map((s, i) =>
        i === idx ? { ...s, status: 'paid', razorpay_id: res.razorpay_id, upi_ref: res.upi_ref } : s
      )
      setDeal(next)
    }
    setBusy(false)
  }

  const generateInvoice = async (idx) => {
    const inst = deal.payment_schedule[idx]
    const subtotal = (deal.terms.amount * inst.pct) / 100
    const gst_pct = creator?.tax_info?.gst ? 18 : 0
    const gst_amount = Math.round(subtotal * gst_pct / 100)
    await downloadInvoice({
      invoice_no: `INV-${deal.id}-${idx + 1}`,
      date: new Date().toLocaleDateString('en-IN'),
      deal_ref: deal.id,
      creator_legal_name: creator?.tax_info?.legal_name || creator?.name || '—',
      creator_pan: creator?.tax_info?.pan || '—',
      creator_gst: creator?.tax_info?.gst,
      brand_name: brand?.name,
      brand_gst_pan: brand?.gst_pan,
      description: `${inst.label} (${inst.pct}%) — ${deal.terms.deliverables.join(', ')}`,
      subtotal, gst_pct, gst_amount, total: subtotal + gst_amount,
    })
  }

  return (
    <div className="space-y-5">
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Deal · {brand?.name} ↔ {creator?.name}</p>
          <h1 className="font-display text-2xl">Payments</h1>
        </div>
        <p className="font-display text-2xl">{formatINR(deal.terms.amount)}</p>
      </header>

      <Card className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted">Total</p>
          <p className="font-display text-lg mt-1">{formatINR(deal.terms.amount)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted">Paid</p>
          <p className="font-display text-lg text-success mt-1">{formatINR(totalPaid)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted">Due</p>
          <p className="font-display text-lg text-warning mt-1">{formatINR(totalDue)}</p>
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-lg mb-3">Payment schedule</h3>
        <ul className="divide-y divide-border/60">
          {deal.payment_schedule.map((s, i) => {
            const amount = (deal.terms.amount * s.pct) / 100
            return (
              <li key={i} className="py-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm">{s.label} <span className="text-muted">({s.pct}%)</span></p>
                  <p className="text-xs text-muted mt-0.5">{formatINR(amount)}</p>
                </div>
                <Badge variant={statusVariant[s.status] || 'muted'}>{s.status}</Badge>
                {s.status === 'paid' ? (
                  <Button size="sm" variant="outline" onClick={() => generateInvoice(i)}>
                    <FileDown className="h-4 w-4" /> Invoice
                  </Button>
                ) : (
                  userType === 'brand' && (
                    <Button size="sm" disabled={busy} onClick={() => releaseInstalment(i)}>
                      <IndianRupee className="h-4 w-4" /> Release
                    </Button>
                  )
                )}
              </li>
            )
          })}
        </ul>
      </Card>

      {!creator?.tax_info?.pan && (
        <Card className="border-warning/40 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-warning mt-0.5" />
          <p className="text-sm">Creator hasn't completed tax info yet — payouts are blocked until PAN + UPI are added.</p>
        </Card>
      )}
    </div>
  )
}
