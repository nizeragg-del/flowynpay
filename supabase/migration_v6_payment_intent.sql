-- Migration: Add stripe_payment_intent_id to orders table
-- This column stores the PaymentIntent ID for transparent checkout
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Also add includes_order_bump flag if it doesn't exist
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS includes_order_bump BOOLEAN DEFAULT FALSE;

-- Create index for faster lookups by payment intent
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id 
ON public.orders(stripe_payment_intent_id);
