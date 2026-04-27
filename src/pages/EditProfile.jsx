import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { validatePAN, validateGST } from '@/lib/utils'
import { ArrowLeft, ShieldAlert } from 'lucide-react'

export default function EditProfile() {
  const nav = useNavigate()
  const { profile, userType, updateProfile } = useAuth()
  const isCreator = userType === 'creator'

  const [name, setName] = useState(profile?.name || '')
  const [bio, setBio]   = useState(profile?.bio || '')
  const [availability, setAvailability] = useState(profile?.availability || 'available')

  const [tax, setTax] = useState(profile?.tax_info || { legal_name: '', pan: '', gst: '', upi_id: '', bank_account: '', ifsc: '' })
  const [contractUrl, setContractUrl] = useState(profile?.contract_vault_url || '')

  const [err, setErr] = useState('')

  const save = async () => {
    setErr('')
    if (isCreator) {
      if (tax.pan && !validatePAN(tax.pan)) return setErr('PAN format looks wrong (e.g. ABCDE1234F).')
      if (tax.gst && !validateGST(tax.gst)) return setErr('GST format looks wrong.')
      await updateProfile({ name, bio, availability, tax_info: tax })
    } else {
      await updateProfile({ name, description: bio, contract_vault_url: contractUrl })
    }
    nav('/profile', { replace: true })
  }

  const onContract = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setContractUrl(`uploaded://${f.name}`)
  }

  return (
    <div className="space-y-5">
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-muted hover:text-body">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="font-display text-3xl">Edit profile</h1>

      <Card className="space-y-4">
        <div><Label>Name</Label><Input className="mt-2" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div>
          <Label>{isCreator ? 'Bio' : 'Description'}</Label>
          <Textarea className="mt-2" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={isCreator ? 280 : 600} />
        </div>
        {isCreator && (
          <div>
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
        )}
      </Card>

      {isCreator && (
        <Card id="tax" className="space-y-4">
          <div className="flex items-start gap-2 text-xs text-muted">
            <ShieldAlert className="h-4 w-4 mt-0.5 text-warning shrink-0" />
            <span>Tax info is required to accept paid deals. Stored encrypted, never shown publicly.</span>
          </div>
          <div><Label>Full legal name (PAN match)</Label><Input className="mt-2" value={tax.legal_name} onChange={(e) => setTax({ ...tax, legal_name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>PAN</Label><Input className="mt-2" value={tax.pan} onChange={(e) => setTax({ ...tax, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" /></div>
            <div><Label>GST (optional)</Label><Input className="mt-2" value={tax.gst} onChange={(e) => setTax({ ...tax, gst: e.target.value.toUpperCase() })} /></div>
          </div>
          <div><Label>UPI ID</Label><Input className="mt-2" value={tax.upi_id} onChange={(e) => setTax({ ...tax, upi_id: e.target.value })} placeholder="you@upi" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Bank account</Label><Input className="mt-2" value={tax.bank_account} onChange={(e) => setTax({ ...tax, bank_account: e.target.value })} /></div>
            <div><Label>IFSC</Label><Input className="mt-2" value={tax.ifsc} onChange={(e) => setTax({ ...tax, ifsc: e.target.value.toUpperCase() })} /></div>
          </div>
        </Card>
      )}

      {!isCreator && (
        <Card id="contract">
          <Label>Contract template (PDF)</Label>
          <p className="text-xs text-muted mt-1">Required before initiating paid partnerships.</p>
          <input type="file" accept="application/pdf" onChange={onContract} className="mt-3 text-sm" />
          {contractUrl && <p className="text-xs text-success mt-2">Uploaded: {contractUrl}</p>}
        </Card>
      )}

      {err && <p className="text-sm text-error">{err}</p>}
      <Button className="w-full" onClick={save}>Save changes</Button>
    </div>
  )
}
