import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Book, BookOpen, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookShelf from '@/components/library/BookShelf';

export default function Library() {
  const [savedBooks, setSavedBooks] = useState([]);
  const [readingLogs, setReadingLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    try {
      const [books, logs] = await Promise.all([
        base44.entities.SavedBook.list(),
        base44.entities.ReadingLog.list()
      ]);
      setSavedBooks(books);
      setReadingLogs(logs);
    } catch (error) {
      console.error('Fehler beim Laden der Bibliothek:', error);
    } finally {
      setLoading(false);
    }
  };

  // Berechne Fortschritt für jedes Buch
  const getBooksWithProgress = () => {
    return savedBooks.map(book => {
      const bookLogs = readingLogs.filter(log => log.saved_book_id === book.id);
      const totalPagesRead = bookLogs.reduce((sum, log) => sum + (log.pages_read || 0), 0);
      const totalPages = book.book_data?.pageCount || 0;
      const progress = totalPages > 0 ? Math.min(Math.round((totalPagesRead / totalPages) * 100), 100) : 0;
      
      return {
        ...book,
        progress,
        totalPagesRead,
        totalPages
      };
    });
  };

  const booksWithProgress = getBooksWithProgress();

  // Kategorisiere Bücher
  const completedBooks = booksWithProgress.filter(b => b.is_completed);
  const inProgressBooks = booksWithProgress.filter(b => !b.is_completed && b.progress > 0);
  const toReadBooks = booksWithProgress.filter(b => !b.is_completed && b.progress === 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Lade deine Bibliothek...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/Account')}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Zurück zum Account</span>
          </button>

          <h1 className="text-4xl font-light text-stone-800 mb-3">Meine Bibliothek</h1>
          <p className="text-stone-500">Deine persönliche Büchersammlung</p>
        </div>

        {/* Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-stone-200 p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-light text-stone-800">{completedBooks.length}</div>
                <div className="text-sm text-stone-500">Gelesen</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-stone-200 p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-light text-stone-800">{inProgressBooks.length}</div>
                <div className="text-sm text-stone-500">In Bearbeitung</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-stone-200 p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                <Book className="w-5 h-5 text-stone-600" />
              </div>
              <div>
                <div className="text-2xl font-light text-stone-800">{toReadBooks.length}</div>
                <div className="text-sm text-stone-500">Zu lesen</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bücherregale */}
        <div className="space-y-12">
          {inProgressBooks.length > 0 && (
            <BookShelf
              title="In Bearbeitung"
              icon={<BookOpen className="w-6 h-6 text-amber-600" />}
              books={inProgressBooks}
              showProgress={true}
            />
          )}

          {toReadBooks.length > 0 && (
            <BookShelf
              title="Zu lesen"
              icon={<Book className="w-6 h-6 text-stone-600" />}
              books={toReadBooks}
              showProgress={false}
            />
          )}

          {completedBooks.length > 0 && (
            <BookShelf
              title="Gelesen"
              icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
              books={completedBooks}
              showProgress={false}
            />
          )}
        </div>

        {savedBooks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
              <Book className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-xl font-light text-stone-700 mb-2">Deine Bibliothek ist noch leer</h3>
            <p className="text-stone-500 mb-6">Starte eine neue Buchsuche, um deine Sammlung aufzubauen</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors"
            >
              Bücher entdecken
            </button>
          </div>
        )}
      </div>
    </div>
  );
}