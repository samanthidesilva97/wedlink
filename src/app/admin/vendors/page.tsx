'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'

const VENDORS = [
  { id: 'v1', name: 'Crystal Moments Photography', category: 'Photography', location: 'Colombo', applied: '2026-06-03', status: 'pending', docs: true, tier: 'premium' },
  { id: 'v2', name: 'Garden of Eden Florist', category: 'Florist', location: 'Kandy', applied: '2026-06-02', status: 'pending', docs: true, tier: 'free' },
  { id: 'v3', name: 'Luxe Catering Solutions', category: 'Catering', location: 'Gampaha', applied: '2026-06-01', status: 'pending', docs: false, tier: 'premium' },
  { id: 'v4', name: 'Lens & Love Photography', category: 'Photography', location: 'Colombo', applied: '2025-01-10', status: 'approved', docs: true, tier: 'premium' },
  { id: 'v5', name: 'Royal Palms Venue', category: 'Venue', location: 'Colombo', applied: '2025-02-15', status: 'approved', docs: true, tier: 'premium' },
  { id: 'v6', name: 'Budget Snaps Studio', category: 'Photography', location: 'Matara', applied: '2026-05-28', status: 'rejected', docs: false, tier: 'free' },
]

export default function AdminVendorsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('pending')
  const [rejectOpen, setRejectOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<typeof VENDORS[0] | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [vendors, setVendors] = useState(VENDORS)
  const { toast } = useToast()

  const filtered = vendors.filter(v => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter !== 'all' && v.status !== filter) return false
    return true
  })

  const approve = (id: string) => {
    setVendors(p => p.map(v => v.id === id ? { ...v, status: 'approved' } : v))
    toast('Vendor approved and notified via email.', 'success')
  }

  const reject = () => {
    if (!selectedVendor) return
    setVendors(p => p.map(v => v.id === selectedVendor.id ? { ...v, status: 'rejected' } : v))
    setRejectOpen(false)
    setRejectReason('')
    toast('Vendor rejected and notified with reason.', 'info')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="admin" activeItem="/admin/vendors" userName="Admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="admin" userName="Admin" />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
            <p className="text-sm text-gray-500 mt-1">Review and approve vendor applications</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B]" />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected', 'suspended'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${filter === f ? 'bg-[#C21A6B] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                  {f}
                  {f === 'pending' && <span className="ml-1.5 bg-orange-500 text-white text-xs rounded-full px-1.5">{vendors.filter(v => v.status === 'pending').length}</span>}
                </button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Vendor', 'Category', 'Location', 'Plan', 'Docs', 'Applied', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, i) => (
                    <tr key={v.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{v.name}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{v.category}</td>
                      <td className="px-5 py-4 text-gray-600">{v.location}</td>
                      <td className="px-5 py-4">
                        <Badge variant={v.tier === 'premium' ? 'gold' : 'default'}>{v.tier}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        {v.docs
                          ? <span className="text-green-600 font-medium text-xs">✓ Submitted</span>
                          : <span className="text-red-500 font-medium text-xs">✗ Missing</span>}
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{v.applied}</td>
                      <td className="px-5 py-4"><StatusBadge status={v.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="w-7 h-7 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center transition-colors" title="View profile">
                            <Eye size={14} />
                          </button>
                          {v.status === 'pending' && (
                            <>
                              <button onClick={() => approve(v.id)} className="w-7 h-7 text-green-600 hover:bg-green-50 rounded-lg flex items-center justify-center transition-colors" title="Approve">
                                <CheckCircle size={14} />
                              </button>
                              <button onClick={() => { setSelectedVendor(v); setRejectOpen(true) }} className="w-7 h-7 text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors" title="Reject">
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          {v.status === 'approved' && (
                            <button onClick={() => { setVendors(p => p.map(x => x.id === v.id ? { ...x, status: 'suspended' } : x)); toast('Vendor suspended.', 'warning') }}
                              className="text-xs text-orange-500 hover:underline">Suspend</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="py-10 text-center text-gray-400 text-sm">No vendors match this filter</div>}
            </CardContent>
          </Card>
        </main>
      </div>

      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject Vendor Application">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-sm font-medium text-gray-900">{selectedVendor?.name}</p>
            <p className="text-xs text-gray-500">{selectedVendor?.category} · {selectedVendor?.location}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rejection reason</label>
            <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B]">
              <option>Incomplete documentation</option>
              <option>Business registration not verified</option>
              <option>Does not meet quality standards</option>
              <option>Duplicate account detected</option>
              <option>Other</option>
            </select>
          </div>
          <Textarea label="Additional notes (sent to vendor)" value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Explain what they need to fix to reapply..." rows={3} />
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={reject}>Reject & Notify</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
