import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Book, TrendingUp, Award, Calendar, BookOpen } from 'lucide-react';

export default function YearlyStats({ savedBooks, readingLogs, year = new Date().getFullYear() }) {
  const stats = useMemo(() => {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    const completedThisYear = savedBooks.filter(book => {
      if (!book.completed_date) return false;
      const completedDate = new Date(book.completed_date);
      return completedDate >= yearStart && completedDate <= yearEnd;
    });

    const logsThisYear = readingLogs.filter(log => {
      const logDate = new Date(log.reading_date);
      return logDate >= yearStart && logDate <= yearEnd;
    });

    const totalPages = logsThisYear.reduce((sum, log) => sum + log.pages_read, 0);
    
    const genreCounts = {};
    completedThisYear.forEach(book => {
      const genres = book.book_data.categories || [];
      genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];

    const monthlyReading = Array(12).fill(0);
    completedThisYear.forEach(book => {
      const month = new Date(book.completed_date).getMonth();
      monthlyReading[month]++;
    });

    const bestMonth = monthlyReading.indexOf(Math.max(...monthlyReading));
    const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

    return {
      booksRead: completedThisYear.length,
      pagesRead: totalPages,
      topGenre: topGenre ? topGenre[0] : 'Noch keine',
      bestMonth: monthNames[bestMonth],
      averagePages: completedThisYear.length > 0 ? Math.round(totalPages / completedThisYear.length) : 0,
      readingDays: logsThisYear.length
    };
  }, [savedBooks, readingLogs, year]);

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-light text-stone-800 dark:text-stone-200">Jahresstatistik {year}</h2>
        <Award className="w-6 h-6 text-amber-600 dark:text-amber-500" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-100 dark:bg-amber-900/30 rounded-xl p-4"
        >
          <Book className="w-5 h-5 text-amber-600 dark:text-amber-500 mb-2" />
          <div className="text-2xl font-semibold text-stone-800 dark:text-stone-200">{stats.booksRead}</div>
          <div className="text-xs text-stone-600 dark:text-stone-400">Bücher gelesen</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4"
        >
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
          <div className="text-2xl font-semibold text-stone-800 dark:text-stone-200">{stats.pagesRead.toLocaleString()}</div>
          <div className="text-xs text-stone-600 dark:text-stone-400">Seiten gelesen</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4"
        >
          <Calendar className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
          <div className="text-2xl font-semibold text-stone-800 dark:text-stone-200">{stats.readingDays}</div>
          <div className="text-xs text-stone-600 dark:text-stone-400">Lesetage</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-4"
        >
          <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
          <div className="text-2xl font-semibold text-stone-800 dark:text-stone-200">{stats.averagePages}</div>
          <div className="text-xs text-stone-600 dark:text-stone-400">⌀ Seiten/Buch</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-pink-100 dark:bg-pink-900/30 rounded-xl p-4 col-span-2 md:col-span-1"
        >
          <Award className="w-5 h-5 text-pink-600 dark:text-pink-400 mb-2" />
          <div className="text-lg font-semibold text-stone-800 dark:text-stone-200 truncate">{stats.topGenre}</div>
          <div className="text-xs text-stone-600 dark:text-stone-400">Top Genre</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-4 col-span-2 md:col-span-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-stone-800 dark:text-stone-200">{stats.bestMonth}</div>
              <div className="text-xs text-stone-600 dark:text-stone-400">Bester Monat</div>
            </div>
            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}