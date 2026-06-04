'use client'

import { useState } from 'react'
import { Plus, Users, Trash2, Edit3, Move } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input, Select } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

type Table = { id: string; name: string; shape: 'round' | 'rectangular' | 'head'; capacity: number; guests: string[] }
type UnseatedGuest = { id: string; name: string }

const INIT_TABLES: Table[] = [
  { id: '1', name: 'Head Table', shape: 'head', capacity: 10, guests: ['Samanthi', 'Kasun', 'Best Man', 'Maid of Honour'] },
  { id: '2', name: 'Table 1', shape: 'round', capacity: 8, guests: ['Priya Fernando', 'Rohan Perera', 'Dilini Silva'] },
  { id: '3', name: 'Table 2', shape: 'round', capacity: 8, guests: ['Amali Rodrigo'] },
  { id: '4', name: 'Table 3', shape: 'rectangular', capacity: 10, guests: [] },
]

const INIT_UNSEATED: UnseatedGuest[] = [
  { id: 'u1', name: 'Kasun Wijesinghe' },
  { id: 'u2', name: 'Namal Perera' },
  { id: 'u3', name: 'Chathuri Senaratne' },
  { id: 'u4', name: 'Buddhika Fernando' },
]

export default function SeatingPage() {
  const [tables, setTables] = useState<Table[]>(INIT_TABLES)
  const [unseated, setUnseated] = useState<UnseatedGuest[]>(INIT_UNSEATED)
  const [addTableOpen, setAddTableOpen] = useState(false)
  const [form, setForm] = useState({ name: '', shape: 'round' as Table['shape'], capacity: '8' })
  const [dragGuest, setDragGuest] = useState<string | null>(null)
  const { toast } = useToast()

  const addTable = () => {
    if (!form.name) return
    setTables(p => [...p, { id: Date.now().toString(), name: form.name, shape: form.shape, capacity: +form.capacity, guests: [] }])
    setForm({ name: '', shape: 'round', capacity: '8' })
    setAddTableOpen(false)
  }

  const removeTable = (id: string) => {
    const table = tables.find(t => t.id === id)
    if (table) setUnseated(p => [...p, ...table.guests.map(g => ({ id: g, name: g }))])
    setTables(p => p.filter(t => t.id !== id))
  }

  const addGuestToTable = (tableId: string, guestId: string, guestName: string) => {
    const table = tables.find(t => t.id === tableId)
    if (!table || table.guests.length >= table.capacity) { toast('Table is full!', 'warning'); return }
    setTables(p => p.map(t => t.id === tableId ? { ...t, guests: [...t.guests, guestName] } : t))
    setUnseated(p => p.filter(g => g.id !== guestId))
  }

  const removeGuestFromTable = (tableId: string, guestName: string) => {
    setTables(p => p.map(t => t.id === tableId ? { ...t, guests: t.guests.filter(g => g !== guestName) } : t))
    setUnseated(p => [...p, { id: guestName, name: guestName }])
  }

  const totalSeated = tables.reduce((s, t) => s + t.guests.length, 0)
  const totalCapacity = tables.reduce((s, t) => s + t.capacity, 0)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="couple" activeItem="/couple/planning/seating" userName="Samanthi & Kasun" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="couple" userName="Samanthi" />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seating Organiser</h1>
              <p className="text-sm text-gray-500 mt-1">{totalSeated} seated · {unseated.length} unassigned · {totalCapacity} total capacity</p>
            </div>
            <Button size="sm" onClick={() => setAddTableOpen(true)}><Plus size={16} /> Add Table</Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Unseated Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-4">
                <h2 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <Users size={15} className="text-[#C21A6B]" /> Unassigned ({unseated.length})
                </h2>
                {unseated.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">All guests seated! 🎉</p>
                ) : (
                  <div className="space-y-1.5">
                    {unseated.map(g => (
                      <div key={g.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm group">
                        <span className="text-gray-700 truncate">{g.name}</span>
                        <Move size={12} className="text-gray-300 group-hover:text-[#C21A6B] flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tables Grid */}
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
              {tables.map(table => (
                <div key={table.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{table.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{table.shape} · {table.guests.length}/{table.capacity} seats</p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-full bg-gray-200 rounded-full h-1 w-16 mt-1">
                        <div className="bg-[#C21A6B] h-1 rounded-full" style={{ width: `${(table.guests.length / table.capacity) * 100}%` }} />
                      </div>
                      <button onClick={() => removeTable(table.id)} className="p-1 text-gray-300 hover:text-red-400 ml-2">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Table visual */}
                  <div className="p-4">
                    <div className={cn(
                      'flex items-center justify-center mb-3 mx-auto bg-[#fce4f0] border-2 border-[#C21A6B]/20',
                      table.shape === 'round' ? 'rounded-full w-20 h-20' : table.shape === 'head' ? 'rounded-xl w-full h-10' : 'rounded-lg w-full h-12'
                    )}>
                      <span className="text-xs font-medium text-[#C21A6B] text-center px-2">{table.name}</span>
                    </div>

                    {/* Guests */}
                    <div className="space-y-1.5">
                      {table.guests.map(g => (
                        <div key={g} className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-1.5 text-xs">
                          <span className="text-gray-700">{g}</span>
                          <button onClick={() => removeGuestFromTable(table.id, g)} className="text-gray-300 hover:text-red-400">×</button>
                        </div>
                      ))}
                      {table.guests.length < table.capacity && (
                        <select
                          onChange={e => { if (e.target.value) { const g = unseated.find(x => x.id === e.target.value); if (g) addGuestToTable(table.id, g.id, g.name); e.target.value = '' } }}
                          className="w-full text-xs border border-dashed border-gray-300 rounded-lg px-2 py-1.5 text-gray-400 focus:outline-none focus:border-[#C21A6B] bg-white"
                          defaultValue="">
                          <option value="">+ Assign guest...</option>
                          {unseated.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Table CTA */}
              <button onClick={() => setAddTableOpen(true)}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#C21A6B] hover:text-[#C21A6B] transition-colors">
                <Plus size={24} />
                <span className="text-sm font-medium">Add Table</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <Modal open={addTableOpen} onClose={() => setAddTableOpen(false)} title="Add Table">
        <div className="space-y-4">
          <Input label="Table Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Table 5, Family Table" required />
          <Select label="Shape" value={form.shape} onChange={e => setForm(p => ({ ...p, shape: e.target.value as Table['shape'] }))}
            options={[{ value: 'round', label: 'Round' }, { value: 'rectangular', label: 'Rectangular' }, { value: 'head', label: 'Head Table' }]} />
          <Input label="Capacity (seats)" type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} />
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1" onClick={() => setAddTableOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={addTable}>Add Table</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
