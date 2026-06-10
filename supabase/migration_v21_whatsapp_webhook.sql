-- Create WhatsApp webhook logs table for remarketing and abandoned cart flows
CREATE TABLE IF NOT EXISTS public.whatsapp_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'received',
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_webhook_logs_created_at
  ON public.whatsapp_webhook_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_whatsapp_webhook_logs_event_type
  ON public.whatsapp_webhook_logs(event_type);

CREATE INDEX IF NOT EXISTS idx_whatsapp_webhook_logs_status
  ON public.whatsapp_webhook_logs(status);

ALTER TABLE public.whatsapp_webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can read whatsapp webhook logs"
  ON public.whatsapp_webhook_logs FOR SELECT
  USING (true);

CREATE POLICY "Only service role can insert whatsapp webhook logs"
  ON public.whatsapp_webhook_logs FOR INSERT
  WITH CHECK (true);
