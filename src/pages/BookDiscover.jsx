/**
 * BookDiscover – Live globale Buchentdeckung via Google Books API.
 *
 * Phase 2: Trennung von uiLanguage / bookLanguage / shoppingRegion.
 * - bookLanguage: Sprache der gesuchten Bücher (langRestrict)
 * - shoppingRegion: Region für Kauf-Links (Provider-Router)
 * - uiLanguage: Sprache der Oberfläche (t()-Funktion) – unverändert
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Globe, BookOpen, Loader2, AlertCircle, ChevronDown, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleBooks } from '@/hooks/useGoogleBooks';
import LiveBookCard from '@/components/books/LiveBookCard';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/language/LanguageContext';
import { BOOK_LANGUAGES, SHOPPING_REGIONS } from '@/lib/providerRegistry';
import { isISBN } from '@/lib/bookQueryBuilder';

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

// Aktiver Filter-Tab
const FILTER_TAB = { BOOK_LANG: 'book_lang', REGION: 'region' };

export default function BookDiscover() {
  const [inputValue, setInputValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterTab, setFilterTab] = useState(FILTER_TAB.BOOK_LANG);
  const [user, setUser] = useState(null);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const { t, bookLanguage, changeBookLanguage, shoppingRegion, changeShoppingRegion } = useLanguage();
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
    search(q, { langRestrict: bookLanguage });
  };

  const handleISBNSearch = () => {
    const clean = inputValue.replace(/\s/g, '');
    if (isISBN(clean)) {
      searchByISBN(clean);
    } else {
      handleSearch();
    }
  };

  const handleQuickSearch = (q) => {
    setInputValue(q);
    search(q, { langRestrict: bookLanguage });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleISBNSearch();
  };

  const handleBookLangChange = (lang) => {
    changeBookLanguage(lang);
    if (query) search(query, { langRestrict: lang });
  };

  // Aktueller Shopping-Region-Label
  const currentRegion = SHOPPING_REGIONS.find(r => r.code === shoppingRegion);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-stone-50/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
            <h1 className="text-lg font-semibold text-stone-900 dark:text-white">{t('discover.title')}</h1>
            {/* Shopping-Region-Indikator */}
            <button
              onClick={() => { setShowFilters(true); setFilterTab(FILTER_TAB.REGION); }}
              className="ml-auto flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              title={t('region.label')}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{currentRegion?.flag} {shoppingRegion}</span>
            </button>
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
              className={`p-2.5 rounded-xl border transition-colors relative ${showFilters ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1a1a1a] text-stone-500'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {/* Dot wenn aktiver Buchsprachen-Filter */}
              {bookLanguage && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          </div>

          {/* Filter-Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-3">
                  {/* Tab-Switcher: Buchsprache / Einkaufsregion */}
                  <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
                    <button
                      onClick={() => setFilterTab(FILTER_TAB.BOOK_LANG)}
                      className={`flex-1 text-xs py-1.5 px-2 rounded-md transition-colors font-medium ${
                        filterTab === FILTER_TAB.BOOK_LANG
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      📚 {t('bookLang.label').replace(':', '')}
                    </button>
                    <button
                      onClick={() => setFilterTab(FILTER_TAB.REGION)}
                      className={`flex-1 text-xs py-1.5 px-2 rounded-md transition-colors font-medium ${
                        filterTab === FILTER_TAB.REGION
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      🛒 {t('region.label').replace(':', '')}
                    </button>
                  </div>

                  {/* Buchsprache-Filter */}
                  {filterTab === FILTER_TAB.BOOK_LANG && (
                    <div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">{t('bookLang.label')}</p>
                      <div className="flex flex-wrap gap-2">
                        {BOOK_LANGUAGES.map(opt => (
                          <button
                            key={opt.code}
                            onClick={() => handleBookLangChange(opt.code)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                              bookLanguage === opt.code
                                ? 'bg-amber-600 text-white border-amber-600'
                                : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 bg-white dark:bg-[#1a1a1a] hover:border-amber-400'
                            }`}
                          >
                            {opt.flag} {t(opt.labelKey)}
                          </button>
                        ))}
                      </div>
                      {/* Hinweis für weniger indexierte Sprachen */}
                      {['el', 'tr'].includes(bookLanguage) && (
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                          {t('discover.bookLangHint')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Shopping-Region-Filter */}
                  {filterTab === FILTER_TAB.REGION && (
                    <div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{t('region.label')}</p>
                      <p className="text-xs text-stone-400 dark:text-stone-500 mb-2">{t('region.hint')}</p>
                      <div className="flex flex-wrap gap-2">
                        {SHOPPING_REGIONS.map(opt => (
                          <button
                            key={opt.code}
                            onClick={() => changeShoppingRegion(opt.code)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                              shoppingRegion === opt.code
                                ? 'bg-amber-600 text-white border-amber-600'
                                : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 bg-white dark:bg-[#1a1a1a] hover:border-amber-400'
                            }`}
                          >
                            {opt.flag} {t(opt.labelKey)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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
            <div className="flex items-center gap-2">
              {bookLanguage && (
                <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                  {BOOK_LANGUAGES.find(l => l.code === bookLanguage)?.flag} {t(`bookLang.${bookLanguage}`)}
                </span>
              )}
              {!usingFallback && <span className="text-xs text-green-600 dark:text-green-500 flex items-center gap-1"><Globe className="w-3 h-3" />Live</span>}
            </div>
          </div>
        )}

        {/* Fehler-Hinweis */}
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
                <LiveBookCard book={book} user={user} shoppingRegion={shoppingRegion} />
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