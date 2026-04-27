import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Chip } from '@/components/ui/chip'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CreatorStatCard from '@/components/shared/CreatorStatCard'
import BrandCard from '@/components/shared/BrandCard'
import CampaignCard from '@/components/shared/CampaignCard'
import { DEMO_CREATORS, DEMO_BRANDS, DEMO_CAMPAIGNS } from '@/lib/demoData'
import { useAuth } from '@/contexts/AuthContext'
import { NICHES } from '@/lib/utils'
import { Search, Sliders } from 'lucide-react'

const FOLLOWER_BANDS = [
  { label: 'Any',     min: 0,        max: Infinity },
  { label: '10–50K',  min: 10000,    max: 50000 },
  { label: '50–100K', min: 50000,    max: 100000 },
  { label: '100–200K',min: 100000,   max: 200000 },
]

export default function Discover() {
  const { userType } = useAuth()
  const nav = useNavigate()
  const [tab, setTab] = useState(userType === 'brand' ? 'creators' : 'campaigns')
  const [q, setQ] = useState('')
  const [niche, setNiche] = useState(null)
  const [band, setBand] = useState(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState('relevance')

  const filteredCreators = useMemo(() => {
    let arr = [...DEMO_CREATORS]
    if (q) {
      const s = q.toLowerCase()
      arr = arr.filter(
        (c) => c.name.toLowerCase().includes(s) || c.handle?.toLowerCase().includes(s) ||
               c.niches.some((n) => n.toLowerCase().includes(s))
      )
    }
    if (niche) arr = arr.filter((c) => c.niches.includes(niche))
    const b = FOLLOWER_BANDS[band]
    arr = arr.filter((c) => c.follower_count >= b.min && c.follower_count <= b.max)
    if (verifiedOnly) arr = arr.filter((c) => c.verified)
    if (sort === 'followers')   arr.sort((a, b) => b.follower_count - a.follower_count)
    if (sort === 'engagement')  arr.sort((a, b) => b.engagement_rate - a.engagement_rate)
    if (sort === 'newest')      arr.reverse()
    return arr
  }, [q, niche, band, verifiedOnly, sort])

  const filteredBrands = useMemo(() => {
    let arr = [...DEMO_BRANDS]
    if (q) {
      const s = q.toLowerCase()
      arr = arr.filter((b) => b.name.toLowerCase().includes(s) || b.description?.toLowerCase().includes(s))
    }
    return arr
  }, [q])

  const filteredCampaigns = useMemo(() => {
    let arr = [...DEMO_CAMPAIGNS]
    if (q) {
      const s = q.toLowerCase()
      arr = arr.filter((c) => c.title.toLowerCase().includes(s) || c.brief?.toLowerCase().includes(s))
    }
    return arr
  }, [q])

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl">Discover</h1>
        <p className="text-sm text-muted mt-1">Find the right partner for your next collab.</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <Input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, handle, niche…"
          className="pl-9"
        />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="creators">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Chip active={!niche} onClick={() => setNiche(null)}>All niches</Chip>
              {NICHES.slice(0, 8).map((n) => (
                <Chip key={n} active={niche === n} onClick={() => setNiche(niche === n ? null : n)}>{n}</Chip>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Sliders className="h-3.5 w-3.5 text-muted" />
              <Select value={String(band)} onValueChange={(v) => setBand(Number(v))}>
                <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>{FOLLOWER_BANDS.map((b, i) => <SelectItem key={i} value={String(i)}>{b.label}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="followers">Most Followers</SelectItem>
                  <SelectItem value="engagement">Highest Engagement</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
              <Chip active={verifiedOnly} onClick={() => setVerifiedOnly(!verifiedOnly)}>Verified only</Chip>
            </div>
            <div className="grid gap-3 stagger">
              {filteredCreators.map((c) => (
                <CreatorStatCard key={c.user_id} creator={c} onClick={() => nav(`/pitch/${c.user_id}`)} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="brands">
          <div className="grid gap-3 stagger">
            {filteredBrands.map((b) => (
              <BrandCard key={b.user_id} brand={b} onClick={() => nav(`/pitch/${b.user_id}`)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="grid gap-3 stagger">
            {filteredCampaigns.map((c) => (
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
