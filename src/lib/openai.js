// AI summarisation hooks. Real calls happen server-side via a Supabase
// edge function (so the OpenAI key is never shipped to the browser).
// In dev we synthesise plausible responses.

export async function summariseEmailForCollab(emailMeta) {
  await new Promise((r) => setTimeout(r, 400))
  const brand = emailMeta?.brand_name || extractBrand(emailMeta?.from)
  return {
    brand_name: brand,
    summary: `${brand} reached out about a paid Reel partnership for an upcoming product launch.`,
    confidence: 0.86,
  }
}

export async function suggestMatchScore({ brand, creator }) {
  await new Promise((r) => setTimeout(r, 250))
  const niche = (creator?.niches || [])[0] || 'Lifestyle'
  return {
    score: 0.91,
    reasoning: `${creator?.name || 'Creator'} (${niche}, ${creator?.follower_count?.toLocaleString('en-IN') || '—'} followers) closely matches ${brand?.name || 'this brand'}'s audience profile.`,
  }
}

function extractBrand(from) {
  if (!from) return 'a brand'
  const m = from.match(/^([^<@]+)/)
  return (m?.[1] || from).trim()
}
