import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BookOpen, Flame, ChevronRight, X } from 'lucide-react';

function getWeekPages(readingLogs) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);
  return readingLogs
    .filter(log => new Date(log.reading_date) >= weekStart)
    .reduce((sum, log) => sum + log.pages_read, 0);
}

function getMonthPages(readingLogs) {
  const now = new Date();
  return readingLogs
    .filter(log => {
      const d = new Date(log.reading_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, log) => sum + log.pages_read, 0);
}

function getYearPages(readingLogs) {
  const year = new Date().getFullYear();
  return readingLogs
    .filter(log => new Date(log.reading_date).getFullYear() === year)
    .reduce((sum, log) => sum + log.pages_read, 0);
}

function getPrevWeekPages(readingLogs) {
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay() + 1);
  thisWeekStart.setHours(0, 0, 0, 0);
  const prevWeekStart = new Date(thisWeekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  return readingLogs
    .filter(log => {
      const d = new Date(log.reading_date);
      return d >= prevWeekStart && d < thisWeekStart;
    })
    .reduce((sum, log) => sum + log.pages_read, 0);
}

function calculateStreak(readingLogs) {
  if (!readingLogs.length) return 0;
  const uniqueDates = [...new Set(readingLogs.map(l => l.reading_date))].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let checkDate = new Date(today);
  for (const dateStr of uniqueDates) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const diff = Math.floor((checkDate - d) / 86400000);
    if (diff === 0 || diff === 1) { streak++; checkDate = d; }
    else break;
  }
  return streak;
}

export default function ProgressModule({ readingLogs, completedBooksCount }) {
  const [showDetail, setShowDetail] = useState(false);

  const weekPages = useMemo(() => getWeekPages(readingLogs), [readingLogs]);
  const monthPages = useMemo(() => getMonthPages(readingLogs), [readingLogs]);
  const yearPages = useMemo(() => getYearPages(readingLogs), [readingLogs]);
  const prevWeekPages = useMemo(() => getPrevWeekPages(readingLogs), [readingLogs]);
  const streak = useMemo(() => calculateStreak(readingLogs), [readingLogs]);

  const weekDiff = prevWeekPages > 0
    ? Math.round(((weekPages - prevWeekPages) / prevWeekPages) * 100)
    : null;

  return (
    <>
      {/* Kompaktes Modul – anklickbar */}
      <button
        onClick={() => setShowDetail(true)}
        className="w-full text-left bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-4 shadow-sm hover:border-amber-300 dark:hover:border-amber-700 transition-colors group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider">Wochenfortschritt</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
        </div>

        <div className="flex items-end gap-6">
          <div>
            <div className="text-3xl font-light text-stone-800 dark:text-stone-200">{weekPages}</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Seiten diese Woche</div>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 pb-0.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{streak} Tage</span>
            </div>
          )}
          {weekDiff !== null && (
            <div className={`pb-0.5 text-sm font-medium ${weekDiff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {weekDiff >= 0 ? '+' : ''}{weekDiff}% vs. Vorwoche
            </div>
          )}
        </div>
      </button>

      {/* Detail-Overlay */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center px-4 pb-8 sm:pb-0"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light text-stone-800 dark:text-stone-200">Lesefortschritt</h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4">
                  <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Diese Woche</div>
                  <div className="text-2xl font-semibold text-stone-800 dark:text-stone-200">{weekPages}</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Seiten</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                  <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Dieser Monat</div>
                  <div className="text-2xl font-semibold text-stone-800 dark:text-stone-200">{monthPages}</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Seiten</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4">
                  <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Dieses Jahr</div>
                  <div className="text-2xl font-semibold text-stone-800 dark:text-stone-200">{yearPages}</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Seiten</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4">
                  <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">Lesestreak</div>
                  <div className="text-2xl font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    {streak > 0 ? <><Flame className="w-5 h-5 text-orange-500" />{streak}</> : '–'}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">{streak === 1 ? 'Tag' : 'Tage'}</div>
                </div>
              </div>

              {completedBooksCount > 0 && (
                <div className="bg-stone-50 dark:bg-stone-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                    <span className="text-sm text-stone-700 dark:text-stone-300">Abgeschlossene Bücher</span>
                  </div>
                  <span className="text-lg font-semibold text-stone-800 dark:text-stone-200">{completedBooksCount}</span>
                </div>
              )}

              {weekDiff !== null && (
                <div className={`mt-3 text-center text-sm font-medium rounded-xl py-2 ${weekDiff >= 0 ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                  {weekDiff >= 0 ? '📈' : '📉'} {weekDiff >= 0 ? '+' : ''}{weekDiff}% im Vergleich zur Vorwoche
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}