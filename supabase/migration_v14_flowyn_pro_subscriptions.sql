-- Flowyn Pro platform subscriptions: 7-day trial, recurring Asaas billing and controlled access.

CREATE TABLE IF NOT EXISTS public.platform_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'asaas',
  asaas_customer_id TEXT,
  asaas_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'trialing',
  trial_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  current_period_ends_at TIMESTAMPTZ,
  grace_period_ends_at TIMESTAMPTZ,
  last_payment_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT platform_subscriptions_status_check CHECK (
    status IN ('trialing', 'scheduled', 'active', 'grace_period', 'suspended', 'cancelled')
  )
);

CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_asaas_customer_id
  ON public.platform_subscriptions(asaas_customer_id);

CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_status
  ON public.platform_subscriptions(status);

CREATE TABLE IF NOT EXISTS public.platform_subscription_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_subscription_id UUID NOT NULL REFERENCES public.platform_subscriptions(id) ON DELETE CASCADE,
  asaas_payment_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  value NUMERIC,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_subscription_invoices_subscription_id
  ON public.platform_subscription_invoices(platform_subscription_id);

ALTER TABLE public.platform_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_subscription_invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own platform subscription" ON public.platform_subscriptions;
CREATE POLICY "Users can view own platform subscription"
ON public.platform_subscriptions FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own platform invoices" ON public.platform_subscription_invoices;
CREATE POLICY "Users can view own platform invoices"
ON public.platform_subscription_invoices FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.platform_subscriptions subscription
    WHERE subscription.id = platform_subscription_invoices.platform_subscription_id
      AND subscription.user_id = (SELECT auth.uid())
  )
);

REVOKE ALL ON public.platform_subscriptions, public.platform_subscription_invoices FROM anon, authenticated;
GRANT SELECT ON public.platform_subscriptions, public.platform_subscription_invoices TO authenticated;
GRANT ALL ON public.platform_subscriptions, public.platform_subscription_invoices TO service_role;

INSERT INTO public.platform_subscriptions (user_id)
SELECT id
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.ensure_platform_trial()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.platform_subscriptions (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ensure_platform_trial_trigger ON public.profiles;
CREATE TRIGGER ensure_platform_trial_trigger
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.ensure_platform_trial();

REVOKE EXECUTE ON FUNCTION public.ensure_platform_trial() FROM anon, authenticated, public;

