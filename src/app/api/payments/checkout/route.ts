/**
 * POST /api/payments/checkout
 *
 * Generates a PayHere checkout payload for a booking deposit.
 * The client uses this payload to submit a form to PayHere's hosted checkout page.
 *
 * Body: { booking_id, amount_lkr }
 */

import { NextRequest, NextResponse } from 'next/server'
import { buildCheckoutPayload } from '@/lib/payhere'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { booking_id, amount_lkr } = await request.json()
  if (!booking_id || !amount_lkr) {
    return NextResponse.json({ error: 'booking_id and amount_lkr are required' }, { status: 400 })
  }

  // Load booking + couple profile for name/email
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*, couple_profiles(partner1_name, partner2_name), vendor_profiles(business_name)')
    .eq('id', booking_id)
    .eq('couple_id', user.id)  // ensure the couple owns this booking
    .single()

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Load user profile for contact details
  const { data: profile } = await supabase
    .from('users')
    .select('full_name, email, phone')
    .eq('id', user.id)
    .single()

  const nameParts = (profile?.full_name ?? 'WedLink User').split(' ')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const payload = buildCheckoutPayload({
    orderId: booking_id,
    amount: amount_lkr,
    description: `Booking deposit — ${booking.vendor_profiles?.business_name ?? 'Vendor'}`,
    customerFirstName: nameParts[0] ?? 'Guest',
    customerLastName: nameParts.slice(1).join(' ') || 'User',
    customerEmail: profile?.email ?? user.email ?? '',
    customerPhone: profile?.phone ?? '0000000000',
    notifyUrl: `${appUrl}/api/payments/webhooks`,
    returnUrl: `${appUrl}/couple/bookings/${booking_id}?payment=success`,
    cancelUrl: `${appUrl}/couple/bookings/${booking_id}?payment=cancelled`,
  })

  // Attach custom fields so IPN knows this is a booking payment
  return NextResponse.json({
    ...payload,
    custom_1: 'booking',
    checkout_url: `${process.env.PAYHERE_BASE_URL ?? 'https://sandbox.payhere.lk'}/pay/checkout`,
  })
}
