/**
 * bookService.js – Zentrale Abstraktionsschicht für alle Buchoperationen.
 *
 * Fallback-Hierarchie:
 *   1. Book-Entität (Base44 DB) – primär, persistiert, affiliate-ready
 *   2. Google Books API          – Live-Lookup
 *   3. BookDatabase.js (lokal)  – Legacy-Fallback während Migration
 */

import { base44 } from '@/api/base44Client';
import { books as localBooks } from '@/components/books/BookDatabase';

// ─── Normalisierung ────────────────────────────────────────────────────────────
export function normalizeLocalBook(localBook) {
  return {
    id: localBook.id,
    isbn13: localBook.isbn || null,
    isbn10: null,
    title: localBook.title,
    subtitle: null,
    authors: localBook.author ? [localBook.author] : [],
    author: localBook.author,
    publisher: localBook.publisher || null,
    published_date: localBook.publishYear ? String(localBook.publishYear) : null,
    page_count: localBook.pageCount || null,
    language: 'de',
    categories: localBook.tags || [],
    tags: localBook.tags || [],
    age_group: localBook.ageGroup || 'erwachsene',
    ageGroup: localBook.ageGroup || 'erwachsene',
    difficulty: localBook.difficulty || 'einsteiger',
    reading_style: localBook.style || [],
    style: localBook.style || [],
    time_effort: localBook.timeEffort || 'mittel',
    description: localBook.description || '',
    cover_front_url: localBook.coverUrl || null,
    coverUrl: localBook.coverUrl || null,
    cover_color: localBook.coverColor || 'bg-amber-100',
    coverColor: localBook.coverColor || 'bg-amber-100',
    preview_link: null,
    rating: null,
    ratings_count: null,
    affiliate_providers: {},
    country_availability: [],
    translations: {},
    alternate_titles: [],
    source: 'local',
    is_active: true,
    // Legacy fields
    isbn: localBook.isbn,
    pageCount: localBook.pageCount,
    publishYear: localBook.publishYear,
  };
}

export function normalizeGoogleBook(volume) {
  const info = volume.volumeInfo || {};
  const ids = info.industryIdentifiers || [];
  const isbn13 = ids.find(i => i.type === 'ISBN_13')?.identifier || null;
  const isbn10 = ids.find(i => i.type === 'ISBN_10')?.identifier || null;
  const authorStr = info.authors?.join(', ') || 'Unbekannt';

  // Bessere Cover-URL: zoom=2 für höhere Auflösung, https statt http
  const rawCover = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || null;
  const coverUrl = rawCover
    ? rawCover.replace('http://', 'https://').replace('zoom=1', 'zoom=2')
    : null;

  return {
    // New schema
    isbn13,
    isbn10,
    title: info.title || 'Unbekannter Titel',
    subtitle: info.subtitle || null,
    authors: info.authors || [],
    publisher: info.publisher || null,
    published_date: info.publishedDate || null,
    page_count: info.pageCount || null,
    language: info.language || 'de',
    categories: info.categories || [],
    tags: info.categories || [],
    age_group: 'erwachsene',
    ageGroup: 'erwachsene',
    difficulty: 'einsteiger',
    reading_style: [],
    style: [],
    time_effort: 'mittel',
    description: info.description || '',
    cover_front_url: coverUrl,
    cover_color: 'bg-amber-100',
    preview_link: info.previewLink || null,
    rating: info.averageRating || null,
    ratings_count: info.ratingsCount || null,
    affiliate_providers: {},
    country_availability: [],
    translations: {},
    alternate_titles: [],
    source: 'google_books',
    source_id: volume.id,
    is_active: true,
    // Legacy fields for full backward compat
    id: isbn13 ? parseInt(isbn13.slice(-6)) : Math.floor(Math.random() * 999999),
    author: authorStr,
    coverUrl: coverUrl,
    coverColor: 'bg-amber-100',
    isbn: isbn13 || isbn10,
    pageCount: info.pageCount || null,
    publishYear: info.publishedDate ? parseInt(info.publishedDate) : null,
  };
}

// ─── Google Books API ──────────────────────────────────────────────────────────
const GOOGLE_BOOKS_BASE = 'https://www.googleapis.com/books/v1';
const MAX_RETRIES = 2;
const THROTTLE_MS = 300;

let _lastRequestTime = 0;

async function throttledFetch(url) {
  const now = Date.now();
  const wait = THROTTLE_MS - (now - _lastRequestTime);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  _lastRequestTime = Date.now();

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url);
    if (res.status === 429) {
      // Rate limited – exponential backoff
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      continue;
    }
    if (!res.ok) throw new Error(`Google Books API error: ${res.status}`);
    return res.json();
  }
  throw new Error('Google Books API: max retries exceeded');
}

/**
 * Sucht Bücher via Google Books API.
 * Unterstützt: Titel, Autor, ISBN, Kategorie, Sprachfilter.
 */
export async function searchGoogleBooks(query, options = {}) {
  const {
    maxResults = 20,
    startIndex = 0,
    langRestrict,
    orderBy = 'relevance', // 'relevance' | 'newest'
    filter,               // 'ebooks' | 'free-ebooks' | 'full' | 'paid-ebooks' | 'partial'
  } = options;

  const params = new URLSearchParams({
    q: query,
    maxResults: String(Math.min(maxResults, 40)), // API max = 40
    startIndex: String(startIndex),
    orderBy,
    printType: 'books',
  });
  if (langRestrict) params.set('langRestrict', langRestrict);
  if (filter) params.set('filter', filter);

  const data = await throttledFetch(`${GOOGLE_BOOKS_BASE}/volumes?${params}`);
  const totalItems = data.totalItems || 0;
  const items = (data.items || []).map(normalizeGoogleBook);
  return { items, totalItems, nextStartIndex: startIndex + items.length };
}

/**
 * Dedizierter ISBN-Lookup – holt genau ein Buch.
 */
export async function fetchGoogleBookByISBN(isbn) {
  const clean = isbn.replace(/[-\s]/g, '');
  const data = await throttledFetch(`${GOOGLE_BOOKS_BASE}/volumes?q=isbn:${clean}&maxResults=1`);
  const items = data.items || [];
  return items.length > 0 ? normalizeGoogleBook(items[0]) : null;
}

// ─── DB-Caching ────────────────────────────────────────────────────────────────
/**
 * Speichert ein Google-Buch in der Book-Entität, wenn noch nicht vorhanden.
 * Stille Operation – wirft keine Fehler.
 */
export async function cacheBookToDB(book) {
  try {
    if (book.isbn13) {
      const existing = await base44.entities.Book.filter({ isbn13: book.isbn13 });
      if (existing.length > 0) return existing[0];
    }
    return await base44.entities.Book.create({
      isbn13: book.isbn13,
      isbn10: book.isbn10,
      title: book.title,
      subtitle: book.subtitle,
      authors: book.authors,
      publisher: book.publisher,
      published_date: book.published_date,
      page_count: book.page_count,
      language: book.language,
      categories: book.categories,
      tags: book.tags,
      age_group: book.age_group,
      difficulty: book.difficulty,
      reading_style: book.reading_style,
      style: book.style,
      time_effort: book.time_effort,
      description: book.description,
      cover_front_url: book.cover_front_url,
      cover_color: book.cover_color,
      preview_link: book.preview_link,
      rating: book.rating,
      ratings_count: book.ratings_count,
      source: book.source,
      source_id: book.source_id,
      affiliate_providers: {},
      country_availability: [],
      translations: {},
      alternate_titles: [],
      is_active: true,
    });
  } catch {
    return null;
  }
}

// ─── Affiliate-Links ───────────────────────────────────────────────────────────
const AFFILIATE_TEMPLATES = {
  DE: {
    amazon: (isbn) => `https://www.amazon.de/dp/${isbn}`,
    thalia: (isbn) => `https://www.thalia.de/suche?sq=${isbn}`,
    hugendubel: (isbn) => `https://www.hugendubel.de/de/buch/${isbn}`,
  },
  AT: {
    amazon: (isbn) => `https://www.amazon.de/dp/${isbn}`,
    thalia: (isbn) => `https://www.thalia.at/suche?sq=${isbn}`,
  },
  CH: {
    exlibris: (isbn) => `https://www.exlibris.ch/de/buecher-shop/deutschsprachige-buecher/p/${isbn}`,
    orellfuessli: (isbn) => `https://www.orellfuessli.ch/suche?searchterm=${isbn}`,
  },
  US: {
    amazon: (isbn) => `https://www.amazon.com/dp/${isbn}`,
    bookshop: (isbn) => `https://bookshop.org/books?keywords=${isbn}`,
  },
  UK: {
    amazon: (isbn) => `https://www.amazon.co.uk/dp/${isbn}`,
    bookshop: (isbn) => `https://uk.bookshop.org/books?keywords=${isbn}`,
  },
  DEFAULT: {
    amazon: (isbn) => `https://www.amazon.com/dp/${isbn}`,
  }
};

export function getAffiliateLinks(book, countryCode = 'DE') {
  const isbn = book.isbn13 || book.isbn10 || book.isbn;
  const stored = book.affiliate_providers?.[countryCode];
  if (stored && Object.keys(stored).length > 0) return stored;
  if (!isbn) {
    // Fallback: Titelsuche
    const encoded = encodeURIComponent(`${book.title} ${book.author || (book.authors || [])[0] || ''}`);
    return { amazon: `https://www.amazon.de/s?k=${encoded}`, thalia: `https://www.thalia.de/suche?sq=${encoded}` };
  }
  const templates = AFFILIATE_TEMPLATES[countryCode] || AFFILIATE_TEMPLATES.DEFAULT;
  return Object.fromEntries(Object.entries(templates).map(([p, fn]) => [p, fn(isbn)]));
}

// ─── Matching-Engine ───────────────────────────────────────────────────────────
/**
 * Async: DB-first, Fallback auf lokale Bücher.
 */
export async function getMatchingBooksFromDB(profile) {
  const { mainTopics, secondaryTopics, style, difficulty, ageGroup, readBooks = [], savedBookIds = [] } = profile;

  let pool;
  try {
    const dbBooks = await base44.entities.Book.filter({ age_group: ageGroup, is_active: true }, '-rating', 200);
    pool = dbBooks.length > 0 ? dbBooks : localBooks.map(normalizeLocalBook).filter(b => b.age_group === ageGroup);
  } catch {
    pool = localBooks.map(normalizeLocalBook).filter(b => b.age_group === ageGroup);
  }

  pool = pool.filter(b => !savedBookIds.includes(b.id));
  if (readBooks.length > 0) {
    pool = pool.filter(book => {
      const tl = book.title.toLowerCase();
      const al = (book.authors?.[0] || book.author || '').toLowerCase();
      return !readBooks.some(rb => {
        const rbl = rb.toLowerCase();
        return tl.includes(rbl) || rbl.includes(tl) || al.includes(rbl);
      });
    });
  }

  const scored = pool.map(book => {
    let score = 0;
    const bookTags = book.tags || book.categories || [];
    const bookStyle = book.style || book.reading_style || [];
    mainTopics.forEach(t => { if (bookTags.includes(t)) score += 5; });
    secondaryTopics.forEach(t => { if (bookTags.includes(t)) score += 2; });
    style.forEach(s => { if (bookStyle.includes(s)) score += 3; });
    if (book.difficulty === difficulty) score += 4;
    if ((difficulty === 'fortgeschritten' && book.difficulty === 'einsteiger') ||
        (difficulty === 'einsteiger' && book.difficulty === 'fortgeschritten')) score -= 2;
    return { ...book, score };
  }).sort((a, b) => b.score - a.score);

  const topBooks = scored.slice(0, 10).map((b, i) => ({ ...b, placement: i + 1, isContrast: false }));
  const topIds = new Set(topBooks.map(b => b.id || b.isbn13));
  const remaining = scored.filter(b => !topIds.has(b.id || b.isbn13));
  const contrastBooks = remaining
    .filter(b => !mainTopics.some(t => (b.tags || b.categories || []).includes(t)))
    .slice(0, 3)
    .map((b, i) => ({ ...b, placement: 11 + i, isContrast: true }));

  if (contrastBooks.length < 3) {
    const cIds = new Set(contrastBooks.map(b => b.id || b.isbn13));
    const filler = remaining.filter(b => !cIds.has(b.id || b.isbn13))
      .slice(0, 3 - contrastBooks.length)
      .map((b, i) => ({ ...b, placement: 11 + contrastBooks.length + i, isContrast: true }));
    contrastBooks.push(...filler);
  }
  return [...topBooks, ...contrastBooks];
}

/** Synchroner Legacy-Fallback */
export function getMatchingBooksSync(profile) {
  const { mainTopics, secondaryTopics, style, difficulty, ageGroup, readBooks = [], savedBookIds = [] } = profile;
  let pool = localBooks.map(normalizeLocalBook).filter(b => b.age_group === ageGroup);
  pool = pool.filter(b => !savedBookIds.includes(b.id));
  if (readBooks.length > 0) {
    pool = pool.filter(book => {
      const tl = book.title.toLowerCase();
      const al = (book.authors?.[0] || '').toLowerCase();
      return !readBooks.some(rb => {
        const rbl = rb.toLowerCase();
        return tl.includes(rbl) || rbl.includes(tl) || al.includes(rbl);
      });
    });
  }
  const scored = pool.map(book => {
    let score = 0;
    mainTopics.forEach(t => { if ((book.tags || []).includes(t)) score += 5; });
    secondaryTopics.forEach(t => { if ((book.tags || []).includes(t)) score += 2; });
    style.forEach(s => { if ((book.style || []).includes(s)) score += 3; });
    if (book.difficulty === difficulty) score += 4;
    return { ...book, score };
  }).sort((a, b) => b.score - a.score);

  const topBooks = scored.slice(0, 10).map((b, i) => ({ ...b, placement: i + 1, isContrast: false }));
  const topIds = new Set(topBooks.map(b => b.id));
  const remaining = scored.filter(b => !topIds.has(b.id));
  const contrastBooks = remaining
    .filter(b => !mainTopics.some(t => (b.tags || []).includes(t)))
    .slice(0, 3)
    .map((b, i) => ({ ...b, placement: 11 + i, isContrast: true }));
  return [...topBooks, ...contrastBooks];
}