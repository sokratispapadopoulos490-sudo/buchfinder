import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, TrendingUp, Award } from 'lucide-react';
import { startOfWeek, endOfWeek, format, isWithinInterval, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

export default function WeeklyStats({ readingLogs, completedBooksCount }) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // Filtere Logs dieser Woche
  const thisWeekLogs = readingLogs.filter(log => {
    const logDate = parseISO(log.reading_date);
    return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
  });

  const totalPagesThisWeek = thisWeekLogs.reduce((sum, log) => sum + log.pages_read, 0);
  const readingDaysThisWeek = new Set(thisWeekLogs.map(log => log.reading_date)).size;

  // Berechne Durchschnitt pro Tag
  const avgPagesPerDay = readingDaysThisWeek > 0 ? Math.round(totalPagesThisWeek / readingDaysThisWeek) : 0;

  // Wochenziel (kann später anpassbar gemacht werden)
  const weeklyGoal = 100;
  const goalProgress = Math.min((totalPagesThisWeek / weeklyGoal) * 100, 100);

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-light text-stone-800 dark:text-stone-200">Deine Lesewoche</h2>
        <div className="text-sm text-stone-500 dark:text-stone-400">
          {format(weekStart, 'd. MMM', { locale: de })} - {format(weekEnd, 'd. MMM', { locale: de })}
        </div>
      </div>

      {/* Wochenziel Fortschrittsbalken */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-stone-600 dark:text-stone-400">Wochenziel: {weeklyGoal} Seiten</span>
          <span className="text-sm font-medium text-amber-600 dark:text-amber-500">
            {totalPagesThisWeek} / {weeklyGoal}
          </span>
        </div>
        <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goalProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
          />
        </div>
      </div>

      {/* Statistik-Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs">Seiten diese Woche</span>
          </div>
          <div className="text-2xl font-light text-stone-800 dark:text-stone-200">{totalPagesThisWeek}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-xs">Lesetage</span>
          </div>
          <div className="text-2xl font-light text-stone-800 dark:text-stone-200">{readingDaysThisWeek}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Ø Seiten/Tag</span>
          </div>
          <div className="text-2xl font-light text-stone-800 dark:text-stone-200">{avgPagesPerDay}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
            <Award className="w-4 h-4" />
            <span className="text-xs">Abgeschlossen</span>
          </div>
          <div className="text-2xl font-light text-stone-800 dark:text-stone-200">{completedBooksCount}</div>
        </motion.div>
      </div>

      {/* Motivationstext */}
      {totalPagesThisWeek === 0 ? (
        <div className="mt-6 text-center p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Starte deine Lesewoche! 📚 Jede Seite zählt.
          </p>
        </div>
      ) : goalProgress >= 100 ? (
        <div className="mt-6 text-center p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">
            🎉 Wochenziel erreicht! Fantastische Leistung!
          </p>
        </div>
      ) : (
        <div className="mt-6 text-center p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Noch {weeklyGoal - totalPagesThisWeek} Seiten bis zum Wochenziel! 💪
          </p>
        </div>
      )}
    </div>
  );
}