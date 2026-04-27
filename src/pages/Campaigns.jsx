import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import CampaignCard from '@/components/shared/CampaignCard'
import { Card } from '@/components/ui/card'
import StatusPipeline from '@/components/shared/StatusPipeline'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_CAMPAIGNS, DEMO_BRANDS, DEMO_DEALS, DEMO_CREATORS } from '@/lib/demoData'
import { Plus } from 'lucide-react'
import EmptyState from '@/components/shared/EmptyState'
import { Megaphone } from 'lucide-react'

export default function Campaigns() {
  const { userType } = useAuth()
  const nav = useNavigate()

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Campaigns</h1>
          <p className="text-sm text-muted mt-1">Track open campaigns and active deals.</p>
        </div>
        {userType === 'brand' && (
          <Button asChild size="sm">
            <Link to="/campaigns/new"><Plus className="h-4 w-4" /> New</Link>
          </Button>
        )}
      </header>

      <Tabs defaultValue="active">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="active">Active deals</TabsTrigger>
          <TabsTrigger value="open">Open campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-3 stagger">
            {DEMO_DEALS.length === 0 ? (
              <EmptyState icon={Megaphone} title="No active deals yet" description="Pitch a brand or apply to a campaign to start." />
            ) : DEMO_DEALS.map((d) => {
              const brand = DEMO_BRANDS.find((b) => b.user_id === d.brand_id)
              const creator = DEMO_CREATORS.find((c) => c.user_id === d.creator_id)
              const counterparty = userType === 'brand' ? creator : brand
              return (
                <Card
                  key={d.id}
                  onClick={() => nav(`/deals/${d.id}/kpis`)}
                  className="cursor-pointer flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted">
                        {userType === 'brand' ? 'Creator' : 'Brand'}
                      </p>
                      <h3 className="font-display text-lg mt-0.5">{counterparty?.name}</h3>
                    </div>
                    <p className="font-display text-lg">₹{d.terms.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <StatusPipeline status={d.status} />
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="open">
          <div className="grid gap-3 stagger">
            {DEMO_CAMPAIGNS.map((c) => (
              <CampaignCard
                key={c.id} campaign={c}
                brandName={DEMO_BRANDS.find((b) => b.user_id === c.brand_id)?.name}
                onClick={() => nav(`/campaigns/${c.id}`)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
