import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatINR = (n) => {
  if (n == null || isNaN(n)) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n)
}

export const formatFollowers = (n) => {
  if (n == null) return '—'
  if (n >= 1_00_00_000) return (n / 1_00_00_000).toFixed(1) + ' Cr'
  if (n >= 1_00_000)    return (n / 1_00_000).toFixed(1) + ' L'
  if (n >= 1000)        return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

export const engagementColor = (rate) => {
  if (rate == null) return 'text-muted'
  if (rate > 4) return 'text-success'
  if (rate >= 2) return 'text-warning'
  return 'text-error'
}

export const NICHES = [
  'Fashion','Beauty','Tech','Food','Travel','Fitness','Lifestyle','Gaming',
  'Finance','Parenting','Health','Education','Comedy','Music','Dance','Other',
]

export const DELIVERABLES = [
  'Reel','Carousel','Static Post','Stories','YouTube Video','Custom Package','Full Package',
]

export const LANGUAGES = [
  'English','Hindi','Tamil','Telugu','Marathi','Bengali','Punjabi',
  'Gujarati','Kannada','Malayalam','Odia','Assamese',
]

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu and Kashmir','Ladakh','Puducherry','Chandigarh',
]

export const validateIndianMobile = (raw) => {
  const cleaned = String(raw || '').replace(/\D/g, '').replace(/^91/, '')
  return /^[6-9][0-9]{9}$/.test(cleaned) ? '+91' + cleaned : null
}

export const validatePAN = (s) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test((s||'').toUpperCase())
export const validateGST = (s) =>
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test((s||'').toUpperCase())

export const dayDelta = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const days = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7)   return `${days}d ago`
  if (days < 30)  return `${Math.floor(days/7)}w ago`
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
