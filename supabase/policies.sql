-- =====================================================================
-- Row-Level Security policies. Enable RLS on every table, default deny.
-- auth.uid() is the Supabase Auth user id, mapped 1:1 to users.id.
-- =====================================================================

alter table users                  enable row level security;
alter table creator_profiles       enable row level security;
alter table brand_profiles         enable row level security;
alter table campaigns              enable row level security;
alter table pitches                enable row level security;
alter table deals                  enable row level security;
alter table kpis                   enable row level security;
alter table payments               enable row level security;
alter table messages               enable row level security;
alter table profile_views          enable row level security;
alter table ai_settings            enable row level security;
alter table missed_opportunities   enable row level security;
alter table linked_profiles        enable row level security;
alter table badges                 enable row level security;
alter table disputes               enable row level security;

-- USERS: anyone authenticated can read public profile rows; only self can update.
create policy users_read_all on users for select to authenticated using (true);
create policy users_update_self on users for update to authenticated using (auth.uid() = id);

-- CREATOR PROFILES: public read, owner write.
create policy creators_read on creator_profiles for select to authenticated using (true);
create policy creators_write on creator_profiles for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- BRAND PROFILES: same pattern.
create policy brands_read on brand_profiles for select to authenticated using (true);
create policy brands_write on brand_profiles for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- CAMPAIGNS: open campaigns visible to all; brand can write its own.
create policy campaigns_read on campaigns for select to authenticated
  using (status in ('open','closed') or brand_id = auth.uid());
create policy campaigns_write on campaigns for all to authenticated
  using (brand_id = auth.uid()) with check (brand_id = auth.uid());

-- PITCHES: only sender + receiver can read. Sender writes; receiver updates status.
create policy pitches_read on pitches for select to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy pitches_insert on pitches for insert to authenticated
  with check (sender_id = auth.uid());
create policy pitches_update on pitches for update to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid());

-- DEALS: only the two parties.
create policy deals_read on deals for select to authenticated
  using (creator_id = auth.uid() or brand_id = auth.uid());
create policy deals_write on deals for all to authenticated
  using (creator_id = auth.uid() or brand_id = auth.uid())
  with check (creator_id = auth.uid() or brand_id = auth.uid());

-- KPIs follow deal access.
create policy kpis_rw on kpis for all to authenticated
  using (exists (select 1 from deals d where d.id = kpis.deal_id
                 and (d.creator_id = auth.uid() or d.brand_id = auth.uid())))
  with check (exists (select 1 from deals d where d.id = kpis.deal_id
                 and (d.creator_id = auth.uid() or d.brand_id = auth.uid())));

-- PAYMENTS: parties can read; only system inserts.
create policy payments_read on payments for select to authenticated
  using (exists (select 1 from deals d where d.id = payments.deal_id
                 and (d.creator_id = auth.uid() or d.brand_id = auth.uid())));

-- MESSAGES: only deal participants.
create policy messages_rw on messages for all to authenticated
  using (exists (select 1 from deals d where d.id = messages.deal_id
                 and (d.creator_id = auth.uid() or d.brand_id = auth.uid())))
  with check (sender_id = auth.uid()
             and exists (select 1 from deals d where d.id = messages.deal_id
                 and (d.creator_id = auth.uid() or d.brand_id = auth.uid())));

-- PROFILE VIEWS: only the profile owner can read who viewed them, and only
-- if both they and the viewer have whos_looking_enabled.
create policy profile_views_owner_read on profile_views for select to authenticated
  using (
    profile_id = auth.uid()
    and exists (select 1 from ai_settings me     where me.user_id = auth.uid()    and me.whos_looking_enabled)
    and exists (select 1 from ai_settings other  where other.user_id = viewer_id and other.whos_looking_enabled)
  );
create policy profile_views_insert on profile_views for insert to authenticated
  with check (
    viewer_id = auth.uid()
    and exists (select 1 from ai_settings me where me.user_id = auth.uid() and me.whos_looking_enabled)
    and not exists (select 1 from ai_settings me where me.user_id = auth.uid() and me.anonymous_browse_enabled)
  );

-- AI SETTINGS: self only.
create policy ai_settings_self on ai_settings for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- MISSED OPPORTUNITIES: self only.
create policy missed_self on missed_opportunities for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- LINKED PROFILES: readable by either side.
create policy linked_read on linked_profiles for select to authenticated
  using (creatink_user_id = auth.uid());
create policy linked_write on linked_profiles for all to authenticated
  using (creatink_user_id = auth.uid()) with check (creatink_user_id = auth.uid());

-- BADGES: public read, system writes.
create policy badges_read on badges for select to authenticated using (true);

-- DISPUTES: only reporter can read their own; admin via service role.
create policy disputes_read on disputes for select to authenticated
  using (reporter_id = auth.uid());
create policy disputes_insert on disputes for insert to authenticated
  with check (reporter_id = auth.uid());
