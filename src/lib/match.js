// Smart-match wrapper. Calls the Supabase RPCs in live mode; mirrors
// the same scoring formula in JS for stub/dev mode so the UI behaves
// identically with or without a live database.
import { supabase, SUPABASE_LIVE } from './supabase'
import { DEMO_CREATORS, DEMO_BRANDS, DEMO_CAMPAIGNS } from './demoData'

const round1 = (n) => Math.round(n * 10) / 10

// Brand → ranked creators
export async function matchCreatorsForBrand(brandId, brandCategories = []) {
  if (SUPABASE_LIVE && brandId) {
    const { data, error } = await supabase.rpc('match_creators_for_brand', { brand_uuid: brandId })
    if (error) throw error
    return data || []
  }
  return DEMO_CREATORS
    .filter((c) => c.availability !== 'not_taking')
    .map((c) => {
      const overlap = (c.niches || []).filter((n) => brandCategories.includes(n))
      const nicheScore = brandCategories.length ? overlap.length / brandCategories.length : 0
      const engScore = Math.min((c.engagement_rate || 0) / 5, 1)
      const verifiedBonus = c.verified ? 1 : 0
      const score = round1((nicheScore * 0.6 + engScore * 0.25 + verifiedBonus * 0.15) * 100)
      const reasoning = overlap.length
        ? `${overlap.length} niche match · ${round1(c.engagement_rate || 0)}% engagement${c.verified ? ' · verified' : ''}`
        : `${round1(c.engagement_rate || 0)}% engagement${c.verified ? ' · verified' : ''}`
      return { ...c, creator_id: c.user_id, matched_niches: overlap, score, reasoning }
    })
    .sort((a, b) => b.score - a.score || b.follower_count - a.follower_count)
    .slice(0, 20)
}

// Creator → ranked open campaigns
export async function matchCampaignsForCreator(creatorId, creatorNiches = []) {
  if (SUPABASE_LIVE && creatorId) {
    const { data, error } = await supabase.rpc('match_campaigns_for_creator', { creator_uuid: creatorId })
    if (error) throw error
    return data || []
  }
  return DEMO_CAMPAIGNS
    .filter((c) => c.status === 'open')
    .map((c) => {
      const brand = DEMO_BRANDS.find((b) => b.user_id === c.brand_id)
      const overlap = (brand?.categories || []).filter((cat) => creatorNiches.includes(cat))
      const nicheScore = creatorNiches.length ? overlap.length / creatorNiches.length : 0
      const score = round1((nicheScore * 0.7 + 0.3) * 100)
      const reasoning = overlap.length
        ? `Matches your ${overlap.join(', ')} niche`
        : 'Open campaign — no exact niche match'
      return {
        ...c,
        campaign_id: c.id,
        brand_name: brand?.name,
        brand_logo_url: brand?.logo_url,
        matched_niches: overlap,
        score,
        reasoning,
      }
    })
    .sort((a, b) => b.score - a.score || new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20)
}
