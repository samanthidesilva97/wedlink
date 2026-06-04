'use client'

import { useState, useMemo } from 'react'
import { Users, Plus, Trash2, Mail, Phone, Send, Download } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Input, Select } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

type Guest = { id: string; name: string; email: string; phone: string; rsvp: 'pending' | 'confirmed' | 'declined'; dietary: string; hasPlusOne: boolean; side: "bride's" | "groom's" | 'mutual'; group: string }

const INITIAL: Guest[] = [
  { id: '1', name: 'Priya Fernando', email: 'priya@email.com', phone: '+94771234567', rsvp: 'confirmed', dietary: '', hasPlusOne: true, side: "bride's", group: 'Family' },
  { id: '2', name: 'Rohan Perera', email: 'rohan@email.com', phone: '+94779876543', rsvp: 'confirmed', dietary: 'Vegetarian', hasPlusOne: false, side: "groom's", group: 'Family' },
  { id: '3', name: 'Dilini Silva', email: 'dilini@email.com', phone: '', rsvp: 'pending', dietary: '', hasPlusOne: true, side: 'mutual', group: 'Friends' },
  { id: '4', name: 'Kasun Wijesinghe', email: '', phone: '+94764321098', rsvp: 'declined', dietary: '', hasPlusOne: false, side: "groom's", group: 'Work' },
  { id: '5', name: 'Amali Rodrigo', email: 'amali@email.com', phone: '', rsvp: 'pending', dietary: 'Vegan', hasPlusOne: true, side: "bride's", group: 'Friends' },
]

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>(INITIAL)
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all')
  const [sideFilter, setSideFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', dietary: '', hasPlusOne: false, side: "bride's" as Guest['side'], group: 'Friends' })
  const { toast } = useToast()

  const stats = useMemo(() => ({
    total: guests.length + guests.filter(g => g.hasPlusOne && g.rsvp === 'confirmed').length,
    confirmed: guests.filter(g => g.rsvp === 'confirmed').length,
    pending: guests.filter(g => g.rsvp === 'pending').length,
    declined: guests.filter(g => g.rsvp === 'declined').length,
  }), [guests])

  const filtered = guests.filter(g => {
    if (filter !== 'all' && g.rsvp !== filter) return false
    if (sideFilter !== 'all' && g.side !== sideFilter) return false
    return true
  })

  const addGuest = () => {
    if (!form.name.trim()) return
    setGuests(p => [...p, { ...form, id: Date.now().toString() }])
    setForm({ name: '', email: '', phone: '', dietary: '', hasPlusOne: false, side: "bride's", group: 'Friends' })
    setAddOpen(false)
    toast('Guest added!', 'success')
  }

  const updateRsvp = (id: string, rsvp: Guest['rsvp']) => setGuests(p => p.map(g => g.id === id ? { ...g, rsvp } : g))
  const remove = (id: string) => setGuests(p => p.filter(g => g.id !== id))
  const sendRsvp = (id: string) => toast('RSVP link sent via email!', 'success')

  const rsvpBadge = { confirmed: 'success' as const, pending: 'warning' as const, declined: 'danger' as const }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="couple" activeItem="/couple/planning/guests" userName="Samanthi & Kasun" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="couple" userName="Samanthi" />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Guest List</h1>
              <p className="text-sm text-gray-500 mt-1">{stats.total} total guests (inc. plus-ones)</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => toast('CSV exported!', 'success')}>
                <Download size={15} /> Export
              </Button>
              <Button size="sm" onClick={() => setAddOpen(true)}><Plus size={16} /> Add Guest</Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Invited', val: guests.length, color: 'text-gray-800', bg: 'bg-white' },
              { label: 'Confirmed', val: stats.confirmed, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Pending', val: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Declined', val: stats.declined, color: 'text-red-600', bg: 'bg-red-50' },
            ].map(s => (
              <Card key={s.label} className={s.bg}>
                <CardContent className="p-4 text-center">
                  <p className={`text-3xl font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[{ v: 'all', l: 'All' }, { v: 'confirmed', l: 'Confirmed' }, { v: 'pending', l: 'Pending' }, { v: 'declined', l: 'Declined' }].map(f => (
              <button key={f.v} onClick={() => setFilter(f.v as any)}
                className={cn('px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                  filter === f.v ? 'bg-[#C21A6B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C21A6B]')}>
                {f.l}
              </button>
            ))}
            <select value={sideFilter} onChange={e => setSideFilter(e.target.value)}
              className="px-3 py-1.5 rounded-full text-sm border border-gray-200 focus:outline-none bg-white">
              <option value="all">All sides</option>
              <option value="bride's">Bride&apos;s side</option>
              <option value="groom's">Groom&apos;s side</option>
              <option value="mutual">Mutual</option>
            </select>
          </div>

          {/* Guest Table */}
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Name', 'Contact', 'Side', 'RSVP', 'Dietary', 'Plus-one', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((g, i) => (
                    <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">{g.name}</p>
                        <p className="text-xs text-gray-400">{g.group}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        {g.email && <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={10} />{g.email}</p>}
                        {g.phone && <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10} />{g.phone}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 capitalize">{g.side}</td>
                      <td className="px-5 py-3.5">
                        <select value={g.rsvp} onChange={e => updateRsvp(g.id, e.target.value as Guest['rsvp'])}
                          className={cn('text-xs px-2 py-1 rounded-lg border font-medium focus:outline-none',
                            g.rsvp === 'confirmed' ? 'bg-green-50 border-green-200 text-green-700' :
                            g.rsvp === 'declined' ? 'bg-red-50 border-red-200 text-red-700' :
                            'bg-yellow-50 border-yellow-200 text-yellow-700')}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="declined">Declined</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{g.dietary || '—'}</td>
                      <td className="px-5 py-3.5">
                        {g.hasPlusOne ? <Badge variant="info">+1</Badge> : <span className="text-xs text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {g.email && (
                            <button onClick={() => sendRsvp(g.id)} className="text-[#C21A6B] hover:opacity-70 transition-opacity" title="Send RSVP">
                              <Send size={14} />
                            </button>
                          )}
                          <button onClick={() => remove(g.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-10 text-center text-gray-400 text-sm">No guests match your filter</div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Guest" size="md">
        <div className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Guest name" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Optional" />
            <Input label="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Optional" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Side" value={form.side} onChange={e => setForm(p => ({ ...p, side: e.target.value as Guest['side'] }))}
              options={[{ value: "bride's", label: "Bride's" }, { value: "groom's", label: "Groom's" }, { value: 'mutual', label: 'Mutual' }]} />
            <Input label="Group / Table" value={form.group} onChange={e => setForm(p => ({ ...p, group: e.target.value }))} placeholder="Family, Friends..." />
          </div>
          <Input label="Dietary requirements" value={form.dietary} onChange={e => setForm(p => ({ ...p, dietary: e.target.value }))} placeholder="Vegetarian, Vegan, etc." />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.hasPlusOne} onChange={e => setForm(p => ({ ...p, hasPlusOne: e.target.checked }))} className="rounded accent-[#C21A6B]" />
            <span className="text-sm text-gray-700">Has a plus-one</span>
          </label>
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={addGuest}>Add Guest</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
