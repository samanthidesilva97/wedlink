'use client'

import Link from 'next/link'
import { BarChart3, TrendingUp, Star, Eye, MessageSquare, CalendarDays, ArrowRight, ArrowUp, Clock } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge, Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { formatCurrency, formatDate } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const STATS = [
  { label: 'Profile Views (30d)', value: '1,248', change: '+18%', up: true, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Booking Inquiries', value: '34', change: '+12%', up: true, icon: CalendarDays, color: 'text-[#C21A6B]', bg: 'bg-[#fce4f0]' },
  { label: 'Average Rating', value: '4.9', change: '+0.1', up: true, icon: Star, color: 'text-[#B8960C]', bg: 'bg-[#fdf6d8]' },
  { label: 'Revenue (30d)', value: 'LKR 520K', change: '+24%', up: true, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
]

const RECENT_BOOKINGS = [
  { id: '1', couple: 'Samanthi & Kasun', date: '2026-12-14', status: 'confirmed', price: 140000 },
  { id: '2', couple: 'Priya & Dinesh', date: '2026-11-08', status: 'awaiting_payment', price: 80000 },
  { id: '3', couple: 'Amali & Rohan', date: '2026-10-22', status: 'negotiating', price: 0 },
  { id: '4', couple: 'Dilini & Kasun', date: '2025-09-14', status: 'completed', price: 140000 },
]

const INQUIRY_DATA = [
  { month: 'Jan', inquiries: 8 }, { month: 'Feb', inquiries: 12 }, { month: 'Mar', inquiries: 15 },
  { month: 'Apr', inquiries: 10 }, { month: 'May', inquiries: 18 }, { month: 'Jun', inquiries: 22 },
]

const RECENT_REVIEWS = [
  { couple: 'Priya & Dinesh', rating: 5, comment: 'Absolutely stunning work!', date: '2025-11-10' },
  { couple: 'Dilini & Kasun', rating: 5, comment: 'Professional and incredibly talented.', date: '2025-09-22' },
]

export default function VendorDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="vendor" activeItem="/vendor/dashboard" userName="Lens & Love" userEmail="vendor@wedlink.lk" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="vendor" userName="Lens & Love" unreadCount={2} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Lens & Love Photography · <Badge variant="gold">⭐ Premium</Badge></p>
            </div>
            <Link href="/vendor/profile">
              <Button size="sm" variant="secondary">Edit Profile</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATS.map(s => (
              <Card key={s.label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                      <s.icon size={18} className={s.color} />
                    </div>
                    <span className={`text-xs font-medium flex items-center gap-0.5 ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                      <ArrowUp size={11} className={s.up ? '' : 'rotate-180'} />{s.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Inquiries (Last 6 months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={INQUIRY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="inquiries" fill="#C21A6B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
                  <Link href="/vendor/bookings" className="text-sm text-[#C21A6B] hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
                </div>
                <CardContent className="p-0">
                  {RECENT_BOOKINGS.map((b, i) => (
                    <div key={b.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${i < RECENT_BOOKINGS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-9 h-9 bg-[#fce4f0] rounded-full flex items-center justify-center text-[#C21A6B] font-bold text-sm flex-shrink-0">
                        {b.couple.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{b.couple}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} />{formatDate(b.date)}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={b.status} />
                        {b.price > 0 && <p className="text-xs text-gray-500 mt-1">{formatCurrency(b.price)}</p>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Profile completeness */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Profile Completeness</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">82% complete</span>
                    <span className="text-sm font-bold text-[#C21A6B]">82%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-[#C21A6B] rounded-full" style={{ width: '82%' }} />
                  </div>
                  <div className="space-y-2">
                    {[
                      { task: 'Add video reel', done: false },
                      { task: 'Add Instagram URL', done: false },
                      { task: 'Complete portfolio (10+ photos)', done: true },
                    ].map(t => (
                      <div key={t.task} className={`text-xs flex items-center gap-2 ${t.done ? 'text-green-600 line-through opacity-60' : 'text-gray-600'}`}>
                        <span>{t.done ? '✓' : '○'}</span>{t.task}
                      </div>
                    ))}
                  </div>
                  <Link href="/vendor/profile" className="block mt-4">
                    <Button variant="secondary" size="sm" className="w-full">Complete Profile</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">Recent Reviews</h3>
                  <span className="text-xs text-[#B8960C] font-bold">4.9 ⭐</span>
                </div>
                <CardContent className="p-4 space-y-4">
                  {RECENT_REVIEWS.map(r => (
                    <div key={r.couple} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-gray-800">{r.couple}</p>
                        <StarRating rating={r.rating} size="sm" />
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{r.comment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming booked date */}
              <Card className="bg-gradient-to-br from-[#fce4f0] to-[#fdf6d8] border-0">
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-[#C21A6B] uppercase tracking-wide mb-2">Next Wedding</p>
                  <p className="font-bold text-gray-900">Samanthi & Kasun</p>
                  <p className="text-sm text-gray-600">14 December 2026</p>
                  <Link href="/vendor/bookings" className="block mt-3">
                    <Button size="sm" className="w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
