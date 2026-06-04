import Link from 'next/link'
import { Heart, Search, CheckSquare, MessageSquare, Star, Shield, ArrowRight, Camera, Utensils, Music, Flower2, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'

const CATEGORIES = [
  { emoji: '📸', label: 'Photography', count: '240+', href: 'photography' },
  { emoji: '🏛️', label: 'Venues', count: '180+', href: 'venue' },
  { emoji: '🍽️', label: 'Catering', count: '130+', href: 'catering' },
  { emoji: '🌸', label: 'Florists', count: '95+', href: 'florist' },
  { emoji: '🎵', label: 'Music & DJ', count: '110+', href: 'music_dj' },
  { emoji: '👗', label: 'Attire', count: '75+', href: 'attire' },
  { emoji: '🎂', label: 'Cakes', count: '60+', href: 'cake' },
  { emoji: '🚗', label: 'Transport', count: '45+', href: 'transport' },
]

const FEATURES = [
  { icon: Search, title: 'Discover Verified Vendors', desc: 'Browse 1,000+ wedding vendors across Sri Lanka. Filter by category, price, location, and availability.' },
  { icon: MessageSquare, title: 'Chat & Negotiate', desc: 'Message vendors directly, share inspiration boards, and finalise quotes — all within the platform.' },
  { icon: CheckSquare, title: 'Plan Everything', desc: 'Smart checklist, budget tracker, guest list, seating organiser, and AI-powered day timeline.' },
  { icon: Shield, title: 'Book with Confidence', desc: 'Secure deposit payments, transparent pricing, and a dispute resolution centre if anything goes wrong.' },
]

const TESTIMONIALS = [
  { name: 'Priya & Dinesh', location: 'Colombo', text: 'WedLink made our wedding planning so much easier. We found our photographer and caterer within a week!', avatar: 'P' },
  { name: 'Dilini & Kasun', location: 'Kandy', text: 'The seating organiser and budget tracker saved us hours of spreadsheet work. Absolutely worth it.', avatar: 'D' },
  { name: 'Kavitha & Raj', location: 'Galle', text: 'Found a stunning venue we never would have discovered otherwise. The comparison tool is a game-changer.', avatar: 'K' },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar role={null} />

      {/* Hero */}
      <section className="gradient-hero py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 mb-6 shadow-sm border border-pink-100">
            <Heart size={14} className="text-[#C21A6B] fill-[#C21A6B]" />
            <span className="text-sm font-medium text-[#C21A6B]">Sri Lanka&apos;s #1 Wedding Platform</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Plan Your Perfect
            <span className="text-[#C21A6B]"> Sri Lankan</span>
            <br />Wedding, Together
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover and book verified vendors, manage your budget and guest list,
            and coordinate every detail — all in one beautiful platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="primary">
                Start Planning Free <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/vendors">
              <Button size="lg" variant="secondary">Browse Vendors</Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Free for couples · 1,000+ verified vendors · Trusted by 5,000+ Sri Lankan couples
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">What are you looking for?</p>
                <p className="text-sm text-gray-600">Photographer, Venue, Caterer...</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100">
              <span>📍</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Location</p>
                <p className="text-sm text-gray-600">Colombo, Kandy, Galle...</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100">
              <span>📅</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Wedding Date</p>
                <p className="text-sm text-gray-600">Select your date</p>
              </div>
            </div>
            <Link href="/vendors">
              <Button className="w-full md:w-auto h-full px-8">Search</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-500">Find perfect vendors for every aspect of your wedding</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} href={`/vendors?category=${cat.href}`}
                className="group bg-white rounded-2xl p-5 text-center border border-gray-100 hover:border-[#C21A6B]/40 hover:shadow-md transition-all duration-200">
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <p className="font-semibold text-gray-800 group-hover:text-[#C21A6B] transition-colors text-sm">{cat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{cat.count} vendors</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need</h2>
            <p className="text-gray-500 max-w-xl mx-auto">WedLink is more than a vendor directory — it&apos;s your complete wedding command centre</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center group">
                <div className="w-14 h-14 bg-[#fce4f0] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C21A6B] transition-colors">
                  <f.icon size={24} className="text-[#C21A6B] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple, Transparent Pricing</h2>
            <p className="text-gray-500">Free for couples. Vendors choose their plan.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border-2 border-[#C21A6B] p-8 text-center shadow-md">
              <div className="text-4xl mb-3">💑</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">For Couples</h3>
              <div className="text-4xl font-bold text-[#C21A6B] my-4">Free</div>
              <ul className="text-sm text-left space-y-2.5 mb-8">
                {['Access 1,000+ vendors', 'All planning tools', 'Guest list & RSVP', 'Budget tracker', 'Seating organiser', 'AI timeline generator'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-gray-700"><span className="text-[#C21A6B]">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/signup?role=couple" className="block">
                <Button className="w-full">Get Started Free</Button>
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="text-4xl mb-3">🏪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Vendor Free</h3>
              <div className="text-4xl font-bold text-gray-900 my-4">$0<span className="text-lg font-normal text-gray-400">/mo</span></div>
              <ul className="text-sm text-left space-y-2.5 mb-8">
                {['Profile listing', 'Up to 5 portfolio photos', 'Booking inquiries', 'Basic messaging'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/signup?role=vendor" className="block">
                <Button variant="secondary" className="w-full">Join as Vendor</Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-[#B8960C] to-[#9a7d0a] rounded-2xl p-8 text-center text-white shadow-xl">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-xl font-bold mb-1">Vendor Premium</h3>
              <div className="text-4xl font-bold my-4">$15<span className="text-lg font-normal opacity-75">/mo</span></div>
              <ul className="text-sm text-left space-y-2.5 mb-8">
                {['Unlimited portfolio + video', 'Priority search ranking', 'Full analytics dashboard', 'Verified badge eligibility', 'AI recommendations'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span>✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/signup?role=vendor&plan=premium" className="block">
                <button className="w-full bg-white text-[#B8960C] font-semibold rounded-lg py-3 hover:bg-white/90 transition-colors">
                  Start Premium
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Loved by Sri Lankan Couples</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-[#B8960C] text-[#B8960C]" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#fce4f0] rounded-full flex items-center justify-center text-[#C21A6B] font-bold text-sm">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Plan Your Dream Wedding?</h2>
          <p className="text-gray-600 mb-8 text-lg">Join thousands of Sri Lankan couples who planned their perfect day with WedLink.</p>
          <Link href="/signup">
            <Button size="lg">Start Planning for Free <ChevronRight size={18} /></Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Heart size={20} className="text-[#C21A6B] fill-[#C21A6B]" />
            <span className="text-white font-bold text-xl">WedLink</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {[
              { title: 'Platform', links: [['Find Vendors', '/vendors'], ['For Couples', '/signup?role=couple'], ['For Vendors', '/signup?role=vendor']] },
              { title: 'Tools', links: [['Budget Tracker', '/signup'], ['Guest List', '/signup'], ['Seating Planner', '/signup']] },
              { title: 'Support', links: [['Help Centre', '#'], ['Contact Us', '#'], ['Dispute Centre', '#']] },
              { title: 'Legal', links: [['Privacy Policy', '#'], ['Terms of Service', '#'], ['Cookie Policy', '#']] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-white font-semibold mb-3 text-sm">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(([label, href]) => (
                    <li key={label}><Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 WedLink. All rights reserved. Made with ❤️ for Sri Lanka.</p>
            <p className="text-sm">English · සිංහල · தமிழ்</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
