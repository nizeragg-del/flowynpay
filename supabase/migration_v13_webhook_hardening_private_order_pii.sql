-- Harden the Asaas event inbox and move checkout PII out of the operational order table.

CREATE TABLE IF NOT EXISTS public.order_customer_private (
  order_id UUID PRIMARY KEY REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_email TEXT,
  document_number TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.order_customer_private ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only service role can manage private order customer data" ON public.order_customer_private;
CREATE POLICY "Only service role can manage private order customer data"
ON public.order_customer_private FOR ALL
USING (false)
WITH CHECK (false);

REVOKE ALL ON public.order_customer_private FROM anon, authenticated;
GRANT ALL ON public.order_customer_private TO service_role;

INSERT INTO public.order_customer_private (order_id, customer_name, customer_email, document_number, phone)
SELECT id, customer_name, customer_email, customer_document, customer_phone
FROM public.orders
ON CONFLICT (order_id) DO UPDATE SET
  customer_name = EXCLUDED.customer_name,
  customer_email = EXCLUDED.customer_email,
  document_number = EXCLUDED.document_number,
  phone = EXCLUDED.phone,
  updated_at = NOW();

UPDATE public.orders
SET customer_name = split_part(trim(customer_name), ' ', 1),
    customer_email = regexp_replace(customer_email, '(^.).*(@.*$)', '\1***\2'),
    customer_document = NULL,
    customer_phone = NULL
WHERE customer_document IS NOT NULL
   OR customer_phone IS NOT NULL
   OR customer_name LIKE '% %'
   OR customer_email NOT LIKE '%***%';

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_legacy_customer_pii_is_null,
  ADD CONSTRAINT orders_legacy_customer_pii_is_null
  CHECK (customer_document IS NULL AND customer_phone IS NULL);

ALTER TABLE public.asaas_webhook_events
  ALTER COLUMN event_id SET NOT NULL,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS attempt_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_error TEXT;

ALTER TABLE public.asaas_webhook_events
  DROP CONSTRAINT IF EXISTS asaas_webhook_events_status_check,
  ADD CONSTRAINT asaas_webhook_events_status_check
  CHECK (status IN ('pending', 'processing', 'done', 'failed'));

CREATE INDEX IF NOT EXISTS idx_asaas_webhook_events_pending
  ON public.asaas_webhook_events(status, created_at)
  WHERE status IN ('pending', 'failed');

CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only service role can manage security audit log" ON public.security_audit_log;
CREATE POLICY "Only service role can manage security audit log"
ON public.security_audit_log FOR ALL
USING (false)
WITH CHECK (false);

REVOKE ALL ON public.security_audit_log FROM anon, authenticated;
GRANT ALL ON public.security_audit_log TO service_role;

CREATE TABLE IF NOT EXISTS public.request_rate_limits (
  bucket TEXT NOT NULL,
  identifier_hash TEXT NOT NULL,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, identifier_hash)
);

ALTER TABLE public.request_rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only service role can manage request rate limits" ON public.request_rate_limits;
CREATE POLICY "Only service role can manage request rate limits"
ON public.request_rate_limits FOR ALL
USING (false)
WITH CHECK (false);

REVOKE ALL ON public.request_rate_limits FROM anon, authenticated;
GRANT ALL ON public.request_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.consume_rate_limit(
  requested_bucket TEXT,
  requested_identifier_hash TEXT,
  max_requests INTEGER,
  window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  INSERT INTO public.request_rate_limits (
    bucket,
    identifier_hash,
    window_started_at,
    request_count
  )
  VALUES (
    requested_bucket,
    requested_identifier_hash,
    NOW(),
    1
  )
  ON CONFLICT (bucket, identifier_hash) DO UPDATE SET
    window_started_at = CASE
      WHEN public.request_rate_limits.window_started_at < NOW() - make_interval(secs => window_seconds)
        THEN NOW()
      ELSE public.request_rate_limits.window_started_at
    END,
    request_count = CASE
      WHEN public.request_rate_limits.window_started_at < NOW() - make_interval(secs => window_seconds)
        THEN 1
      ELSE public.request_rate_limits.request_count + 1
    END
  RETURNING request_count INTO current_count;

  RETURN current_count <= max_requests;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.consume_rate_limit(TEXT, TEXT, INTEGER, INTEGER)
FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(TEXT, TEXT, INTEGER, INTEGER)
TO service_role;
