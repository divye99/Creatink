import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Sparkles, Building2 } from 'lucide-react'

export default function OnboardingRoot() {
  const nav = useNavigate()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Choose your account type</h1>
        <p className="text-sm text-muted mt-2">You can have only one account per phone number.</p>
      </div>

      <div className="grid gap-4">
        <Card onClick={() => nav('/onboarding/creator')} className="cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-md bg-slateblue/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-slateblue" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl">I'm a Creator</h3>
              <p className="text-sm text-muted mt-1">
                Influencer with 10K–200K followers across Instagram, YouTube, or Twitter.
                Get matched with brands directly.
              </p>
            </div>
          </div>
        </Card>

        <Card onClick={() => nav('/onboarding/brand')} className="cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-md bg-cognac/20 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-cognac" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl">I'm a Brand</h3>
              <p className="text-sm text-muted mt-1">
                Discover and collaborate with verified micro-creators across India. No agencies, no middlemen.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
