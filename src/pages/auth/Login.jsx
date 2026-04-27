import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/contexts/AuthContext'
import { validateIndianMobile } from '@/lib/utils'
import { ArrowRight, ShieldAlert } from 'lucide-react'

const DISCLAIMER = `CREATINK is a discovery and communication platform only. We do not verify the authenticity, legal standing, or credibility of any influencer or brand on this platform. All collaborations are entered into at your own risk. CREATINK holds no liability for any disputes, fraud, non-payment, or non-delivery arising from use of this platform.`

export default function Login({ signupMode = false }) {
  const nav = useNavigate()
  const { sendOtp, verifyOtp } = useAuth()
  const [step, setStep] = useState('phone') // 'phone' | 'otp'
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const e164 = validateIndianMobile(phone)

  const handleSend = async (e) => {
    e.preventDefault()
    setErr('')
    if (!e164) return setErr('Enter a valid 10-digit Indian mobile number.')
    if (signupMode && !agreed) return setErr('Please accept the disclaimer to continue.')
    setBusy(true)
    const { error } = await sendOtp(e164)
    setBusy(false)
    if (error) return setErr(error.message)
    setStep('otp')
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setErr('')
    if (otp.length < 4) return setErr('Enter the OTP sent to your phone.')
    setBusy(true)
    const { error } = await verifyOtp(e164, otp)
    setBusy(false)
    if (error) return setErr(error.message)
    nav(signupMode ? '/onboarding' : '/home', { replace: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">{signupMode ? 'Create your account' : 'Welcome back'}</h1>
        <p className="text-sm text-muted mt-2">
          {signupMode
            ? 'Sign up with your Indian mobile number to get started.'
            : 'Log in with the mobile number you registered with.'}
        </p>
      </div>

      {step === 'phone' && (
        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile number</Label>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 rounded-md border border-border bg-card text-sm">+91</span>
              <Input
                id="phone"
                inputMode="numeric"
                maxLength={10}
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          {signupMode && (
            <label className="flex items-start gap-3 rounded-md border border-border bg-card p-4 cursor-pointer">
              <Checkbox checked={agreed} onCheckedChange={setAgreed} className="mt-0.5" />
              <span className="text-xs text-muted leading-relaxed">{DISCLAIMER}</span>
            </label>
          )}

          {err && (
            <div className="flex items-start gap-2 text-error text-sm">
              <ShieldAlert className="h-4 w-4 mt-0.5" /><span>{err}</span>
            </div>
          )}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Sending OTP…' : <>Send OTP <ArrowRight className="h-4 w-4" /></>}
          </Button>

          <p className="text-xs text-muted text-center">
            {signupMode ? (
              <>Already have an account? <Link to="/login" className="text-cognac">Log in</Link></>
            ) : (
              <>New to Creatink? <Link to="/signup" className="text-cognac">Sign up</Link></>
            )}
          </p>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter the 6-digit OTP</Label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="text-center text-lg tracking-[0.4em]"
            />
            <p className="text-xs text-muted">Sent to +91 {phone}. <button type="button" onClick={() => setStep('phone')} className="text-cognac">Change</button></p>
          </div>

          {err && (
            <div className="flex items-start gap-2 text-error text-sm">
              <ShieldAlert className="h-4 w-4 mt-0.5" /><span>{err}</span>
            </div>
          )}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Verifying…' : 'Verify & Continue'}
          </Button>
        </form>
      )}
    </div>
  )
}
