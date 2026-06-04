'use client'

import { useState } from 'react'
import { Plus, Trash2, Link2, Upload } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

type MoodPin = { id: string; imageUrl: string; label: string; category: string; color: string }

const COLORS = ['bg-pink-100', 'bg-purple-100', 'bg-amber-100', 'bg-green-100', 'bg-blue-100', 'bg-rose-100']
const EMOJIS: Record<string, string> = { Flowers: '🌸', Venue: '🏛️', Dress: '👗', Colour: '🎨', Cake: '🎂', Decor: '🎀', Photography: '📸', General: '📌' }

const INIT: MoodPin[] = [
  { id: '1', imageUrl: '', label: 'Blush Pink & Gold palette', category: 'Colour', color: 'bg-pink-100' },
  { id: '2', imageUrl: '', label: 'Romantic archway with roses', category: 'Decor', color: 'bg-rose-100' },
  { id: '3', imageUrl: '', label: 'Outdoor ceremony with fairy lights', category: 'Venue', color: 'bg-amber-100' },
  { id: '4', imageUrl: '', label: 'Lace ballgown with cathedral veil', category: 'Dress', color: 'bg-purple-100' },
  { id: '5', imageUrl: '', label: 'Peonies & garden roses bouquet', category: 'Flowers', color: 'bg-green-100' },
  { id: '6', imageUrl: '', label: 'Four-tier fondant cake with gold leaf', category: 'Cake', color: 'bg-amber-100' },
]

const CATEGORIES = ['General', 'Colour', 'Venue', 'Dress', 'Flowers', 'Cake', 'Decor', 'Photography']

export default function MoodBoardPage() {
  const [pins, setPins] = useState<MoodPin[]>(INIT)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ imageUrl: '', label: '', category: 'General' })
  const [catFilter, setCatFilter] = useState('all')
  const { toast } = useToast()

  const addPin = () => {
    if (!form.label.trim()) return
    setPins(p => [...p, {
      id: Date.now().toString(),
      imageUrl: form.imageUrl,
      label: form.label,
      category: form.category,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }])
    setForm({ imageUrl: '', label: '', category: 'General' })
    setAddOpen(false)
    toast('Pinned to mood board!', 'success')
  }

  const filtered = catFilter === 'all' ? pins : pins.filter(p => p.category === catFilter)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="couple" activeItem="/couple/planning/moodboard" userName="Samanthi & Kasun" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="couple" userName="Samanthi" />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mood Board</h1>
              <p className="text-sm text-gray-500 mt-1">Pin your wedding inspiration and vision</p>
            </div>
            <Button size="sm" onClick={() => setAddOpen(true)}><Plus size={16} /> Add Pin</Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setCatFilter('all')}
              className={cn('flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                catFilter === 'all' ? 'bg-[#C21A6B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C21A6B]')}>
              All ({pins.length})
            </button>
            {CATEGORIES.map(c => {
              const count = pins.filter(p => p.category === c).length
              if (count === 0) return null
              return (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={cn('flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                    catFilter === c ? 'bg-[#C21A6B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C21A6B]')}>
                  {EMOJIS[c]} {c} ({count})
                </button>
              )
            })}
          </div>

          {/* Masonry-style Grid */}
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map(pin => (
              <div key={pin.id} className="break-inside-avoid bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                <div className={cn('w-full flex items-center justify-center text-5xl', pin.color,
                  pin.category === 'Colour' ? 'h-24' : pin.category === 'Cake' ? 'h-40' : 'h-36')}>
                  {EMOJIS[pin.category] || '📌'}
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-800 leading-snug">{pin.label}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{pin.category}</span>
                    <button onClick={() => setPins(p => p.filter(x => x.id !== pin.id))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Pin Card */}
            <button onClick={() => setAddOpen(true)}
              className="break-inside-avoid w-full h-36 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#C21A6B] hover:text-[#C21A6B] transition-colors">
              <Plus size={20} />
              <span className="text-xs font-medium">Add Pin</span>
            </button>
          </div>

          {filtered.length === 0 && catFilter !== 'all' && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">{EMOJIS[catFilter]}</p>
              <p>No {catFilter} pins yet</p>
            </div>
          )}
        </main>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add to Mood Board" size="md">
        <div className="space-y-4">
          <Input
            label="Image URL (optional)"
            value={form.imageUrl}
            onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
            placeholder="https://... or leave blank to use emoji"
            icon={<Link2 size={15} />}
          />
          <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 hover:border-[#C21A6B] hover:text-[#C21A6B] transition-colors cursor-pointer">
            <Upload size={20} className="mx-auto mb-1" />
            <p className="text-xs font-medium">Upload image</p>
            <p className="text-xs">Coming soon with Supabase Storage</p>
          </div>
          <Input
            label="Description / Label"
            value={form.label}
            onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
            placeholder="e.g. Blush pink floral arch"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B]">
              {CATEGORIES.map(c => <option key={c} value={c}>{EMOJIS[c]} {c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={addPin}>Pin It</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
