/**
 * bookService.js – Zentrale Abstraktionsschicht für alle Buchoperationen.
 *
 * Hierarchie der Datenquellen (Fallback-Kette):
 *   1. Book-Entität (Base44 DB) – primär, persistiert, affiliate-ready
 *   2. Google Books API          – Live-Lookup bei fehlenden Büchern
 *   3. BookDatabase.js (lokal)  – Legacy-Fallback während Migration
 *
 * Alle Komponenten sollen NUR noch diesen Service verwenden,
 * niemals direkt BookDatabase.js importieren.
 */

import { base44 } from '@/api/base44Client';
import { books as localBooks } from '@/components/books/BookDatabase';

// ─── Normalisierung ────────────────────────────────────────────────────────────
// Wandelt ein lokales Legacy-Buch in das neue Book-Schema um.
export function normalizeLocalBook(localBook) {
  return {
    id: localBook.id,
    isbn13: localBook.isbn || null,
    isbn10: null,
    title: localBook.title,
    subtitle: null,
    authors: localBook.author ? [localBook.author] : [],
    publisher: localBook.publisher || null,
    published_date: localBook.publishYear ? String(localBook.publishYear) : null,
    page_count: localBook.pageCount || null,
    language: 'de',
    categories: localBook.tags || [],
    tags: localBook.tags || [],
    age_group: localBook.ageGroup || 'erwachsene',
    difficulty: localBook.difficulty || 'einsteiger',
    reading_style: localBook.style || [],
    style: localBook.style || [],
    time_effort: localBook.timeEffort || 'mittel',
    description: localBook.description || '',
    cover_front_url: localBook.coverUrl || null,
    cover_back_url: null,
    cover_color: localBook.coverColor || 'bg-amber-100',
    preview_link: null,
    rating: null,
    ratings_count: null,
    affiliate_providers: {},
    country_availability: [],
    translations: {},
    alternate_titles: [],
    source: 'local',
    is_active: true,
    // Rückwärtskompatibilität mit alten Komponenten
    author: localBook.author,
    coverUrl: localBook.coverUrl,
    coverColor: localBook.coverColor,
    isbn: localBook.isbn,
    pageCount: localBook.pageCount,
    publishYear: localBook.publishYear,
    ageGroup: localBook.ageGroup,
  };
}

// Wandelt ein Google Books API Volume in das neue Book-Schema um.
export function normalizeGoogleBook(volume) {
  const info = volume.volumeInfo || {};
  const ids = info.industryIdentifiers || [];
  const isbn13 = ids.find(i => i.type === 'ISBN_13')?.identifier || null;
  const isbn10 = ids.find(i => i.type === 'ISBN_10')?.identifier || null;

  return {
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
    difficulty: 'einsteiger',
    reading_style: [],
    style: [],
    time_effort: 'mittel',
    description: info.description || '',
    cover_front_url: info.imageLinks?.thumbnail?.replace('http://', 'https://') || null,
    cover_back_url: null,
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
    // Rückwärtskompatibilität
    author: info.authors?.join(', ') || 'Unbekannt',
    coverUrl: info.imageLinks?.thumbnail?.replace('http://', 'https://') || null,
    coverColor: 'bg-amber-100',
    isbn: isbn13 || isbn10,
    pageCount: info.pageCount || null,
    ageGroup: 'erwachsene',
  };
}

// ─── Affiliate-Link-Generierung ────────────────────────────────────────────────
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
    bookshop: (isbn) => `https://bookshop.org/books?keywords=${isbn}`,
  }
};

/**
 * Gibt Affiliate-Links für ein Buch zurück, basierend auf Ländercode.
 * Nutzt zuerst gespeicherte Links in book.affiliate_providers,
 * generiert bei Fehlen dynamisch via ISBN.
 */
export function getAffiliateLinks(book, countryCode = 'DE') {
  const isbn = book.isbn13 || book.isbn10 || book.isbn;
  const stored = book.affiliate_providers?.[countryCode];
  if (stored && Object.keys(stored).length > 0) return stored;

  if (!isbn) return {};
  const templates = AFFILIATE_TEMPLATES[countryCode] || AFFILIATE_TEMPLATES.DEFAULT;
  return Object.fromEntries(
    Object.entries(templates).map(([provider, fn]) => [provider, fn(isbn)])
  );
}

// ─── Google Books API ──────────────────────────────────────────────────────────
const GOOGLE_BOOKS_BASE = 'https://www.googleapis.com/books/v1';

/**
 * Sucht Bücher via Google Books API.
 * Gibt normalisierte Book-Objekte zurück.
 */
export async function searchGoogleBooks(query, options = {}) {
  const { maxResults = 10, langRestrict, country } = options;
  const params = new URLSearchParams({
    q: query,
    maxResults: String(maxResults),
    printType: 'books',
    ...(langRestrict ? { langRestrict } : {}),
    ...(country ? { country } : {}),
  });

  const res = await fetch(`${GOOGLE_BOOKS_BASE}/volumes?${params}`);
  if (!res.ok) throw new Error(`Google Books API error: ${res.status}`);
  const data = await res.json();
  return (data.items || []).map(normalizeGoogleBook);
}

/**
 * Holt ein einzelnes Buch von Google Books via ISBN.
 */
export async function fetchGoogleBookByISBN(isbn) {
  const res = await searchGoogleBooks(`isbn:${isbn}`, { maxResults: 1 });
  return res[0] || null;
}

// ─── Zentrale Book-Lookup-Funktion ─────────────────────────────────────────────
/**
 * Sucht ein Buch mit Fallback-Kette:
 *   Book-DB → Google Books API → Lokale DB
 */
export async function findBookByISBN(isbn) {
  // 1. Aus Book-Entität (DB)
  try {
    const results = await base44.entities.Book.filter({ isbn13: isbn });
    if (results.length > 0) return results[0];
    const results10 = await base44.entities.Book.filter({ isbn10: isbn });
    if (results10.length > 0) return results10[0];
  } catch (e) { /* Entität noch nicht befüllt */ }

  // 2. Google Books API
  try {
    const googleBook = await fetchGoogleBookByISBN(isbn);
    if (googleBook) return googleBook;
  } catch (e) { /* API nicht verfügbar */ }

  // 3. Lokale Legacy-DB
  const local = localBooks.find(b => b.isbn === isbn || b.isbn === isbn);
  if (local) return normalizeLocalBook(local);

  return null;
}

// ─── Matching-Engine (migriert von BookDatabaseLogic.js) ──────────────────────
/**
 * Findet passende Bücher für ein Leserprofil.
 * Quelle: Book-Entität (wenn befüllt), sonst lokale DB.
 * Drop-in-Ersatz für getMatchingBooks() aus BookDatabaseLogic.js
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

  // Bereits gespeicherte/gelesene Bücher herausfiltern
  pool = pool.filter(b => !savedBookIds.includes(b.id));
  if (readBooks.length > 0) {
    pool = pool.filter(book => {
      const titleLower = book.title.toLowerCase();
      const authorLower = (book.authors?.[0] || book.author || '').toLowerCase();
      return !readBooks.some(rb => {
        const rbL = rb.toLowerCase();
        return titleLower.includes(rbL) || rbL.includes(titleLower) ||
               authorLower.includes(rbL) || rbL.includes(authorLower);
      });
    });
  }

  // Scoring
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
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  const topBooks = sorted.slice(0, 10).map((b, i) => ({ ...b, placement: i + 1, isContrast: false }));
  const topIds = new Set(topBooks.map(b => b.id || b.isbn13));
  const remaining = sorted.filter(b => !topIds.has(b.id || b.isbn13));

  const contrastBooks = remaining
    .filter(b => {
      const bTags = b.tags || b.categories || [];
      return !mainTopics.some(t => bTags.includes(t));
    })
    .slice(0, 3)
    .map((b, i) => ({ ...b, placement: 11 + i, isContrast: true }));

  if (contrastBooks.length < 3) {
    const contrastIds = new Set(contrastBooks.map(b => b.id || b.isbn13));
    const filler = remaining
      .filter(b => !contrastIds.has(b.id || b.isbn13))
      .slice(0, 3 - contrastBooks.length)
      .map((b, i) => ({ ...b, placement: 11 + contrastBooks.length + i, isContrast: true }));
    contrastBooks.push(...filler);
  }

  return [...topBooks, ...contrastBooks];
}

/**
 * Synchroner Fallback (für Komponenten die noch nicht async sind).
 * Nutzt ausschließlich die lokale DB – identisch mit altem getMatchingBooks().
 */
export function getMatchingBooksSync(profile) {
  const { mainTopics, secondaryTopics, style, difficulty, ageGroup, readBooks = [], savedBookIds = [] } = profile;

  let pool = localBooks.map(normalizeLocalBook).filter(b => b.age_group === ageGroup);
  pool = pool.filter(b => !savedBookIds.includes(b.id));
  if (readBooks.length > 0) {
    pool = pool.filter(book => {
      const titleLower = book.title.toLowerCase();
      const authorLower = (book.authors?.[0] || '').toLowerCase();
      return !readBooks.some(rb => {
        const rbL = rb.toLowerCase();
        return titleLower.includes(rbL) || rbL.includes(titleLower) || authorLower.includes(rbL);
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