'use client'

import Link from 'next/link'
import { Users, ShieldCheck, AlertTriangle, DollarSign, TrendingUp, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const STATS = [
  { label: 'Total Vendors', val: '1,248', sub: '34 pending review', icon: ShieldCheck, color: 'text-[#C21A6B]', bg: 'bg-[#fce4f0]' },
  { label: 'Total Couples', val: '5,034', sub: '+128 this week', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Open Disputes', val: '7', sub: '2 urgent', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Platform Revenue', val: formatCurrency(1850000), sub: 'This month', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
]

const PENDING_VENDORS = [
  { id: 'v1', name: 'Crystal Moments Photography', category: 'Photography', location: 'Colombo', applied: '2026-06-03' },
  { id: 'v2', name: 'Garden of Eden Florist', category: 'Florist', location: 'Kandy', applied: '2026-06-02' },
  { id: 'v3', name: 'Luxe Catering Solutions', category: 'Catering', location: 'Gampaha', applied: '2026-06-01' },
]

const RECENT_DISPUTES = [
  { id: 'd1', booking: 'Samanthi & Kasun ↔ Spice Garden', reason: 'Service quality below agreement', status: 'open', days: 2 },
  { id: 'd2', booking: 'Priya & Dinesh ↔ Harmony Band', reason: 'No-show on wedding day', status: 'investigating', days: 5 },
]

const REVENUE_DATA = [
  { month: 'Jan', revenue: 820000 }, { month: 'Feb', revenue: 940000 }, { month: 'Mar', revenue: 1100000 },
  { month: 'Apr', revenue: 1050000 }, { month: 'May', revenue: 1380000 }, { month: 'Jun', revenue: 1850000 },
]

export default function AdminDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="admin" activeItem="/admin/dashboard" userName="Admin" userEmail="admin@wedlink.lk" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="admin" userName="Admin" />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Platform overview — WedLink</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATS.map(s => (
              <Card key={s.label}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                      <s.icon size={18} className={s.color} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Platform Revenue (Commission)</CardTitle>
                    <Link href="/admin/revenue" className="text-sm text-[#C21A6B] hover:underline">Full report →</Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v / 1000}K`} />
                      <Tooltip formatter={(v: number) => formatCurrency(v)} />
                      <Bar dataKey="revenue" fill="#C21A6B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pending Vendor Approvals */}
              <Card>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#C21A6B]" /> Pending Vendor Approvals
                    <Badge variant="warning">{PENDING_VENDORS.length}</Badge>
                  </h2>
                  <Link href="/admin/vendors" className="text-sm text-[#C21A6B] hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
                </div>
                <CardContent className="p-0">
                  {PENDING_VENDORS.map((v, i) => (
                    <div key={v.id} className={`flex items-center gap-4 px-6 py-4 ${i < PENDING_VENDORS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 font-bold text-sm flex-shrink-0">
                        {v.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{v.name}</p>
                        <p className="text-xs text-gray-400">{v.category} · {v.location} · Applied {v.applied}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors">
                          <CheckCircle size={16} />
                        </button>
                        <button className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors">
                          <XCircle size={16} />
                        </button>
                        <Link href={`/admin/vendors/${v.id}`}>
                          <button className="text-xs text-[#C21A6B] hover:underline px-2">Review</button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Open Disputes */}
              <Card>
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <AlertTriangle size={15} className="text-orange-500" /> Open Disputes
                  </h3>
                  <Link href="/admin/disputes" className="text-xs text-[#C21A6B] hover:underline">View all</Link>
                </div>
                <CardContent className="p-4 space-y-3">
                  {RECENT_DISPUTES.map(d => (
                    <div key={d.id} className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.status === 'open' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {d.status}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} />{d.days}d ago</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mt-1">{d.booking}</p>
                      <p className="text-xs text-gray-500">{d.reason}</p>
                      <Link href={`/admin/disputes/${d.id}`}>
                        <button className="text-xs text-[#C21A6B] hover:underline mt-2">Investigate →</button>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader><CardTitle>Platform Health</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'Avg. response time', val: '4.2h', good: true },
                    { label: 'Booking conversion', val: '24%', good: true },
                    { label: 'Dispute rate', val: '0.8%', good: true },
                    { label: 'Vendor satisfaction', val: '4.7 ★', good: true },
                    { label: 'Couple satisfaction', val: '4.8 ★', good: true },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{s.label}</span>
                      <span className={`text-xs font-bold ${s.good ? 'text-green-600' : 'text-red-600'}`}>{s.val}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#C21A6B] to-[#9a155a] text-white border-0">
                <CardContent className="p-5">
                  <p className="text-sm font-bold mb-1">Commission Rate</p>
                  <p className="text-3xl font-bold">10%</p>
                  <p className="text-white/70 text-xs mt-1">Per confirmed booking</p>
                  <p className="text-white/80 text-xs mt-3">Stripe Connect handles all vendor payouts automatically after the 30-day review window.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
