import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Chip } from '@/components/ui/chip'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogTitle, DialogHeader, DialogTrigger,
} from '@/components/ui/dialog'
import DiscoverCreatorCard from '@/components/shared/DiscoverCreatorCard'
import BrandCard from '@/components/shared/BrandCard'
import CampaignCard from '@/components/shared/CampaignCard'
import { DEMO_CREATORS, DEMO_BRANDS, DEMO_CAMPAIGNS } from '@/lib/demoData'
import { useAuth } from '@/contexts/AuthContext'
import { NICHES, cn } from '@/lib/utils'
import { Search, Sliders } from 'lucide-react'

const FOLLOWER_BANDS = [
  { label: 'Any',     min: 0,        max: Infinity },
  { label: '10–50K',  min: 10000,    max: 50000 },
  { label: '50–100K', min: 50000,    max: 100000 },
  { label: '100–200K',min: 100000,   max: 200000 },
]

const SORTS = [
  { value: 'relevance',  label: 'Most relevant' },
  { value: 'followers',  label: 'Most followers' },
  { value: 'engagement', label: 'Highest engagement' },
  { value: 'newest',     label: 'Newest' },
]

export default function Discover() {
  const { userType } = useAuth()
  const nav = useNavigate()
  const [tab, setTab] = useState(userType === 'brand' ? 'creators' : 'campaigns')
  const [q, setQ] = useState('')

  // Creator filters
  const [niche, setNiche] = useState(null)
  const [band, setBand] = useState(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState('relevance')
  const [refineOpen, setRefineOpen] = useState(false)

  const activeFilters =
    (niche ? 1 : 0) +
    (band > 0 ? 1 : 0) +
    (sort !== 'relevance' ? 1 : 0) +
    (verifiedOnly ? 1 : 0)

  const clearFilters = () => {
    setNiche(null); setBand(0); setSort('relevance'); setVerifiedOnly(false)
  }

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
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Search the platform</p>
        <h1 className="font-display text-4xl mt-2 leading-none">Discover</h1>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" strokeWidth={1.5} />
        <Input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, handle, niche…"
          className="pl-9"
        />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between gap-3">
          <TabsList className="grid grid-cols-3 flex-1">
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>

          {tab === 'creators' && (
            <RefineTrigger
              activeFilters={activeFilters}
              open={refineOpen}
              setOpen={setRefineOpen}
              niche={niche} setNiche={setNiche}
              band={band} setBand={setBand}
              sort={sort} setSort={setSort}
              verifiedOnly={verifiedOnly} setVerifiedOnly={setVerifiedOnly}
              clearFilters={clearFilters}
            />
          )}
        </div>

        <TabsContent value="creators">
          {activeFilters > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cognac/70">
              <span>{filteredCreators.length} matches</span>
              <span className="text-cognac/30">·</span>
              <button onClick={clearFilters} className="text-cognac hover:underline">
                Clear all
              </button>
            </div>
          )}
          <div className="grid gap-4 stagger">
            {filteredCreators.map((c) => (
              <DiscoverCreatorCard
                key={c.user_id}
                creator={c}
                onClick={() => nav(`/pitch/${c.user_id}`)}
              />
            ))}
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

function RefineTrigger({
  activeFilters, open, setOpen,
  niche, setNiche, band, setBand, sort, setSort,
  verifiedOnly, setVerifiedOnly, clearFilters,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            'inline-flex items-center gap-2 px-3 h-9 rounded-md',
            'text-[10px] uppercase tracking-[0.22em]',
            'border border-cognac/40 text-cognac hover:bg-cognac/5 transition-colors',
            'shrink-0'
          )}
        >
          <Sliders className="h-3.5 w-3.5" strokeWidth={1.5} />
          Refine
          {activeFilters > 0 && (
            <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-cognac text-champagne text-[9px] tracking-normal">
              {activeFilters}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Filters</p>
          <DialogTitle className="text-3xl">Refine</DialogTitle>
        </DialogHeader>

        <div className="space-y-7 pt-2">
          <FilterGroup title="Niche">
            <Chip active={!niche} onClick={() => setNiche(null)}>All</Chip>
            {NICHES.map((n) => (
              <Chip key={n} active={niche === n} onClick={() => setNiche(niche === n ? null : n)}>{n}</Chip>
            ))}
          </FilterGroup>

          <FilterGroup title="Followers">
            {FOLLOWER_BANDS.map((b, i) => (
              <Chip key={i} active={band === i} onClick={() => setBand(i)}>{b.label}</Chip>
            ))}
          </FilterGroup>

          <FilterGroup title="Sort by">
            {SORTS.map((o) => (
              <Chip key={o.value} active={sort === o.value} onClick={() => setSort(o.value)}>{o.label}</Chip>
            ))}
          </FilterGroup>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70">Verified only</p>
              <p className="text-[11px] text-muted/85 mt-1">Show only creators with social OAuth verified</p>
            </div>
            <Switch checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
          </div>
        </div>

        <div className="flex gap-2 pt-5 mt-5 border-t border-cognac/15">
          <Button variant="outline" onClick={clearFilters} className="flex-1">Clear all</Button>
          <Button onClick={() => setOpen(false)} className="flex-1">Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-cognac/70 mb-3">{title}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}
