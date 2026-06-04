import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const role = searchParams.get('role') ?? 'couple'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if user profile exists
      const { data: existing } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', data.user.id)
        .single()

      if (!existing) {
        // Create user profile on first OAuth login
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || '',
          avatar_url: data.user.user_metadata?.avatar_url || '',
          role,
          locale: 'en',
        })

        // Create couple profile by default
        if (role === 'couple') {
          await supabase.from('couple_profiles').insert({
            user_id: data.user.id,
            partner1_name: data.user.user_metadata?.full_name || '',
            partner2_name: '',
          })
        }

        return NextResponse.redirect(`${origin}/onboarding`)
      }

      return NextResponse.redirect(`${origin}/${existing.role}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
