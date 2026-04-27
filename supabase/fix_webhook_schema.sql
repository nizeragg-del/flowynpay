-- Fix user_role enum to include customer
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'customer';

-- Add missing columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS transfer_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS platform_fee NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS producer_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS customer_provisioned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS customer_user_id UUID REFERENCES auth.users(id);

-- Ensure system can update orders
DROP POLICY IF EXISTS "System can update orders" ON public.orders;
CREATE POLICY "System can update orders" ON public.orders FOR UPDATE USING (true);
