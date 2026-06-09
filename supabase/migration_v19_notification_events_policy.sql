-- Migration v19: add RLS policy for notification_events
-- Ensures only the Supabase service_role key can access notification_events

ALTER TABLE public.notification_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only service role can manage notification events" ON public.notification_events;
CREATE POLICY "Only service role can manage notification events"
  ON public.notification_events
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

GRANT ALL ON public.notification_events TO service_role;
