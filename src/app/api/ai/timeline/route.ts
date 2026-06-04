import { NextResponse } from 'next/server'

// NOTE: Install openai package to enable: npm install openai
// import OpenAI from 'openai'
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const body = await request.json()
  const { wedding_date, guest_count, venue_type, ceremony_type, booked_vendors } = body

  // --- Replace this block with real OpenAI call when API key is configured ---
  const prompt = `Generate a detailed wedding day timeline for a Sri Lankan wedding with the following details:
  - Date: ${wedding_date}
  - Guest count: ${guest_count}
  - Venue type: ${venue_type || 'hotel'}
  - Ceremony type: ${ceremony_type || 'mixed'}
  - Booked vendors: ${booked_vendors?.join(', ') || 'Photography, Catering, Venue'}

  Return a JSON array of timeline events with fields: time (HH:MM), title, description, category.
  Categories: Getting Ready, Ceremony, Photos, Reception, Catering, Music, Transport, Other.`

  // Fallback template when OpenAI is not configured
  const fallbackTimeline = [
    { time: '07:00', title: 'Hair & Makeup — Bridal Party', description: 'Bridal party arrives. Hair and makeup begins for bride and bridesmaids.', category: 'Getting Ready' },
    { time: '09:30', title: 'Groom & Groomsmen Preparation', description: 'Groom and groomsmen get ready in separate suite.', category: 'Getting Ready' },
    { time: '10:30', title: 'Bridal Detail Photography', description: 'Photographer captures dress, rings, flowers, and getting-ready moments.', category: 'Photos' },
    { time: '11:30', title: 'Guests Begin Arriving', description: 'Ushers in position. Welcome drinks and background music begins.', category: 'Reception' },
    { time: '12:00', title: 'Wedding Ceremony', description: 'Bridal procession. Ceremony, vows, and ring exchange.', category: 'Ceremony' },
    { time: '13:00', title: 'Signing & Family Portraits', description: 'Official signing of register. Group photos — family, bridal party.', category: 'Photos' },
    { time: '14:00', title: 'Wedding Reception Meal', description: `Buffet/seated meal for ${guest_count} guests. Catering service begins.`, category: 'Catering' },
    { time: '15:00', title: 'Speeches & Toasts', description: 'Best Man, Maid of Honour, and Father of the Bride speeches.', category: 'Reception' },
    { time: '16:00', title: 'Wedding Cake Cutting', description: 'Couple cuts the cake. Dessert service follows.', category: 'Reception' },
    { time: '16:30', title: 'First Dance & Dance Floor Opens', description: "Couple's first dance. DJ/band opens the floor.", category: 'Music' },
    { time: '18:00', title: 'Sunset Couple Portraits', description: 'Golden hour photography session with the couple.', category: 'Photos' },
    { time: '21:00', title: 'Grand Send-Off', description: 'Bouquet toss. Guests line up for couple send-off.', category: 'Reception' },
  ]

  // Uncomment and use when OpenAI is configured:
  /*
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a Sri Lankan wedding planner assistant. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
    })
    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return NextResponse.json({ timeline: result.timeline || fallbackTimeline })
  } catch (err) {
    return NextResponse.json({ timeline: fallbackTimeline })
  }
  */

  return NextResponse.json({ timeline: fallbackTimeline })
}
