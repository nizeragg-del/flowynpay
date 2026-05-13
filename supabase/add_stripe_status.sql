-- Add column to track if Stripe onboarding is finished
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT false;
