-- Allow product owners to list private lessons in the producer dashboard.

CREATE POLICY IF NOT EXISTS "Product owners can view lessons"
ON public.course_lessons FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.products p
    WHERE p.id = course_lessons.product_id
      AND p.owner_id = (SELECT auth.uid())
  )
);
