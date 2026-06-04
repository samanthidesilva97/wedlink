'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin, Star, Heart, X, ChevronDown } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { VENDOR_CATEGORIES, SRI_LANKA_DISTRICTS } from '@/lib/constants'

// Mock vendor data
const VENDORS = [
  { id: '1', business_name: 'Lens & Love Photography', category: 'photography', location: 'Colombo', city: 'Colombo 7', price_min: 80000, price_max: 250000, avg_rating: 4.9, review_count: 87, is_verified: true, subscription_tier: 'premium', portfolio_images: ['/placeholder.jpg'], description: 'Capturing timeless moments with artistic vision. Specialising in candid, documentary-style wedding photography across Sri Lanka.', tags: ['Candid', 'Portrait', 'Drone'] },
  { id: '2', business_name: 'Royal Palms Venue', category: 'venue', location: 'Colombo', city: 'Mount Lavinia', price_min: 500000, price_max: 1500000, avg_rating: 4.8, review_count: 134, is_verified: true, subscription_tier: 'premium', portfolio_images: [], description: 'A breathtaking beachside venue with capacity for up to 500 guests. Full event coordination included.', tags: ['Beachfront', '500 guests', 'AC'] },
  { id: '3', business_name: 'Spice Garden Catering', category: 'catering', location: 'Colombo', city: 'Rajagiriya', price_min: 1800, price_max: 4500, avg_rating: 4.7, review_count: 212, is_verified: true, subscription_tier: 'free', portfolio_images: [], description: 'Award-winning catering with authentic Sri Lankan and fusion menus. Price per head from LKR 1,800.', tags: ['Per head', 'Sri Lankan', 'Buffet'] },
  { id: '4', business_name: 'Floral Dreams', category: 'florist', location: 'Kandy', city: 'Kandy', price_min: 50000, price_max: 300000, avg_rating: 4.9, review_count: 58, is_verified: true, subscription_tier: 'premium', portfolio_images: [], description: 'Bespoke floral arrangements crafted with fresh tropical and imported blooms for your perfect day.', tags: ['Bespoke', 'Tropical', 'Imported'] },
  { id: '5', business_name: 'Harmony String Band', category: 'music_dj', location: 'Colombo', city: 'Colombo 3', price_min: 60000, price_max: 180000, avg_rating: 4.6, review_count: 43, is_verified: false, subscription_tier: 'free', portfolio_images: [], description: 'Live band and DJ services for wedding receptions. 15 years of experience making dance floors unforgettable.', tags: ['Live Band', 'DJ', 'Baila'] },
  { id: '6', business_name: 'Glow & Glam Studio', category: 'hair_makeup', location: 'Gampaha', city: 'Negombo', price_min: 35000, price_max: 120000, avg_rating: 4.8, review_count: 96, is_verified: true, subscription_tier: 'premium', portfolio_images: [], description: 'Bridal beauty specialists with a team of 8 artists. Home visits available. Trial sessions included.', tags: ['Home Visit', 'Trial', 'Airbrush'] },
  { id: '7', business_name: 'Sweet Moments Cakes', category: 'cake', location: 'Galle', city: 'Galle', price_min: 25000, price_max: 150000, avg_rating: 4.9, review_count: 71, is_verified: true, subscription_tier: 'premium', portfolio_images: [], description: 'Artisan wedding cakes crafted to order. Multi-tier, custom designs, dietary accommodations available.', tags: ['Custom', 'Vegan option', 'Tasting'] },
  { id: '8', business_name: 'Luxury Bridal Chauffeurs', category: 'transport', location: 'Colombo', city: 'Colombo 1', price_min: 20000, price_max: 80000, avg_rating: 4.5, review_count: 29, is_verified: false, subscription_tier: 'free', portfolio_images: [], description: 'Classic and luxury vehicles for your wedding day. Rolls-Royce, Bentley, and decorated vintage cars available.', tags: ['Rolls-Royce', 'Vintage', 'Decorated'] },
  { id: '9', business_name: 'Enchanted Decor Co.', category: 'decor', location: 'Colombo', city: 'Battaramulla', price_min: 100000, price_max: 800000, avg_rating: 4.7, review_count: 65, is_verified: true, subscription_tier: 'premium', portfolio_images: [], description: 'Full-service wedding decoration — from ceremony backdrops to reception table centrepieces.', tags: ['Full setup', 'Themed', 'Rentals'] },
  { id: '10', business_name: 'Cinematic Weddings', category: 'videography', location: 'Colombo', city: 'Colombo 5', price_min: 90000, price_max: 280000, avg_rating: 4.8, review_count: 52, is_verified: true, subscription_tier: 'premium', portfolio_images: [], description: 'Award-winning wedding films with cinematic drone footage, same-day edits, and highlight reels.', tags: ['Drone', 'Same-day edit', 'Cinematic'] },
  { id: '11', business_name: 'Dream Attire Boutique', category: 'attire', location: 'Kandy', city: 'Kandy', price_min: 45000, price_max: 350000, avg_rating: 4.6, review_count: 38, is_verified: false, subscription_tier: 'free', portfolio_images: [], description: 'Exclusive bridal sarees, lehengas and Western gowns. Custom alterations and groom attire packages.', tags: ['Custom', 'Saree', 'Gown'] },
  { id: '12', business_name: 'Pearl Wedding Planners', category: 'planning', location: 'Colombo', city: 'Colombo', price_min: 150000, price_max: 600000, avg_rating: 5.0, review_count: 22, is_verified: true, subscription_tier: 'premium', portfolio_images: [], description: 'Full-service wedding planning from vision to execution. Coordination, logistics, and vendor management.', tags: ['Full Service', 'Day-of', 'Coordinator'] },
]

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'reviews', label: 'Most Reviewed' },
]

const CATEGORY_EMOJI: Record<string, string> = {
  photography: '📸', venue: '🏛️', catering: '🍽️', florist: '🌸',
  music_dj: '🎵', hair_makeup: '💄', cake: '🎂', transport: '🚗',
  decor: '🎀', videography: '🎬', attire: '👗', planning: '📋', other: '⭐',
}

export default function VendorsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [district, setDistrict] = useState('all')
  const [priceMax, setPriceMax] = useState(2000000)
  const [sort, setSort] = useState('rating')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [saved, setSaved] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [compareList, setCompareList] = useState<string[]>([])

  const filtered = useMemo(() => {
    let list = VENDORS.filter(v => {
      if (search && !v.business_name.toLowerCase().includes(search.toLowerCase()) && !v.description.toLowerCase().includes(search.toLowerCase())) return false
      if (category !== 'all' && v.category !== category) return false
      if (district !== 'all' && v.location !== district) return false
      if (v.price_min > priceMax) return false
      if (verifiedOnly && !v.is_verified) return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'rating') return b.avg_rating - a.avg_rating
      if (sort === 'price_asc') return a.price_min - b.price_min
      if (sort === 'price_desc') return b.price_min - a.price_min
      if (sort === 'reviews') return b.review_count - a.review_count
      return 0
    })
    // Premium first
    return list.sort((a, b) => (b.subscription_tier === 'premium' ? 1 : 0) - (a.subscription_tier === 'premium' ? 1 : 0))
  }, [search, category, district, priceMax, sort, verifiedOnly])

  const toggleSave = (id: string) => setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) setCompareList(prev => prev.filter(x => x !== id))
    else if (compareList.length < 3) setCompareList(prev => [...prev, id])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={null} />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Find Wedding Vendors</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search photographers, venues, caterers..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B] focus:border-[#C21A6B]"
              />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B] bg-white">
              <option value="all">All Categories</option>
              {VENDOR_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select value={district} onChange={e => setDistrict(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C21A6B] bg-white">
              <option value="all">All Districts</option>
              {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <Button variant="secondary" size="md" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} /> Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-wrap items-center gap-6">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Max Price</label>
                <input type="range" min={50000} max={2000000} step={50000} value={priceMax}
                  onChange={e => setPriceMax(+e.target.value)}
                  className="w-40 accent-[#C21A6B]" />
                <p className="text-xs text-gray-500 mt-0.5">Up to {formatCurrency(priceMax)}</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)}
                  className="rounded accent-[#C21A6B]" />
                <span className="text-sm text-gray-700">Verified vendors only</span>
              </label>
              <button onClick={() => { setSearch(''); setCategory('all'); setDistrict('all'); setPriceMax(2000000); setVerifiedOnly(false) }}
                className="text-sm text-[#C21A6B] hover:underline">Reset all</button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500"><span className="font-semibold text-gray-900">{filtered.length}</span> vendors found</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sort by</span>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#C21A6B] bg-white">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setCategory('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === 'all' ? 'bg-[#C21A6B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C21A6B]'}`}>
            All
          </button>
          {VENDOR_CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === c.value ? 'bg-[#C21A6B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C21A6B]'}`}>
              {CATEGORY_EMOJI[c.value]} {c.label}
            </button>
          ))}
        </div>

        {/* Vendor Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-semibold text-gray-900">No vendors found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(vendor => (
              <div key={vendor.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden flex flex-col">
                {/* Image placeholder */}
                <div className="relative h-44 bg-gradient-to-br from-[#fce4f0] to-[#fdf6d8] flex items-center justify-center">
                  <span className="text-5xl">{CATEGORY_EMOJI[vendor.category]}</span>
                  {vendor.subscription_tier === 'premium' && (
                    <span className="absolute top-2 left-2 bg-[#B8960C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">⭐ PREMIUM</span>
                  )}
                  {vendor.is_verified && (
                    <span className="absolute top-2 right-2 bg-white shadow text-[10px] font-bold px-2 py-0.5 rounded-full text-green-600">✓ Verified</span>
                  )}
                  <button onClick={() => toggleSave(vendor.id)}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                    <Heart size={15} className={saved.includes(vendor.id) ? 'fill-[#C21A6B] text-[#C21A6B]' : 'text-gray-400'} />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-[#C21A6B] transition-colors">
                      {vendor.business_name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin size={11} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{vendor.city}</span>
                    <span className="mx-1 text-gray-200">·</span>
                    <span className="text-xs text-gray-400">{VENDOR_CATEGORIES.find(c => c.value === vendor.category)?.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{vendor.description}</p>

                  {vendor.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {vendor.tags.slice(0, 3).map(t => (
                        <span key={t} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star size={13} className="fill-[#B8960C] text-[#B8960C]" />
                      <span className="text-sm font-semibold text-gray-800">{vendor.avg_rating}</span>
                      <span className="text-xs text-gray-400">({vendor.review_count})</span>
                    </div>
                    <p className="text-xs text-gray-500">From <span className="font-semibold text-gray-800">{formatCurrency(vendor.price_min)}</span></p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/vendors/${vendor.id}`} className="flex-1">
                      <Button size="sm" variant="primary" className="w-full text-xs">View Profile</Button>
                    </Link>
                    <button
                      onClick={() => toggleCompare(vendor.id)}
                      className={`px-2 py-1.5 rounded-lg border text-xs font-medium transition-colors ${compareList.includes(vendor.id) ? 'bg-[#fce4f0] border-[#C21A6B] text-[#C21A6B]' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}
                    >
                      {compareList.includes(vendor.id) ? '✓' : '+'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4">
            <p className="text-sm font-medium">{compareList.length} vendor{compareList.length > 1 ? 's' : ''} selected</p>
            <Link href={`/vendors/compare?ids=${compareList.join(',')}`}>
              <Button size="sm" variant="gold">Compare Now</Button>
            </Link>
            <button onClick={() => setCompareList([])} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
