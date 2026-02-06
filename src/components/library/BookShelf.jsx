import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BookSpine from './BookSpine';
import BookDetailModal from '../books/BookDetailModal';

export default function BookShelf({ title, icon, books, showProgress }) {
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Regal-Titel */}
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-2xl font-light text-stone-800">{title}</h2>
        <span className="text-stone-400 text-lg">({books.length})</span>
      </div>

      {/* Bücherregal */}
      <div className="relative">
        {/* Oberes Regalbrett */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-amber-900 to-amber-800 rounded-t-lg shadow-lg" />
        
        {/* Bücher */}
        <div className="bg-gradient-to-b from-amber-50/50 to-transparent pt-3 pb-6 px-4 min-h-[200px] flex flex-wrap gap-2 items-end">
          {books.map((book, index) => (
            <BookSpine
              key={book.id}
              book={book}
              showProgress={showProgress}
              onClick={() => setSelectedBook(book)}
              index={index}
            />
          ))}
        </div>

        {/* Unteres Regalbrett */}
        <div className="h-3 bg-gradient-to-b from-amber-800 to-amber-900 rounded-b-lg shadow-xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook.book_data}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </motion.div>
  );
}