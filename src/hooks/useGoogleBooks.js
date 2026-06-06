/**
 * useGoogleBooks – React Hook for live Google Books API search with:
 * - Debouncing (400ms)
 * - Pagination (no stale closure bug — uses refs for mutable state)
 * - Deduplication by ISBN/title
 * - Silent background caching in Book entity
 * - Graceful fallback to local DB
 */

import { useState, useCallback, useRef } from 'react';
import { searchGoogleBooks, cacheBookToDB } from '@/lib/bookService';
import { makeCacheKey, cacheGet, cacheSet } from '@/lib/clientCache';

const DEBOUNCE_MS = 400;
const PAGE_SIZE = 20;

export function useGoogleBooks() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);

  // Use refs for mutable state that search/loadMore closures read — avoids stale closure
  const startIndexRef = useRef(0);
  const queryRef = useRef('');
  const optionsRef = useRef({});
  const seenKeysRef = useRef(new Set());
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const loadingRef = useRef(false); // prevent concurrent requests

  const _doSearch = useCallback(async (searchQuery, options = {}, append = false) => {
    if (!searchQuery?.trim()) {
      setResults([]);
      setTotalItems(0);
      setHasMore(false);
      setUsingFallback(false);
      setQuery('');
      return;
    }

    // Prevent concurrent requests
    if (loadingRef.current && !append) {
      abortRef.current?.abort();
    }
    if (loadingRef.current && append) return;

    abortRef.current = new AbortController();

    const langRestrict = options.langRestrict || '';

    if (!append) {
      seenKeysRef.current = new Set();
      startIndexRef.current = 0;
      queryRef.current = searchQuery;
      optionsRef.current = options;
      setResults([]);

      // Cache-Hit prüfen (nur für erste Seite, nicht für loadMore)
      const cacheKey = makeCacheKey(searchQuery, langRestrict, 0);
      const cached = cacheGet(cacheKey);
      if (cached) {
        loadingRef.current = false;
        setLoading(false);
        setResults(cached.items);
        setTotalItems(cached.totalItems);
        startIndexRef.current = cached.nextStartIndex;
        setHasMore(cached.nextStartIndex < cached.totalItems);
        cached.items.forEach(b => { seenKeysRef.current.add(b.isbn13 || b.isbn10 || b.title); });
        return;
      }
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const idx = startIndexRef.current;
      const { items, totalItems: total, nextStartIndex } = await searchGoogleBooks(searchQuery, {
        maxResults: PAGE_SIZE,
        startIndex: idx,
        ...options,
      });

      // Deduplicate
      const unique = items.filter(book => {
        const key = book.isbn13 || book.isbn10 || book.title;
        if (seenKeysRef.current.has(key)) return false;
        seenKeysRef.current.add(key);
        return true;
      });

      startIndexRef.current = nextStartIndex;
      setResults(prev => append ? [...prev, ...unique] : unique);
      setTotalItems(total);
      setHasMore(nextStartIndex < total);

      // Ergebnis für erste Seite cachen
      if (!append) {
        const cacheKey = makeCacheKey(searchQuery, langRestrict, 0);
        cacheSet(cacheKey, { items: unique, totalItems: total, nextStartIndex });
      }

      // Silent background caching (fire-and-forget)
      unique.forEach(book => cacheBookToDB(book).catch(() => {}));

    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn('All book APIs failed, using local fallback:', err);
      setError('Suche nicht verfügbar. Lokale Bücher werden angezeigt.');
      setUsingFallback(true);
      setHasMore(false);

      const { normalizeLocalBook } = await import('@/lib/bookService');
      const { books: localBooks } = await import('@/components/books/BookDatabase');
      const q = searchQuery.toLowerCase();
      const fallback = localBooks
        .filter(b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.isbn && b.isbn.includes(q)) ||
          (b.tags || []).some(t => t.toLowerCase().includes(q))
        )
        .slice(0, 20)
        .map(normalizeLocalBook);
      setResults(fallback);
      setTotalItems(fallback.length);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []); // no dependencies — all mutable state via refs

  // Debounced external-facing search
  const search = useCallback((searchQuery, options = {}) => {
    setQuery(searchQuery);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => _doSearch(searchQuery, options, false), DEBOUNCE_MS);
  }, [_doSearch]);

  // loadMore reads from refs — no stale closure possible
  const loadMore = useCallback(() => {
    if (loadingRef.current || !queryRef.current) return;
    _doSearch(queryRef.current, optionsRef.current, true);
  }, [_doSearch]);

  const searchByISBN = useCallback((isbn) => {
    const clean = isbn.replace(/[-\s]/g, '');
    return _doSearch(`isbn:${clean}`, {}, false);
  }, [_doSearch]);

  const reset = useCallback(() => {
    clearTimeout(debounceRef.current);
    abortRef.current?.abort();
    seenKeysRef.current = new Set();
    startIndexRef.current = 0;
    queryRef.current = '';
    optionsRef.current = {};
    loadingRef.current = false;
    setResults([]);
    setQuery('');
    setTotalItems(0);
    setHasMore(false);
    setError(null);
    setUsingFallback(false);
    setLoading(false);
  }, []);

  return {
    results,
    loading,
    error,
    totalItems,
    hasMore,
    usingFallback,
    query,
    search,
    searchByISBN,
    loadMore,
    reset,
  };
}