/**
 * useGoogleBooks – React Hook für Live Google Books API Suche mit:
 * - Debouncing (400ms)
 * - Pagination
 * - Deduplication
 * - Caching in Book-Entität (stilles Hintergrund-Write)
 * - Graceful Fallback auf lokale DB
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { searchGoogleBooks, cacheBookToDB, getMatchingBooksSync } from '@/lib/bookService';

const DEBOUNCE_MS = 400;
const PAGE_SIZE = 20;

export function useGoogleBooks() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const seenIsbnsRef = useRef(new Set());

  const search = useCallback(async (searchQuery, options = {}, append = false) => {
    if (!searchQuery?.trim()) {
      setResults([]);
      setTotalItems(0);
      setHasMore(false);
      setUsingFallback(false);
      return;
    }

    // Abort laufende Anfrage
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    if (!append) {
      seenIsbnsRef.current = new Set();
      setResults([]);
      setStartIndex(0);
    }

    setLoading(true);
    setError(null);
    setUsingFallback(false);

    try {
      const idx = append ? startIndex : 0;
      const { items, totalItems: total, nextStartIndex } = await searchGoogleBooks(searchQuery, {
        maxResults: PAGE_SIZE,
        startIndex: idx,
        ...options,
      });

      // ISBN-Deduplication
      const unique = items.filter(book => {
        const key = book.isbn13 || book.isbn10 || book.title;
        if (seenIsbnsRef.current.has(key)) return false;
        seenIsbnsRef.current.add(key);
        return true;
      });

      setResults(prev => append ? [...prev, ...unique] : unique);
      setTotalItems(total);
      setStartIndex(nextStartIndex);
      setHasMore(nextStartIndex < total);

      // Stilles Caching in DB (fire-and-forget, kein await)
      unique.forEach(book => cacheBookToDB(book).catch(() => {}));

    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn('Google Books API failed, using local fallback:', err);
      setError('Live-Suche nicht verfügbar. Lokale Bücher werden angezeigt.');
      setUsingFallback(true);
      setHasMore(false);

      // Fallback: lokale Bücher filtern
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
      setLoading(false);
    }
  }, [startIndex]);

  // Debounced search
  const debouncedSearch = useCallback((q, options = {}) => {
    setQuery(q);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q, options, false), DEBOUNCE_MS);
  }, [search]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && query) {
      search(query, {}, true);
    }
  }, [loading, hasMore, query, search]);

  const searchByISBN = useCallback(async (isbn) => {
    const clean = isbn.replace(/[-\s]/g, '');
    return search(`isbn:${clean}`, {}, false);
  }, [search]);

  const searchByAuthor = useCallback((author, options = {}) => {
    return debouncedSearch(`inauthor:${author}`, options);
  }, [debouncedSearch]);

  const searchByTitle = useCallback((title, options = {}) => {
    return debouncedSearch(`intitle:${title}`, options);
  }, [debouncedSearch]);

  const searchByCategory = useCallback((category, options = {}) => {
    return debouncedSearch(`subject:${category}`, options);
  }, [debouncedSearch]);

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  return {
    results,
    loading,
    error,
    totalItems,
    hasMore,
    usingFallback,
    query,
    search: debouncedSearch,
    searchByISBN,
    searchByAuthor,
    searchByTitle,
    searchByCategory,
    loadMore,
    reset: () => {
      setResults([]);
      setQuery('');
      setTotalItems(0);
      setHasMore(false);
      setError(null);
      setUsingFallback(false);
    },
  };
}