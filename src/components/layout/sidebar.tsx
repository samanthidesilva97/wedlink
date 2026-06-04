'use client'

import Link from 'next/link'
import { Heart, LayoutDashboard, Search, CalendarDays, MessageSquare, CheckSquare, PiggyBank, Users, Grid3x3, Image, Clock, Bookmark, User, BookOpen, BarChart3, Settings, ShieldCheck, AlertTriangle, DollarSign, ChevronLeft, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type Role = 'couple' | 'vendor' | 'admin'

const NAV = {
  couple: [
    { href: '/couple/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/vendors', label: 'Find Vendors', icon: Search },
    { href: '/couple/bookings', label: 'My Bookings', icon: CalendarDays },
    { href: '/couple/messages', label: 'Messages', icon: MessageSquare },
    { href: '/couple/planning/checklist', label: 'Checklist', icon: CheckSquare },
    { href: '/couple/planning/budget', label: 'Budget', icon: PiggyBank },
    { href: '/couple/planning/guests', label: 'Guest List', icon: Users },
    { href: '/couple/planning/seating', label: 'Seating Plan', icon: Grid3x3 },
    { href: '/couple/planning/moodboard', label: 'Mood Board', icon: Image },
    { href: '/couple/planning/timeline', label: 'Day Timeline', icon: Clock },
    { href: '/couple/wishlist', label: 'Saved Vendors', icon: Bookmark },
    { href: '/couple/settings', label: 'Settings', icon: Settings },
  ],
  vendor: [
    { href: '/vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/vendor/profile', label: 'My Profile', icon: User },
    { href: '/vendor/bookings', label: 'Bookings', icon: BookOpen },
    { href: '/vendor/messages', label: 'Messages', icon: MessageSquare },
    { href: '/vendor/availability', label: 'Availability', icon: CalendarDays },
    { href: '/vendor/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/vendor/settings', label: 'Settings', icon: Settings },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/vendors', label: 'Vendor Approvals', icon: ShieldCheck },
    { href: '/admin/disputes', label: 'Disputes', icon: AlertTriangle },
    { href: '/admin/revenue', label: 'Revenue', icon: DollarSign },
    { href: '/admin/users', label: 'All Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ],
}

interface SidebarProps {
  role: Role
  activeItem: string
  userName?: string
  userEmail?: string
}

export function Sidebar({ role, activeItem, userName, userEmail }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const links = NAV[role]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col bg-white border-r border-gray-100 h-screen sticky top-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100 h-16">
          <div className="w-8 h-8 bg-[#C21A6B] rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart size={16} className="text-white fill-white" />
          </div>
          {!collapsed && <span className="text-xl font-bold text-[#C21A6B]">WedLink</span>}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active = activeItem === href || activeItem.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-[#fce4f0] text-[#C21A6B]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom User */}
        <div className="border-t border-gray-100 p-3">
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="w-8 h-8 bg-[#fce4f0] rounded-full flex items-center justify-center text-[#C21A6B] font-semibold text-sm flex-shrink-0">
                {userName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-1 w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ChevronLeft size={16} className={cn('transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-2 py-2 safe-area-inset-bottom">
        <div className="flex justify-around">
          {links.slice(0, 5).map(({ href, label, icon: Icon }) => {
            const active = activeItem === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors min-w-0',
                  active ? 'text-[#C21A6B]' : 'text-gray-500'
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium truncate">{label.split(' ')[0]}</span>
              </Link>
            )
          })}
          <button className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-500">
            <Menu size={20} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </div>
    </>
  )
}
