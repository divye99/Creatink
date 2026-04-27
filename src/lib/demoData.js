// Curated dev seed data so every screen renders with rich content
// even without a live Supabase project.

export const DEMO_CREATORS = [
  {
    user_id: 'cr-001', name: 'Aanya Kapoor', handle: '@aanyak',
    photo_url: 'https://i.pravatar.cc/200?img=47',
    bio: 'Mumbai-based fashion + lifestyle creator. Honest reviews, calm aesthetics.',
    niches: ['Fashion','Lifestyle'], follower_count: 84500, engagement_rate: 5.2,
    availability: 'available', verified: true, tax_ready: true, castink_linked: true,
    top_demographic: { age_range: '18-24', gender_split: 'F 78%', top_city: 'Mumbai' },
    rate_card: { reel: 25000, story: 8000, static_post: 15000, youtube_video: null, custom_package: 60000 },
    state: 'Maharashtra', city: 'Mumbai',
  },
  {
    user_id: 'cr-002', name: 'Rohan Iyer', handle: '@rohaniyer',
    photo_url: 'https://i.pravatar.cc/200?img=12',
    bio: 'Tech reviewer. Phones, audio, and the occasional rant.',
    niches: ['Tech'], follower_count: 142000, engagement_rate: 3.4,
    availability: 'available', verified: true, tax_ready: true,
    top_demographic: { age_range: '18-34', gender_split: 'M 71%', top_city: 'Bengaluru' },
    rate_card: { reel: 35000, story: 12000, static_post: 22000, youtube_video: 90000, custom_package: 150000 },
    state: 'Karnataka', city: 'Bengaluru',
  },
  {
    user_id: 'cr-003', name: 'Mira Sen', handle: '@mira.eats',
    photo_url: 'https://i.pravatar.cc/200?img=32',
    bio: 'Food, recipes, restaurant reviews. Bengali roots, pan-Indian palate.',
    niches: ['Food','Lifestyle'], follower_count: 36800, engagement_rate: 6.7,
    availability: 'busy', verified: true,
    top_demographic: { age_range: '25-34', gender_split: 'F 64%', top_city: 'Kolkata' },
    rate_card: { reel: 14000, story: 5000, static_post: 9000, youtube_video: null, custom_package: 35000 },
    state: 'West Bengal', city: 'Kolkata',
  },
  {
    user_id: 'cr-004', name: 'Arjun Reddy', handle: '@arjunfit',
    photo_url: 'https://i.pravatar.cc/200?img=15',
    bio: 'Strength coach. Honest about supplements, calmer about cardio.',
    niches: ['Fitness','Health'], follower_count: 198000, engagement_rate: 4.1,
    availability: 'available', verified: true, tax_ready: true, castink_linked: false,
    top_demographic: { age_range: '18-34', gender_split: 'M 68%', top_city: 'Hyderabad' },
    rate_card: { reel: 42000, story: 15000, static_post: 28000, youtube_video: 110000, custom_package: 180000 },
    state: 'Telangana', city: 'Hyderabad',
  },
  {
    user_id: 'cr-005', name: 'Tara Mehta', handle: '@tara.travels',
    photo_url: 'https://i.pravatar.cc/200?img=23',
    bio: 'Slow travel, small budgets, good light.',
    niches: ['Travel','Lifestyle'], follower_count: 58200, engagement_rate: 5.9,
    availability: 'available', verified: true,
    top_demographic: { age_range: '22-34', gender_split: 'F 60%', top_city: 'Goa' },
    rate_card: { reel: 18000, story: 6000, static_post: 11000, youtube_video: null, custom_package: 45000 },
    state: 'Goa', city: 'Panaji',
  },
  {
    user_id: 'cr-006', name: 'Karan Shah', handle: '@karanmoney',
    photo_url: 'https://i.pravatar.cc/200?img=68',
    bio: 'Personal finance, made boring on purpose.',
    niches: ['Finance','Education'], follower_count: 112000, engagement_rate: 4.8,
    availability: 'available', verified: true, tax_ready: true,
    top_demographic: { age_range: '24-40', gender_split: 'M 72%', top_city: 'Pune' },
    rate_card: { reel: 32000, story: 11000, static_post: 20000, youtube_video: 85000, custom_package: 140000 },
    state: 'Maharashtra', city: 'Pune',
  },
]

export const DEMO_BRANDS = [
  {
    user_id: 'br-001', name: 'Saanvi Skincare', logo_url: 'https://i.pravatar.cc/200?img=5',
    description: 'Ayurveda-led clean skincare for Indian skin.',
    gst_pan: '07ABCDE1234F1Z5', categories: ['Beauty','Wellness'],
    target_audience: 'Women 22-35, urban India', contract_vault_url: 'demo://contract.pdf',
  },
  {
    user_id: 'br-002', name: 'TaraTech Audio', logo_url: 'https://i.pravatar.cc/200?img=11',
    description: 'Indian-designed wireless audio. Studio-grade tuning, street prices.',
    gst_pan: '29ABCDE5678F1Z9', categories: ['Tech'],
    target_audience: 'Young professionals, audiophiles', contract_vault_url: 'demo://contract.pdf',
  },
  {
    user_id: 'br-003', name: 'Khoya Kitchen', logo_url: 'https://i.pravatar.cc/200?img=42',
    description: 'Heritage Indian sweets reimagined. D2C, cold-chain, no preservatives.',
    gst_pan: '24ABCDE9012F1Z3', categories: ['Food & Bev'],
    target_audience: 'Families, gifters, festive shoppers',
  },
  {
    user_id: 'br-004', name: 'Vellum Fitness', logo_url: 'https://i.pravatar.cc/200?img=14',
    description: 'Whey, creatine, and patience. Made in India.',
    gst_pan: '36ABCDE3456F1Z7', categories: ['Wellness','Fitness'],
    target_audience: 'Gymgoers 18-34, value-conscious', contract_vault_url: 'demo://contract.pdf',
  },
]

export const DEMO_CAMPAIGNS = [
  {
    id: 'cmp-001', brand_id: 'br-001', title: 'Monsoon Glow Launch',
    brief: 'Launch our new monsoon serum range with authentic creator content. Looking for honest reviews after 14 days of use.',
    deliverables: ['Reel','Story','Static Post'], budget: 75000, status: 'open',
    timeline: { start: '2026-05-15', end: '2026-06-30' }, exclusivity: false,
    created_at: '2026-04-22T08:00:00Z',
  },
  {
    id: 'cmp-002', brand_id: 'br-002', title: 'Studio Buds — First Impressions',
    brief: 'Unboxing + 7-day daily-driver review of our new Studio Buds. Tech reviewers preferred.',
    deliverables: ['YouTube Video','Reel'], budget: 120000, status: 'open',
    timeline: { start: '2026-05-01', end: '2026-06-15' }, exclusivity: true,
    created_at: '2026-04-25T08:00:00Z',
  },
  {
    id: 'cmp-003', brand_id: 'br-003', title: 'Diwali Sweet Box Gifting',
    brief: 'Festive gifting collab. Recipe reels, unboxings, family moments.',
    deliverables: ['Reel','Stories'], budget: null, status: 'open',
    timeline: { start: '2026-05-05', end: '2026-05-30' }, exclusivity: false,
    created_at: '2026-04-26T10:00:00Z',
  },
  {
    id: 'cmp-004', brand_id: 'br-004', title: '90-Day Transformation',
    brief: '12-week training + supplementation collab. Looking for serious creators with engaged audiences.',
    deliverables: ['Custom Package'], budget: 200000, status: 'open',
    timeline: { start: '2026-05-10', end: '2026-08-10' }, exclusivity: true,
    created_at: '2026-04-20T08:00:00Z',
  },
]

export const DEMO_PITCHES = [
  {
    id: 'p-001', sender_id: 'br-001', receiver_id: 'cr-001', campaign_id: 'cmp-001',
    pitch_type: 'paid', deliverables: ['Reel','Story'], rate: 35000,
    note: 'Loved your monsoon haircare reel last week — the slow-burn aesthetic is exactly what we want.',
    status: 'pending', created_at: '2026-04-26T10:30:00Z',
  },
  {
    id: 'p-002', sender_id: 'cr-003', receiver_id: 'br-003', campaign_id: 'cmp-003',
    pitch_type: 'paid', deliverables: ['Reel','Stories'], rate: 22000,
    note: 'Bengali sweet recipes are my niche. I can shoot the unboxing in my home kitchen this week.',
    status: 'pending', created_at: '2026-04-25T14:00:00Z',
  },
]

export const DEMO_DEALS = [
  {
    id: 'd-001', creator_id: 'cr-001', brand_id: 'br-001',
    pitch_id: 'p-001', campaign_id: 'cmp-001',
    terms: { amount: 35000, deliverables: ['Reel','Story'], timeline: 'May 15 – Jun 5' },
    payment_schedule: [
      { label: 'Upfront', pct: 40, status: 'paid' },
      { label: 'On delivery', pct: 60, status: 'pending' },
    ],
    contract_url: 'demo://contract.pdf',
    contract_acknowledged_at: '2026-04-25T11:00:00Z',
    status: 'in_discussion', created_at: '2026-04-23T08:00:00Z',
  },
  {
    id: 'd-002', creator_id: 'cr-002', brand_id: 'br-002',
    pitch_id: null, campaign_id: 'cmp-002',
    terms: { amount: 120000, deliverables: ['YouTube Video','Reel'], timeline: 'May 1 – Jun 1' },
    payment_schedule: [
      { label: 'Upfront', pct: 30, status: 'paid' },
      { label: 'On approval', pct: 70, status: 'processing' },
    ],
    status: 'content_submitted', created_at: '2026-04-15T08:00:00Z',
  },
]

export const DEMO_MESSAGES = {
  'd-001': [
    { id: 'm1', deal_id: 'd-001', sender_id: 'br-001', content: 'Hi Aanya — excited to work together!', created_at: '2026-04-25T11:00:00Z' },
    { id: 'm2', deal_id: 'd-001', sender_id: 'cr-001', content: 'Thanks! I have a draft script for the Reel — sharing tomorrow.', created_at: '2026-04-25T11:05:00Z' },
    { id: 'm3', deal_id: 'd-001', sender_id: 'br-001', content: 'Perfect. Briefing PDF is in the chat.', attachment_url: 'demo://brief.pdf', created_at: '2026-04-26T09:30:00Z' },
  ],
  'd-002': [
    { id: 'm4', deal_id: 'd-002', sender_id: 'cr-002', content: 'Submitted final cut — link below.', created_at: '2026-04-26T16:00:00Z' },
  ],
}

export const DEMO_KPIS = {
  'd-002': {
    deal_id: 'd-002', reach: 412000, impressions: 680000, likes: 32400,
    comments: 1840, shares: 920, saves: 2100, story_views: 88000,
    link_clicks: 4200, promo_redemptions: 312,
    proof_url: 'https://youtube.com/watch?v=xxxx',
    brand_rating: 5, brand_note: 'Excellent execution, on-brief, on-time.',
  },
}

export const DEMO_MISSED = [
  { id: 'mo-1', user_id: 'cr-001', sender_name: 'Lakme PR', brand_name: 'Lakme',
    date_received: '2026-03-12', summary: 'Lakme reached out about a paid Reel collaboration for their winter range.',
    creatink_profile_id: null },
  { id: 'mo-2', user_id: 'cr-001', sender_name: 'Saanvi Team', brand_name: 'Saanvi Skincare',
    date_received: '2026-04-02', summary: 'Saanvi Skincare proposed a 3-month brand ambassador partnership.',
    creatink_profile_id: 'br-001' },
]

export const DEMO_PROFILE_VIEWS_CR_001 = [
  { brand: DEMO_BRANDS[0], count: 4, last: '2026-04-25' },
  { brand: DEMO_BRANDS[3], count: 2, last: '2026-04-23' },
  { brand: DEMO_BRANDS[1], count: 1, last: '2026-04-20' },
]
