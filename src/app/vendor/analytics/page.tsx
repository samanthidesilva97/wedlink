'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

const VIEWS = [
  { month: 'Jul', views: 380 }, { month: 'Aug', views: 420 }, { month: 'Sep', views: 510 },
  { month: 'Oct', views: 640 }, { month: 'Nov', views: 820 }, { month: 'Dec', views: 1248 },
]
const INQUIRIES = [
  { month: 'Jul', inquiries: 8, conversions: 2 }, { month: 'Aug', inquiries: 12, conversions: 3 },
  { month: 'Sep', inquiries: 15, conversions: 4 }, { month: 'Oct', inquiries: 10, conversions: 2 },
  { month: 'Nov', inquiries: 18, conversions: 5 }, { month: 'Dec', inquiries: 22, conversions: 6 },
]
const REVENUE = [
  { month: 'Jul', revenue: 140000 }, { month: 'Aug', revenue: 80000 }, { month: 'Sep', revenue: 220000 },
  { month: 'Oct', revenue: 140000 }, { month: 'Nov', revenue: 280000 }, { month: 'Dec', revenue: 520000 },
]
const PACKAGE_DIST = [
  { name: 'Essential', value: 30, color: '#fce4f0' },
  { name: 'Classic', value: 45, color: '#C21A6B' },
  { name: 'Premium', value: 25, color: '#B8960C' },
]
const TRAFFIC = [
  { source: 'WedLink Search', pct: 62 },
  { source: 'Direct Profile', pct: 21 },
  { source: 'AI Recommendation', pct: 12 },
  { source: 'Wishlist', pct: 5 },
]

export default function VendorAnalyticsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role="vendor" activeItem="/vendor/analytics" userName="Lens & Love" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="vendor" userName="Lens & Love" />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Performance insights for the last 6 months</p>
          </div>

          {/* Summary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Profile Views', val: '4,018', change: '+38%' },
              { label: 'Total Inquiries', val: '85', change: '+22%' },
              { label: 'Conversion Rate', val: '26%', change: '+4%' },
              { label: 'Total Revenue', val: formatCurrency(1380000), change: '+31%' },
            ].map(s => (
              <Card key={s.label}>
                <CardContent className="p-5">
                  <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.val}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">{s.change} vs prev. period</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Profile Views */}
            <Card>
              <CardHeader><CardTitle>Profile Views</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={VIEWS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#C21A6B" strokeWidth={2} dot={{ fill: '#C21A6B', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue */}
            <Card>
              <CardHeader><CardTitle>Revenue (LKR)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={REVENUE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v / 1000}K`} />
                    <Tooltip formatter={v => formatCurrency(Number(v))} />
                    <Bar dataKey="revenue" fill="#B8960C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Inquiries vs Conversions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader><CardTitle>Inquiries & Conversions</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={INQUIRIES}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inquiries" fill="#fce4f0" name="Inquiries" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="conversions" fill="#C21A6B" name="Conversions" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Package Distribution */}
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Package Mix</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={PACKAGE_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                        {PACKAGE_DIST.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip formatter={v => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {PACKAGE_DIST.map(p => (
                      <div key={p.name} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />{p.name}</span>
                        <span className="font-semibold text-gray-700">{p.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Traffic Sources</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {TRAFFIC.map(t => (
                    <div key={t.source}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">{t.source}</span>
                        <span className="font-semibold text-gray-800">{t.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#C21A6B] rounded-full" style={{ width: `${t.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
