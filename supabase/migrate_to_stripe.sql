-- Migração Asaas para Stripe
-- 1. Adicionar campos do Stripe
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT FALSE;

-- 2. Remover campos do Asaas (opcional, para limpeza)
-- ALTER TABLE profiles DROP COLUMN IF EXISTS asaas_customer_id;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS asaas_api_key;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS asaas_account_id;

-- 3. Adicionar campos de controle financeiro na tabela orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS platform_fee NUMERIC(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS producer_amount NUMERIC(10,2);
