'use client'

import { useState } from 'react'
import { PiggyBank, Plus, Trash2, TrendingUp, AlertCircle } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { BUDGET_CATEGORIES } from '@/lib/constants'

type BudgetItem = { id: string; name: string; estimated: number; actual: number }

const INITIAL: BudgetItem[] = [
  { id: '1', name: 'Venue', estimated: 700000, actual: 650000 },
  { id: '2', name: 'Catering', estimated: 400000, actual: 320000 },
  { id: '3', name: 'Photography', estimated: 180000, actual: 140000 },
  { id: '4', name: 'Videography', estimated: 120000, actual: 0 },
  { id: '5', name: 'Attire', estimated: 200000, actual: 0 },
  { id: '6', name: 'Flowers', estimated: 100000, actual: 0 },
  { id: '7', name: 'Music', estimated: 80000, actual: 0 },
  { id: '8', name: 'Cake', estimated: 50000, actual: 0 },
  { id: '9', name: 'Invitations', estimated: 30000, actual: 0 },
  { id: '10', name: 'Transport', estimated: 40000, actual: 0 },
  { id: '11', name: 'Honeymoon', estimated: 300000, actual: 0 },
  { id: '12', name: 'Miscellaneous', estimated: 100000, actual: 0 },
]

export default function BudgetPage() {
  const [items, setItems] = useState<BudgetItem[]>(INITIAL)
  const [totalBudget, setTotalBudget] = useState(2500000)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', estimated: '', actual: '' })

  const totalEst = items.reduce((s, i) => s + i.estimated, 0)
  const totalActual = items.reduce((s, i) => s + i.actual, 0)
  const remaining = totalBudget - totalActual
  const overBudget = totalActual > totalBudget

  const addItem = () => {
    if (!form.name) return
    setItems(p => [...p, { id: Date.now().toString(), name: form.name, estimated: +form.estimated || 0, actual: +form.actual || 0 }])
    setForm({ name: '', estimated: '', actual: '' })
    setAddOpen(false)
  }

  const updateActual = (id: string, val: string) => setItems(p => p.map(i => i.id === id ? { ...i, actual: +val || 0 } : i))
  const remove = (id: string) => setItems(p => p.filter(i => i.id !== id))

  const pct = Math.min(100, Math.round((totalActual / totalBudget) * 100))

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="couple" activeItem="/couple/planning/budget" userName="Samanthi & Kasun" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="couple" userName="Samanthi" />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Budget Tracker</h1>
              <p className="text-sm text-gray-500 mt-1">Track estimated vs. actual spend</p>
            </div>
            <Button onClick={() => setAddOpen(true)} size="sm"><Plus size={16} /> Add Item</Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Budget', val: formatCurrency(totalBudget), sub: 'Your cap', color: 'text-gray-800', bg: 'bg-white' },
              { label: 'Estimated Total', val: formatCurrency(totalEst), sub: totalEst > totalBudget ? '⚠️ Over budget' : 'Under budget', color: totalEst > totalBudget ? 'text-red-600' : 'text-green-600', bg: 'bg-white' },
              { label: 'Spent So Far', val: formatCurrency(totalActual), sub: `${pct}% of budget`, color: 'text-[#C21A6B]', bg: 'bg-white' },
              { label: remaining >= 0 ? 'Remaining' : 'Over by', val: formatCurrency(Math.abs(remaining)), sub: overBudget ? 'Over budget!' : 'Left to spend', color: overBudget ? 'text-red-600' : 'text-green-600', bg: overBudget ? 'bg-red-50' : 'bg-green-50' },
            ].map(s => (
              <Card key={s.label} className={s.bg}>
                <CardContent className="p-5">
                  <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Budget Progress */}
          <Card className="mb-6">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Budget Used</span>
                <span className={`text-sm font-bold ${pct >= 90 ? 'text-red-600' : pct >= 70 ? 'text-orange-500' : 'text-green-600'}`}>{pct}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-orange-400' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
              </div>
              {overBudget && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <AlertCircle size={15} /> You&apos;ve exceeded your total budget. Consider adjusting estimates.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['Category', 'Estimated', 'Actual / Paid', 'Difference', ''].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => {
                      const diff = item.estimated - item.actual
                      return (
                        <tr key={item.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors`}>
                          <td className="px-5 py-3.5 font-medium text-gray-800">{item.name}</td>
                          <td className="px-5 py-3.5 text-gray-600">{formatCurrency(item.estimated)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-800 font-medium">{formatCurrency(item.actual)}</span>
                              {item.actual === 0 && <span className="text-xs text-gray-400">Not paid</span>}
                            </div>
                          </td>
                          <td className={`px-5 py-3.5 font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {diff >= 0 ? `+${formatCurrency(diff)}` : `-${formatCurrency(Math.abs(diff))}`}
                          </td>
                          <td className="px-5 py-3.5">
                            <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 border-t-2 border-gray-200 font-semibold">
                      <td className="px-5 py-3.5 text-gray-900">Total</td>
                      <td className="px-5 py-3.5 text-gray-900">{formatCurrency(totalEst)}</td>
                      <td className="px-5 py-3.5 text-[#C21A6B]">{formatCurrency(totalActual)}</td>
                      <td className={`px-5 py-3.5 ${totalEst - totalActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {totalEst - totalActual >= 0 ? '+' : ''}{formatCurrency(totalEst - totalActual)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Budget Item">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B]">
              <option value="">Select a category...</option>
              {BUDGET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Estimated Amount (LKR)" type="number" value={form.estimated} onChange={e => setForm(p => ({ ...p, estimated: e.target.value }))} placeholder="0" />
          <Input label="Actual Paid (LKR)" type="number" value={form.actual} onChange={e => setForm(p => ({ ...p, actual: e.target.value }))} placeholder="0" />
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={addItem}>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
