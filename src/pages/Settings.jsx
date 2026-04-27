import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { connectGmail, connectOutlook } from '@/lib/oauth'
import { Mail, Eye, EyeOff, Sparkles, Link2, ArrowLeft, Globe } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

export default function Settings() {
  const nav = useNavigate()
  const { profile, updateProfile, signOut } = useAuth()
  const { lang, changeLang } = useApp()

  const [emailScanner, setEmailScanner] = useState(false)
  const [whosLooking, setWhosLooking] = useState(false)
  const [anonBrowse, setAnonBrowse] = useState(false)
  const [emailProvider, setEmailProvider] = useState(null)
  const [castinkVis, setCastinkVis] = useState({
    follower_count: true, engagement_rate: true,
    brand_deals_count: true, primary_niche: true,
  })
  const [confirmConsent, setConfirmConsent] = useState(null) // 'scanner' | 'looking'

  const enableScanner = async (provider) => {
    const data = provider === 'gmail' ? await connectGmail() : await connectOutlook()
    setEmailProvider(data.provider)
    setEmailScanner(true)
    setConfirmConsent(null)
  }

  const revokeScanner = () => {
    setEmailScanner(false)
    setEmailProvider(null)
    // In live mode: call edge function to delete oauth token from ai_settings
  }

  return (
    <div className="space-y-5">
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="font-display text-3xl">Settings</h1>

      <Card>
        <h3 className="font-display text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-cognac" /> AI Features</h3>
        <p className="text-xs text-muted mt-1">All AI features are off by default and revocable instantly.</p>

        <div className="mt-4 space-y-4">
          <div className="rounded-md border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm flex items-center gap-2"><Mail className="h-4 w-4" /> Smart Email Scanner</p>
                <p className="text-xs text-muted mt-1">
                  Scans your Gmail/Outlook for missed brand collaborations. Raw emails are processed and discarded — only summaries are kept.
                </p>
              </div>
              {emailScanner ? (
                <Switch checked={true} onCheckedChange={revokeScanner} />
              ) : (
                <Switch checked={false} onCheckedChange={() => setConfirmConsent('scanner')} />
              )}
            </div>
            {emailScanner && (
              <p className="text-xs text-success mt-2">
                Connected: {emailProvider} · <Link to="/missed-opportunities" className="text-cognac">View results</Link>
              </p>
            )}
          </div>

          <div className="rounded-md border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm flex items-center gap-2"><Eye className="h-4 w-4" /> Who's Looking</p>
                <p className="text-xs text-muted mt-1">
                  See who viewed your profile — but only if both you and the viewer have opted in.
                </p>
              </div>
              <Switch
                checked={whosLooking}
                onCheckedChange={(v) => v ? setConfirmConsent('looking') : setWhosLooking(false)}
              />
            </div>
          </div>

          <div className="rounded-md border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm flex items-center gap-2"><EyeOff className="h-4 w-4" /> Anonymous Browse</p>
                <p className="text-xs text-muted mt-1">Hide your views from others, regardless of opt-in.</p>
              </div>
              <Switch checked={anonBrowse} onCheckedChange={setAnonBrowse} />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-lg flex items-center gap-2"><Link2 className="h-5 w-5 text-cognac" /> CASTINK Linked Stats</h3>
        <p className="text-xs text-muted mt-1">Choose which Creatink stats are visible on your CASTINK profile.</p>
        <div className="mt-4 space-y-3">
          {Object.entries(castinkVis).map(([k, v]) => (
            <label key={k} className="flex items-center justify-between">
              <span className="text-sm capitalize">{k.replace(/_/g, ' ')}</span>
              <Switch checked={v} onCheckedChange={(val) => setCastinkVis({ ...castinkVis, [k]: val })} />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-lg flex items-center gap-2"><Globe className="h-5 w-5 text-cognac" /> Language</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'हिन्दी (Hindi)' },
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className={`rounded-md border p-3 text-sm transition ${
                lang === l.code ? 'border-cognac bg-cognac/10 text-cognac' : 'border-border text-body hover:border-cognac/60'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </Card>

      <Button variant="outline" className="w-full" onClick={signOut}>Sign out</Button>

      {/* Consent dialogs */}
      <Dialog open={confirmConsent === 'scanner'} onOpenChange={(o) => !o && setConfirmConsent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect your email</DialogTitle>
            <DialogDescription>
              We'll scan up to 5 years of email history for collaboration language. Raw email content is processed
              and immediately discarded — only the summary, brand name, and date are stored. Revocable any time.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button onClick={() => enableScanner('gmail')}>Gmail</Button>
            <Button variant="outline" onClick={() => enableScanner('outlook')}>Outlook</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmConsent === 'looking'} onOpenChange={(o) => !o && setConfirmConsent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Who's Looking?</DialogTitle>
            <DialogDescription>
              By enabling, your profile views are recorded so that you can see who viewed yours — but only when both
              parties have enabled this feature. We never share view data with non-opted-in users.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => { setWhosLooking(true); setConfirmConsent(null) }} className="flex-1">I agree</Button>
            <Button variant="outline" onClick={() => setConfirmConsent(null)} className="flex-1">Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
