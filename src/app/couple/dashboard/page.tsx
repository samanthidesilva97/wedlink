'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, CalendarDays, PiggyBank, CheckSquare, Users, MessageSquare, Clock, Star, ArrowRight, TrendingUp, Bookmark } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { formatCurrency, calculateDaysUntil, formatDate } from '@/lib/utils'

// --- Mock data (replace with Supabase queries) ---
const COUPLE = {
  partner1: 'Samanthi',
  partner2: 'Kasun',
  weddingDate: '2026-12-14',
  weddingLocation: 'Colombo',
  totalBudget: 2500000,
  spentBudget: 980000,
  guestCount: 220,
  confirmedGuests: 148,
}

const CHECKLIST_PROGRESS = { total: 20, completed: 8 }

const UPCOMING_BOOKINGS = [
  { id: '1', vendor: 'Lens & Love Photography', category: 'Photography', date: '2026-12-14', status: 'confirmed', price: 180000 },
  { id: '2', vendor: 'Royal Palms Venue', category: 'Venue', date: '2026-12-14', status: 'awaiting_payment', price: 650000 },
  { id: '3', vendor: 'Spice Garden Catering', category: 'Catering', date: '2026-12-14', status: 'negotiating', price: 320000 },
]

const RECENT_MESSAGES = [
  { id: '1', from: 'Lens & Love Photography', preview: 'Great! I\'ve blocked your date. Please review...', time: '2h ago', unread: true },
  { id: '2', from: 'Royal Palms Venue', preview: 'The deposit invoice has been sent to your...', time: '1d ago', unread: false },
]

const STATS = [
  { label: 'Days to go', value: null, icon: CalendarDays, color: 'text-[#C21A6B]', bg: 'bg-[#fce4f0]', isDays: true },
  { label: 'Budget used', value: null, icon: PiggyBank, color: 'text-[#B8960C]', bg: 'bg-[#fdf6d8]', isBudget: true },
  { label: 'Tasks done', value: null, icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50', isChecklist: true },
  { label: 'Guests confirmed', value: null, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', isGuests: true },
]

export default function CoupleDashboard() {
  const daysUntil = calculateDaysUntil(COUPLE.weddingDate)
  const budgetPct = Math.round((COUPLE.spentBudget / COUPLE.totalBudget) * 100)
  const checklistPct = Math.round((CHECKLIST_PROGRESS.completed / CHECKLIST_PROGRESS.total) * 100)
  const guestPct = Math.round((COUPLE.confirmedGuests / COUPLE.guestCount) * 100)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="couple" activeItem="/couple/dashboard" userName={`${COUPLE.partner1} & ${COUPLE.partner2}`} userEmail="couple@wedlink.lk" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="couple" userName={COUPLE.partner1} unreadCount={1} />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {/* Welcome */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {COUPLE.partner1} & {COUPLE.partner2} 💍
              </h1>
              <p className="text-gray-500 mt-1">
                Your wedding is on <span className="font-medium text-[#C21A6B]">{formatDate(COUPLE.weddingDate)}</span> — let&apos;s keep the momentum going!
              </p>
            </div>
            <Link href="/vendors">
              <Button size="sm">
                <Star size={15} /> Find Vendors
              </Button>
            </Link>
          </div>

          {/* Countdown Banner */}
          <div className="bg-gradient-to-r from-[#C21A6B] to-[#9a155a] rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">Counting down to your big day</p>
                <p className="text-5xl font-bold">{daysUntil} <span className="text-2xl font-normal opacity-80">days</span></p>
                <p className="text-white/80 text-sm mt-1">{COUPLE.weddingLocation} · {formatDate(COUPLE.weddingDate)}</p>
              </div>
              <div className="flex gap-3">
                {[
                  { v: Math.floor(daysUntil / 30), u: 'months' },
                  { v: Math.floor((daysUntil % 30) / 7), u: 'weeks' },
                  { v: daysUntil % 7, u: 'days' },
                ].map(({ v, u }) => (
                  <div key={u} className="bg-white/20 rounded-xl px-4 py-3 text-center min-w-[60px]">
                    <p className="text-2xl font-bold">{v}</p>
                    <p className="text-xs text-white/70">{u}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Days to Go', value: daysUntil, sub: formatDate(COUPLE.weddingDate), icon: CalendarDays, color: 'text-[#C21A6B]', bg: 'bg-[#fce4f0]' },
              { label: 'Budget Used', value: `${budgetPct}%`, sub: `${formatCurrency(COUPLE.spentBudget)} of ${formatCurrency(COUPLE.totalBudget)}`, icon: PiggyBank, color: 'text-[#B8960C]', bg: 'bg-[#fdf6d8]', pct: budgetPct },
              { label: 'Tasks Done', value: `${CHECKLIST_PROGRESS.completed}/${CHECKLIST_PROGRESS.total}`, sub: `${checklistPct}% complete`, icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50', pct: checklistPct },
              { label: 'RSVPs In', value: `${COUPLE.confirmedGuests}/${COUPLE.guestCount}`, sub: `${guestPct}% confirmed`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', pct: guestPct },
            ].map(({ label, value, sub, icon: Icon, color, bg, pct }) => (
              <Card key={label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                      <Icon size={18} className={color} />
                    </div>
                    <span className={`text-2xl font-bold ${color}`}>{value}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  {pct !== undefined && (
                    <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${color.replace('text-', 'bg-')}`} style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Bookings */}
            <div className="lg:col-span-2">
              <Card>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">My Bookings</h2>
                  <Link href="/couple/bookings" className="text-sm text-[#C21A6B] font-medium hover:underline flex items-center gap-1">
                    View all <ArrowRight size={14} />
                  </Link>
                </div>
                <CardContent className="p-0">
                  {UPCOMING_BOOKINGS.map((b, i) => (
                    <div key={b.id} className={`flex items-center gap-4 px-6 py-4 ${i < UPCOMING_BOOKINGS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-10 h-10 bg-[#fce4f0] rounded-xl flex items-center justify-center text-[#C21A6B] font-bold text-sm flex-shrink-0">
                        {b.vendor.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{b.vendor}</p>
                        <p className="text-xs text-gray-400">{b.category} · {formatDate(b.date)}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={b.status} />
                        <p className="text-xs text-gray-500 mt-1">{formatCurrency(b.price)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <div className="px-6 py-3 border-t border-gray-100">
                  <Link href="/vendors">
                    <Button variant="secondary" size="sm" className="w-full">+ Find more vendors</Button>
                  </Link>
                </div>
              </Card>

              {/* Planning Progress */}
              <Card className="mt-4">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Planning Tools</h2>
                </div>
                <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Checklist', href: '/couple/planning/checklist', icon: CheckSquare, pct: checklistPct, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Budget', href: '/couple/planning/budget', icon: PiggyBank, pct: budgetPct, color: 'text-[#B8960C]', bg: 'bg-[#fdf6d8]' },
                    { label: 'Guests', href: '/couple/planning/guests', icon: Users, pct: guestPct, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Seating', href: '/couple/planning/seating', icon: TrendingUp, pct: 30, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Mood Board', href: '/couple/planning/moodboard', icon: Heart, pct: 0, color: 'text-[#C21A6B]', bg: 'bg-[#fce4f0]' },
                    { label: 'Timeline', href: '/couple/planning/timeline', icon: Clock, pct: 0, color: 'text-orange-600', bg: 'bg-orange-50' },
                  ].map(({ label, href, icon: Icon, pct, color, bg }) => (
                    <Link key={label} href={href}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-[#C21A6B]/30 hover:shadow-sm transition-all group">
                      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon size={18} className={color} />
                      </div>
                      <p className="text-xs font-semibold text-gray-700">{label}</p>
                      <div className="w-full h-1 bg-gray-100 rounded-full">
                        <div className={`h-full rounded-full ${color.replace('text-', 'bg-')}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Messages */}
              <Card>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Messages</h2>
                  <Link href="/couple/messages" className="text-sm text-[#C21A6B] font-medium hover:underline">
                    View all
                  </Link>
                </div>
                <CardContent className="p-0">
                  {RECENT_MESSAGES.map((m, i) => (
                    <Link key={m.id} href={`/couple/messages?booking=${m.id}`}
                      className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors ${i < RECENT_MESSAGES.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-9 h-9 bg-[#fce4f0] rounded-full flex items-center justify-center text-[#C21A6B] font-bold text-sm flex-shrink-0">
                        {m.from.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${m.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{m.from}</p>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{m.time}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{m.preview}</p>
                      </div>
                      {m.unread && <div className="w-2 h-2 bg-[#C21A6B] rounded-full flex-shrink-0 mt-1.5" />}
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Saved Vendors */}
              <Card>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Saved Vendors</h2>
                  <Link href="/couple/wishlist" className="text-sm text-[#C21A6B] font-medium hover:underline">View all</Link>
                </div>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    {[
                      { name: 'Floral Dreams', cat: 'Florist', rating: 4.8 },
                      { name: 'Sweet Moments Cake', cat: 'Cake', rating: 4.9 },
                      { name: 'Harmony Band', cat: 'Music', rating: 4.7 },
                    ].map(v => (
                      <div key={v.name} className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                          {v.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{v.name}</p>
                          <p className="text-xs text-gray-400">{v.cat}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#B8960C]">
                          <Star size={12} className="fill-[#B8960C]" />
                          {v.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/vendors" className="mt-4 block">
                    <Button variant="ghost" size="sm" className="w-full text-[#C21A6B]">
                      <Bookmark size={14} /> Browse vendors
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Next Task */}
              <Card className="bg-gradient-to-br from-[#fce4f0] to-[#fdf6d8] border-0">
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-[#C21A6B] uppercase tracking-wide mb-2">Next Up</p>
                  <p className="font-semibold text-gray-900 mb-1">Book your florist</p>
                  <p className="text-xs text-gray-500 mb-3">Florists book up fast — 8 months before the wedding is recommended.</p>
                  <Link href="/vendors?category=florist">
                    <Button size="sm" className="w-full">Find Florists <ArrowRight size={14} /></Button>
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
