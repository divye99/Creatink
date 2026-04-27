-- =====================================================================
-- Smart-match RPC functions. Both ranked by:
--   niche_overlap * 0.6  +  engagement_score * 0.25  +  verified * 0.15
-- (creator side flips niche-overlap denominator and weights baseline)
-- =====================================================================

-- Faster array overlap on hot tables
create index if not exists creator_profiles_niches_idx
  on creator_profiles using gin (niches);
create index if not exists brand_profiles_categories_idx
  on brand_profiles using gin (categories);
create index if not exists campaigns_status_idx2
  on campaigns (status, created_at desc);

-- ---------------------------------------------------------------------
-- Brand viewer → ranked creators
-- ---------------------------------------------------------------------
create or replace function match_creators_for_brand(brand_uuid uuid)
returns table (
  creator_id      uuid,
  name            text,
  handle          text,
  photo_url       text,
  bio             text,
  follower_count  int,
  engagement_rate numeric,
  niches          text[],
  availability    availability_enum,
  matched_niches  text[],
  score           numeric,
  reasoning       text
)
language sql stable security invoker as $$
  with brand as (
    select coalesce(categories, '{}'::text[]) as cats
    from brand_profiles
    where user_id = brand_uuid
  ),
  scored as (
    select
      cp.user_id, cp.name, cp.handle, cp.photo_url, cp.bio,
      cp.follower_count, cp.engagement_rate, cp.niches, cp.availability,
      array(select unnest(cp.niches) intersect select unnest(b.cats)) as overlap,
      coalesce(
        cardinality(array(select unnest(cp.niches) intersect select unnest(b.cats)))::numeric
        / nullif(cardinality(b.cats), 0),
        0
      ) as niche_score,
      least(coalesce(cp.engagement_rate, 0) / 5.0, 1.0) as eng_score,
      case when exists (
        select 1 from badges
        where badges.user_id = cp.user_id
          and badges.badge_type = 'verified_creator'
      ) then 1 else 0 end as verified_bonus
    from creator_profiles cp
    cross join brand b
    where cp.availability <> 'not_taking'
  )
  select
    user_id, name, handle, photo_url, bio,
    follower_count, engagement_rate, niches, availability,
    overlap as matched_niches,
    round((niche_score * 0.6 + eng_score * 0.25 + verified_bonus * 0.15) * 100, 1) as score,
    case
      when cardinality(overlap) > 0 then
        cardinality(overlap)::text || ' niche match · '
        || round(coalesce(engagement_rate, 0), 1)::text || '% engagement'
        || case when verified_bonus > 0 then ' · verified' else '' end
      else
        round(coalesce(engagement_rate, 0), 1)::text || '% engagement'
        || case when verified_bonus > 0 then ' · verified' else '' end
    end as reasoning
  from scored
  order by score desc, follower_count desc
  limit 20
$$;

grant execute on function match_creators_for_brand(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- Creator viewer → ranked open campaigns
-- ---------------------------------------------------------------------
create or replace function match_campaigns_for_creator(creator_uuid uuid)
returns table (
  campaign_id     uuid,
  brand_id        uuid,
  brand_name      text,
  brand_logo_url  text,
  title           text,
  brief           text,
  deliverables    text[],
  budget          numeric,
  exclusivity     boolean,
  created_at      timestamptz,
  matched_niches  text[],
  score           numeric,
  reasoning       text
)
language sql stable security invoker as $$
  with creator as (
    select coalesce(niches, '{}'::text[]) as niches
    from creator_profiles
    where user_id = creator_uuid
  ),
  scored as (
    select
      c.id, c.brand_id, bp.name as brand_name, bp.logo_url as brand_logo_url,
      c.title, c.brief, c.deliverables, c.budget, c.exclusivity, c.created_at,
      array(select unnest(coalesce(bp.categories, '{}'::text[])) intersect select unnest(cr.niches)) as overlap,
      coalesce(
        cardinality(array(select unnest(coalesce(bp.categories, '{}'::text[])) intersect select unnest(cr.niches)))::numeric
        / nullif(cardinality(cr.niches), 0),
        0
      ) as niche_score
    from campaigns c
    join brand_profiles bp on bp.user_id = c.brand_id
    cross join creator cr
    where c.status = 'open'
  )
  select
    id, brand_id, brand_name, brand_logo_url,
    title, brief, deliverables, budget, exclusivity, created_at,
    overlap,
    round((niche_score * 0.7 + 0.3) * 100, 1) as score,
    case
      when cardinality(overlap) > 0 then
        'Matches your ' || array_to_string(overlap, ', ') || ' niche'
      else
        'Open campaign — no exact niche match'
    end as reasoning
  from scored
  order by score desc, created_at desc
  limit 20
$$;

grant execute on function match_campaigns_for_creator(uuid) to authenticated;
