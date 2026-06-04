import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  const role = profile?.role

  let query = supabase.from('bookings').select(`
    *,
    vendor_profiles!vendor_id(business_name, category, portfolio_images),
    couple_profiles!couple_id(partner1_name, partner2_name)
  `)

  if (role === 'couple') {
    const { data: coupleProfile } = await supabase.from('couple_profiles').select('id').eq('user_id', user.id).single()
    query = query.eq('couple_id', coupleProfile?.id)
  } else if (role === 'vendor') {
    const { data: vendorProfile } = await supabase.from('vendor_profiles').select('id').eq('user_id', user.id).single()
    query = query.eq('vendor_id', vendorProfile?.id)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { vendor_id, event_date, service_description, estimated_guests, package_name, message } = body

  const { data: coupleProfile } = await supabase.from('couple_profiles').select('id').eq('user_id', user.id).single()
  if (!coupleProfile) return NextResponse.json({ error: 'Couple profile not found' }, { status: 404 })

  const { data, error } = await supabase.from('bookings').insert({
    couple_id: coupleProfile.id,
    vendor_id,
    status: 'inquiry',
    event_date,
    service_description,
    estimated_guests,
    notes: message,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // TODO: Send notification to vendor via Resend/Supabase edge function
  // await sendBookingInquiryEmail(vendorEmail, coupleNames, event_date)

  return NextResponse.json(data, { status: 201 })
}
