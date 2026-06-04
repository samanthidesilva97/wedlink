import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export const COMMISSION_RATE = 0.1 // 10% platform commission

export function calculateCommission(amount: number) {
  return Math.round(amount * COMMISSION_RATE)
}

export function calculateVendorPayout(amount: number) {
  return amount - calculateCommission(amount)
}
