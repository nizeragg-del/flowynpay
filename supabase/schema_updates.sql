-- Update public.products to support sso toggle
ALTER TABLE public.products ADD COLUMN sso_enabled BOOLEAN NOT NULL DEFAULT false;

-- Update public.orders to support sandbox testing
ALTER TABLE public.orders ADD COLUMN is_sandbox BOOLEAN NOT NULL DEFAULT false;

-- Update public.webhook_logs to allow null order_id for test webhooks
ALTER TABLE public.webhook_logs ALTER COLUMN order_id DROP NOT NULL;
