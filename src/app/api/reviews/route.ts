import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { booking_id, overall_rating, quality_rating, communication_rating, value_rating, punctuality_rating, comment } = body

  // Verify booking exists, is completed, and belongs to this couple
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, couple_profiles!couple_id(user_id)')
    .eq('id', booking_id)
    .single()

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  if (booking.status !== 'completed') return NextResponse.json({ error: 'Can only review completed bookings' }, { status: 400 })
  if (booking.couple_profiles?.user_id !== user.id) return NextResponse.json({ error: 'Not your booking' }, { status: 403 })

  // Check no existing review
  const { data: existing } = await supabase.from('reviews').select('id').eq('booking_id', booking_id).single()
  if (existing) return NextResponse.json({ error: 'Review already submitted for this booking' }, { status: 409 })

  const { data, error } = await supabase.from('reviews').insert({
    booking_id,
    vendor_id: booking.vendor_id,
    couple_id: booking.couple_id,
    overall_rating,
    quality_rating,
    communication_rating,
    value_rating,
    punctuality_rating,
    comment,
    status: 'pending', // goes through moderation
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update vendor avg_rating via database function (trigger)
  // CREATE TRIGGER update_vendor_rating AFTER INSERT ON reviews ...

  return NextResponse.json(data, { status: 201 })
}
