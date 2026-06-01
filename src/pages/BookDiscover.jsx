/**
 * BookDiscover – Live globale Buchentdeckung via Google Books API.
 * Ersetzt die statische Empfehlungsseite durch echte Live-Suche.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Globe, BookOpen, Loader2, AlertCircle, ChevronDown, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleBooks } from '@/hooks/useGoogleBooks';
import BookCover from '@/components/books/BookCover';
import LiveBookCard from '@/components/books/LiveBookCard';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/language/LanguageContext';

const LANGUAGE_OPTIONS = [
  { code: '', flag: '', name: '🌐' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
];

const QUICK_SEARCH_KEYS = [
  { key: 'discover.qs.selfHelp',   query: 'subject:self-help' },
  { key: 'discover.qs.philosophy', query: 'subject:philosophy' },
  { key: 'discover.qs.fantasy',    query: 'subject:fantasy fiction' },
  { key: 'discover.qs.thriller',   query: 'subject:thriller' },
  { key: 'discover.qs.history',    query: 'subject:history' },
  { key: 'discover.qs.science',    query: 'subject:science' },
  { key: 'discover.qs.biography',  query: 'subject:biography' },
  { key: 'discover.qs.romance',    query: 'subject:romance' },
];

export default function BookDiscover() {
  const [inputValue, setInputValue] = useState('');
  const [langRestrict, setLangRestrict] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [user, setUser] = useState(null);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { results, loading, error, totalItems, hasMore, usingFallback, query, search, searchByISBN, loadMore, reset } = useGoogleBooks();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasMore && !loading) loadMore(); },
      { threshold: 0.1 }
    );
    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, loadMore]);

  const handleSearch = (q = inputValue) => {
    if (!q.trim()) return;
    search(q, { langRestrict });
  };

  const handleQuickSearch = (q) => {
    setInputValue(q);
    search(q, { langRestrict });
  };

  const handleISBNSearch = () => {
    const isISBN = /^[\d-]{10,17}$/.test(inputValue.replace(/\s/g, ''));
    if (isISBN) {
      searchByISBN(inputValue);
    } else {
      handleSearch();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleISBNSearch();
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-stone-50/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
            <h1 className="text-lg font-semibold text-stone-900 dark:text-white">{t('discover.title')}</h1>
            <span className="text-xs text-stone-400 dark:text-stone-500 ml-auto">via Google Books</span>
          </div>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('discover.searchPlaceholder')}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1a1a1a] text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {inputValue && (
                <button
                  onClick={() => { setInputValue(''); reset(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-stone-400" />
                </button>
              )}
            </div>
            <Button
              onClick={handleISBNSearch}
              disabled={loading || !inputValue.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 rounded-xl"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`p-2.5 rounded-xl border transition-colors ${showFilters ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1a1a1a] text-stone-500'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-stone-500 dark:text-stone-400 flex-shrink-0">{t('discover.languageFilter')}</span>
                    {LANGUAGE_OPTIONS.map(opt => (
                      <button
                        key={opt.code}
                        onClick={() => { setLangRestrict(opt.code); if (query) search(query, { langRestrict: opt.code }); }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          langRestrict === opt.code
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 bg-white dark:bg-[#1a1a1a] hover:border-amber-400'
                        }`}
                      >
                        {opt.code === '' ? t('discover.allLanguages') : `${opt.flag} ${opt.name}`}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Quick searches – nur wenn keine aktive Suche */}
        {!query && (
          <div className="mb-6">
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 uppercase tracking-wider">{t('discover.topicsLabel')}</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SEARCH_KEYS.map(qs => (
                <button
                  key={qs.query}
                  onClick={() => handleQuickSearch(qs.query)}
                  className="text-sm px-4 py-2 rounded-full bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                >
                  {t(qs.key)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ergebnis-Header */}
        {query && !loading && totalItems > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {usingFallback ? t('discover.localResults') : `~${totalItems.toLocaleString()} ${t('discover.results')}`}
            </p>
            {!usingFallback && <span className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1"><Globe className="w-3 h-3" />Live</span>}
          </div>
        )}

        {/* Fehler / Fallback-Hinweis */}
        {error && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">{error}</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && results.length === 0 && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-24 rounded-lg bg-stone-200 dark:bg-stone-700 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
                    <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-1/2" />
                    <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-full mt-3" />
                    <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ergebnisse */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((book, idx) => (
              <motion.div
                key={book.isbn13 || book.isbn10 || `${book.title}-${idx}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.4) }}
              >
                <LiveBookCard book={book} user={user} />
              </motion.div>
            ))}

            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="py-4 flex justify-center">
              {loading && hasMore && <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />}
              {!loading && hasMore && (
                <button onClick={loadMore} className="text-sm text-amber-600 dark:text-amber-500 hover:underline flex items-center gap-1">
                  {t('btn.loadMore')} <ChevronDown className="w-4 h-4" />
                </button>
              )}
              {!hasMore && results.length > 0 && !usingFallback && (
                <p className="text-xs text-stone-400 dark:text-stone-500">{t('status.allLoaded')}</p>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 dark:text-stone-400 mb-2">{t('discover.empty')}</p>
            <p className="text-sm text-stone-400">{t('discover.emptyHint')}</p>
          </div>
        )}

        {/* Start state */}
        {!query && !loading && (
          <div className="text-center py-12 text-stone-400 dark:text-stone-600">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">{t('discover.startHint')}</p>
          </div>
        )}
      </div>
    </div>
  );
}