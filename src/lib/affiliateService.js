/**
 * affiliateService.js
 *
 * Production-ready dynamic affiliate link generation.
 * No hardcoded URLs – all links are built at runtime from ISBN + country + provider.
 *
 * Architecture is Geniuslink-ready: swap PROVIDER_CONFIG entries with
 * Geniuslink destination URLs when keys are available.
 */

import { base44 } from '@/api/base44Client';

// ─── Provider Registry ─────────────────────────────────────────────────────────
// Each provider has a `build(isbn, title, author)` factory.
// `logo` is an emoji fallback; swap with real logo URLs when available.
// `label` is the localized display name.

const PROVIDERS = {
  amazon_de: {
    label: 'Amazon.de',
    logo: '🛒',
    build: (isbn, title) =>
      isbn
        ? `https://www.amazon.de/dp/${isbn}`
        : `https://www.amazon.de/s?k=${encodeURIComponent(title)}`,
  },
  thalia: {
    label: 'Thalia',
    logo: '📚',
    build: (isbn, title) =>
      isbn
        ? `https://www.thalia.de/suche?sq=${isbn}`
        : `https://www.thalia.de/suche?sq=${encodeURIComponent(title)}`,
  },
  hugendubel: {
    label: 'Hugendubel',
    logo: '📖',
    build: (isbn, title) =>
      `https://www.hugendubel.de/de/taschenbuch/${isbn || encodeURIComponent(title)}.html`,
  },
  amazon_uk: {
    label: 'Amazon.co.uk',
    logo: '🛒',
    build: (isbn, title) =>
      isbn
        ? `https://www.amazon.co.uk/dp/${isbn}`
        : `https://www.amazon.co.uk/s?k=${encodeURIComponent(title)}`,
  },
  bookshop_uk: {
    label: 'Bookshop.org',
    logo: '🏪',
    build: (isbn, title) =>
      isbn
        ? `https://uk.bookshop.org/books/${isbn}`
        : `https://uk.bookshop.org/books?keywords=${encodeURIComponent(title)}`,
  },
  amazon_us: {
    label: 'Amazon.com',
    logo: '🛒',
    build: (isbn, title) =>
      isbn
        ? `https://www.amazon.com/dp/${isbn}`
        : `https://www.amazon.com/s?k=${encodeURIComponent(title)}`,
  },
  barnes_noble: {
    label: 'Barnes & Noble',
    logo: '🏛️',
    build: (isbn, title) =>
      isbn
        ? `https://www.barnesandnoble.com/s/${isbn}`
        : `https://www.barnesandnoble.com/s/${encodeURIComponent(title)}`,
  },
  ianos: {
    label: 'Ianos',
    logo: '📗',
    build: (isbn, title) =>
      `https://www.ianos.gr/search?q=${isbn || encodeURIComponent(title)}`,
  },
  public_gr: {
    label: 'Public.gr',
    logo: '🏬',
    build: (isbn, title) =>
      `https://www.public.gr/search?q=${isbn || encodeURIComponent(title)}`,
  },
  amazon_at: {
    label: 'Amazon.de (AT)',
    logo: '🛒',
    build: (isbn, title) =>
      isbn
        ? `https://www.amazon.de/dp/${isbn}`
        : `https://www.amazon.de/s?k=${encodeURIComponent(title)}`,
  },
  thalia_at: {
    label: 'Thalia.at',
    logo: '📚',
    build: (isbn, title) =>
      isbn
        ? `https://www.thalia.at/suche?sq=${isbn}`
        : `https://www.thalia.at/suche?sq=${encodeURIComponent(title)}`,
  },
  exlibris: {
    label: 'Ex Libris',
    logo: '📘',
    build: (isbn, title) =>
      isbn
        ? `https://www.exlibris.ch/de/buecher-shop/deutschsprachige-buecher/p/${isbn}`
        : `https://www.exlibris.ch/de/suche/?keyword=${encodeURIComponent(title)}`,
  },
  orellfuessli: {
    label: 'Orell Füssli',
    logo: '🦅',
    build: (isbn, title) =>
      `https://www.orellfuessli.ch/suche?searchterm=${isbn || encodeURIComponent(title)}`,
  },
};

// ─── Country → Provider Priority List ─────────────────────────────────────────
const COUNTRY_PROVIDERS = {
  DE: ['amazon_de', 'thalia', 'hugendubel'],
  AT: ['amazon_at', 'thalia_at', 'amazon_de'],
  CH: ['exlibris', 'orellfuessli', 'amazon_de'],
  GB: ['amazon_uk', 'bookshop_uk'],
  US: ['amazon_us', 'barnes_noble'],
  GR: ['ianos', 'public_gr'],
  DEFAULT: ['amazon_de', 'thalia'],
};

// ─── Country Detection ─────────────────────────────────────────────────────────

// Timezone → country mapping (covers main cases)
const TIMEZONE_COUNTRY = {
  'Europe/Berlin': 'DE',
  'Europe/Vienna': 'AT',
  'Europe/Zurich': 'CH',
  'Europe/London': 'GB',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'Europe/Athens': 'GR',
};

// Locale → country mapping
const LOCALE_COUNTRY = {
  'de-DE': 'DE',
  'de-AT': 'AT',
  'de-CH': 'CH',
  'de': 'DE',
  'en-GB': 'GB',
  'en-US': 'US',
  'en': 'US',
  'el-GR': 'GR',
  'el': 'GR',
};

let _detectedCountry = null;

export function detectCountry() {
  if (_detectedCountry) return _detectedCountry;

  // 1. Timezone (most reliable in browser)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TIMEZONE_COUNTRY[tz]) {
      _detectedCountry = TIMEZONE_COUNTRY[tz];
      return _detectedCountry;
    }
  } catch {}

  // 2. Browser locale
  try {
    const locale = navigator.language || navigator.languages?.[0] || '';
    if (LOCALE_COUNTRY[locale]) {
      _detectedCountry = LOCALE_COUNTRY[locale];
      return _detectedCountry;
    }
    // Try just the language part
    const lang = locale.split('-')[0];
    if (LOCALE_COUNTRY[lang]) {
      _detectedCountry = LOCALE_COUNTRY[lang];
      return _detectedCountry;
    }
  } catch {}

  // 3. Default fallback
  _detectedCountry = 'DE';
  return _detectedCountry;
}

// ─── Link Generation ───────────────────────────────────────────────────────────

/**
 * Returns an ordered array of provider objects for a given book + country.
 * Each entry: { providerKey, label, logo, url }
 *
 * Geniuslink-ready: when geniuslinkTag is set in future,
 * wrap url: `https://go.geni.us/to?url=${encodeURIComponent(url)}&tag=${geniuslinkTag}`
 */
export function getProviderLinks(book, countryCode) {
  const country = countryCode || detectCountry();
  const providerKeys = COUNTRY_PROVIDERS[country] || COUNTRY_PROVIDERS.DEFAULT;
  const isbn = book.isbn13 || book.isbn10 || book.isbn || null;
  const title = book.title || '';
  const author = book.author || (book.authors || [])[0] || '';

  return providerKeys
    .filter(key => PROVIDERS[key])
    .map(key => {
      const p = PROVIDERS[key];
      return {
        providerKey: key,
        label: p.label,
        logo: p.logo,
        url: p.build(isbn, title, author),
      };
    });
}

// ─── Click Tracking ────────────────────────────────────────────────────────────

export async function trackAffiliateClick({ book, providerKey, url, country, userId }) {
  try {
    await base44.entities.AffiliateClick.create({
      user_id: userId || null,
      isbn13: book.isbn13 || book.isbn || null,
      book_title: book.title,
      provider: providerKey,
      country: country || detectCountry(),
      url,
    });
  } catch {
    // Non-blocking – never break UX for analytics
  }
}

// ─── Analytics Queries ─────────────────────────────────────────────────────────

export async function getClickAnalytics() {
  const clicks = await base44.entities.AffiliateClick.list('-created_date', 500);

  // Most clicked books
  const bookCounts = {};
  clicks.forEach(c => {
    if (!c.isbn13) return;
    const key = c.isbn13;
    if (!bookCounts[key]) bookCounts[key] = { isbn13: key, title: c.book_title, count: 0 };
    bookCounts[key].count++;
  });

  // Most clicked providers
  const providerCounts = {};
  clicks.forEach(c => {
    if (!c.provider) return;
    if (!providerCounts[c.provider]) providerCounts[c.provider] = { provider: c.provider, label: PROVIDERS[c.provider]?.label || c.provider, count: 0 };
    providerCounts[c.provider].count++;
  });

  // Country stats
  const countryCounts = {};
  clicks.forEach(c => {
    if (!c.country) return;
    if (!countryCounts[c.country]) countryCounts[c.country] = { country: c.country, count: 0 };
    countryCounts[c.country].count++;
  });

  return {
    topBooks: Object.values(bookCounts).sort((a, b) => b.count - a.count).slice(0, 10),
    topProviders: Object.values(providerCounts).sort((a, b) => b.count - a.count),
    countryStats: Object.values(countryCounts).sort((a, b) => b.count - a.count),
    totalClicks: clicks.length,
  };
}