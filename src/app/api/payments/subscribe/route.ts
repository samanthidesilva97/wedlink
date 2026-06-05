/**
 * POST /api/payments/subscribe
 *
 * Generates a PayHere recurring (preapproval) checkout payload
 * for a vendor to subscribe to the Premium plan (LKR 4,500/month).
 *
 * The client submits this form to PayHere's hosted checkout.
 * PayHere auto-charges the vendor every month.
 */

import { NextRequest, NextResponse } from 'next/server'
import { buildRecurringPayload, PREMIUM_MONTHLY_LKR } from '@/lib/payhere'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // Confirm this user is a vendor
  const { data: profile } = await supabase
    .from('users')
    .select('full_name, email, phone, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'vendor') {
    return NextResponse.json({ error: 'Only vendors can subscribe to Premium' }, { status: 403 })
  }

  const nameParts = (profile.full_name ?? 'Vendor').split(' ')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Use a unique order_id per subscription attempt (user_id + timestamp)
  const orderId = `sub_${user.id}_${Date.now()}`

  const payload = buildRecurringPayload({
    orderId,
    amount: PREMIUM_MONTHLY_LKR,
    description: 'WedLink Premium — Monthly Subscription',
    customerFirstName: nameParts[0] ?? 'Vendor',
    customerLastName: nameParts.slice(1).join(' ') || 'User',
    customerEmail: profile.email ?? user.email ?? '',
    customerPhone: profile.phone ?? '0000000000',
    notifyUrl: `${appUrl}/api/payments/webhooks`,
    returnUrl: `${appUrl}/vendor/settings?subscription=success`,
    cancelUrl: `${appUrl}/vendor/settings?subscription=cancelled`,
    recurrenceMonths: 1,
    durationMonths: 0, // charge forever until cancelled
  })

  return NextResponse.json({
    ...payload,
    custom_1: 'subscription',
    custom_2: user.id,   // IPN uses this to update vendor_profiles
    checkout_url: `${process.env.PAYHERE_BASE_URL ?? 'https://sandbox.payhere.lk'}/pay/checkout`,
  })
}
