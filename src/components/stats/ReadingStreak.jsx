import React, { useMemo } from 'react';
import { Flame, Calendar } from 'lucide-react';

export default function ReadingStreak({ readingLogs }) {
  const streakData = useMemo(() => {
    if (readingLogs.length === 0) return { current: 0, longest: 0 };

    const sortedLogs = [...readingLogs].sort((a, b) => 
      new Date(b.reading_date) - new Date(a.reading_date)
    );

    const uniqueDates = [...new Set(sortedLogs.map(log => log.reading_date))];
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDates.length; i++) {
      const date = new Date(uniqueDates[i]);
      date.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (date.getTime() === expectedDate.getTime()) {
        currentStreak++;
        tempStreak++;
      } else {
        if (i === 0) currentStreak = 0;
        tempStreak++;
        if (i > 0) {
          const prevDate = new Date(uniqueDates[i - 1]);
          prevDate.setHours(0, 0, 0, 0);
          const diff = (prevDate - date) / (1000 * 60 * 60 * 24);
          if (diff > 1) tempStreak = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return { current: currentStreak, longest: longestStreak };
  }, [readingLogs]);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-2xl font-semibold text-stone-800">{streakData.current}</div>
          <div className="text-xs text-stone-600">Tage Streak</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-stone-600">
        <Calendar className="w-3 h-3" />
        <span>Längste: {streakData.longest} Tage</span>
      </div>
    </div>
  );
}