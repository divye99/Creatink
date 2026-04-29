import { Badge } from '@/components/ui/badge'
import { ShieldCheck, BadgeCheck, ReceiptText, FileSignature, Link2 } from 'lucide-react'

export function VerifiedCreatorBadge() {
  return <Badge variant="slate"><BadgeCheck className="h-3 w-3" /> Verified Creator</Badge>
}
export function RegisteredBusinessBadge() {
  return <Badge variant="slate"><ShieldCheck className="h-3 w-3" /> Registered Business</Badge>
}
export function TaxReadyBadge() {
  return <Badge variant="champagne"><ReceiptText className="h-3 w-3" /> Tax Ready</Badge>
}
export function ContractReadyBadge() {
  return <Badge variant="champagne"><FileSignature className="h-3 w-3" /> Contract Ready</Badge>
}
export function CastinkLinkedBadge() {
  return <Badge variant="cognac"><Link2 className="h-3 w-3" /> CASTINK Linked</Badge>
}
export function UnverifiedBadge() {
  return <Badge variant="muted">Unverified</Badge>
}

export function AvailabilityBadge({ availability }) {
  if (availability === 'available')   return <Badge variant="hermes">Available</Badge>
  if (availability === 'busy')        return <Badge variant="muted">Busy</Badge>
  if (availability === 'not_taking')  return <Badge variant="muted">Not Taking Collabs</Badge>
  return null
}
