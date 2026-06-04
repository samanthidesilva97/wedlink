'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays, MessageSquare, FileText, AlertCircle, ExternalLink } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

const BOOKINGS = [
  { id: '1', vendor: 'Lens & Love Photography', category: 'Photography', vendorId: '1', date: '2026-12-14', status: 'confirmed', agreed_price: 140000, deposit: 28000, deposit_paid: true, notes: 'Classic package booked. Shot list to be shared 2 weeks before.', invoice_url: '#' },
  { id: '2', vendor: 'Royal Palms Venue', category: 'Venue', vendorId: '2', date: '2026-12-14', status: 'awaiting_payment', agreed_price: 650000, deposit: 130000, deposit_paid: false, notes: 'Grand Hall booked for 220 guests.', invoice_url: '#' },
  { id: '3', vendor: 'Spice Garden Catering', category: 'Catering', vendorId: '3', date: '2026-12-14', status: 'negotiating', agreed_price: 320000, deposit: 64000, deposit_paid: false, notes: 'Menu finalisation pending.' },
  { id: '4', vendor: 'Floral Dreams', category: 'Florist', vendorId: '4', date: '2026-12-14', status: 'inquiry', agreed_price: 0, deposit: 0, deposit_paid: false, notes: '' },
]

const STATUS_ACTIONS: Record<string, string[]> = {
  inquiry: ['Message Vendor', 'Cancel'],
  negotiating: ['Message Vendor', 'Accept Quote', 'Cancel'],
  awaiting_payment: ['Pay Deposit', 'Message Vendor'],
  confirmed: ['Message Vendor', 'View Invoice', 'Raise Dispute'],
  completed: ['Leave Review', 'View Invoice'],
  cancelled: [],
}

export default function CoupleBookingsPage() {
  const [filter, setFilter] = useState('all')
  const [disputeOpen, setDisputeOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<typeof BOOKINGS[0] | null>(null)
  const [disputeReason, setDisputeReason] = useState('')
  const { toast } = useToast()

  const filtered = filter === 'all' ? BOOKINGS : BOOKINGS.filter(b => b.status === filter)

  const handleAction = (action: string, booking: typeof BOOKINGS[0]) => {
    if (action === 'Pay Deposit') toast('Redirecting to Stripe checkout...', 'info')
    else if (action === 'Raise Dispute') { setSelectedBooking(booking); setDisputeOpen(true) }
    else if (action === 'View Invoice') toast('Opening invoice...', 'info')
    else if (action === 'Leave Review') toast('Opening review form...', 'info')
    else toast(`${action} action triggered`, 'info')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="couple" activeItem="/couple/bookings" userName="Samanthi & Kasun" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="couple" userName="Samanthi" />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all your vendor bookings in one place</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
            {['all', 'inquiry', 'negotiating', 'awaiting_payment', 'confirmed', 'completed', 'cancelled'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${filter === s ? 'bg-[#C21A6B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C21A6B]'}`}>
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map(booking => (
              <Card key={booking.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#fce4f0] rounded-xl flex items-center justify-center text-[#C21A6B] font-bold text-lg flex-shrink-0">
                        {booking.vendor.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{booking.vendor}</h3>
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="text-sm text-gray-400">{booking.category} · {formatDate(booking.date)}</p>
                        {booking.notes && <p className="text-xs text-gray-500 mt-1 max-w-md">{booking.notes}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="text-right">
                        {booking.agreed_price > 0 && (
                          <>
                            <p className="text-xs text-gray-400">Agreed price</p>
                            <p className="font-bold text-gray-900">{formatCurrency(booking.agreed_price)}</p>
                          </>
                        )}
                        {booking.deposit > 0 && (
                          <p className={`text-xs ${booking.deposit_paid ? 'text-green-600' : 'text-orange-500'}`}>
                            {booking.deposit_paid ? '✓ Deposit paid' : `Deposit due: ${formatCurrency(booking.deposit)}`}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(STATUS_ACTIONS[booking.status] || []).map(action => (
                          <Button key={action} size="sm"
                            variant={action === 'Pay Deposit' ? 'primary' : action === 'Raise Dispute' ? 'destructive' : 'secondary'}
                            onClick={() => handleAction(action, booking)}>
                            {action === 'Message Vendor' && <MessageSquare size={13} />}
                            {action === 'View Invoice' && <FileText size={13} />}
                            {action}
                          </Button>
                        ))}
                        <Link href={`/couple/messages?booking=${booking.id}`}>
                          {booking.status === 'inquiry' || booking.status === 'negotiating' ? null : null}
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <CalendarDays size={48} className="mx-auto mb-4 text-gray-200" />
                <p className="text-gray-500">No bookings found</p>
                <Link href="/vendors" className="mt-4 block">
                  <Button variant="secondary" size="sm">Browse Vendors</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <Modal open={disputeOpen} onClose={() => setDisputeOpen(false)} title="Raise a Dispute" size="md">
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex gap-2 text-sm text-orange-700">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            Please try messaging the vendor first. Disputes are reviewed by our admin team within 2–3 business days.
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for dispute</label>
            <select className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B]">
              <option>Service not delivered as agreed</option>
              <option>Quality was significantly below expected</option>
              <option>Vendor no-show / cancellation</option>
              <option>Overcharged / billing issue</option>
              <option>Other</option>
            </select>
          </div>
          <Textarea label="Describe the issue" value={disputeReason} onChange={e => setDisputeReason(e.target.value)} placeholder="Please provide as much detail as possible..." rows={4} required />
          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1" onClick={() => setDisputeOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={() => { setDisputeOpen(false); toast('Dispute submitted. Admin team will review within 48 hours.', 'success') }}>Submit Dispute</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
