-- Optional seed data for local dev. Insert via service role.
insert into users (id, phone, user_type, verified) values
  ('11111111-1111-1111-1111-111111111111', '+919999900001', 'creator', true),
  ('22222222-2222-2222-2222-222222222222', '+919999900002', 'brand',   true)
on conflict (phone) do nothing;

insert into creator_profiles (user_id, name, handle, bio, niches, follower_count, engagement_rate, availability, city, state)
values ('11111111-1111-1111-1111-111111111111', 'Aanya Kapoor', '@aanyak', 'Mumbai-based fashion + lifestyle creator.',
        array['Fashion','Lifestyle'], 84500, 5.20, 'available', 'Mumbai', 'Maharashtra')
on conflict do nothing;

insert into brand_profiles (user_id, name, description, gst_pan, categories, target_audience)
values ('22222222-2222-2222-2222-222222222222', 'Saanvi Skincare', 'Ayurveda-led clean skincare for Indian skin.',
        '07ABCDE1234F1Z5', array['Beauty','Wellness'], 'Women 22-35, urban India')
on conflict do nothing;

insert into campaigns (brand_id, title, brief, deliverables, budget, exclusivity, status)
values ('22222222-2222-2222-2222-222222222222',
        'Monsoon Glow Launch',
        'Launch our new monsoon serum range with authentic creator content.',
        array['Reel','Story','Static Post'], 75000, false, 'open')
on conflict do nothing;
