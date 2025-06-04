-- Migration: Create assignments and submissions tables
-- Description: Sets up the assignment and homework system with video submissions

-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instrument TEXT NOT NULL CHECK (instrument IN ('piano', 'guitar', 'viola', 'harp')),
  due_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('assigned', 'in_progress', 'submitted', 'completed', 'overdue')) DEFAULT 'assigned',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignment submissions table
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('text', 'video', 'audio')) DEFAULT 'text',
  content TEXT, -- For text submissions
  file_url TEXT, -- For video/audio files stored in Supabase Storage
  file_name TEXT, -- Original filename
  file_size BIGINT, -- File size in bytes
  transcript TEXT, -- Auto-generated transcript for video/audio
  ai_summary TEXT, -- AI-generated summary
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  teacher_feedback TEXT,
  feedback_given_at TIMESTAMP WITH TIME ZONE,
  grade INTEGER CHECK (grade >= 1 AND grade <= 5),
  is_reviewed BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assignments
CREATE POLICY "Students can view their assignments" ON public.assignments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view their assignments" ON public.assignments
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can create assignments" ON public.assignments
  FOR INSERT WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update their assignments" ON public.assignments
  FOR UPDATE USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their assignments" ON public.assignments
  FOR DELETE USING (teacher_id = auth.uid());

-- RLS Policies for assignment submissions
CREATE POLICY "Students can view their submissions" ON public.assignment_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assignments 
      WHERE assignments.id = assignment_submissions.assignment_id 
      AND assignments.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view submissions for their assignments" ON public.assignment_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assignments 
      WHERE assignments.id = assignment_submissions.assignment_id 
      AND assignments.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can create submissions for their assignments" ON public.assignment_submissions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.assignments 
      WHERE assignments.id = assignment_submissions.assignment_id 
      AND assignments.student_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their own submissions" ON public.assignment_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.assignments 
      WHERE assignments.id = assignment_submissions.assignment_id 
      AND assignments.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update submissions (feedback)" ON public.assignment_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.assignments 
      WHERE assignments.id = assignment_submissions.assignment_id 
      AND assignments.teacher_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assignments_student_id ON public.assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment_id ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_submitted_at ON public.assignment_submissions(submitted_at);
