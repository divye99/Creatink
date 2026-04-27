# CREATINK — Creator Link

India-based influencer × brand matchmaking platform for micro and mid-tier creators (10K–200K followers). Sister app to **CASTINK** (the casting platform); both share the same Supabase instance.

> **Tagline:** Creator Link — direct collaborations, no agencies, no middlemen.

---

## Stack

| Layer            | Tech                                                                 |
|------------------|----------------------------------------------------------------------|
| Frontend         | React 18 + Vite + Tailwind CSS + shadcn/ui (Radix primitives)        |
| Backend / DB     | Supabase (Postgres) — shared with CASTINK                            |
| Auth             | Supabase Auth — Indian mobile OTP (+91 only)                         |
| Social OAuth     | Instagram, YouTube, Twitter (creator verification + follower pull)   |
| Email OAuth      | Gmail, Outlook (for AI Email Scanner — opt-in)                       |
| Payments         | Razorpay (UPI / Paytm / bank transfer in INR)                        |
| AI               | OpenAI GPT-4o (email summarisation + match scoring) — server-side    |
| Charts           | Recharts                                                              |
| PDF              | @react-pdf/renderer (GST-compliant invoices, talent dossiers)        |
| Deployment       | Vercel                                                                |

---

## Quick start

```bash
cp .env.example .env       # add Supabase + OAuth + Razorpay keys
npm install
npm run dev                # http://localhost:5173
```

Without env keys the app runs against an in-memory stub for Supabase + OAuth + Razorpay so every screen is fully demo-able end-to-end.

---

## Database

The full schema lives in `supabase/`:

```bash
psql $SUPABASE_DB_URL < supabase/schema.sql
psql $SUPABASE_DB_URL < supabase/policies.sql   # RLS
psql $SUPABASE_DB_URL < supabase/seed.sql       # optional dev seed
```

### Shared with CASTINK

- A single `users` row per Indian phone number anchors all identity.
- `linked_profiles(creatink_user_id, castink_user_id, stat_visibility jsonb)` bridges the two apps.
- A custom Postgres trigger blocks duplicate signups across either app — the only legal cross-app flow is *linking* an existing CREATINK account to a new CASTINK profile (or vice versa).
- Per-stat privacy toggles control which CREATINK metrics surface on a CASTINK actor card.

### Highlights of the data model

- `pitches` is bidirectional — both brands and creators send structured pitch cards.
- `deals` carries `terms`, `payment_schedule`, and a contract-acknowledgement timestamp.
- `kpis` is a 1:1 record per deal, populated post-`content_submitted`.
- `profile_views` is **only** writable when the viewer has `whos_looking_enabled=true` and `anonymous_browse_enabled=false`. RLS only allows the profile owner to read views, and only when both they and the viewer have `whos_looking_enabled=true`.
- `missed_opportunities` stores AI summaries — never raw email content.
- `disputes` feeds the admin queue.

---

## App map

```
/                              → /home
/login          /signup        Indian OTP, disclaimer checkbox
/onboarding     /onboarding/creator   /onboarding/brand
/home                          Smart-match feed, trending niches, AI insight tiles
/discover                      Creators / Brands / Campaigns tabs, full filters
/campaigns      /campaigns/new /campaigns/:id   Active deals + open campaigns
/messages       /messages/:dealId   Chat (unlocks post-pitch acceptance)
/profile        /profile/edit /settings   Profile, Tax Info / Contract Vault, AI consent
/pitch/:targetId   Structured pitch builder
/deals/:id/kpis    KPI dashboard with Recharts + PDF export
/deals/:id/pay     Payment tracker, Razorpay payouts, GST invoices
/whos-looking      Mutual opt-in profile-view feed
/missed-opportunities   AI-summarised email collab finds
/notifications
/admin             Password-gated admin panel (env: VITE_ADMIN_PASSWORD)
```

---

## Design system (single source of truth)

| Role            | Token       | Hex       | Usage                                                   |
|-----------------|-------------|-----------|---------------------------------------------------------|
| Canvas          | `bg`        | `#8FA3BF` | Slate blue — the entire app background                  |
| Card surface    | `card`      | `#E8D5B0` | Champagne "paper" cards on the slate canvas             |
| Primary CTA     | `cognac`    | `#8B5E3C` | Buttons, active tabs/chips, progress, switch on, charts |
| Energy accent   | `hermes`    | `#E8600A` | **Only** for unread dots, live indicators, urgency      |
| Light text on cognac | `champagne` | `#E8D5B0` | Text inside cognac fills (CTAs, active tabs)        |
| Body text       | `body`      | `#1A1410` | Warm near-black — for body text on champagne cards     |
| Muted text      | `muted`     | `#6B5D4F` | Warm muted brown                                        |
| Border          | `border`    | `#BFA47C` | Darker tan — gives champagne cards visible edges        |
| Success / Warn / Error | … | `#2ECC71` `#F39C12` `#E74C3C` |                                |

- Headings use **Playfair Display**, body uses **Inter**.
- All cards have `border-radius: 16px` and a cognac glow on hover/focus.
- Hermès orange (`#E8600A`) is reserved for notification dots, unread badges, and live indicators — never as a background or large surface.
- Champagne is reserved for primary CTAs and active nav states.
- Bottom nav (mobile-first): Home / Discover / Campaigns / Messages / Profile.
- Splash screen: CREATINK in Playfair bold slate-blue, "Creator Link" in Inter light champagne, slow fade-in.

---

## India-specific

- All currency in **INR (₹)** with `Intl.NumberFormat('en-IN')`.
- Indian mobile OTP (+91) is the **only** login method — phone is the identity anchor across both apps.
- City + state dropdowns use Indian geography.
- Language toggle: English (default) + Hindi. Wire-frame for Tamil, Telugu, Marathi, Bengali, Punjabi, Gujarati, Kannada, Malayalam, Odia, Assamese.
- GST-compliant invoices rendered as PDF (PAN + GST lines, 18% on the GST flag).
- Razorpay for UPI / Paytm / bank payouts.

---

## Security & compliance

- **Disclaimer checkbox** is mandatory on signup (creator + brand) — signup cannot proceed without it.
- **Tax Info** is required before a creator can accept paid pitches. Stored encrypted, never displayed publicly.
- **Contract Vault** is required before a brand can initiate paid pitches. Contract acknowledgement is captured in-app (not a legal e-signature).
- **AI features off by default**, opt-in with explicit consent, instantly revokable.
- **Profile views** require mutual opt-in for visibility, with an optional Anonymous Browse mode.
- **Row-Level Security** enforced on every table — see `supabase/policies.sql`.

---

## Deployment

The repo is Vercel-ready (`vercel.json` includes the SPA rewrite + asset cache headers). On first deploy, set the env vars from `.env.example` in the Vercel dashboard.

```bash
vercel       # link
vercel --prod
```

---

## Status

Built end-to-end in one pass — frontend, schema, RLS, auth, onboarding, all core features, AI integrations, admin panel. The app boots and is fully navigable without any external API keys (uses an in-memory stub for Supabase, OAuth, Razorpay, and OpenAI). Wire real keys in `.env` to flip every integration to live mode without code changes.
