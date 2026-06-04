'use client'

import { useState } from 'react'
import { CheckSquare, Plus, Trash2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { SEED_TASKS } from '@/lib/constants'

type CheckItem = { id: string; title: string; category: string; due_date: string; is_completed: boolean; notes: string }

const INITIAL: CheckItem[] = SEED_TASKS.slice(0, 14).map((t, i) => ({
  id: String(i + 1),
  title: t.title,
  category: t.category,
  due_date: '',
  is_completed: i < 4,
  notes: '',
}))

const CATEGORIES = [...new Set(SEED_TASKS.map(t => t.category))]

export default function ChecklistPage() {
  const [items, setItems] = useState<CheckItem[]>(INITIAL)
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all')
  const [catFilter, setCatFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCat, setNewCat] = useState('Planning')
  const [newDate, setNewDate] = useState('')

  const toggle = (id: string) => setItems(p => p.map(i => i.id === id ? { ...i, is_completed: !i.is_completed } : i))
  const remove = (id: string) => setItems(p => p.filter(i => i.id !== id))

  const addItem = () => {
    if (!newTitle.trim()) return
    setItems(p => [...p, { id: Date.now().toString(), title: newTitle, category: newCat, due_date: newDate, is_completed: false, notes: '' }])
    setNewTitle(''); setNewDate(''); setAddOpen(false)
  }

  const filtered = items.filter(i => {
    if (filter === 'pending' && i.is_completed) return false
    if (filter === 'done' && !i.is_completed) return false
    if (catFilter !== 'all' && i.category !== catFilter) return false
    return true
  })

  const done = items.filter(i => i.is_completed).length
  const pct = Math.round((done / items.length) * 100)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="couple" activeItem="/couple/planning/checklist" userName="Samanthi & Kasun" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="couple" userName="Samanthi" />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wedding Checklist</h1>
              <p className="text-gray-500 text-sm mt-1">{done} of {items.length} tasks completed</p>
            </div>
            <Button onClick={() => setAddOpen(true)} size="sm"><Plus size={16} /> Add Task</Button>
          </div>

          {/* Progress Bar */}
          <Card className="mb-6">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800">Overall Progress</span>
                <span className="text-2xl font-bold text-[#C21A6B]">{pct}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#C21A6B] to-[#e05a9a] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex gap-6 mt-4">
                {[
                  { label: 'Completed', val: done, color: 'text-green-600' },
                  { label: 'Remaining', val: items.length - done, color: 'text-orange-500' },
                  { label: 'Total', val: items.length, color: 'text-gray-600' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[{ v: 'all', l: 'All' }, { v: 'pending', l: 'Pending' }, { v: 'done', l: 'Completed' }].map(f => (
              <button key={f.v} onClick={() => setFilter(f.v as any)}
                className={cn('px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                  filter === f.v ? 'bg-[#C21A6B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C21A6B]')}>
                {f.l}
              </button>
            ))}
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              className="px-3 py-1.5 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C21A6B] bg-white">
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Items */}
          <Card>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <CheckSquare size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No tasks match your filter</p>
                </div>
              ) : (
                filtered.map((item, i) => (
                  <div key={item.id}
                    className={cn('flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors', i < filtered.length - 1 && 'border-b border-gray-50')}>
                    <button onClick={() => toggle(item.id)} className="flex-shrink-0">
                      {item.is_completed
                        ? <CheckCircle2 size={22} className="text-green-500" />
                        : <div className="w-5.5 h-5.5 w-[22px] h-[22px] rounded-full border-2 border-gray-300 hover:border-[#C21A6B] transition-colors" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium', item.is_completed && 'line-through text-gray-400')}>{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.category}</span>
                        {item.due_date && <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} />{item.due_date}</span>}
                      </div>
                    </div>
                    <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Task">
        <div className="space-y-4">
          <Input label="Task Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Book the photographer" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={newCat} onChange={e => setNewCat(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B]">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Due Date (optional)" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={addItem}>Add Task</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
