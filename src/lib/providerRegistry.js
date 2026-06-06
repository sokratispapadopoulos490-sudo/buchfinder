/**
 * providerRegistry.js – Zentrale Provider-Konfiguration für Book Compass.
 *
 * Provider-Typen:
 *   discovery   – Leseprobe/Metadaten (kein Kauf)
 *   new         – Neubuch-Kauf
 *   used        – Gebrauchtkauf
 *   marketplace – Marktplatz (neu + gebraucht gemischt)
 *   ebook       – E-Book-Kauf
 *   audiobook   – Hörbuch (Architektur-ready, noch nicht voll implementiert)
 *
 * Regionen: global, DE, AT, CH, GR, TR, FR, ES, IT, UK, US
 *
 * Griechische Priorität (GR):
 *   1. Politeia  (neu)
 *   2. Protoporia (neu)
 *   3. Ianos     (neu)
 *   4. Evripidis (neu)
 *   5. Metabook  (gebraucht)
 *   6. Skroutz   (marketplace – Preisvergleich)
 *   9. Amazon.de (Fallback, international)
 *
 * Used-Provider-Übersicht:
 *   DE:  Medimops, Booklooker, ZVAB (via AbeBooks)
 *   GR:  Metabook
 *   UK:  World of Books
 *   US:  ThriftBooks, AbeBooks
 *   global: AbeBooks
 */

import { AFFILIATE_IDS, wrapWithGeniuslink } from '@/lib/affiliateConfig';

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────

function q(book) {
  return encodeURIComponent(`${book.title} ${(book.authors || [])[0] || book.author || ''}`.trim());
}

function isbn(book) {
  return book.isbn13 || book.isbn10 || null;
}

function isbnOrTitle(book) {
  return isbn(book) ? encodeURIComponent(isbn(book)) : q(book);
}

function amazonUrl(domain, book, affiliateKey) {
  const id = isbn(book);
  const tag = AFFILIATE_IDS[affiliateKey] ? `?tag=${AFFILIATE_IDS[affiliateKey]}` : '';
  const url = id
    ? `https://www.amazon.${domain}/dp/${id}${tag}`
    : `https://www.amazon.${domain}/s?k=${q(book)}`;
  return wrapWithGeniuslink(url);
}

// ─── Provider-Definitionen ────────────────────────────────────────────────────

const PROVIDER_DEFS = {

  // ── Discovery ─────────────────────────────────────────────────────────────
  google_books: {
    providerId: 'google_books', providerName: 'Google Books',
    type: 'discovery', region: 'global', currency: null, priority: 1,
    buildLink: (book) => ({
      url: book.preview_link || `https://books.google.com/books?q=${q(book)}`,
      availability: book.preview_link ? 'available' : 'unknown',
    }),
  },

  // ── Deutschland – Neu ─────────────────────────────────────────────────────
  amazon_de: {
    providerId: 'amazon_de', providerName: 'Amazon.de',
    type: 'new', region: 'DE', currency: 'EUR', priority: 2,
    buildLink: (book) => ({ url: amazonUrl('de', book, 'amazon_de'), availability: 'unknown' }),
  },
  thalia: {
    providerId: 'thalia', providerName: 'Thalia',
    type: 'new', region: 'DE', currency: 'EUR', priority: 3,
    buildLink: (book) => {
      const id = isbn(book);
      return { url: id ? `https://www.thalia.de/suche?sq=${id}` : `https://www.thalia.de/suche?sq=${q(book)}`, availability: 'unknown' };
    },
  },
  hugendubel: {
    providerId: 'hugendubel', providerName: 'Hugendubel',
    type: 'new', region: 'DE', currency: 'EUR', priority: 4,
    buildLink: (book) => {
      const id = isbn(book);
      return { url: id ? `https://www.hugendubel.de/de/buch/${id}.html` : `https://www.hugendubel.de/de/suche?q=${q(book)}`, availability: 'unknown' };
    },
  },

  // ── Deutschland – Used ────────────────────────────────────────────────────
  medimops: {
    providerId: 'medimops', providerName: 'Medimops',
    type: 'used', region: 'DE', currency: 'EUR', priority: 5,
    buildLink: (book) => {
      const id = isbn(book);
      // Medimops nutzt ISBN als direkten Such-Slug
      const url = id
        ? `https://www.medimops.de/produkte/buecher/?search=${id}`
        : `https://www.medimops.de/produkte/buecher/?search=${q(book)}`;
      return { url, availability: 'unknown' };
    },
  },
  booklooker: {
    providerId: 'booklooker', providerName: 'Booklooker',
    type: 'used', region: 'DE', currency: 'EUR', priority: 6,
    buildLink: (book) => {
      const id = isbn(book);
      const url = id
        ? `https://www.booklooker.de/Buecher/Angebote/isbn=${id}`
        : `https://www.booklooker.de/Buecher/Angebote/titel=${q(book)}`;
      return { url, availability: 'unknown' };
    },
  },
  zvab: {
    providerId: 'zvab', providerName: 'ZVAB',
    type: 'used', region: 'DE', currency: 'EUR', priority: 7,
    buildLink: (book) => {
      const id = isbn(book);
      const url = id
        ? `https://www.zvab.com/servlet/SearchResults?isbn=${id}`
        : `https://www.zvab.com/servlet/SearchResults?title=${q(book)}`;
      return { url, availability: 'unknown' };
    },
  },

  // ── Österreich ────────────────────────────────────────────────────────────
  thalia_at: {
    providerId: 'thalia_at', providerName: 'Thalia.at',
    type: 'new', region: 'AT', currency: 'EUR', priority: 2,
    buildLink: (book) => {
      const id = isbn(book);
      return { url: id ? `https://www.thalia.at/suche?sq=${id}` : `https://www.thalia.at/suche?sq=${q(book)}`, availability: 'unknown' };
    },
  },

  // ── Schweiz ───────────────────────────────────────────────────────────────
  exlibris: {
    providerId: 'exlibris', providerName: 'Ex Libris',
    type: 'new', region: 'CH', currency: 'CHF', priority: 2,
    buildLink: (book) => {
      const id = isbn(book);
      return { url: id ? `https://www.exlibris.ch/de/buecher-shop/deutschsprachige-buecher/p/${id}` : `https://www.exlibris.ch/de/suche?query=${q(book)}`, availability: 'unknown' };
    },
  },
  orellfuessli: {
    providerId: 'orellfuessli', providerName: 'Orell Füssli',
    type: 'new', region: 'CH', currency: 'CHF', priority: 3,
    buildLink: (book) => {
      const id = isbn(book);
      return { url: id ? `https://www.orellfuessli.ch/suche?searchterm=${id}` : `https://www.orellfuessli.ch/suche?searchterm=${q(book)}`, availability: 'unknown' };
    },
  },

  // ── Griechenland – Neu (korrekte Priorität) ───────────────────────────────
  politeia_gr: {
    providerId: 'politeia_gr', providerName: 'Πολιτεία',
    type: 'new', region: 'GR', currency: 'EUR', priority: 1,
    buildLink: (book) => {
      // Politeia: ISBN-Suche als GET-Parameter
      const id = isbn(book);
      const url = id
        ? `https://www.politeianet.gr/index.php?option=com_virtuemart&view=category&search=${id}`
        : `https://www.politeianet.gr/index.php?option=com_virtuemart&view=category&search=${q(book)}`;
      return { url, availability: 'unknown' };
    },
  },
  protoporia_gr: {
    providerId: 'protoporia_gr', providerName: 'Πρωτοπορία',
    type: 'new', region: 'GR', currency: 'EUR', priority: 2,
    buildLink: (book) => {
      const id = isbn(book);
      const url = id
        ? `https://www.protoporia.gr/advanced_search_result.php?isbn=${id}`
        : `https://www.protoporia.gr/advanced_search_result.php?keywords=${q(book)}`;
      return { url, availability: 'unknown' };
    },
  },
  ianos_gr: {
    providerId: 'ianos_gr', providerName: 'Ιανός',
    type: 'new', region: 'GR', currency: 'EUR', priority: 3,
    buildLink: (book) => {
      const id = isbn(book);
      return { url: `https://www.ianos.gr/search/?text=${encodeURIComponent(id || book.title)}`, availability: 'unknown' };
    },
  },
  evripidis_gr: {
    providerId: 'evripidis_gr', providerName: 'Ευριπίδης',
    type: 'new', region: 'GR', currency: 'EUR', priority: 4,
    buildLink: (book) => {
      const id = isbn(book);
      const url = id
        ? `https://www.evripidis.gr/gr/books/search/?q=${id}`
        : `https://www.evripidis.gr/gr/books/search/?q=${q(book)}`;
      return { url, availability: 'unknown' };
    },
  },
  skroutz_gr: {
    providerId: 'skroutz_gr', providerName: 'Skroutz',
    type: 'marketplace', region: 'GR', currency: 'EUR', priority: 6,
    buildLink: (book) => {
      const id = isbn(book);
      const url = id
        ? `https://www.skroutz.gr/search?keyphrase=${id}`
        : `https://www.skroutz.gr/search?keyphrase=${q(book)}`;
      return { url, availability: 'unknown' };
    },
  },

  // ── Griechenland – Used ───────────────────────────────────────────────────
  metabook_gr: {
    providerId: 'metabook_gr', providerName: 'Metabook',
    type: 'used', region: 'GR', currency: 'EUR', priority: 5,
    buildLink: (book) => {
      // Metabook.gr – griechischer Gebrauchtbuchmarktplatz
      const id = isbn(book);
      const url = id
        ? `https://www.metabook.gr/search?isbn=${id}`
        : `https://www.metabook.gr/search?q=${q(book)}`;
      return { url, availability: 'unknown' };
    },
  },

  // ── Griechenland – Fallback (international) ───────────────────────────────
  amazon_de_gr: {
    providerId: 'amazon_de', providerName: 'Amazon.de',
    type: 'new', region: 'GR', currency: 'EUR', priority: 9,
    buildLink: (book) => ({ url: amazonUrl('de', book, 'amazon_de'), availability: 'unknown' }),
  },

  // ── Türkei ────────────────────────────────────────────────────────────────
  kitapyurdu: {
    providerId: 'kitapyurdu', providerName: 'Kitapyurdu',
    type: 'new', region: 'TR', currency: 'TRY', priority: 2,
    buildLink: (book) => ({ url: `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${isbnOrTitle(book)}`, availability: 'unknown' }),
  },
  dr_tr: {
    providerId: 'dr_tr', providerName: 'D&R',
    type: 'new', region: 'TR', currency: 'TRY', priority: 3,
    buildLink: (book) => ({ url: `https://www.dr.com.tr/search?q=${isbnOrTitle(book)}`, availability: 'unknown' }),
  },

  // ── Frankreich ────────────────────────────────────────────────────────────
  amazon_fr: {
    providerId: 'amazon_fr', providerName: 'Amazon.fr',
    type: 'new', region: 'FR', currency: 'EUR', priority: 2,
    buildLink: (book) => ({ url: amazonUrl('fr', book, 'amazon_fr'), availability: 'unknown' }),
  },
  fnac_fr: {
    providerId: 'fnac_fr', providerName: 'Fnac',
    type: 'new', region: 'FR', currency: 'EUR', priority: 3,
    buildLink: (book) => ({ url: `https://www.fnac.com/SearchResult/ResultList.aspx?SCat=0%211&Search=${isbnOrTitle(book)}`, availability: 'unknown' }),
  },

  // ── Spanien ───────────────────────────────────────────────────────────────
  amazon_es: {
    providerId: 'amazon_es', providerName: 'Amazon.es',
    type: 'new', region: 'ES', currency: 'EUR', priority: 2,
    buildLink: (book) => ({ url: amazonUrl('es', book, 'amazon_es'), availability: 'unknown' }),
  },
  casa_del_libro: {
    providerId: 'casa_del_libro', providerName: 'Casa del Libro',
    type: 'new', region: 'ES', currency: 'EUR', priority: 3,
    buildLink: (book) => ({ url: `https://www.casadellibro.com/busqueda-generica?q=${isbnOrTitle(book)}`, availability: 'unknown' }),
  },

  // ── Italien ───────────────────────────────────────────────────────────────
  amazon_it: {
    providerId: 'amazon_it', providerName: 'Amazon.it',
    type: 'new', region: 'IT', currency: 'EUR', priority: 2,
    buildLink: (book) => ({ url: amazonUrl('it', book, 'amazon_it'), availability: 'unknown' }),
  },
  ibs_it: {
    providerId: 'ibs_it', providerName: 'IBS',
    type: 'new', region: 'IT', currency: 'EUR', priority: 3,
    buildLink: (book) => ({ url: `https://www.ibs.it/search/?ts=as&query=${isbnOrTitle(book)}`, availability: 'unknown' }),
  },

  // ── UK – Neu + Used ───────────────────────────────────────────────────────
  amazon_uk: {
    providerId: 'amazon_uk', providerName: 'Amazon.co.uk',
    type: 'new', region: 'UK', currency: 'GBP', priority: 2,
    buildLink: (book) => ({ url: amazonUrl('co.uk', book, 'amazon_uk'), availability: 'unknown' }),
  },
  bookshop_uk: {
    providerId: 'bookshop_uk', providerName: 'Bookshop.org',
    type: 'new', region: 'UK', currency: 'GBP', priority: 3,
    buildLink: (book) => {
      const id = isbn(book);
      return { url: id ? `https://uk.bookshop.org/books/${id}` : `https://uk.bookshop.org/books?keywords=${q(book)}`, availability: 'unknown' };
    },
  },
  world_of_books: {
    providerId: 'world_of_books', providerName: 'World of Books',
    type: 'used', region: 'UK', currency: 'GBP', priority: 5,
    buildLink: (book) => {
      const id = isbn(book);
      const url = id
        ? `https://www.worldofbooks.com/en-gb/category/all?search=${id}`
        : `https://www.worldofbooks.com/en-gb/category/all?search=${q(book)}`;
      return { url, availability: 'unknown' };
    },
  },

  // ── USA – Neu + Used ──────────────────────────────────────────────────────
  amazon_us: {
    providerId: 'amazon_us', providerName: 'Amazon.com',
    type: 'new', region: 'US', currency: 'USD', priority: 2,
    buildLink: (book) => ({ url: amazonUrl('com', book, 'amazon_us'), availability: 'unknown' }),
  },
  bookshop_us: {
    providerId: 'bookshop_us', providerName: 'Bookshop.org',
    type: 'new', region: 'US', currency: 'USD', priority: 3,
    buildLink: (book) => {
      const id = isbn(book);
      return { url: id ? `https://bookshop.org/books/${id}` : `https://bookshop.org/books?keywords=${q(book)}`, availability: 'unknown' };
    },
  },
  thriftbooks: {
    providerId: 'thriftbooks', providerName: 'ThriftBooks',
    type: 'used', region: 'US', currency: 'USD', priority: 5,
    buildLink: (book) => {
      const id = isbn(book);
      const url = id
        ? `https://www.thriftbooks.com/browse/?b.search=${id}`
        : `https://www.thriftbooks.com/browse/?b.search=${q(book)}`;
      return { url, availability: 'unknown' };
    },
  },

  // ── Global Used / Marketplace ─────────────────────────────────────────────
  abebooks: {
    providerId: 'abebooks', providerName: 'AbeBooks',
    type: 'used', region: 'global', currency: null, priority: 8,
    buildLink: (book) => {
      const id = isbn(book);
      const url = id
        ? `https://www.abebooks.com/servlet/SearchResults?isbn=${id}`
        : `https://www.abebooks.com/servlet/SearchResults?title=${q(book)}`;
      return { url, availability: 'unknown' };
    },
  },

  // ── Audiobook (Architektur-ready) ─────────────────────────────────────────
  // Keine ASIN/Spotify-ID – nur sichere Suchseiten-URLs, availability immer 'unknown'
  audible_de: {
    providerId: 'audible_de', providerName: 'Audible',
    type: 'audiobook', region: 'DE', currency: 'EUR', priority: 10,
    buildLink: (book) => ({
      url: `https://www.audible.de/search?keywords=${q(book)}`,
      availability: 'unknown',
    }),
  },
  audible_uk: {
    providerId: 'audible_uk', providerName: 'Audible UK',
    type: 'audiobook', region: 'UK', currency: 'GBP', priority: 10,
    buildLink: (book) => ({
      url: `https://www.audible.co.uk/search?keywords=${q(book)}`,
      availability: 'unknown',
    }),
  },
  audible_us: {
    providerId: 'audible_us', providerName: 'Audible',
    type: 'audiobook', region: 'US', currency: 'USD', priority: 10,
    buildLink: (book) => ({
      url: `https://www.audible.com/search?keywords=${q(book)}`,
      availability: 'unknown',
    }),
  },
  storytel_de: {
    providerId: 'storytel_de', providerName: 'Storytel',
    type: 'audiobook', region: 'DE', currency: 'EUR', priority: 11,
    buildLink: (book) => ({
      url: `https://www.storytel.com/de/search#query=${encodeURIComponent(book.title)}`,
      availability: 'unknown',
    }),
  },
  spotify_audiobooks: {
    providerId: 'spotify_audiobooks', providerName: 'Spotify',
    type: 'audiobook', region: 'global', currency: null, priority: 12,
    buildLink: (book) => ({
      // Spotify: Suche auf der Webseite – kein Deeplink ohne Spotify-ID
      url: `https://open.spotify.com/search/${encodeURIComponent(book.title)}`,
      availability: 'unknown',
    }),
  },
};

// ─── Regionen-Registry ─────────────────────────────────────────────────────────

/**
 * REGION_REGISTRY: Mappt Region-Code → geordnete Provider-ID-Liste
 * Sortierung = Anzeigereihenfolge (aufsteigend nach priority)
 * Used-Provider sind bewusst in der Liste – werden bei Bedarf per Typ gefiltert.
 */
export const REGION_REGISTRY = {
  global: ['google_books', 'abebooks', 'spotify_audiobooks'],
  DE:     ['amazon_de', 'thalia', 'hugendubel', 'medimops', 'booklooker', 'zvab', 'audible_de', 'storytel_de'],
  AT:     ['amazon_de', 'thalia_at', 'medimops', 'audible_de'],
  CH:     ['exlibris', 'orellfuessli'],
  // GR: griechische Provider zuerst, Amazon.de ganz hinten
  GR:     ['politeia_gr', 'protoporia_gr', 'ianos_gr', 'evripidis_gr', 'metabook_gr', 'skroutz_gr', 'amazon_de_gr'],
  TR:     ['kitapyurdu', 'dr_tr'],
  FR:     ['amazon_fr', 'fnac_fr'],
  ES:     ['amazon_es', 'casa_del_libro'],
  IT:     ['amazon_it', 'ibs_it'],
  UK:     ['amazon_uk', 'bookshop_uk', 'world_of_books', 'audible_uk'],
  US:     ['amazon_us', 'bookshop_us', 'thriftbooks', 'audible_us'],
};

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

// ─── Provider-Router API ──────────────────────────────────────────────────────

/**
 * Gibt ProviderLinks für ein Buch in einer Region zurück.
 *
 * @param {object} book         – normalisiertes BookResult
 * @param {string} region       – 'DE', 'GR', 'TR', ...
 * @param {object} options
 * @param {string[]} options.types   – Filter nach type, z.B. ['new'] oder ['new','used']
 * @param {number}  options.limit    – Maximale Anzahl (default: alle)
 * @param {boolean} options.includeUsed – Shortcut: true = ['new','used','marketplace']
 * @returns {ProviderLink[]}
 */
export function getProviderLinksForBook(book, region = 'DE', options = {}) {
  const { types, limit, includeUsed = false } = options;

  const providerIds = REGION_REGISTRY[region] || REGION_REGISTRY.DE;

  // Gespeicherte Links aus DB bevorzugen
  const stored = book.affiliate_providers?.[region];
  let links;

  if (stored && Object.keys(stored).length > 0) {
    links = Object.entries(stored).map(([pid, url], i) => ({
      providerId: pid,
      providerName: PROVIDER_DEFS[pid]?.providerName || pid,
      region,
      type: PROVIDER_DEFS[pid]?.type || 'new',
      url,
      currency: PROVIDER_DEFS[pid]?.currency || null,
      price: null,
      availability: 'unknown',
      priority: PROVIDER_DEFS[pid]?.priority || (i + 2),
    }));
  } else {
    links = providerIds
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
      .filter(Boolean);
  }

  // Typ-Filter
  let allowedTypes = types;
  if (!allowedTypes) {
    allowedTypes = includeUsed
      ? ['new', 'used', 'marketplace']
      : ['new', 'marketplace'];
  }
  links = links.filter(l => allowedTypes.includes(l.type));

  // Nach priority sortieren
  links.sort((a, b) => a.priority - b.priority);

  // Limit
  if (limit && limit > 0) links = links.slice(0, limit);

  return links;
}

// Legacy-Alias für Rückwärtskompatibilität
export function getProviderLinks(book, region = 'DE') {
  return getProviderLinksForBook(book, region, { includeUsed: false });
}

export function getAllProviderLinks(book, regions = ['DE']) {
  return regions.flatMap(r => getProviderLinksForBook(book, r));
}