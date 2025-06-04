-- Migration: Create locations and lessons tables
-- Description: Sets up the booking and scheduling system

-- Create locations table for lesson venues
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('home_studio', 'community_center', 'student_home', 'other')),
  additional_cost DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES public.locations(id) NOT NULL,
  instrument TEXT NOT NULL CHECK (instrument IN ('piano', 'guitar', 'viola', 'harp')),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')) DEFAULT 'scheduled',
  lesson_type TEXT NOT NULL CHECK (lesson_type IN ('single', 'package', 'subscription')) DEFAULT 'single',
  price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  teacher_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for locations (public read for active locations)
CREATE POLICY "Anyone can view active locations" ON public.locations
  FOR SELECT USING (is_active = true);

-- RLS Policies for lessons
CREATE POLICY "Students can view their lessons" ON public.lessons
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view their lessons" ON public.lessons
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Students can update their lesson notes" ON public.lessons
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage their lessons" ON public.lessons
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can book lessons" ON public.lessons
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_student_id ON public.lessons(student_id);
CREATE INDEX IF NOT EXISTS idx_lessons_teacher_id ON public.lessons(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_date ON public.lessons(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_lessons_status ON public.lessons(status);
CREATE INDEX IF NOT EXISTS idx_locations_type ON public.locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_active ON public.locations(is_active);
