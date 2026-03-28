-- Migration: add featured column + seed initial featured nominees
-- Run this against your Supabase database

ALTER TABLE nominees ADD COLUMN IF NOT EXISTS featured boolean default false;

-- Seed the 12 curated featured nominees (approved + featured)
INSERT INTO nominees (name, photo_url, state, lga, field, writeup, status, featured, nomination_count)
VALUES
  (
    'Ngozi Okonjo-Iweala',
    'https://upload.wikimedia.org/wikipedia/commons/c/ce/Ngozi_Okonjo-Iweala_takes_over_as_new_WTO_Director-General%2C_1_March_2021_%2850993534756%29_%28cropped%29.jpg',
    'Delta', 'Ogwashi-Uku', 'Economics',
    'WTO Director-General · 2× Finance Minister',
    'approved', true, 0
  ),
  (
    'Akinwumi Adesina',
    'https://upload.wikimedia.org/wikipedia/commons/6/64/Akinwumi_Adesina_-_2014_%28cropped%29.jpg',
    'Oyo', 'Iseyin', 'Agriculture & Finance',
    'President, African Development Bank',
    'approved', true, 0
  ),
  (
    'Amina J. Mohammed',
    'https://upload.wikimedia.org/wikipedia/commons/c/c9/UN_Deputy_Secretary_General_Amina_J._Mohammed_%283x4_cropped%29.jpg',
    'Gombe', 'Gombe', 'International Development',
    'UN Deputy Secretary-General',
    'approved', true, 0
  ),
  (
    'Oby Ezekwesili',
    'https://upload.wikimedia.org/wikipedia/commons/6/6e/Obiageli_Katryn_Ezekwesili%2C_2009_World_Economic_Forum_on_Africa.jpg',
    'Anambra', 'Onitsha North', 'Governance & Anti-Corruption',
    'Co-founder, Transparency International · #BBOG',
    'approved', true, 0
  ),
  (
    'Tunji Ojo',
    null,
    'Ondo', 'Akoko North-East', 'Politics & Governance',
    'Minister of Interior · Ondo State federal lawmaker',
    'approved', true, 0
  ),
  (
    'Funke Opeke',
    'https://upload.wikimedia.org/wikipedia/commons/2/22/Funke_Opeke_-_ITU_Telecom_World_2016_-_Industry_Leaders_Roundtable_%28cropped%29.jpg',
    'Lagos', 'Apapa', 'Technology & Infrastructure',
    'CEO MainOne · Built West Africa''s first private fibre cable',
    'approved', true, 0
  ),
  (
    'Alex Otti',
    null,
    'Abia', 'Bende', 'Politics & Finance',
    'Governor, Abia State · Former Unity Bank CEO',
    'approved', true, 0
  ),
  (
    'Randy Peters',
    null,
    'Rivers', 'Port Harcourt', 'Community Development',
    'Grassroots community organiser & youth advocate',
    'approved', true, 0
  ),
  (
    'Aisha Yesufu',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Aisha_Yesufu_2.jpg/440px-Aisha_Yesufu_2.jpg',
    'Kano', 'Kano Municipal', 'Civil Society & Activism',
    'Co-convener #BringBackOurGirls · #EndSARS frontline activist',
    'approved', true, 0
  ),
  (
    'Senator Natasha Akpoti-Uduaghan',
    null,
    'Kogi', 'Okehi', 'Politics & Governance',
    'Senator, Kogi Central · Anti-corruption & women''s rights champion',
    'approved', true, 0
  ),
  (
    'Senator Ireti Kingibe',
    null,
    'FCT', 'Abuja Municipal', 'Law & Politics',
    'Senator, FCT · Human rights lawyer & former SDP presidential candidate',
    'approved', true, 0
  ),
  (
    'Dele Farotimi',
    null,
    'Ekiti', 'Ado-Ekiti', 'Law & Activism',
    'Human rights lawyer · Author · Fearless voice against injustice',
    'approved', true, 0
  )
ON CONFLICT DO NOTHING;
