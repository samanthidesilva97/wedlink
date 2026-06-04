import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'WedLink — Sri Lanka\'s Wedding Marketplace',
  description: 'Plan your perfect wedding. Find and book the best vendors in Sri Lanka, manage your guest list, budget, and more — all in one place.',
  keywords: 'wedding, Sri Lanka, vendor, photographer, venue, catering, wedding planning',
  openGraph: {
    title: 'WedLink — Sri Lanka\'s Wedding Marketplace',
    description: 'Plan your perfect wedding with WedLink.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
