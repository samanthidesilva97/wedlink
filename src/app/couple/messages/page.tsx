'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Phone, Info, ArrowLeft, ImageIcon } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { cn, formatDate } from '@/lib/utils'

type Msg = { id: string; from: 'couple' | 'vendor'; text: string; time: string; read: boolean }
type Conversation = { id: string; vendor: string; category: string; lastMsg: string; time: string; unread: number; messages: Msg[] }

const CONVERSATIONS: Conversation[] = [
  {
    id: '1', vendor: 'Lens & Love Photography', category: 'Photography', lastMsg: "Great! I've blocked your date.", time: '2h ago', unread: 1,
    messages: [
      { id: 'm1', from: 'couple', text: 'Hi! We loved your portfolio. Are you available on December 14, 2026?', time: '10:00 AM', read: true },
      { id: 'm2', from: 'vendor', text: "Hello! Thank you so much 😊 Let me check my calendar...", time: '10:15 AM', read: true },
      { id: 'm3', from: 'vendor', text: "Great! I've blocked your date. Please review the Classic Package details I've attached. Would you like to schedule a call?", time: '10:20 AM', read: false },
    ],
  },
  {
    id: '2', vendor: 'Royal Palms Venue', category: 'Venue', lastMsg: 'The deposit invoice has been sent.', time: '1d ago', unread: 0,
    messages: [
      { id: 'm4', from: 'couple', text: 'We are interested in the Grand Hall for ~220 guests.', time: '9:00 AM', read: true },
      { id: 'm5', from: 'vendor', text: 'Perfect! The Grand Hall is available on your date. The deposit invoice has been sent to your email.', time: '9:30 AM', read: true },
    ],
  },
  {
    id: '3', vendor: 'Spice Garden Catering', category: 'Catering', lastMsg: 'Can we schedule a tasting?', time: '2d ago', unread: 0,
    messages: [
      { id: 'm6', from: 'couple', text: 'We are looking for a caterer for 220 guests. Do you have availability?', time: '2:00 PM', read: true },
      { id: 'm7', from: 'vendor', text: 'Yes! We have a delicious menu for you. Can we schedule a tasting session next week?', time: '2:45 PM', read: true },
    ],
  },
]

export default function MessagesPage() {
  const [conversations] = useState(CONVERSATIONS)
  const [activeId, setActiveId] = useState<string | null>('1')
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<Record<string, Msg[]>>(
    Object.fromEntries(CONVERSATIONS.map(c => [c.id, c.messages]))
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const active = conversations.find(c => c.id === activeId)
  const activeMessages = activeId ? messages[activeId] || [] : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages])

  const sendMsg = () => {
    if (!text.trim() || !activeId) return
    const newMsg: Msg = { id: Date.now().toString(), from: 'couple', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false }
    setMessages(p => ({ ...p, [activeId]: [...(p[activeId] || []), newMsg] }))
    setText('')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="couple" activeItem="/couple/messages" userName="Samanthi & Kasun" />
      <div className="flex-1 flex overflow-hidden">

        {/* Conversation List */}
        <div className={cn('w-full md:w-72 lg:w-80 bg-white border-r border-gray-100 flex flex-col', activeId && 'hidden md:flex')}>
          <div className="px-5 py-4 border-b border-gray-100">
            <h1 className="text-lg font-bold text-gray-900">Messages</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(c => (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className={cn('w-full text-left flex items-start gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors',
                  activeId === c.id && 'bg-[#fce4f0]')}>
                <div className="w-10 h-10 bg-[#fce4f0] rounded-full flex items-center justify-center text-[#C21A6B] font-bold text-sm flex-shrink-0">
                  {c.vendor.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn('text-sm font-semibold text-gray-900 truncate', c.unread > 0 && 'text-[#C21A6B]')}>{c.vendor}</p>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{c.lastMsg}</p>
                  <p className="text-xs text-gray-400">{c.category}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 bg-[#C21A6B] text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">{c.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {active ? (
          <div className={cn('flex-1 flex flex-col bg-white', !activeId && 'hidden md:flex')}>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white">
              <button onClick={() => setActiveId(null)} className="md:hidden text-gray-500 hover:text-gray-700">
                <ArrowLeft size={18} />
              </button>
              <div className="w-9 h-9 bg-[#fce4f0] rounded-full flex items-center justify-center text-[#C21A6B] font-bold text-sm">
                {active.vendor.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{active.vendor}</p>
                <p className="text-xs text-gray-400">{active.category}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-[#C21A6B] rounded-lg hover:bg-gray-50 transition-colors"><Info size={18} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50">
              {activeMessages.map(msg => (
                <div key={msg.id} className={cn('flex', msg.from === 'couple' ? 'justify-end' : 'justify-start')}>
                  {msg.from === 'vendor' && (
                    <div className="w-7 h-7 bg-[#fce4f0] rounded-full flex items-center justify-center text-[#C21A6B] font-bold text-xs mr-2 flex-shrink-0 mt-auto">
                      {active.vendor.charAt(0)}
                    </div>
                  )}
                  <div className={cn('max-w-[75%] rounded-2xl px-4 py-2.5',
                    msg.from === 'couple' ? 'bg-[#C21A6B] text-white rounded-br-sm' : 'bg-white text-gray-900 shadow-sm rounded-bl-sm')}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={cn('text-[10px] mt-1', msg.from === 'couple' ? 'text-white/60' : 'text-gray-400')}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-3 border-t border-gray-100 bg-white">
              <div className="flex items-end gap-3 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-200 focus-within:border-[#C21A6B] transition-colors">
                <button className="text-gray-400 hover:text-[#C21A6B] transition-colors flex-shrink-0 pb-0.5">
                  <Paperclip size={18} />
                </button>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() } }}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm resize-none focus:outline-none text-gray-900 placeholder:text-gray-400 max-h-24"
                />
                <button
                  onClick={sendMsg}
                  disabled={!text.trim()}
                  className="w-8 h-8 bg-[#C21A6B] text-white rounded-full flex items-center justify-center hover:bg-[#a5155a] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0">
                  <Send size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5 text-center">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 flex-col gap-3">
            <div className="w-16 h-16 bg-[#fce4f0] rounded-full flex items-center justify-center">
              <Send size={24} className="text-[#C21A6B]" />
            </div>
            <p className="text-gray-500 text-sm">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
