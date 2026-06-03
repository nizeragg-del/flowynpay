-- Flowyn Play and Flowyn Journey: course progress and mentorship workspace.

ALTER TABLE public.student_access
  ADD COLUMN IF NOT EXISTS access_email TEXT,
  ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_student_access_product_id
  ON public.student_access(product_id);

CREATE INDEX IF NOT EXISTS idx_student_access_access_email
  ON public.student_access(LOWER(access_email));

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  last_position_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_product
  ON public.lesson_progress(user_id, product_id);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own lesson progress" ON public.lesson_progress;
CREATE POLICY "Students can view own lesson progress"
ON public.lesson_progress FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Students can manage own lesson progress" ON public.lesson_progress;
CREATE POLICY "Students can manage own lesson progress"
ON public.lesson_progress FOR INSERT TO authenticated
WITH CHECK (
  user_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1
    FROM public.student_access access
    WHERE access.user_id = (SELECT auth.uid())
      AND access.product_id = lesson_progress.product_id
  )
);

DROP POLICY IF EXISTS "Students can update own lesson progress" ON public.lesson_progress;
CREATE POLICY "Students can update own lesson progress"
ON public.lesson_progress FOR UPDATE TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

GRANT SELECT, INSERT, UPDATE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;

CREATE TABLE IF NOT EXISTS public.mentorship_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
  headline TEXT,
  promise TEXT,
  session_count INTEGER NOT NULL DEFAULT 4,
  session_duration_minutes INTEGER NOT NULL DEFAULT 60,
  meeting_url TEXT,
  intake_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.mentorship_programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Product owners can view mentorship programs" ON public.mentorship_programs;
CREATE POLICY "Product owners can view mentorship programs"
ON public.mentorship_programs FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_programs.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.student_access access
    WHERE access.user_id = (SELECT auth.uid())
      AND access.product_id = mentorship_programs.product_id
  )
);

DROP POLICY IF EXISTS "Product owners can manage mentorship programs" ON public.mentorship_programs;
CREATE POLICY "Product owners can manage mentorship programs"
ON public.mentorship_programs FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_programs.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_programs.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentorship_programs TO authenticated;
GRANT ALL ON public.mentorship_programs TO service_role;

CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  meeting_url TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT mentorship_sessions_status_check CHECK (
    status IN ('planned', 'scheduled', 'done', 'missed', 'cancelled')
  )
);

CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_product_student
  ON public.mentorship_sessions(product_id, student_id);

ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mentorship sessions visible to owner and student" ON public.mentorship_sessions;
CREATE POLICY "Mentorship sessions visible to owner and student"
ON public.mentorship_sessions FOR SELECT TO authenticated
USING (
  student_id = (SELECT auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_sessions.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Product owners can manage mentorship sessions" ON public.mentorship_sessions;
CREATE POLICY "Product owners can manage mentorship sessions"
ON public.mentorship_sessions FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_sessions.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_sessions.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentorship_sessions TO authenticated;
GRANT ALL ON public.mentorship_sessions TO service_role;

CREATE TABLE IF NOT EXISTS public.mentorship_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.mentorship_sessions(id) ON DELETE SET NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mentorship_tasks_product_student
  ON public.mentorship_tasks(product_id, student_id);

ALTER TABLE public.mentorship_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mentorship tasks visible to owner and student" ON public.mentorship_tasks;
CREATE POLICY "Mentorship tasks visible to owner and student"
ON public.mentorship_tasks FOR SELECT TO authenticated
USING (
  student_id = (SELECT auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_tasks.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Students can complete own mentorship tasks" ON public.mentorship_tasks;
CREATE POLICY "Students can complete own mentorship tasks"
ON public.mentorship_tasks FOR UPDATE TO authenticated
USING (student_id = (SELECT auth.uid()))
WITH CHECK (student_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Product owners can manage mentorship tasks" ON public.mentorship_tasks;
CREATE POLICY "Product owners can manage mentorship tasks"
ON public.mentorship_tasks FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_tasks.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_tasks.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentorship_tasks TO authenticated;
GRANT ALL ON public.mentorship_tasks TO service_role;
