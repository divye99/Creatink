// OAuth integration shims. In production each call returns the real
// follower count + handle from the platform's API. Without API keys we
// stub plausible values so onboarding runs end-to-end.

export async function connectInstagram() {
  await fakeDelay()
  return {
    platform: 'instagram',
    handle: '@yourhandle',
    follower_count: 42_300,
    engagement_rate: 4.8,
    verified: true,
  }
}

export async function connectYouTube() {
  await fakeDelay()
  return {
    platform: 'youtube',
    handle: '@yourchannel',
    follower_count: 18_500,
    engagement_rate: 3.6,
    verified: true,
  }
}

export async function connectTwitter() {
  await fakeDelay()
  return {
    platform: 'twitter',
    handle: '@yourhandle',
    follower_count: 9_800,
    engagement_rate: 2.4,
    verified: true,
  }
}

export async function connectGmail() {
  await fakeDelay()
  return { provider: 'gmail', token: 'stub-token', email: 'you@gmail.com' }
}

export async function connectOutlook() {
  await fakeDelay()
  return { provider: 'outlook', token: 'stub-token', email: 'you@outlook.com' }
}

function fakeDelay(ms = 800) { return new Promise((r) => setTimeout(r, ms)) }
