-- Flowyn Play/Journey full layer: native videos, lesson comments, intake, scheduling, certificates and notifications.

ALTER TABLE public.course_lessons
  ADD COLUMN IF NOT EXISTS video_file_path TEXT,
  ADD COLUMN IF NOT EXISTS material_file_paths TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE TABLE IF NOT EXISTS public.lesson_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.lesson_comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lesson_comments_lesson_id
  ON public.lesson_comments(lesson_id, created_at);

ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students and owners can view lesson comments" ON public.lesson_comments;
CREATE POLICY "Students and owners can view lesson comments"
ON public.lesson_comments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.student_access access
    WHERE access.user_id = (SELECT auth.uid())
      AND access.product_id = lesson_comments.product_id
  )
  OR EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = lesson_comments.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Students and owners can create lesson comments" ON public.lesson_comments;
CREATE POLICY "Students and owners can create lesson comments"
ON public.lesson_comments FOR INSERT TO authenticated
WITH CHECK (
  user_id = (SELECT auth.uid())
  AND (
    EXISTS (
      SELECT 1 FROM public.student_access access
      WHERE access.user_id = (SELECT auth.uid())
        AND access.product_id = lesson_comments.product_id
    )
    OR EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = lesson_comments.product_id
        AND p.owner_id = (SELECT auth.uid())
    )
  )
);

DROP POLICY IF EXISTS "Users can update own lesson comments" ON public.lesson_comments;
CREATE POLICY "Users can update own lesson comments"
ON public.lesson_comments FOR UPDATE TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own lesson comments" ON public.lesson_comments;
CREATE POLICY "Users can delete own lesson comments"
ON public.lesson_comments FOR DELETE TO authenticated
USING (user_id = (SELECT auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_comments TO authenticated;
GRANT ALL ON public.lesson_comments TO service_role;

CREATE TABLE IF NOT EXISTS public.mentorship_intake_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, student_id)
);

ALTER TABLE public.mentorship_intake_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mentorship intake visible to owner and student" ON public.mentorship_intake_responses;
CREATE POLICY "Mentorship intake visible to owner and student"
ON public.mentorship_intake_responses FOR SELECT TO authenticated
USING (
  student_id = (SELECT auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_intake_responses.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "Students can manage own intake" ON public.mentorship_intake_responses;
CREATE POLICY "Students can manage own intake"
ON public.mentorship_intake_responses FOR INSERT TO authenticated
WITH CHECK (
  student_id = (SELECT auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.student_access access
    WHERE access.user_id = (SELECT auth.uid())
      AND access.product_id = mentorship_intake_responses.product_id
  )
);

DROP POLICY IF EXISTS "Students can update own intake" ON public.mentorship_intake_responses;
CREATE POLICY "Students can update own intake"
ON public.mentorship_intake_responses FOR UPDATE TO authenticated
USING (student_id = (SELECT auth.uid()))
WITH CHECK (student_id = (SELECT auth.uid()));

GRANT SELECT, INSERT, UPDATE ON public.mentorship_intake_responses TO authenticated;
GRANT ALL ON public.mentorship_intake_responses TO service_role;

CREATE TABLE IF NOT EXISTS public.mentorship_availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  meeting_url TEXT,
  booked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booked_session_id UUID REFERENCES public.mentorship_sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT mentorship_availability_slot_time_check CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS idx_mentorship_availability_product_starts
  ON public.mentorship_availability_slots(product_id, starts_at);

ALTER TABLE public.mentorship_availability_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Mentorship slots visible to owner and students" ON public.mentorship_availability_slots;
CREATE POLICY "Mentorship slots visible to owner and students"
ON public.mentorship_availability_slots FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_availability_slots.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.student_access access
    WHERE access.user_id = (SELECT auth.uid())
      AND access.product_id = mentorship_availability_slots.product_id
  )
);

DROP POLICY IF EXISTS "Product owners can manage mentorship slots" ON public.mentorship_availability_slots;
CREATE POLICY "Product owners can manage mentorship slots"
ON public.mentorship_availability_slots FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_availability_slots.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = mentorship_availability_slots.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentorship_availability_slots TO authenticated;
GRANT ALL ON public.mentorship_availability_slots TO service_role;

CREATE TABLE IF NOT EXISTS public.course_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  certificate_code TEXT NOT NULL UNIQUE DEFAULT ('FYW-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 10))),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own certificates" ON public.course_certificates;
CREATE POLICY "Students can view own certificates"
ON public.course_certificates FOR SELECT TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = course_certificates.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
);

GRANT SELECT ON public.course_certificates TO authenticated;
GRANT ALL ON public.course_certificates TO service_role;

CREATE TABLE IF NOT EXISTS public.notification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT notification_events_status_check CHECK (status IN ('pending', 'sent', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_notification_events_product
  ON public.notification_events(product_id, event_type);

ALTER TABLE public.notification_events ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.notification_events TO service_role;
