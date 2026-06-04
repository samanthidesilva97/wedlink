'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Bell, Heart, ChevronDown, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavbarProps {
  role?: 'couple' | 'vendor' | 'admin' | null
  userName?: string
  unreadCount?: number
}

export function Navbar({ role, userName, unreadCount = 0 }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [lang, setLang] = useState('EN')

  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/vendors', label: 'Find Vendors' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#pricing', label: 'Pricing' },
  ]

  const dashboardHref = role ? `/${role}/dashboard` : '/'

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={dashboardHref} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C21A6B] rounded-lg flex items-center justify-center">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-[#C21A6B]">WedLink</span>
          </Link>

          {/* Desktop Nav */}
          {!role && (
            <div className="hidden md:flex items-center gap-6">
              {publicLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-[#C21A6B] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#C21A6B] transition-colors p-1.5 rounded-lg hover:bg-gray-50"
              >
                <Globe size={16} />
                <span className="hidden sm:block">{lang}</span>
                <ChevronDown size={14} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                  {['EN', 'SI', 'TA'].map(l => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false) }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
                        lang === l && 'text-[#C21A6B] font-medium'
                      )}
                    >
                      {l === 'EN' ? '🇬🇧 English' : l === 'SI' ? '🇱🇰 සිංහල' : '🇱🇰 தமிழ்'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {role ? (
              <>
                {/* Notifications */}
                <Link href={`/${role}/notifications`} className="relative p-2 text-gray-500 hover:text-[#C21A6B] hover:bg-gray-50 rounded-lg transition-colors">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#C21A6B] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                {/* Avatar */}
                <Link href={`/${role}/settings`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 bg-[#fce4f0] rounded-full flex items-center justify-center text-[#C21A6B] font-semibold text-sm">
                    {userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{userName}</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">Sign Up Free</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && !role && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {publicLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2.5 text-sm font-medium text-gray-700 hover:text-[#C21A6B]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link href="/login"><Button variant="ghost" size="sm" className="w-full">Log In</Button></Link>
            <Link href="/signup"><Button variant="primary" size="sm" className="w-full">Sign Up Free</Button></Link>
          </div>
        </div>
      )}
    </nav>
  )
}
