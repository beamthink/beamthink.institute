-- Migration: Create user profiles and role-specific tables
-- Description: Sets up the foundation user system with students and teachers

-- Create custom user profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table for student-specific data
CREATE TABLE IF NOT EXISTS public.students (
  id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE PRIMARY KEY,
  primary_instrument TEXT NOT NULL CHECK (primary_instrument IN ('piano', 'guitar', 'viola', 'harp')),
  experience_level TEXT NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teachers table for teacher-specific data
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  specializations TEXT[] DEFAULT '{}',
  hourly_rate DECIMAL(10,2) DEFAULT 75.00,
  is_available BOOLEAN DEFAULT true,
  location_sharing_enabled BOOLEAN DEFAULT false,
  current_latitude DECIMAL(10,8),
  current_longitude DECIMAL(11,8),
  location_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for students
CREATE POLICY "Students can view own data" ON public.students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own data" ON public.students
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can insert own data" ON public.students
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for teachers
CREATE POLICY "Teachers can view own data" ON public.teachers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Teachers can update own data" ON public.teachers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Teachers can insert own data" ON public.teachers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Public policies for students to view their teachers
CREATE POLICY "Students can view their teachers" ON public.teachers
  FOR SELECT USING (true); -- Will be refined after lessons table exists

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_students_instrument ON public.students(primary_instrument);
CREATE INDEX IF NOT EXISTS idx_teachers_available ON public.teachers(is_available);
