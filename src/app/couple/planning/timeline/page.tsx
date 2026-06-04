'use client'

import { useState } from 'react'
import { Clock, Plus, Trash2, Sparkles, GripVertical } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

type TimelineEvent = { id: string; time: string; title: string; description: string; category: string; isAI: boolean }

const CATEGORY_COLORS: Record<string, string> = {
  'Getting Ready': 'bg-pink-100 text-pink-700 border-pink-200',
  'Ceremony': 'bg-purple-100 text-purple-700 border-purple-200',
  'Photos': 'bg-blue-100 text-blue-700 border-blue-200',
  'Reception': 'bg-amber-100 text-amber-700 border-amber-200',
  'Catering': 'bg-orange-100 text-orange-700 border-orange-200',
  'Music': 'bg-green-100 text-green-700 border-green-200',
  'Transport': 'bg-sky-100 text-sky-700 border-sky-200',
  'Other': 'bg-gray-100 text-gray-700 border-gray-200',
}

const AI_TEMPLATE: TimelineEvent[] = [
  { id: 'ai1', time: '07:00', title: 'Hair & Makeup begins — Bride', description: 'Bridal party arrives at venue suite. Champagne breakfast served.', category: 'Getting Ready', isAI: true },
  { id: 'ai2', time: '09:30', title: 'Groom & groomsmen get ready', description: 'Groom and groomsmen to arrive at their designated room.', category: 'Getting Ready', isAI: true },
  { id: 'ai3', time: '10:30', title: 'Bridal photography session', description: 'Photographer captures bridal details, dress, and getting-ready moments.', category: 'Photos', isAI: true },
  { id: 'ai4', time: '11:30', title: 'Guests begin arriving', description: 'Ushers to be in position. Welcome drinks and music begins.', category: 'Reception', isAI: true },
  { id: 'ai5', time: '12:00', title: 'Wedding ceremony begins', description: 'Bridal procession. Ceremony conducted. Exchange of vows and rings.', category: 'Ceremony', isAI: true },
  { id: 'ai6', time: '13:00', title: 'Signing of register & family photos', description: 'Official signing. Group photographs — family, bridal party, and guests.', category: 'Photos', isAI: true },
  { id: 'ai7', time: '14:00', title: 'Wedding breakfast / Lunch service', description: 'Guests seated for reception meal. Catering team begins service.', category: 'Catering', isAI: true },
  { id: 'ai8', time: '15:00', title: 'Speeches & toasts', description: 'Speeches from Best Man, Maid of Honour, Father of the Bride.', category: 'Reception', isAI: true },
  { id: 'ai9', time: '16:00', title: 'Wedding cake cutting', description: 'Couple cuts the cake. Dessert service begins.', category: 'Reception', isAI: true },
  { id: 'ai10', time: '16:30', title: 'First dance & music begins', description: 'Couple\'s first dance. DJ/band opens the floor for guests.', category: 'Music', isAI: true },
  { id: 'ai11', time: '18:00', title: 'Sunset couple photos', description: 'Photographer takes golden hour couple portraits.', category: 'Photos', isAI: true },
  { id: 'ai12', time: '21:00', title: 'Bouquet toss & send-off', description: 'Bride tosses bouquet. Grand send-off for couple.', category: 'Reception', isAI: true },
]

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ time: '', title: '', description: '', category: 'Other' })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateAI = () => {
    setLoading(true)
    setTimeout(() => { setEvents(AI_TEMPLATE); setLoading(false); toast('AI timeline generated! Customise as needed.', 'success') }, 1500)
  }

  const addEvent = () => {
    if (!form.time || !form.title) return
    setEvents(p => [...p, { ...form, id: Date.now().toString(), isAI: false }].sort((a, b) => a.time.localeCompare(b.time)))
    setForm({ time: '', title: '', description: '', category: 'Other' })
    setAddOpen(false)
  }

  const remove = (id: string) => setEvents(p => p.filter(e => e.id !== id))

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="couple" activeItem="/couple/planning/timeline" userName="Samanthi & Kasun" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="couple" userName="Samanthi" />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Day-of Timeline</h1>
              <p className="text-sm text-gray-500 mt-1">Plan every moment of your wedding day</p>
            </div>
            <div className="flex gap-2">
              <Button variant="gold" size="sm" loading={loading} onClick={generateAI}>
                <Sparkles size={15} /> Generate with AI
              </Button>
              <Button size="sm" onClick={() => setAddOpen(true)}><Plus size={16} /> Add Event</Button>
            </div>
          </div>

          {events.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Clock size={48} className="mx-auto mb-4 text-gray-200" />
                <p className="text-lg font-semibold text-gray-900 mb-2">Your timeline is empty</p>
                <p className="text-gray-500 text-sm mb-6">Let our AI generate a full wedding day schedule, or add events manually.</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="gold" onClick={generateAI} loading={loading}>
                    <Sparkles size={15} /> Generate AI Timeline
                  </Button>
                  <Button variant="secondary" onClick={() => setAddOpen(true)}>Add Manually</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-2xl">
              {events.map((event, i) => (
                <div key={event.id} className="flex gap-4 group">
                  {/* Time + line */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 text-right flex-shrink-0">
                      <span className="text-sm font-bold text-[#C21A6B]">{event.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center mx-2">
                    <div className="w-3 h-3 rounded-full bg-[#C21A6B] border-2 border-white ring-2 ring-[#C21A6B]/30 mt-1 flex-shrink-0" />
                    {i < events.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1 mb-1 min-h-[2rem]" />}
                  </div>
                  {/* Event Card */}
                  <div className="flex-1 pb-5">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 group-hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                            {event.isAI && <span className="text-[10px] bg-[#fdf6d8] text-[#B8960C] px-2 py-0.5 rounded-full font-medium">✨ AI</span>}
                          </div>
                          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', CATEGORY_COLORS[event.category] || CATEGORY_COLORS['Other'])}>
                            {event.category}
                          </span>
                          {event.description && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{event.description}</p>}
                        </div>
                        <button onClick={() => remove(event.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 flex-shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Timeline Event">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Time" type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B]">
                {Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Input label="Event Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. First dance" required />
          <Textarea label="Notes (optional)" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Details, instructions, contacts..." rows={3} />
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={addEvent}>Add Event</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
