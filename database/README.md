# wlanvi Database Setup

This directory contains the database schema and migrations for the wlanvi music lessons platform.

## Migration Files

Run these SQL files in order in your Supabase SQL editor:

1. **001_create_users.sql** - User profiles, students, and teachers tables
2. **002_create_locations_and_lessons.sql** - Locations and lesson booking system
3. **003_create_assignments.sql** - Assignments and video submissions
4. **004_create_payments_and_notifications.sql** - Billing and notification system
5. **005_create_events_and_functions.sql** - Events, triggers, and utility functions

## Seed Data

After running all migrations, run:
- **seed/sample_data.sql** - Sample locations and events for testing

## Storage Buckets

Create these storage buckets in Supabase Storage:

1. **video-submissions** - For student assignment videos
2. **profile-avatars** - For user profile pictures
3. **event-images** - For event photos

## Environment Variables

Make sure these are set in your Vercel project:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Row Level Security

All tables have RLS enabled with appropriate policies:
- Users can only access their own data
- Students can view their teachers and lessons
- Teachers can manage their students' assignments
- Public data (events, locations) is accessible to all

## Next Steps

1. Run migrations in Supabase SQL editor
2. Create storage buckets
3. Update your Next.js app to use real Supabase client
4. Test authentication and data flow
