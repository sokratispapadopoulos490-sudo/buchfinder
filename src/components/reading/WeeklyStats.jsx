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
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-light text-stone-800">Deine Lesewoche</h2>
        <div className="text-sm text-stone-500">
          {format(weekStart, 'd. MMM', { locale: de })} - {format(weekEnd, 'd. MMM', { locale: de })}
        </div>
      </div>

      {/* Wochenziel Fortschrittsbalken */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-stone-600">Wochenziel: {weeklyGoal} Seiten</span>
          <span className="text-sm font-medium text-amber-600">
            {totalPagesThisWeek} / {weeklyGoal}
          </span>
        </div>
        <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
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
          className="bg-amber-50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs">Seiten diese Woche</span>
          </div>
          <div className="text-2xl font-light text-stone-800">{totalPagesThisWeek}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-xs">Lesetage</span>
          </div>
          <div className="text-2xl font-light text-stone-800">{readingDaysThisWeek}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Ø Seiten/Tag</span>
          </div>
          <div className="text-2xl font-light text-stone-800">{avgPagesPerDay}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-purple-50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Award className="w-4 h-4" />
            <span className="text-xs">Abgeschlossen</span>
          </div>
          <div className="text-2xl font-light text-stone-800">{completedBooksCount}</div>
        </motion.div>
      </div>

      {/* Motivationstext */}
      {totalPagesThisWeek === 0 ? (
        <div className="mt-6 text-center p-4 bg-stone-50 rounded-lg">
          <p className="text-sm text-stone-600">
            Starte deine Lesewoche! 📚 Jede Seite zählt.
          </p>
        </div>
      ) : goalProgress >= 100 ? (
        <div className="mt-6 text-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800 font-medium">
            🎉 Wochenziel erreicht! Fantastische Leistung!
          </p>
        </div>
      ) : (
        <div className="mt-6 text-center p-4 bg-stone-50 rounded-lg">
          <p className="text-sm text-stone-600">
            Noch {weeklyGoal - totalPagesThisWeek} Seiten bis zum Wochenziel! 💪
          </p>
        </div>
      )}
    </div>
  );
}