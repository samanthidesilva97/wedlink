'use client'

import { useState } from 'react'
import { Heart, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'

// Mock — replace with Supabase lookup by token
const WEDDING = {
  couple: 'Samanthi & Kasun',
  date: 'Sunday, 14 December 2026',
  venue: 'Royal Palms Venue, Mount Lavinia, Colombo',
  message: 'Together with their families, Samanthi and Kasun joyfully request your presence to celebrate their marriage.',
}

export default function RSVPPage() {
  const [step, setStep] = useState<'form' | 'done'>('form')
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null)
  const [form, setForm] = useState({ name: '', email: '', dietary: '', plusOneName: '', message: '' })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!attending) { toast('Please select whether you are attending.', 'warning'); return }
    setLoading(true)
    // TODO: POST to /api/rsvp with token
    setTimeout(() => {
      setLoading(false)
      setStep('done')
    }, 1000)
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Wedding header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#C21A6B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart size={28} className="text-white fill-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{WEDDING.couple}</h1>
          <p className="text-[#C21A6B] font-semibold">{WEDDING.date}</p>
          <p className="text-gray-500 text-sm mt-1">{WEDDING.venue}</p>
        </div>

        {step === 'form' ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <p className="text-center text-gray-600 text-sm mb-6 italic">&ldquo;{WEDDING.message}&rdquo;</p>

            <form onSubmit={submit} className="space-y-5">
              <Input label="Your Full Name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="As it appears on the invitation" required />
              <Input label="Email Address" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="For confirmation" />

              {/* Attending toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Will you be attending? *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setAttending('yes')}
                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${attending === 'yes' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                    ✓ Joyfully Accepts
                  </button>
                  <button type="button" onClick={() => setAttending('no')}
                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${attending === 'no' ? 'border-red-400 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                    ✗ Regretfully Declines
                  </button>
                </div>
              </div>

              {attending === 'yes' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dietary requirements</label>
                    <select value={form.dietary} onChange={e => update('dietary', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B]">
                      <option value="">No dietary requirements</option>
                      <option>Vegetarian</option>
                      <option>Vegan</option>
                      <option>Halal</option>
                      <option>Gluten-free</option>
                      <option>Other (specify in message)</option>
                    </select>
                  </div>
                  <Input label="Plus-one name (if applicable)" value={form.plusOneName} onChange={e => update('plusOneName', e.target.value)} placeholder="Guest name" />
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message to the couple (optional)</label>
                <textarea value={form.message} onChange={e => update('message', e.target.value)}
                  rows={3} placeholder="Send your best wishes..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B] resize-none" />
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Submit RSVP
              </Button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-5">
              Powered by <span className="text-[#C21A6B] font-semibold">WedLink</span> · Sri Lanka&apos;s Wedding Platform
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">RSVP Received!</h2>
            <p className="text-gray-500 mb-2">
              {attending === 'yes'
                ? `Thank you, ${form.name || 'friend'}! We look forward to celebrating with you.`
                : `Thank you for letting us know, ${form.name || 'friend'}. You will be missed!`}
            </p>
            <p className="text-sm text-gray-400">A confirmation has been sent to your email.</p>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-1">{WEDDING.couple}</p>
              <p className="text-xs text-gray-400">{WEDDING.date} · {WEDDING.venue}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
