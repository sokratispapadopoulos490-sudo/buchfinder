/**
 * providerRegistry.js – Zentrale Provider-Konfiguration für Book Compass.
 *
 * Architektur:
 * - Jede Region hat eine geordnete Liste von Providern.
 * - Jeder Provider weiß, wie er für ein Buch einen Link baut.
 * - type: 'discovery' = nur Suche/Anzeige (kein Kauf), 'new' = Neukauf, 'used' = Gebrauchtkauf
 *
 * Regionen:
 *   global – Google Books, Open Library (Discovery)
 *   DE     – Amazon.de, Thalia, Hugendubel
 *   GR     – Ianos, Public.gr, Amazon.de (Fallback)
 *   TR     – Kitapyurdu, D&R, Amazon.de (Fallback)
 *   FR     – Amazon.fr, Fnac, Cultura
 *   ES     – Amazon.es, Casa del Libro, FNAC.es
 *   IT     – Amazon.it, IBS, Feltrinelli
 *   AT     – Amazon.de, Thalia.at
 *   CH     – Ex Libris, Orell Füssli
 *   UK     – Amazon.co.uk, Bookshop.org
 *   US     – Amazon.com, Bookshop.org US
 *
 * Provider-IDs entsprechen affiliateConfig.js AFFILIATE_IDS-Keys.
 */

import { AFFILIATE_IDS, getAmazonTag, wrapWithGeniuslink } from '@/lib/affiliateConfig';

// ─── Provider-Definitionen ────────────────────────────────────────────────────

/**
 * Baut eine URL für einen Provider. isbn kann isbn13 oder isbn10 sein.
 * fallbackQuery ist Titel + Autor für Bücher ohne ISBN.
 */
function buildUrl(template, isbn, fallbackQuery, affiliateKey) {
  const tag = affiliateKey ? (AFFILIATE_IDS[affiliateKey] ? `?tag=${AFFILIATE_IDS[affiliateKey]}` : '') : '';
  const url = isbn ? template.isbn(isbn) + tag : template.search(fallbackQuery);
  return wrapWithGeniuslink(url);
}

const PROVIDER_DEFS = {
  // ── Discovery (kostenlos, kein Kauf) ──────────────────────────────────────
  google_books: {
    providerId: 'google_books',
    providerName: 'Google Books',
    type: 'discovery',
    region: 'global',
    currency: null,
    priority: 1,
    buildLink: (book) => ({
      url: book.preview_link || `https://books.google.com/books?q=${encodeURIComponent(book.title)}`,
      availability: book.preview_link ? 'available' : 'unknown',
    }),
  },

  // ── Deutschland ───────────────────────────────────────────────────────────
  amazon_de: {
    providerId: 'amazon_de',
    providerName: 'Amazon.de',
    type: 'new',
    region: 'DE',
    currency: 'EUR',
    priority: 2,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const tag = AFFILIATE_IDS.amazon_de ? `?tag=${AFFILIATE_IDS.amazon_de}` : '';
      const url = isbn
        ? `https://www.amazon.de/dp/${isbn}${tag}`
        : `https://www.amazon.de/s?k=${encodeURIComponent(book.title)}`;
      return { url: wrapWithGeniuslink(url), availability: 'unknown' };
    },
  },
  thalia: {
    providerId: 'thalia',
    providerName: 'Thalia',
    type: 'new',
    region: 'DE',
    currency: 'EUR',
    priority: 3,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const url = isbn
        ? `https://www.thalia.de/suche?sq=${isbn}`
        : `https://www.thalia.de/suche?sq=${encodeURIComponent(book.title)}`;
      return { url, availability: 'unknown' };
    },
  },
  hugendubel: {
    providerId: 'hugendubel',
    providerName: 'Hugendubel',
    type: 'new',
    region: 'DE',
    currency: 'EUR',
    priority: 4,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const url = isbn
        ? `https://www.hugendubel.de/de/buch/${isbn}.html`
        : `https://www.hugendubel.de/de/suche?q=${encodeURIComponent(book.title)}`;
      return { url, availability: 'unknown' };
    },
  },

  // ── Österreich ────────────────────────────────────────────────────────────
  thalia_at: {
    providerId: 'thalia_at',
    providerName: 'Thalia.at',
    type: 'new',
    region: 'AT',
    currency: 'EUR',
    priority: 3,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const url = isbn
        ? `https://www.thalia.at/suche?sq=${isbn}`
        : `https://www.thalia.at/suche?sq=${encodeURIComponent(book.title)}`;
      return { url, availability: 'unknown' };
    },
  },

  // ── Schweiz ───────────────────────────────────────────────────────────────
  exlibris: {
    providerId: 'exlibris',
    providerName: 'Ex Libris',
    type: 'new',
    region: 'CH',
    currency: 'CHF',
    priority: 2,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const url = isbn
        ? `https://www.exlibris.ch/de/buecher-shop/deutschsprachige-buecher/p/${isbn}`
        : `https://www.exlibris.ch/de/suche?query=${encodeURIComponent(book.title)}`;
      return { url, availability: 'unknown' };
    },
  },
  orellfuessli: {
    providerId: 'orellfuessli',
    providerName: 'Orell Füssli',
    type: 'new',
    region: 'CH',
    currency: 'CHF',
    priority: 3,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const url = isbn
        ? `https://www.orellfuessli.ch/suche?searchterm=${isbn}`
        : `https://www.orellfuessli.ch/suche?searchterm=${encodeURIComponent(book.title)}`;
      return { url, availability: 'unknown' };
    },
  },

  // ── Griechenland ─────────────────────────────────────────────────────────
  ianos_gr: {
    providerId: 'ianos_gr',
    providerName: 'Ianos',
    type: 'new',
    region: 'GR',
    currency: 'EUR',
    priority: 2,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      // Ianos hat kein direktes ISBN-Deeplink — ISBN als Suchbegriff
      const q = isbn || book.title;
      return { url: `https://www.ianos.gr/search/?text=${encodeURIComponent(q)}`, availability: 'unknown' };
    },
  },
  public_gr: {
    providerId: 'public_gr',
    providerName: 'Public.gr',
    type: 'new',
    region: 'GR',
    currency: 'EUR',
    priority: 3,
    buildLink: (book) => {
      const q = book.isbn13 || book.title;
      return { url: `https://www.public.gr/search/?q=${encodeURIComponent(q)}`, availability: 'unknown' };
    },
  },
  amazon_de_gr: {
    // Amazon.de als Fallback für GR (internationale Bestellung)
    providerId: 'amazon_de',
    providerName: 'Amazon.de',
    type: 'new',
    region: 'GR',
    currency: 'EUR',
    priority: 5,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const tag = AFFILIATE_IDS.amazon_de ? `?tag=${AFFILIATE_IDS.amazon_de}` : '';
      const url = isbn
        ? `https://www.amazon.de/dp/${isbn}${tag}`
        : `https://www.amazon.de/s?k=${encodeURIComponent(book.title)}`;
      return { url: wrapWithGeniuslink(url), availability: 'unknown' };
    },
  },

  // ── Türkei ────────────────────────────────────────────────────────────────
  kitapyurdu: {
    providerId: 'kitapyurdu',
    providerName: 'Kitapyurdu',
    type: 'new',
    region: 'TR',
    currency: 'TRY',
    priority: 2,
    buildLink: (book) => {
      const q = book.isbn13 || book.title;
      return { url: `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${encodeURIComponent(q)}`, availability: 'unknown' };
    },
  },
  dr_tr: {
    providerId: 'dr_tr',
    providerName: 'D&R',
    type: 'new',
    region: 'TR',
    currency: 'TRY',
    priority: 3,
    buildLink: (book) => {
      const q = book.isbn13 || book.title;
      return { url: `https://www.dr.com.tr/search?q=${encodeURIComponent(q)}`, availability: 'unknown' };
    },
  },

  // ── Frankreich ────────────────────────────────────────────────────────────
  amazon_fr: {
    providerId: 'amazon_fr',
    providerName: 'Amazon.fr',
    type: 'new',
    region: 'FR',
    currency: 'EUR',
    priority: 2,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const url = isbn
        ? `https://www.amazon.fr/dp/${isbn}`
        : `https://www.amazon.fr/s?k=${encodeURIComponent(book.title)}`;
      return { url: wrapWithGeniuslink(url), availability: 'unknown' };
    },
  },
  fnac_fr: {
    providerId: 'fnac_fr',
    providerName: 'Fnac',
    type: 'new',
    region: 'FR',
    currency: 'EUR',
    priority: 3,
    buildLink: (book) => {
      const q = book.isbn13 || book.title;
      return { url: `https://www.fnac.com/SearchResult/ResultList.aspx?SCat=0%211&Search=${encodeURIComponent(q)}`, availability: 'unknown' };
    },
  },

  // ── Spanien ───────────────────────────────────────────────────────────────
  amazon_es: {
    providerId: 'amazon_es',
    providerName: 'Amazon.es',
    type: 'new',
    region: 'ES',
    currency: 'EUR',
    priority: 2,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const url = isbn
        ? `https://www.amazon.es/dp/${isbn}`
        : `https://www.amazon.es/s?k=${encodeURIComponent(book.title)}`;
      return { url: wrapWithGeniuslink(url), availability: 'unknown' };
    },
  },
  casa_del_libro: {
    providerId: 'casa_del_libro',
    providerName: 'Casa del Libro',
    type: 'new',
    region: 'ES',
    currency: 'EUR',
    priority: 3,
    buildLink: (book) => {
      const q = book.isbn13 || book.title;
      return { url: `https://www.casadellibro.com/busqueda-generica?q=${encodeURIComponent(q)}`, availability: 'unknown' };
    },
  },

  // ── Italien ───────────────────────────────────────────────────────────────
  amazon_it: {
    providerId: 'amazon_it',
    providerName: 'Amazon.it',
    type: 'new',
    region: 'IT',
    currency: 'EUR',
    priority: 2,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const url = isbn
        ? `https://www.amazon.it/dp/${isbn}`
        : `https://www.amazon.it/s?k=${encodeURIComponent(book.title)}`;
      return { url: wrapWithGeniuslink(url), availability: 'unknown' };
    },
  },
  ibs_it: {
    providerId: 'ibs_it',
    providerName: 'IBS',
    type: 'new',
    region: 'IT',
    currency: 'EUR',
    priority: 3,
    buildLink: (book) => {
      const q = book.isbn13 || book.title;
      return { url: `https://www.ibs.it/search/?ts=as&query=${encodeURIComponent(q)}`, availability: 'unknown' };
    },
  },

  // ── UK ────────────────────────────────────────────────────────────────────
  amazon_uk: {
    providerId: 'amazon_uk',
    providerName: 'Amazon.co.uk',
    type: 'new',
    region: 'UK',
    currency: 'GBP',
    priority: 2,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const tag = AFFILIATE_IDS.amazon_uk ? `?tag=${AFFILIATE_IDS.amazon_uk}` : '';
      const url = isbn
        ? `https://www.amazon.co.uk/dp/${isbn}${tag}`
        : `https://www.amazon.co.uk/s?k=${encodeURIComponent(book.title)}`;
      return { url: wrapWithGeniuslink(url), availability: 'unknown' };
    },
  },
  bookshop_uk: {
    providerId: 'bookshop_uk',
    providerName: 'Bookshop.org',
    type: 'new',
    region: 'UK',
    currency: 'GBP',
    priority: 3,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const url = isbn
        ? `https://uk.bookshop.org/books/${isbn}`
        : `https://uk.bookshop.org/books?keywords=${encodeURIComponent(book.title)}`;
      return { url, availability: 'unknown' };
    },
  },

  // ── USA ───────────────────────────────────────────────────────────────────
  amazon_us: {
    providerId: 'amazon_us',
    providerName: 'Amazon.com',
    type: 'new',
    region: 'US',
    currency: 'USD',
    priority: 2,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const tag = AFFILIATE_IDS.amazon_us ? `?tag=${AFFILIATE_IDS.amazon_us}` : '';
      const url = isbn
        ? `https://www.amazon.com/dp/${isbn}${tag}`
        : `https://www.amazon.com/s?k=${encodeURIComponent(book.title)}`;
      return { url: wrapWithGeniuslink(url), availability: 'unknown' };
    },
  },
  bookshop_us: {
    providerId: 'bookshop_us',
    providerName: 'Bookshop.org',
    type: 'new',
    region: 'US',
    currency: 'USD',
    priority: 3,
    buildLink: (book) => {
      const isbn = book.isbn13 || book.isbn10;
      const url = isbn
        ? `https://bookshop.org/books/${isbn}`
        : `https://bookshop.org/books?keywords=${encodeURIComponent(book.title)}`;
      return { url, availability: 'unknown' };
    },
  },
};

// ─── Regionen-Registry ─────────────────────────────────────────────────────────

/**
 * REGION_REGISTRY: Mappt Region-Code → geordnete Provider-Liste
 * Reihenfolge = Anzeigereihenfolge (priority aufsteigend)
 */
export const REGION_REGISTRY = {
  global: ['google_books'],
  DE:     ['amazon_de', 'thalia', 'hugendubel'],
  AT:     ['amazon_de', 'thalia_at'],
  CH:     ['exlibris', 'orellfuessli'],
  GR:     ['ianos_gr', 'public_gr', 'amazon_de_gr'],
  TR:     ['kitapyurdu', 'dr_tr'],
  FR:     ['amazon_fr', 'fnac_fr'],
  ES:     ['amazon_es', 'casa_del_libro'],
  IT:     ['amazon_it', 'ibs_it'],
  UK:     ['amazon_uk', 'bookshop_uk'],
  US:     ['amazon_us', 'bookshop_us'],
};

/**
 * Alle unterstützten Shopping-Regionen als Optionen für UI.
 */
export const SHOPPING_REGIONS = [
  { code: 'DE', flag: '🇩🇪', labelKey: 'region.de' },
  { code: 'AT', flag: '🇦🇹', labelKey: 'region.at' },
  { code: 'CH', flag: '🇨🇭', labelKey: 'region.ch' },
  { code: 'GR', flag: '🇬🇷', labelKey: 'region.gr' },
  { code: 'TR', flag: '🇹🇷', labelKey: 'region.tr' },
  { code: 'FR', flag: '🇫🇷', labelKey: 'region.fr' },
  { code: 'ES', flag: '🇪🇸', labelKey: 'region.es' },
  { code: 'IT', flag: '🇮🇹', labelKey: 'region.it' },
  { code: 'UK', flag: '🇬🇧', labelKey: 'region.uk' },
  { code: 'US', flag: '🇺🇸', labelKey: 'region.us' },
];

/**
 * Buchsprachen für den bookLanguage-Filter in der Suche.
 */
export const BOOK_LANGUAGES = [
  { code: '',   flag: '🌐', labelKey: 'bookLang.all' },
  { code: 'de', flag: '🇩🇪', labelKey: 'bookLang.de' },
  { code: 'en', flag: '🇬🇧', labelKey: 'bookLang.en' },
  { code: 'el', flag: '🇬🇷', labelKey: 'bookLang.el' },
  { code: 'tr', flag: '🇹🇷', labelKey: 'bookLang.tr' },
  { code: 'fr', flag: '🇫🇷', labelKey: 'bookLang.fr' },
  { code: 'es', flag: '🇪🇸', labelKey: 'bookLang.es' },
  { code: 'it', flag: '🇮🇹', labelKey: 'bookLang.it' },
];

// ─── Provider-Router ──────────────────────────────────────────────────────────

/**
 * Gibt generierte ProviderLinks für ein Buch in einer gegebenen Region zurück.
 * Benutzt gespeicherte Links aus book.affiliate_providers wenn vorhanden.
 *
 * @param {object} book - normalisiertes BookResult
 * @param {string} region - z.B. 'DE', 'GR', 'TR'
 * @returns {ProviderLink[]}
 */
export function getProviderLinks(book, region = 'DE') {
  const providerIds = REGION_REGISTRY[region] || REGION_REGISTRY.DE;

  // Gespeicherte Links aus DB bevorzugen
  const stored = book.affiliate_providers?.[region];
  if (stored && Object.keys(stored).length > 0) {
    return Object.entries(stored).map(([pid, url], i) => ({
      providerId: pid,
      providerName: PROVIDER_DEFS[pid]?.providerName || pid,
      region,
      type: PROVIDER_DEFS[pid]?.type || 'new',
      url,
      currency: PROVIDER_DEFS[pid]?.currency || null,
      price: null,
      availability: 'unknown',
      priority: i + 2,
    }));
  }

  // Dynamisch generieren
  return providerIds
    .map(pid => {
      const def = PROVIDER_DEFS[pid];
      if (!def) return null;
      const { url, availability } = def.buildLink(book);
      return {
        providerId: def.providerId,
        providerName: def.providerName,
        region: def.region,
        type: def.type,
        url,
        currency: def.currency,
        price: null,
        availability,
        priority: def.priority,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Gibt alle ProviderLinks für ein Buch in mehreren Regionen zurück (für Multi-Region-Anzeige).
 */
export function getAllProviderLinks(book, regions = ['DE']) {
  return regions.flatMap(r => getProviderLinks(book, r));
}