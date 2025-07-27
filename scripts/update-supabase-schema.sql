-- Add sanity_person_id column to link Supabase to Sanity
ALTER TABLE ai_advisors ADD COLUMN sanity_person_id TEXT;

-- Update existing advisors with their Sanity IDs (you'll update these once Sanity is set up)
UPDATE ai_advisors SET sanity_person_id = 'minerva-haugabrooks-person' WHERE slug = 'minerva-haugabrooks';
UPDATE ai_advisors SET sanity_person_id = 'james-smith-person' WHERE slug = 'james-smith';
