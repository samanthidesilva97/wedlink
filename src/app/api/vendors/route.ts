import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')
  const district = searchParams.get('district')
  const search = searchParams.get('search')
  const minPrice = searchParams.get('min_price')
  const maxPrice = searchParams.get('max_price')
  const verifiedOnly = searchParams.get('verified_only') === 'true'
  const sort = searchParams.get('sort') || 'rating'
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('vendor_profiles')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')

  if (category) query = query.eq('category', category)
  if (district) query = query.eq('district', district)
  if (verifiedOnly) query = query.eq('is_verified', true)
  if (minPrice) query = query.gte('price_min', parseInt(minPrice))
  if (maxPrice) query = query.lte('price_min', parseInt(maxPrice))
  if (search) query = query.ilike('business_name', `%${search}%`)

  // Sorting
  if (sort === 'rating') query = query.order('avg_rating', { ascending: false })
  else if (sort === 'price_asc') query = query.order('price_min', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price_min', { ascending: false })
  else if (sort === 'reviews') query = query.order('review_count', { ascending: false })

  // Premium first
  query = query.order('subscription_tier', { ascending: false })

  const { data, error, count } = await query.range(offset, offset + limit - 1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ vendors: data, total: count, offset, limit })
}
