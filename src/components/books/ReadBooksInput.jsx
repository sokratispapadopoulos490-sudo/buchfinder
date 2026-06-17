import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/components/language/LanguageContext';

/**
 * ReadBooksInput – Chip-Eingabe für bereits gelesene Bücher.
 * Lokal: kein API-Call, nur Titel als Strings.
 * Props:
 *   value: string[]  – aktuelle Liste
 *   onChange: (string[]) => void
 *   onSkip: () => void
 *   placeholder?: string
 *   maxItems?: number
 */
export default function ReadBooksInput({ value = [], onChange, onSkip, placeholder, maxItems = 8 }) {
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  const addBook = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (value.length >= maxItems) return;
    if (value.some(b => b.toLowerCase() === trimmed.toLowerCase())) {
      setInput('');
      return;
    }
    onChange([...value, trimmed]);
    setInput('');
  };

  const removeBook = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addBook(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Chips */}
      <div className="min-h-[44px] mb-4">
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            <AnimatePresence>
              {value.map((title, idx) => (
                <motion.span
                  key={title + idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-2 pl-3.5 pr-1.5 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 text-sm border border-amber-200 dark:border-amber-800"
                >
                  <span className="max-w-[160px] truncate">{title}</span>
                  <button
                    onClick={() => removeBook(idx)}
                    className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors touch-manipulation"
                    aria-label={t('readBooks.remove').replace('{title}', title)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        ) : null}
      </div>

      {/* Eingabefeld */}
      {value.length < maxItems && (
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Buchtitel eingeben..."}
            className="flex-1 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:placeholder-stone-500"
          />
          <button
            onClick={addBook}
            disabled={!input.trim()}
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-stone-800 dark:bg-amber-600 text-white disabled:opacity-30 hover:bg-stone-700 dark:hover:bg-amber-700 transition-colors flex-shrink-0 touch-manipulation"
            aria-label={t('readBooks.continue')}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Aktionen */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={onSkip}
          className="w-full h-12 bg-stone-800 hover:bg-stone-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-base"
        >
          {value.length > 0 ? t('readBooks.continue') : t('readBooks.skip')}
        </Button>
        {value.length > 0 && (
          <button
            onClick={onSkip}
            className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors text-center py-1"
          >
            {t('readBooks.skip')}
          </button>
        )}
      </div>
    </motion.div>
  );
}