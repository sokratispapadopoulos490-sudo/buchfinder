import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Tag, FileText, BookOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import BookCover from '@/components/books/BookCover';
import { useLanguage } from '@/components/language/LanguageContext';

export default function CreateEventModal({ onClose, onCreated }) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('lesen');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedBooks, setSavedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // Categories resolved at render-time so they react to language changes
  const CATEGORIES = [
    { value: 'lesen',      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
    { value: 'challenge',  color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
    { value: 'club',       color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
    { value: 'diskussion', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
    { value: 'geschenk',   color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300' },
    { value: 'sonstiges',  color: 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-300' },
  ];

  useEffect(() => {
    base44.entities.SavedBook.list('-created_date', 50).then(setSavedBooks);
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !date) return;
    setSaving(true);
    await base44.entities.ReadingEvent.create({
      title,
      category,
      date,
      time,
      notes,
      book_data: selectedBook ? selectedBook.book_data : undefined,
    });
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-6 w-full max-w-md shadow-xl"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium text-stone-800 dark:text-stone-200">{t('createEvent.title')}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800">
              <X className="w-5 h-5 text-stone-500" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Titel */}
            <div>
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1 block">{t('createEvent.titleLabel')}</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t('createEvent.titlePlaceholder')}
                className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Kategorie */}
            <div>
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1">
                <Tag className="w-3 h-3" /> {t('createEvent.categoryLabel')}
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border-2 ${
                      category === cat.value
                        ? `${cat.color} border-current scale-105`
                        : 'border-transparent bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {t(`events.cat.${cat.value}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Datum & Uhrzeit */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {t('createEvent.dateLabel')}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="w-28">
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {t('createEvent.timeLabel')}
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Buch auswählen (optional) */}
            {savedBooks.length > 0 && (
              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {t('createEvent.linkBook')}
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {savedBooks.slice(0, 10).map(sb => {
                    const isSelected = selectedBook?.id === sb.id;
                    return (
                      <button
                        key={sb.id}
                        type="button"
                        onClick={() => setSelectedBook(isSelected ? null : sb)}
                        className={`flex-shrink-0 flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all border-2 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 scale-105'
                            : 'border-transparent hover:border-stone-300 dark:hover:border-stone-600'
                        }`}
                        title={sb.book_data?.title}
                      >
                        <BookCover bookData={sb.book_data} width="w-10" height="h-14" textSize="text-xs" />
                        <span className="text-xs text-stone-600 dark:text-stone-400 w-12 truncate text-center leading-tight">
                          {sb.book_data?.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notizen */}
            <div>
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3" /> {t('createEvent.notesLabel')}
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t('createEvent.notesPlaceholder')}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">{t('createEvent.cancel')}</Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim() || !date || saving}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              {saving ? t('createEvent.saving') : t('createEvent.save')}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}