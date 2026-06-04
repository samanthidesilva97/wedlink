'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Star, Heart, Phone, Globe, Instagram, CheckCircle, ArrowLeft, Calendar, MessageSquare, Share2, Flag } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

// Mock — replace with Supabase fetch by params.id
const VENDOR = {
  id: '1',
  business_name: 'Lens & Love Photography',
  category: 'Photography',
  description: `We are a team of passionate photographers dedicated to capturing your most precious moments with an artistic, documentary-style approach. With over 10 years of experience shooting weddings across Sri Lanka, we blend into your celebration and tell your unique story through stunning imagery.

Our packages include pre-wedding shoots, full-day wedding coverage, edited galleries delivered within 4 weeks, and optional album design. We use the latest Sony and Canon camera systems with professional-grade lenses.`,
  location: 'Colombo',
  city: 'Colombo 7',
  district: 'Colombo',
  price_min: 80000,
  price_max: 250000,
  is_verified: true,
  subscription_tier: 'premium',
  avg_rating: 4.9,
  review_count: 87,
  portfolio_images: [],
  website_url: 'https://lensandlove.lk',
  instagram_url: 'https://instagram.com/lensandlove',
  phone: '+94 77 123 4567',
  tags: ['Candid', 'Portrait', 'Drone', 'Pre-wedding', 'Albums'],
  packages: [
    { name: 'Essential', price: 80000, includes: ['6 hours coverage', '1 photographer', '300+ edited photos', 'Online gallery'] },
    { name: 'Classic', price: 140000, includes: ['8 hours coverage', '2 photographers', '500+ edited photos', 'Online gallery', 'Printed album'] },
    { name: 'Premium', price: 220000, includes: ['Full day coverage', '2 photographers + drone', '700+ edited photos', 'Online gallery', 'Luxury album', 'Pre-wedding shoot'] },
  ],
}

const REVIEWS = [
  { id: '1', couple: 'Priya & Dinesh', date: '2025-11-10', rating: 5, comment: 'Absolutely stunning work! They captured every emotion beautifully. The drone shots were breathtaking.', verified: true },
  { id: '2', couple: 'Dilini & Kasun', date: '2025-09-22', rating: 5, comment: 'Professional, friendly, and incredibly talented. Our photos look like they\'re from a magazine.', verified: true },
  { id: '3', couple: 'Amali & Rohan', date: '2025-08-05', rating: 4, comment: 'Great photos overall. Album delivery took a bit longer than expected but the quality made up for it.', verified: true },
]

const AVAILABILITY = ['2026-07-05', '2026-07-12', '2026-07-19', '2026-08-02']

export default function VendorProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'reviews' | 'availability'>('overview')
  const [saved, setSaved] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(VENDOR.packages[1])
  const [eventDate, setEventDate] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setBookingOpen(false)
      toast('Booking inquiry sent! The vendor will respond within 24 hours.', 'success')
    }, 1200)
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'packages', label: 'Packages' },
    { id: 'reviews', label: `Reviews (${VENDOR.review_count})` },
    { id: 'availability', label: 'Availability' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={null} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back */}
        <Link href="/vendors" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C21A6B] mb-5 transition-colors">
          <ArrowLeft size={16} /> Back to vendors
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hero Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-56 bg-gradient-to-br from-[#fce4f0] to-[#fdf6d8] flex items-center justify-center relative">
                <span className="text-8xl">📸</span>
                {VENDOR.subscription_tier === 'premium' && (
                  <span className="absolute top-4 left-4 bg-[#B8960C] text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Premium Vendor</span>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => setSaved(!saved)}
                    className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform">
                    <Heart size={16} className={saved ? 'fill-[#C21A6B] text-[#C21A6B]' : 'text-gray-400'} />
                  </button>
                  <button className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform">
                    <Share2 size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-gray-900">{VENDOR.business_name}</h1>
                      {VENDOR.is_verified && <CheckCircle size={20} className="text-green-500 flex-shrink-0" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={14} />{VENDOR.city}, {VENDOR.district}</span>
                      <span>·</span>
                      <span>{VENDOR.category}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={VENDOR.avg_rating} size="sm" />
                      <span className="font-semibold text-gray-900">{VENDOR.avg_rating}</span>
                      <span className="text-gray-400 text-sm">({VENDOR.review_count} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Starting from</p>
                    <p className="text-2xl font-bold text-[#C21A6B]">{formatCurrency(VENDOR.price_min)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {VENDOR.tags.map(t => (
                    <span key={t} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-shrink-0 px-6 py-3.5 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id ? 'border-[#C21A6B] text-[#C21A6B]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-3">About</h2>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{VENDOR.description}</p>
                    <div className="mt-5 grid sm:grid-cols-2 gap-3">
                      {VENDOR.website_url && (
                        <a href={VENDOR.website_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                          <Globe size={14} /> {VENDOR.website_url.replace('https://', '')}
                        </a>
                      )}
                      {VENDOR.instagram_url && (
                        <a href={VENDOR.instagram_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-pink-600 hover:underline">
                          <Instagram size={14} /> Instagram
                        </a>
                      )}
                    </div>
                    {/* Portfolio grid placeholder */}
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Portfolio</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${i % 3 === 0 ? 'from-pink-100 to-pink-200' : i % 3 === 1 ? 'from-amber-100 to-amber-200' : 'from-purple-100 to-purple-200'} flex items-center justify-center text-2xl`}>
                            📸
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'packages' && (
                  <div className="space-y-4">
                    {VENDOR.packages.map(pkg => (
                      <div key={pkg.name} onClick={() => { setSelectedPackage(pkg); setBookingOpen(true) }}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all hover:border-[#C21A6B] hover:shadow-sm ${selectedPackage.name === pkg.name ? 'border-[#C21A6B] bg-[#fce4f0]/30' : 'border-gray-100'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                          <span className="text-xl font-bold text-[#C21A6B]">{formatCurrency(pkg.price)}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {pkg.includes.map(item => (
                            <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {item}
                            </li>
                          ))}
                        </ul>
                        <Button size="sm" className="mt-4 w-full">Book this Package</Button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-gray-900">{VENDOR.avg_rating}</p>
                        <StarRating rating={VENDOR.avg_rating} size="sm" className="justify-center mt-1" />
                        <p className="text-xs text-gray-400 mt-1">{VENDOR.review_count} reviews</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map(s => (
                          <div key={s} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-3">{s}</span>
                            <Star size={10} className="fill-[#B8960C] text-[#B8960C]" />
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#B8960C] rounded-full" style={{ width: s === 5 ? '75%' : s === 4 ? '18%' : s === 3 ? '5%' : '2%' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {REVIEWS.map(r => (
                      <div key={r.id} className="border-b border-gray-100 pb-5 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#fce4f0] rounded-full flex items-center justify-center text-[#C21A6B] font-bold text-sm">{r.couple.charAt(0)}</div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{r.couple}</p>
                              <p className="text-xs text-gray-400">{formatDate(r.date)}</p>
                            </div>
                          </div>
                          <StarRating rating={r.rating} size="sm" />
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                        {r.verified && <p className="text-xs text-green-600 mt-1.5">✓ Verified booking</p>}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">Available dates in the next 3 months:</p>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABILITY.map(d => (
                        <span key={d} className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg font-medium">{formatDate(d)}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-4">For specific date inquiries, send a booking request below.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
              <p className="text-sm text-gray-500 mb-1">Price range</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(VENDOR.price_min)} – {formatCurrency(VENDOR.price_max)}</p>
              <p className="text-xs text-gray-400 mb-5">Varies by package and date</p>

              <Button className="w-full mb-3" size="lg" onClick={() => setBookingOpen(true)}>
                <Calendar size={16} /> Request Booking
              </Button>
              <Button variant="secondary" className="w-full mb-3" size="md" onClick={() => setEnquiryOpen(true)}>
                <MessageSquare size={16} /> Send Enquiry
              </Button>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                {VENDOR.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400" /> {VENDOR.phone}
                  </div>
                )}
                {VENDOR.is_verified && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle size={14} /> Verified vendor
                  </div>
                )}
              </div>

              <button className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors">
                <Flag size={12} /> Report this profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal open={bookingOpen} onClose={() => setBookingOpen(false)} title="Request Booking" size="md">
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div className="bg-[#fce4f0] rounded-xl p-3 text-sm text-[#C21A6B] font-medium">
            📦 {selectedPackage.name} Package — {formatCurrency(selectedPackage.price)}
          </div>
          <Input label="Wedding Date" type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
          <Input label="Estimated Guest Count" type="number" value={guestCount} onChange={e => setGuestCount(e.target.value)} placeholder="e.g. 200" />
          <Textarea label="Message to Vendor" value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell them about your wedding, style preferences, and any special requirements..." rows={4} />
          <p className="text-xs text-gray-400">A 20% deposit will be required to confirm your booking. No payment now — the vendor will review and respond first.</p>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setBookingOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={loading}>Send Request</Button>
          </div>
        </form>
      </Modal>

      {/* Enquiry Modal */}
      <Modal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} title="Send Enquiry" size="md">
        <form onSubmit={e => { e.preventDefault(); setEnquiryOpen(false); toast('Enquiry sent!', 'success') }} className="space-y-4">
          <Input label="Your question or message" placeholder="Ask about availability, pricing, customisation..." />
          <Textarea label="Details" placeholder="Any other details you'd like to share..." rows={4} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setEnquiryOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Send</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
