import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

// Platform fee percentage (10%)
export const PLATFORM_FEE_PERCENT = 10

/**
 * Calculate the payment split for a given amount
 */
export function calculateSplit(amount: number, commissionRate: number) {
  const stripeFeeEstimate = Math.round(amount * 0.0349 + 39) // ~3.49% + R$0.39
  const platformFee = Math.round(amount * (PLATFORM_FEE_PERCENT / 100))
  const affiliateCommission = Math.round(amount * (commissionRate / 100))
  const producerAmount = amount - platformFee - affiliateCommission

  return {
    total: amount,
    stripeFeeEstimate,
    platformFee,
    affiliateCommission,
    producerAmount,
  }
}
