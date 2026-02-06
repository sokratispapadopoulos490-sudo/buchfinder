import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function BookSpine({ book, showProgress, onClick, index }) {
  const bookData = book.book_data;
  
  // Zufällige Farben für Buchrücken (basierend auf book.id für Konsistenz)
  const colors = [
    'bg-gradient-to-r from-red-600 to-red-700',
    'bg-gradient-to-r from-blue-600 to-blue-700',
    'bg-gradient-to-r from-green-600 to-green-700',
    'bg-gradient-to-r from-purple-600 to-purple-700',
    'bg-gradient-to-r from-amber-600 to-amber-700',
    'bg-gradient-to-r from-teal-600 to-teal-700',
    'bg-gradient-to-r from-pink-600 to-pink-700',
    'bg-gradient-to-r from-indigo-600 to-indigo-700',
    'bg-gradient-to-r from-orange-600 to-orange-700',
    'bg-gradient-to-r from-cyan-600 to-cyan-700',
  ];

  const colorClass = colors[book.id % colors.length];

  // Titel kürzen wenn zu lang
  const shortTitle = bookData.title.length > 25 ? bookData.title.substring(0, 25) + '...' : bookData.title;
  const shortAuthor = bookData.author.length > 20 ? bookData.author.substring(0, 20) + '...' : bookData.author;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        "relative h-48 w-16 rounded-sm shadow-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl group",
        colorClass
      )}
      whileHover={{ y: -8 }}
    >
      {/* Buchdeckel-Details */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/5 to-black/20 rounded-sm" />
      
      {/* Buchrücken-Text (vertikal) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="transform -rotate-90 whitespace-nowrap">
          <div className="text-white text-xs font-semibold tracking-wide px-2 drop-shadow-lg">
            {shortTitle}
          </div>
          <div className="text-white/70 text-[10px] mt-1 drop-shadow">
            {shortAuthor}
          </div>
        </div>
      </div>

      {/* Fortschrittsanzeige */}
      {showProgress && book.progress !== undefined && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-stone-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {book.progress}%
          </div>
        </div>
      )}

      {/* Seitenmarkierungen (kleine Linien am Rand) */}
      <div className="absolute top-2 left-0 right-0 h-px bg-white/20" />
      <div className="absolute bottom-2 left-0 right-0 h-px bg-black/20" />
    </motion.button>
  );
}