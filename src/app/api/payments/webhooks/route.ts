import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = await createAdminClient()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const bookingId = pi.metadata?.booking_id
      if (bookingId) {
        await supabase.from('bookings').update({
          status: 'confirmed',
          stripe_payment_id: pi.id,
          deposit_amount: pi.amount / 100,
        }).eq('id', bookingId)
        // TODO: Send confirmation emails to both couple and vendor
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      const bookingId = pi.metadata?.booking_id
      if (bookingId) {
        await supabase.from('bookings').update({ status: 'awaiting_payment' }).eq('id', bookingId)
      }
      break
    }

    case 'account.updated': {
      // Stripe Connect vendor account update
      const account = event.data.object as Stripe.Account
      if (account.payouts_enabled) {
        await supabase.from('vendor_profiles').update({ payout_enabled: true })
          .eq('stripe_connect_account_id', account.id)
      }
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const vendorUserId = sub.metadata?.vendor_user_id
      const isActive = sub.status === 'active'
      if (vendorUserId) {
        await supabase.from('vendor_profiles').update({
          subscription_tier: isActive ? 'premium' : 'free',
        }).eq('user_id', vendorUserId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const vendorUserId = sub.metadata?.vendor_user_id
      if (vendorUserId) {
        await supabase.from('vendor_profiles').update({ subscription_tier: 'free' }).eq('user_id', vendorUserId)
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
