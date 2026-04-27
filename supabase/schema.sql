-- =====================================================================
-- CREATINK × CASTINK shared Supabase schema
-- One Postgres instance powers both apps. Phone number is the identity
-- anchor. linked_profiles bridges the two app-specific user rows.
-- =====================================================================

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
do $$ begin
  create type user_type_enum         as enum ('creator', 'brand');
  create type castink_user_type_enum as enum ('actor',   'casting_agent');
  create type availability_enum      as enum ('available', 'busy', 'not_taking');
  create type pitch_type_enum        as enum ('paid', 'barter');
  create type pitch_status_enum      as enum ('pending', 'accepted', 'declined', 'withdrawn');
  create type deal_status_enum       as enum (
    'applied', 'in_discussion', 'contracted',
    'content_submitted', 'approved', 'payment_released', 'cancelled'
  );
  create type payment_status_enum    as enum ('pending', 'processing', 'paid', 'failed');
  create type campaign_status_enum   as enum ('draft', 'open', 'closed', 'archived');
  create type badge_type_enum        as enum (
    'verified_creator', 'registered_business',
    'tax_ready', 'contract_ready', 'castink_linked'
  );
  create type castink_app_status_enum as enum (
    'applied', 'shortlisted', 'audition_scheduled', 'callback', 'offer_made', 'rejected'
  );
  create type experience_level_enum  as enum (
    'newcomer', 'some_experience', 'trained', 'working_actor'
  );
  create type audition_format_enum   as enum ('in_person', 'self_tape', 'either');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- 1. SHARED IDENTITY: every user across both apps anchors to phone.
-- ---------------------------------------------------------------------
create table if not exists users (
  id           uuid primary key default uuid_generate_v4(),
  phone        text unique not null check (phone ~ '^\+91[6-9][0-9]{9}$'),
  user_type    user_type_enum not null,
  email        text,
  verified     boolean not null default false,
  suspended    boolean not null default false,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz
);
create index if not exists users_phone_idx on users(phone);

-- ---------------------------------------------------------------------
-- 2. CREATOR PROFILES
-- ---------------------------------------------------------------------
create table if not exists creator_profiles (
  user_id          uuid primary key references users(id) on delete cascade,
  name             text not null,
  handle           text unique,
  photo_url        text,
  bio              text check (char_length(bio) <= 280),
  niches           text[] not null default '{}',
  follower_count   int  not null default 0,
  engagement_rate  numeric(5,2) not null default 0,
  rate_card        jsonb not null default '{
    "reel": null, "story": null, "static_post": null,
    "youtube_video": null, "custom_package": null
  }'::jsonb,
  availability     availability_enum not null default 'available',
  top_demographic  jsonb default '{"age_range": null, "gender_split": null, "top_city": null}'::jsonb,
  past_collabs     jsonb not null default '[]'::jsonb,
  tax_info         jsonb,  -- {legal_name, pan, gst, upi_id, bank_account, ifsc}
  oauth_handles    jsonb not null default '{}'::jsonb,  -- {instagram, youtube, twitter}
  city             text,
  state            text,
  language         text default 'en',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. BRAND PROFILES
-- ---------------------------------------------------------------------
create table if not exists brand_profiles (
  user_id            uuid primary key references users(id) on delete cascade,
  name               text not null,
  logo_url           text,
  description        text,
  gst_pan            text,
  categories         text[] not null default '{}',
  budget_range       jsonb default '{"min": null, "max": null, "currency": "INR"}'::jsonb,
  target_audience    text,
  contract_vault_url text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 4. CAMPAIGNS
-- ---------------------------------------------------------------------
create table if not exists campaigns (
  id            uuid primary key default uuid_generate_v4(),
  brand_id      uuid not null references users(id) on delete cascade,
  title         text not null,
  brief         text not null,
  product       text,
  deliverables  text[] not null default '{}',
  budget        numeric(12,2),
  timeline      jsonb,  -- {start, end}
  exclusivity   boolean not null default false,
  target_audience text,
  status        campaign_status_enum not null default 'open',
  created_at    timestamptz not null default now()
);
create index if not exists campaigns_brand_idx on campaigns(brand_id);
create index if not exists campaigns_status_idx on campaigns(status);

-- ---------------------------------------------------------------------
-- 5. PITCHES (bidirectional brand <-> creator)
-- ---------------------------------------------------------------------
create table if not exists pitches (
  id           uuid primary key default uuid_generate_v4(),
  sender_id    uuid not null references users(id) on delete cascade,
  receiver_id  uuid not null references users(id) on delete cascade,
  campaign_id  uuid references campaigns(id) on delete set null,
  pitch_type   pitch_type_enum not null,
  deliverables text[] not null default '{}',
  rate         numeric(12,2),
  exclusivity  boolean default false,
  timeline     jsonb,
  note         text,
  status       pitch_status_enum not null default 'pending',
  created_at   timestamptz not null default now(),
  responded_at timestamptz
);
create index if not exists pitches_receiver_idx on pitches(receiver_id, status);
create index if not exists pitches_sender_idx   on pitches(sender_id, status);

-- ---------------------------------------------------------------------
-- 6. DEALS (live, post-acceptance contract pipeline)
-- ---------------------------------------------------------------------
create table if not exists deals (
  id                       uuid primary key default uuid_generate_v4(),
  creator_id               uuid not null references users(id) on delete cascade,
  brand_id                 uuid not null references users(id) on delete cascade,
  pitch_id                 uuid references pitches(id) on delete set null,
  campaign_id              uuid references campaigns(id) on delete set null,
  terms                    jsonb not null,           -- {amount, deliverables[], timeline, exclusivity}
  payment_schedule         jsonb not null default '[]'::jsonb,  -- [{label, pct, status}]
  contract_url             text,
  contract_acknowledged_at timestamptz,
  status                   deal_status_enum not null default 'applied',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create index if not exists deals_creator_idx on deals(creator_id);
create index if not exists deals_brand_idx   on deals(brand_id);

-- ---------------------------------------------------------------------
-- 7. KPIs (one row per deal)
-- ---------------------------------------------------------------------
create table if not exists kpis (
  deal_id           uuid primary key references deals(id) on delete cascade,
  reach             int default 0,
  impressions       int default 0,
  likes             int default 0,
  comments          int default 0,
  shares            int default 0,
  saves             int default 0,
  story_views       int default 0,
  link_clicks       int default 0,
  promo_redemptions int default 0,
  proof_url         text,
  brand_rating      int check (brand_rating between 1 and 5),
  brand_note        text,
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 8. PAYMENTS
-- ---------------------------------------------------------------------
create table if not exists payments (
  id          uuid primary key default uuid_generate_v4(),
  deal_id     uuid not null references deals(id) on delete cascade,
  amount      numeric(12,2) not null,
  status      payment_status_enum not null default 'pending',
  upi_ref     text,
  razorpay_id text,
  invoice_url text,
  created_at  timestamptz not null default now(),
  paid_at     timestamptz
);
create index if not exists payments_deal_idx on payments(deal_id);

-- ---------------------------------------------------------------------
-- 9. MESSAGES (deal-scoped, unlocks after pitch accepted)
-- ---------------------------------------------------------------------
create table if not exists messages (
  id             uuid primary key default uuid_generate_v4(),
  deal_id        uuid not null references deals(id) on delete cascade,
  sender_id      uuid not null references users(id) on delete cascade,
  content        text,
  attachment_url text,
  read_at        timestamptz,
  created_at     timestamptz not null default now()
);
create index if not exists messages_deal_idx on messages(deal_id, created_at desc);

-- ---------------------------------------------------------------------
-- 10. PROFILE VIEWS  (only written if viewer opted in to who's_looking)
-- ---------------------------------------------------------------------
create table if not exists profile_views (
  id          uuid primary key default uuid_generate_v4(),
  viewer_id   uuid not null references users(id) on delete cascade,
  profile_id  uuid not null references users(id) on delete cascade,
  viewed_at   timestamptz not null default now()
);
create index if not exists profile_views_profile_idx on profile_views(profile_id, viewed_at desc);

-- ---------------------------------------------------------------------
-- 11. AI SETTINGS
-- ---------------------------------------------------------------------
create table if not exists ai_settings (
  user_id                  uuid primary key references users(id) on delete cascade,
  email_scanner_enabled    boolean not null default false,
  whos_looking_enabled     boolean not null default false,
  anonymous_browse_enabled boolean not null default false,
  email_provider           text,             -- 'gmail' | 'outlook'
  email_oauth_token        text,             -- encrypted at rest
  scanner_last_run_at      timestamptz,
  updated_at               timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 12. MISSED OPPORTUNITIES (raw email content discarded — only summary stored)
-- ---------------------------------------------------------------------
create table if not exists missed_opportunities (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references users(id) on delete cascade,
  sender_name         text,
  brand_name          text,
  date_received       timestamptz,
  summary             text not null,
  creatink_profile_id uuid references users(id) on delete set null,
  dismissed           boolean not null default false,
  created_at          timestamptz not null default now()
);
create index if not exists missed_user_idx on missed_opportunities(user_id, date_received desc);

-- ---------------------------------------------------------------------
-- 13. LINKED PROFILES (CREATINK <-> CASTINK bridge — shared with CASTINK)
-- ---------------------------------------------------------------------
create table if not exists linked_profiles (
  creatink_user_id uuid unique references users(id) on delete cascade,
  castink_user_id  uuid unique,
  stat_visibility  jsonb not null default '{
    "follower_count": true,
    "engagement_rate": true,
    "brand_deals_count": true,
    "primary_niche": true
  }'::jsonb,
  linked_at        timestamptz not null default now(),
  primary key (creatink_user_id, castink_user_id)
);

-- ---------------------------------------------------------------------
-- 14. BADGES
-- ---------------------------------------------------------------------
create table if not exists badges (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references users(id) on delete cascade,
  badge_type  badge_type_enum not null,
  awarded_at  timestamptz not null default now(),
  unique (user_id, badge_type)
);

-- ---------------------------------------------------------------------
-- 15. DISPUTES (admin queue)
-- ---------------------------------------------------------------------
create table if not exists disputes (
  id           uuid primary key default uuid_generate_v4(),
  reporter_id  uuid not null references users(id) on delete cascade,
  against_id   uuid not null references users(id) on delete cascade,
  deal_id      uuid references deals(id) on delete set null,
  reason       text not null,
  details      text,
  status       text not null default 'open',  -- 'open' | 'reviewing' | 'resolved'
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 16. CASTINK-SPECIFIC TABLES (shared instance)
-- ---------------------------------------------------------------------
create table if not exists castink_users (
  id         uuid primary key default uuid_generate_v4(),
  phone      text unique not null,
  user_type  castink_user_type_enum not null,
  created_at timestamptz not null default now()
);

create table if not exists actor_profiles (
  user_id                 uuid primary key references castink_users(id) on delete cascade,
  name                    text not null,
  age                     int,
  gender                  text,
  city                    text,
  languages               text[] default '{}',
  height_cm               int,
  weight_kg               int,
  build                   text,
  experience_level        experience_level_enum,
  genres                  text[] default '{}',
  photo_url               text,
  intro_video_url         text,
  scene_video_url         text,
  headshot_urls           text[] default '{}',
  showreel_url            text,
  availability            availability_enum default 'available',
  contact_sharing_enabled boolean not null default false
);

create table if not exists casting_agent_profiles (
  user_id          uuid primary key references castink_users(id) on delete cascade,
  agency_name      text not null,
  logo_url         text,
  bio              text,
  notable_projects text,
  role_types       text[] default '{}'
);

create table if not exists casting_calls (
  id              uuid primary key default uuid_generate_v4(),
  agent_id        uuid not null references castink_users(id) on delete cascade,
  role_name       text not null,
  description     text,
  age_min         int, age_max int,
  gender          text,
  languages       text[] default '{}',
  project_type    text,
  audition_format audition_format_enum,
  location        text,
  deadline        date,
  status          text default 'open',
  created_at      timestamptz not null default now()
);

create table if not exists casting_applications (
  id         uuid primary key default uuid_generate_v4(),
  call_id    uuid not null references casting_calls(id) on delete cascade,
  actor_id   uuid not null references castink_users(id) on delete cascade,
  cover_note text,
  status     castink_app_status_enum default 'applied',
  created_at timestamptz not null default now()
);

create table if not exists castink_favourites (
  agent_id   uuid not null references castink_users(id) on delete cascade,
  actor_id   uuid not null references castink_users(id) on delete cascade,
  list_name  text default 'General',
  created_at timestamptz not null default now(),
  primary key (agent_id, actor_id, list_name)
);

create table if not exists castink_messages (
  id              uuid primary key default uuid_generate_v4(),
  application_id  uuid references casting_applications(id) on delete set null,
  sender_id       uuid not null references castink_users(id) on delete cascade,
  receiver_id     uuid not null references castink_users(id) on delete cascade,
  content         text,
  attachment_url  text,
  created_at      timestamptz not null default now()
);

create table if not exists castink_profile_views (
  viewer_id  uuid references castink_users(id) on delete cascade,
  actor_id   uuid references castink_users(id) on delete cascade,
  viewed_at  timestamptz not null default now()
);

create table if not exists castink_ai_settings (
  user_id                  uuid primary key references castink_users(id) on delete cascade,
  casting_match_enabled    boolean default false,
  whos_looking_enabled     boolean default false,
  anonymous_browse_enabled boolean default false
);

create table if not exists castink_match_scores (
  agent_id     uuid references castink_users(id) on delete cascade,
  actor_id     uuid references castink_users(id) on delete cascade,
  score        numeric(5,2),
  reasoning    text,
  generated_at timestamptz not null default now(),
  primary key (agent_id, actor_id)
);

-- ---------------------------------------------------------------------
-- 17. UNIFIED PHONE-UNIQUENESS GUARD
-- A phone cannot exist as both a CREATINK creator AND brand simultaneously,
-- nor as a duplicate CREATINK + CASTINK signup (the latter must use linking).
-- ---------------------------------------------------------------------
create or replace function ensure_phone_uniqueness()
returns trigger as $$
begin
  if exists (
    select 1 from users        where phone = new.phone and id <> new.id
    union all
    select 1 from castink_users where phone = new.phone
  ) then
    raise exception 'PHONE_EXISTS' using errcode = '23505';
  end if;
  return new;
end $$ language plpgsql;

drop trigger if exists trg_users_phone_unique on users;
create trigger trg_users_phone_unique
  before insert on users
  for each row execute function ensure_phone_uniqueness();

create or replace function ensure_castink_phone_uniqueness()
returns trigger as $$
begin
  if exists (
    select 1 from castink_users where phone = new.phone and id <> new.id
  ) then
    raise exception 'PHONE_EXISTS' using errcode = '23505';
  end if;
  return new;
end $$ language plpgsql;

drop trigger if exists trg_castink_users_phone_unique on castink_users;
create trigger trg_castink_users_phone_unique
  before insert on castink_users
  for each row execute function ensure_castink_phone_uniqueness();

-- ---------------------------------------------------------------------
-- 18. UPDATED_AT triggers
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$ begin new.updated_at := now(); return new; end $$ language plpgsql;

do $$
declare t text;
begin
  for t in select unnest(array['creator_profiles','brand_profiles','deals','kpis','ai_settings']) loop
    execute format('drop trigger if exists trg_%I_updated on %I', t, t);
    execute format('create trigger trg_%I_updated before update on %I
      for each row execute function set_updated_at()', t, t);
  end loop;
end $$;
