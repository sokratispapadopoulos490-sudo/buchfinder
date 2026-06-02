/**
 * bookTypes.js – Normalisiertes BookResult-Schema für Book Compass.
 *
 * Vereinheitlicht Daten aus: Google Books, Open Library, lokaler DB
 * und zukünftigen Providern (Ianos GR, Kitapyurdu TR, etc.)
 *
 * BookResult-Felder:
 *   id            – interne ID (isbn13-basiert oder zufällig)
 *   source        – 'google_books' | 'open_library' | 'local' | 'manual'
 *   sourceId      – ID beim ursprünglichen Provider (z.B. Google volumeId)
 *   isbn10        – ISBN-10 (falls vorhanden)
 *   isbn13        – ISBN-13 (bevorzugt)
 *   title         – Titel
 *   authors       – string[] – Autorenliste
 *   description   – Buchbeschreibung (in der Sprache des Originaleintrags)
 *   thumbnail     – Cover-URL (möglichst https + hohe Auflösung)
 *   language      – ISO 639-1 Buchsprache (de, en, el, tr, fr, es, it, ...)
 *   publishedDate – YYYY oder YYYY-MM-DD
 *   categories    – string[] Genres/Kategorien
 *   pageCount     – Seitenzahl (integer)
 *   format        – 'book' | 'ebook' | 'audiobook' | null
 *   providerLinks – ProviderLink[] – Kauflinks pro Region/Provider
 *   raw           – Originaldaten des Providers (für Debugging)
 *
 * ProviderLink-Felder:
 *   providerId    – 'amazon_de' | 'thalia' | 'ianos_gr' | 'kitapyurdu' | ...
 *   providerName  – Lesebarer Name 'Amazon.de', 'Thalia', ...
 *   region        – ISO 3166-1 alpha-2 ('DE', 'GR', 'TR', 'FR', 'ES', 'IT', 'global')
 *   type          – 'discovery' | 'new' | 'used' | 'marketplace' | 'ebook' | 'audiobook'
 *   url           – Affiliate- oder Such-URL
 *   currency      – 'EUR' | 'TRY' | 'GBP' | 'USD' | null
 *   price         – number | null (falls bekannt)
 *   availability  – 'available' | 'unknown' | 'out_of_stock'
 *   priority      – integer, niedrig = zuerst anzeigen
 */

/**
 * Erstellt ein leeres BookResult-Skeleton für manuelle Befüllung.
 */
export function createEmptyBookResult(overrides = {}) {
  return {
    id: null,
    source: 'manual',
    sourceId: null,
    isbn10: null,
    isbn13: null,
    title: '',
    authors: [],
    description: '',
    thumbnail: null,
    language: 'de',
    publishedDate: null,
    categories: [],
    pageCount: null,
    format: 'book',
    providerLinks: [],
    raw: null,
    // Legacy-Kompatibilität (für BookCard, LiveBookCard, SavedBook-Mapping)
    cover_front_url: null,
    author: '',
    isbn: null,
    coverUrl: null,
    coverColor: 'bg-amber-100',
    cover_color: 'bg-amber-100',
    affiliate_providers: {},
    ...overrides,
  };
}

/**
 * Erstellt ein ProviderLink-Objekt.
 */
export function createProviderLink({
  providerId,
  providerName,
  region,
  type = 'new',
  url,
  currency = null,
  price = null,
  availability = 'unknown',
  priority = 10,
} = {}) {
  return { providerId, providerName, region, type, url, currency, price, availability, priority };
}

/**
 * Gibt einen kanonischen Schlüssel für Deduplication zurück.
 */
export function bookResultKey(book) {
  return book.isbn13 || book.isbn10 || book.title;
}

/**
 * Mappt ein bestehendes normalisiertes Buch (aus bookService) auf das BookResult-Schema.
 * Rückwärtskompatibel — bestehende Felder bleiben erhalten.
 */
export function toBookResult(book) {
  return {
    id: book.id || null,
    source: book.source || 'local',
    sourceId: book.source_id || null,
    isbn10: book.isbn10 || null,
    isbn13: book.isbn13 || null,
    title: book.title || '',
    authors: book.authors || (book.author ? [book.author] : []),
    description: book.description || '',
    thumbnail: book.cover_front_url || book.coverUrl || null,
    language: book.language || 'de',
    publishedDate: book.published_date || null,
    categories: book.categories || book.tags || [],
    pageCount: book.page_count || book.pageCount || null,
    format: 'book',
    providerLinks: book.providerLinks || [],
    raw: book.raw || null,
    // Legacy-Felder erhalten
    cover_front_url: book.cover_front_url || book.coverUrl || null,
    cover_color: book.cover_color || book.coverColor || 'bg-amber-100',
    author: book.author || (book.authors || [])[0] || '',
    isbn: book.isbn13 || book.isbn10 || book.isbn || null,
    coverUrl: book.cover_front_url || book.coverUrl || null,
    coverColor: book.cover_color || book.coverColor || 'bg-amber-100',
    affiliate_providers: book.affiliate_providers || {},
    preview_link: book.preview_link || null,
    rating: book.rating || null,
    ratings_count: book.ratings_count || null,
    publisher: book.publisher || null,
    age_group: book.age_group || book.ageGroup || 'erwachsene',
    ageGroup: book.age_group || book.ageGroup || 'erwachsene',
    difficulty: book.difficulty || 'einsteiger',
    reading_style: book.reading_style || book.style || [],
    style: book.style || book.reading_style || [],
    tags: book.tags || book.categories || [],
    is_active: book.is_active !== false,
    source_id: book.source_id || null,
  };
}