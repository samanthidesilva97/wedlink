/**
 * PayHere IPN (Instant Payment Notification) endpoint
 *
 * PayHere POSTs to this URL after every payment attempt.
 * Docs: https://support.payhere.lk/api-&-mobile-sdk/ipn
 *
 * This route handles:
 *  - Booking deposit / full payments
 *  - Vendor Premium subscription recurring payments
 *  - Refunds / chargebacks
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyIPNSignature, PAYHERE_STATUS } from '@/lib/payhere'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  // PayHere sends application/x-www-form-urlencoded
  const formData = await request.formData()
  const params = Object.fromEntries(formData.entries()) as Record<string, string>

  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    payment_id,
    method,
    custom_1,   // we use this to carry: "booking" | "subscription"
    custom_2,   // we use this to carry the vendor_user_id for subscriptions
  } = params

  // 1. Verify IPN signature to confirm it genuinely came from PayHere
  const isValid = verifyIPNSignature({
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  })

  if (!isValid) {
    console.error('[PayHere IPN] Invalid signature — ignoring.', { order_id })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const paymentType = custom_1 // "booking" | "subscription"

  // ── Booking payment ───────────────────────────────────────────────────────
  if (paymentType === 'booking') {
    const bookingId = order_id

    if (status_code === PAYHERE_STATUS.SUCCESS) {
      await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          payhere_payment_id: payment_id,
          payhere_payment_method: method,
          deposit_amount: parseFloat(payhere_amount),
        })
        .eq('id', bookingId)

      // Log to payment_logs table for audit trail
      await supabase.from('payment_logs').insert({
        booking_id: bookingId,
        payhere_payment_id: payment_id,
        amount: parseFloat(payhere_amount),
        currency: payhere_currency,
        status: 'success',
        method,
        raw_payload: params,
      })

      // TODO: trigger email/SMS confirmation to both couple and vendor

    } else if (status_code === PAYHERE_STATUS.PENDING) {
      await supabase
        .from('bookings')
        .update({ status: 'awaiting_payment' })
        .eq('id', bookingId)

    } else if (
      status_code === PAYHERE_STATUS.FAILED ||
      status_code === PAYHERE_STATUS.CANCELLED
    ) {
      await supabase
        .from('bookings')
        .update({ status: 'awaiting_payment' })
        .eq('id', bookingId)

      await supabase.from('payment_logs').insert({
        booking_id: bookingId,
        payhere_payment_id: payment_id ?? null,
        amount: parseFloat(payhere_amount),
        currency: payhere_currency,
        status: status_code === PAYHERE_STATUS.CANCELLED ? 'cancelled' : 'failed',
        method,
        raw_payload: params,
      })

    } else if (status_code === PAYHERE_STATUS.CHARGEDBACK) {
      await supabase
        .from('bookings')
        .update({ status: 'disputed' })
        .eq('id', bookingId)
    }
  }

  // ── Vendor Premium subscription ───────────────────────────────────────────
  if (paymentType === 'subscription') {
    const vendorUserId = custom_2

    if (status_code === PAYHERE_STATUS.SUCCESS) {
      // Calculate next billing date (1 month from now)
      const nextBilling = new Date()
      nextBilling.setMonth(nextBilling.getMonth() + 1)

      await supabase
        .from('vendor_profiles')
        .update({
          subscription_tier: 'premium',
          subscription_payment_id: payment_id,
          subscription_expires_at: nextBilling.toISOString(),
        })
        .eq('user_id', vendorUserId)

      await supabase.from('subscription_logs').insert({
        vendor_user_id: vendorUserId,
        payhere_payment_id: payment_id,
        amount: parseFloat(payhere_amount),
        currency: payhere_currency,
        status: 'success',
        next_billing_date: nextBilling.toISOString(),
      })

    } else if (
      status_code === PAYHERE_STATUS.FAILED ||
      status_code === PAYHERE_STATUS.CANCELLED
    ) {
      // Grace period: don't immediately downgrade — let them retry
      await supabase.from('subscription_logs').insert({
        vendor_user_id: vendorUserId,
        payhere_payment_id: payment_id ?? null,
        amount: parseFloat(payhere_amount),
        currency: payhere_currency,
        status: 'failed',
      })

    } else if (status_code === PAYHERE_STATUS.CHARGEDBACK) {
      await supabase
        .from('vendor_profiles')
        .update({ subscription_tier: 'free' })
        .eq('user_id', vendorUserId)
    }
  }

  // PayHere expects HTTP 200 to confirm receipt
  return NextResponse.json({ received: true })
}
