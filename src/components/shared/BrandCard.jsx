import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ContractReadyBadge, RegisteredBusinessBadge } from './VerifiedBadges'

export default function BrandCard({ brand, onClick }) {
  const b = brand || {}
  return (
    <Card onClick={onClick} className="cursor-pointer flex flex-col gap-4" role="button" tabIndex={0}>
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 rounded-md">
          <AvatarImage src={b.logo_url} alt={b.name} />
          <AvatarFallback>{b.name?.[0] || 'B'}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg truncate">{b.name}</h3>
          <p className="text-sm text-muted line-clamp-2">{b.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(b.categories || []).slice(0, 3).map((c) => (
          <Badge key={c} variant="slate">{c}</Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {b.gst_pan && <RegisteredBusinessBadge />}
        {b.contract_vault_url && <ContractReadyBadge />}
      </div>
    </Card>
  )
}
