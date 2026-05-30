/**
 * AffiliateAnalytics – Admin page for affiliate click statistics.
 */

import React, { useEffect, useState } from 'react';
import { getClickAnalytics } from '@/lib/affiliateService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Globe, ShoppingBag, BookOpen } from 'lucide-react';

const COLORS = ['#d97706', '#92400e', '#b45309', '#78350f', '#fbbf24', '#f59e0b', '#fcd34d'];

export default function AffiliateAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClickAnalytics()
      .then(setData)
      .catch(() => setData({ topBooks: [], topProviders: [], countryStats: [], totalClicks: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-600" /> Affiliate Analytics
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {data.totalClicks} Klicks insgesamt
          </p>
        </div>

        {/* Provider Stats */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-4">
          <h2 className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2 mb-4">
            <ShoppingBag className="w-4 h-4 text-amber-600" /> Top Anbieter
          </h2>
          {data.topProviders.length === 0 ? (
            <p className="text-stone-400 text-sm">Noch keine Daten</p>
          ) : (
            <div className="space-y-2">
              {data.topProviders.map((p, i) => (
                <div key={p.provider} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-stone-400 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-stone-800 dark:text-stone-200">{p.label}</span>
                      <span className="text-stone-500">{p.count}</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.round((p.count / (data.topProviders[0]?.count || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Country Stats */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-4">
          <h2 className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-amber-600" /> Länder
          </h2>
          {data.countryStats.length === 0 ? (
            <p className="text-stone-400 text-sm">Noch keine Daten</p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={data.countryStats} margin={{ top: 4, right: 4, bottom: 4, left: -16 }}>
                <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.countryStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Books */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-4">
          <h2 className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-amber-600" /> Meistgeklickte Bücher
          </h2>
          {data.topBooks.length === 0 ? (
            <p className="text-stone-400 text-sm">Noch keine Daten</p>
          ) : (
            <div className="space-y-3">
              {data.topBooks.map((b, i) => (
                <div key={b.isbn13} className="flex items-center gap-3">
                  <span className="text-xs font-mono w-4 text-stone-400">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{b.title || b.isbn13}</p>
                    <p className="text-xs text-stone-400">{b.isbn13}</p>
                  </div>
                  <span className="text-sm font-semibold text-amber-600">{b.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}