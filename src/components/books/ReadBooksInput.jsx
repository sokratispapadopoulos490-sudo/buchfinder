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
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <AnimatePresence>
            {value.map((title, idx) => (
              <motion.span
                key={title + idx}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 text-sm border border-amber-200 dark:border-amber-800"
              >
                {title}
                <button
                  onClick={() => removeBook(idx)}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label={`${title} entfernen`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Eingabefeld */}
      {value.length < maxItems && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Buchtitel eingeben..."}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:placeholder-stone-500"
          />
          <button
            onClick={addBook}
            disabled={!input.trim()}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-800 dark:bg-amber-600 text-white text-sm disabled:opacity-40 hover:bg-stone-700 dark:hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Aktionen */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={onSkip}
          className="w-full bg-stone-800 hover:bg-stone-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
        >
          {value.length > 0 ? t('readBooks.continue') : t('readBooks.skip')}
        </Button>
        {value.length > 0 && (
          <button
            onClick={onSkip}
            className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors text-center"
          >
            {t('readBooks.skip')}
          </button>
        )}
      </div>
    </motion.div>
  );
}