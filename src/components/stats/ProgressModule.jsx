import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BookOpen, Flame, ChevronRight, X, ChevronLeft, Sparkles, BookMarked } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getWeekDays(readingLogs) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return { date: d, pages: 0 };
  });

  readingLogs.forEach(log => {
    const d = new Date(log.reading_date);
    d.setHours(0, 0, 0, 0);
    const idx = days.findIndex(day => day.date.toDateString() === d.toDateString());
    if (idx >= 0) days[idx].pages += log.pages_read;
  });

  return days;
}

function getMonthWeeks(readingLogs) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [
    { label: 'Woche 1', pages: 0, days: '1–7' },
    { label: 'Woche 2', pages: 0, days: '8–14' },
    { label: 'Woche 3', pages: 0, days: '15–21' },
    { label: 'Woche 4+', pages: 0, days: `22–${daysInMonth}` },
  ];

  readingLogs.forEach(log => {
    const d = new Date(log.reading_date);
    if (d.getMonth() !== month || d.getFullYear() !== year) return;
    const day = d.getDate();
    const weekIdx = day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : 3;
    weeks[weekIdx].pages += log.pages_read;
  });

  return weeks;
}

function getYearMonths(readingLogs) {
  const year = new Date().getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const months = monthNames.map((label, i) => ({ label, pages: 0, month: i }));

  readingLogs.forEach(log => {
    const d = new Date(log.reading_date);
    if (d.getFullYear() !== year) return;
    months[d.getMonth()].pages += log.pages_read;
  });

  return months;
}

function calcWeekTotal(readingLogs) {
  const days = getWeekDays(readingLogs);
  return days.reduce((s, d) => s + d.pages, 0);
}

function calcMonthTotal(readingLogs) {
  const now = new Date();
  return readingLogs
    .filter(l => {
      const d = new Date(l.reading_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, l) => s + l.pages_read, 0);
}

function calcYearTotal(readingLogs) {
  const year = new Date().getFullYear();
  return readingLogs
    .filter(l => new Date(l.reading_date).getFullYear() === year)
    .reduce((s, l) => s + l.pages_read, 0);
}

function getPrevWeekPages(readingLogs) {
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay() + 1);
  thisWeekStart.setHours(0, 0, 0, 0);
  const prevWeekStart = new Date(thisWeekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  return readingLogs
    .filter(l => { const d = new Date(l.reading_date); return d >= prevWeekStart && d < thisWeekStart; })
    .reduce((s, l) => s + l.pages_read, 0);
}

function calculateStreak(readingLogs) {
  if (!readingLogs.length) return 0;
  const uniqueDates = [...new Set(readingLogs.map(l => l.reading_date))].sort().reverse();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let streak = 0, checkDate = new Date(today);
  for (const dateStr of uniqueDates) {
    const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
    const diff = Math.floor((checkDate - d) / 86400000);
    if (diff === 0 || diff === 1) { streak++; checkDate = d; } else break;
  }
  return streak;
}

// ── Mini Bar Chart ────────────────────────────────────────────────────────────

function MiniBar({ label, pages, max, color = 'bg-amber-500', sublabel }) {
  const pct = max > 0 ? Math.round((pages / max) * 100) : 0;
  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      <div className="w-full flex flex-col justify-end" style={{ height: 60 }}>
        <div
          className={`rounded-t-md ${color} transition-all duration-500`}
          style={{ height: `${Math.max(pct, pages > 0 ? 4 : 0)}%`, minHeight: pages > 0 ? 4 : 0 }}
        />
      </div>
      <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate w-full text-center">{label}</div>
      {sublabel && <div className="text-[9px] text-stone-400 dark:text-stone-500 truncate w-full text-center">{sublabel}</div>}
    </div>
  );
}

// ── Level views ──────────────────────────────────────────────────────────────

function WeekView({ readingLogs, onDrillDown, t }) {
  const days = useMemo(() => getWeekDays(readingLogs), [readingLogs]);
  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const maxPages = Math.max(...days.map(d => d.pages), 1);
  const total = days.reduce((s, d) => s + d.pages, 0);
  const today = new Date();

  return (
    <div>
      <div className="flex items-end justify-between mb-1">
        <span className="text-sm text-stone-500 dark:text-stone-400">{t('progress.total')} <span className="font-semibold text-stone-800 dark:text-stone-200">{total} {t('progress.pages')}</span></span>
        <button onClick={onDrillDown} className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-0.5 hover:underline">
          {t('progress.monthView')} <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="flex gap-1 mt-4 items-end">
        {days.map((day, i) => {
          const isToday = day.date.toDateString() === today.toDateString();
          return (
            <MiniBar
              key={i}
              label={dayNames[i]}
              pages={day.pages}
              max={maxPages}
              color={isToday ? 'bg-amber-500' : 'bg-amber-300 dark:bg-amber-700'}
              sublabel={day.pages > 0 ? String(day.pages) : ''}
            />
          );
        })}
      </div>
    </div>
  );
}

function MonthView({ readingLogs, onDrillDown, onBack, t }) {
  const weeks = useMemo(() => getMonthWeeks(readingLogs), [readingLogs]);
  const maxPages = Math.max(...weeks.map(w => w.pages), 1);
  const total = weeks.reduce((s, w) => s + w.pages, 0);
  const monthName = new Date().toLocaleString(undefined, { month: 'long' });

  return (
    <div>
      <div className="flex items-end justify-between mb-1">
        <span className="text-sm text-stone-500 dark:text-stone-400">{monthName}: <span className="font-semibold text-stone-800 dark:text-stone-200">{total} {t('progress.pages')}</span></span>
        <button onClick={onDrillDown} className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-0.5 hover:underline">
          {t('progress.yearView')} <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="flex gap-2 mt-4 items-end">
        {weeks.map((w, i) => (
          <MiniBar
            key={i}
            label={w.label}
            pages={w.pages}
            max={maxPages}
            color="bg-blue-400 dark:bg-blue-600"
            sublabel={w.pages > 0 ? String(w.pages) : ''}
          />
        ))}
      </div>
    </div>
  );
}

function YearView({ readingLogs, onBack, t }) {
  const months = useMemo(() => getYearMonths(readingLogs), [readingLogs]);
  const maxPages = Math.max(...months.map(m => m.pages), 1);
  const total = months.reduce((s, m) => s + m.pages, 0);
  const currentMonth = new Date().getMonth();

  return (
    <div>
      <div className="flex items-end justify-between mb-1">
        <span className="text-sm text-stone-500 dark:text-stone-400">{new Date().getFullYear()}: <span className="font-semibold text-stone-800 dark:text-stone-200">{total} {t('progress.pages')}</span></span>
      </div>
      <div className="flex gap-1 mt-4 items-end">
        {months.map((m, i) => (
          <MiniBar
            key={i}
            label={m.label}
            pages={m.pages}
            max={maxPages}
            color={i === currentMonth ? 'bg-green-500' : 'bg-green-300 dark:bg-green-700'}
            sublabel={m.pages > 0 ? String(m.pages) : ''}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const LEVELS = ['week', 'month', 'year'];

export default function ProgressModule({ readingLogs, completedBooksCount, savedBooksCount = 0, generatedBooksCount = 0 }) {
  const { t } = useLanguage();
  const LEVEL_LABELS = { week: t('progress.weeklyProgress'), month: t('progress.monthlyProgress'), year: t('progress.yearlyProgress') };
  const [showDetail, setShowDetail] = useState(false);
  const [level, setLevel] = useState('week'); // 'week' | 'month' | 'year'

  const weekPages = useMemo(() => calcWeekTotal(readingLogs), [readingLogs]);
  const prevWeekPages = useMemo(() => getPrevWeekPages(readingLogs), [readingLogs]);
  const streak = useMemo(() => calculateStreak(readingLogs), [readingLogs]);

  const weekDiff = prevWeekPages > 0
    ? Math.round(((weekPages - prevWeekPages) / prevWeekPages) * 100)
    : null;

  const drillDown = () => {
    const idx = LEVELS.indexOf(level);
    if (idx < LEVELS.length - 1) setLevel(LEVELS[idx + 1]);
  };

  const drillUp = () => {
    const idx = LEVELS.indexOf(level);
    if (idx > 0) setLevel(LEVELS[idx - 1]);
  };

  const canGoBack = level !== 'week';

  return (
    <>
      {/* Kompaktes Modul */}
      <button
        onClick={() => { setLevel('week'); setShowDetail(true); }}
        className="w-full text-left bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-4 shadow-sm hover:border-amber-300 dark:hover:border-amber-700 transition-colors group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider">{t('progress.weeklyProgress')}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-end gap-4">
            <div>
              <div className="text-3xl font-light text-stone-800 dark:text-stone-200">{weekPages}</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">{t('progress.pagesThisWeek')}</div>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1 pb-0.5">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{streak}d</span>
              </div>
            )}
            {/* Motivational trend – no red numbers in compact view */}
            {weekDiff !== null && (
              <div className={`pb-0.5 text-sm font-medium ${weekDiff >= 0 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {weekDiff >= 0
                  ? `+${weekDiff}% 🎉`
                  : weekPages === 0
                    ? t('progress.letsGo')
                    : t('progress.keepGoing')}
              </div>
            )}
          </div>

          {/* Mini-Icons: Empfehlungen, Gespeichert, Seiten */}
          <div className="flex items-center gap-3 pb-0.5">
            <div className="flex flex-col items-center gap-0.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">{generatedBooksCount}</span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500">{t('progress.discovered')}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <BookMarked className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">{savedBooksCount}</span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500">{t('progress.saved')}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <BookOpen className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">{weekPages}</span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500">{t('progress.pages')}</span>
            </div>
          </div>
        </div>
      </button>

      {/* Detail-Overlay mit Drill-down */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-6 w-full max-w-md shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {canGoBack && (
                    <button
                      onClick={drillUp}
                      className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-stone-500" />
                    </button>
                  )}
                  <h2 className="text-lg font-light text-stone-800 dark:text-stone-200">{LEVEL_LABELS[level]}</h2>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Level tabs */}
              <div className="flex gap-1 mb-5 bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
                {LEVELS.map(l => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      level === l
                        ? 'bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 shadow-sm'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                    }`}
                  >
                    {l === 'week' ? t('progress.week') : l === 'month' ? t('progress.month') : t('progress.year')}
                  </button>
                ))}
              </div>

              {/* Animated content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={level}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                >
                  {level === 'week' && (
                    <WeekView readingLogs={readingLogs} onDrillDown={drillDown} t={t} />
                  )}
                  {level === 'month' && (
                    <MonthView readingLogs={readingLogs} onDrillDown={drillDown} onBack={drillUp} t={t} />
                  )}
                  {level === 'year' && (
                    <YearView readingLogs={readingLogs} onBack={drillUp} t={t} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer stats */}
              <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-700 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mb-0.5">Streak</div>
                  <div className="flex items-center justify-center gap-1">
                    {streak > 0 ? (
                      <><Flame className="w-3.5 h-3.5 text-orange-500" /><span className="text-sm font-semibold text-stone-800 dark:text-stone-200">{streak}d</span></>
                    ) : <span className="text-sm text-stone-400">–</span>}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mb-0.5">{t('progress.books')}</div>
                  <div className="flex items-center justify-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">{completedBooksCount}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mb-0.5">{t('progress.vsPrevWeek')}</div>
                  <div className={`text-sm font-semibold ${weekDiff === null ? 'text-stone-400' : weekDiff >= 0 ? 'text-green-600' : 'text-amber-500'}`}>
                    {weekDiff === null ? '–' : weekDiff >= 0 ? `+${weekDiff}%` : `${weekDiff}%`}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}