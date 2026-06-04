'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Booked dates (ISO strings)
const BOOKED = ['2026-12-14', '2026-11-08', '2026-09-20', '2026-10-05']
const BLOCKED = ['2026-12-25', '2026-12-26', '2026-01-01']

export default function VendorAvailabilityPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [blocked, setBlocked] = useState<string[]>(BLOCKED)
  const { toast } = useToast()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const isoDate = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const toggleBlocked = (date: string) => {
    if (BOOKED.includes(date)) { toast('Cannot block a date with a confirmed booking.', 'error'); return }
    setBlocked(p => p.includes(date) ? p.filter(d => d !== date) : [...p, date])
    toast(blocked.includes(date) ? 'Date unblocked' : 'Date blocked', 'success')
  }

  const getDayStatus = (date: string) => {
    if (BOOKED.includes(date)) return 'booked'
    if (blocked.includes(date)) return 'blocked'
    const d = new Date(date)
    if (d < today) return 'past'
    return 'available'
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="vendor" activeItem="/vendor/availability" userName="Lens & Love" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="vendor" userName="Lens & Love" />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Availability Calendar</h1>
            <p className="text-sm text-gray-500 mt-1">Click dates to block or unblock them for couples to see</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-5">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-5">
                    <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><ChevronLeft size={18} /></button>
                    <h2 className="text-lg font-semibold text-gray-900">{MONTHS[month]} {year}</h2>
                    <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><ChevronRight size={18} /></button>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 mb-2">
                    {DAYS.map(d => (
                      <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}
                    {[...Array(daysInMonth)].map((_, i) => {
                      const d = i + 1
                      const date = isoDate(d)
                      const status = getDayStatus(date)
                      const isToday = date === today.toISOString().slice(0, 10)

                      return (
                        <button key={d} onClick={() => status !== 'past' && toggleBlocked(date)}
                          className={cn(
                            'aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all',
                            status === 'available' && 'hover:bg-[#fce4f0] hover:text-[#C21A6B] text-gray-700',
                            status === 'booked' && 'bg-[#C21A6B] text-white cursor-not-allowed',
                            status === 'blocked' && 'bg-gray-200 text-gray-400',
                            status === 'past' && 'text-gray-200 cursor-not-allowed',
                            isToday && status === 'available' && 'ring-2 ring-[#C21A6B] ring-offset-1',
                          )}>
                          {d}
                        </button>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-gray-100">
                    {[
                      { color: 'bg-white border border-gray-200', label: 'Available' },
                      { color: 'bg-[#C21A6B]', label: 'Booked' },
                      { color: 'bg-gray-200', label: 'Blocked by you' },
                      { color: 'bg-gray-100', label: 'Past' },
                    ].map(l => (
                      <div key={l.label} className="flex items-center gap-2">
                        <div className={cn('w-4 h-4 rounded', l.color)} />
                        <span className="text-xs text-gray-500">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>This Month Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Booked Dates', val: BOOKED.filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length, color: 'text-[#C21A6B]' },
                    { label: 'Blocked Dates', val: blocked.filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length, color: 'text-gray-600' },
                    { label: 'Available Days', val: daysInMonth - BOOKED.filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length - blocked.filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length, color: 'text-green-600' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{s.label}</span>
                      <span className={`text-lg font-bold ${s.color}`}>{s.val}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Upcoming Bookings</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {BOOKED.filter(d => new Date(d) >= today).sort().map(d => (
                    <div key={d} className="flex items-center gap-3 bg-[#fce4f0] rounded-xl px-3 py-2.5">
                      <CalendarDays size={15} className="text-[#C21A6B] flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  ))}
                  {BOOKED.filter(d => new Date(d) >= today).length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-3">No upcoming bookings</p>
                  )}
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
                <p className="font-semibold mb-1">💡 Tip</p>
                Couples can see your available dates when viewing your profile. Keeping your calendar up to date increases your booking rate.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
