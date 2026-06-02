/**
 * bookQueryBuilder.js – Sauberer Query-Builder für Google Books API.
 *
 * Trennt klar zwischen:
 *   - searchTerm: was der Nutzer eingibt (Titel, Autor, ISBN, Thema)
 *   - bookLanguage: langRestrict-Parameter (Buchsprache)
 *   - shoppingRegion: beeinflusst NICHT die Suche, nur die Ergebnis-Links
 *
 * Unterstützte Query-Typen:
 *   - Freitext: "Harry Potter"
 *   - Autor: "intitle:..." / "inauthor:..."
 *   - ISBN: "isbn:9783..."
 *   - Thema: "subject:..."
 *
 * bookLanguage vs. shoppingRegion:
 *   - bookLanguage='el' → sucht griechische Bücher (langRestrict=el)
 *   - shoppingRegion='GR' → zeigt Ianos/Public.gr Links → UNABHÄNGIG von bookLanguage
 *   - Beispiel: UI auf Deutsch, griechische Bücher suchen, aber bei Amazon.de bestellen
 *     → uiLanguage='de', bookLanguage='el', shoppingRegion='DE' → alles gültig
 */

/**
 * Erkennt ob ein String eine ISBN ist (10 oder 13 Ziffern, ggf. mit Trennzeichen).
 */
export function isISBN(str) {
  return /^[\d-]{10,17}$/.test(str.replace(/\s/g, ''));
}

/**
 * Normalisiert eine ISBN: entfernt alle Nicht-Ziffern.
 */
export function cleanISBN(str) {
  return str.replace(/[^0-9X]/gi, '');
}

/**
 * Baut eine Google Books API Query-String + Parameter-Objekt.
 *
 * @param {string} input - Nutzereingabe (Titel, Autor, ISBN, Thema)
 * @param {object} opts
 * @param {string} opts.bookLanguage - ISO 639-1, z.B. 'de', 'el', 'tr' oder '' für alle
 * @param {string} opts.shoppingRegion - z.B. 'DE', 'GR' – beeinflusst NUR Links, nicht Suche
 * @param {number} opts.maxResults - Standard: 20, max: 40
 * @param {number} opts.startIndex - Für Pagination
 * @param {string} opts.orderBy - 'relevance' | 'newest'
 * @returns {{ query: string, params: object, isISBNSearch: boolean }}
 */
export function buildGoogleBooksQuery(input, opts = {}) {
  const {
    bookLanguage = '',
    maxResults = 20,
    startIndex = 0,
    orderBy = 'relevance',
  } = opts;

  const trimmed = input.trim();

  // ISBN-Erkennung
  if (isISBN(trimmed)) {
    const isbn = cleanISBN(trimmed);
    return {
      query: `isbn:${isbn}`,
      params: {
        maxResults: 1,
        startIndex: 0,
        orderBy: 'relevance',
        printType: 'books',
        // Kein langRestrict bei ISBN – das Buch hat eine feste ISBN unabhängig von Sprache
      },
      isISBNSearch: true,
    };
  }

  // Subject-Queries (z.B. 'subject:history') direkt durchreichen
  const isSubjectQuery = trimmed.startsWith('subject:') || trimmed.startsWith('inauthor:') || trimmed.startsWith('intitle:');

  const params = {
    maxResults: String(Math.min(maxResults, 40)),
    startIndex: String(startIndex),
    orderBy,
    printType: 'books',
  };

  // bookLanguage als langRestrict
  if (bookLanguage) params.langRestrict = bookLanguage;

  return {
    query: trimmed,
    params,
    isISBNSearch: false,
    isSubjectQuery,
  };
}

/**
 * Sprachspezifische Query-Verbesserungen für Google Books.
 *
 * Manche Sprachen funktionieren mit zusätzlichen Hints besser.
 * Beispiel: griechische Bücher brauchen oft kein langRestrict,
 * wenn der Titel griechisch ist – aber es schadet nicht.
 */
export const BOOK_LANGUAGE_HINTS = {
  // Keine Hints nötig für westeuropäische Sprachen
  de: null,
  en: null,
  fr: null,
  es: null,
  it: null,
  // Griechisch: langRestrict=el funktioniert gut für moderne Bücher
  // Ältere oder akademische griechische Bücher sind evtl. nicht indexiert
  el: { note: 'langRestrict=el. Bei leeren Ergebnissen: ohne Sprachfilter suchen.' },
  // Türkisch: langRestrict=tr funktioniert, aber türkische Bücher sind weniger indexiert
  tr: { note: 'langRestrict=tr. Viele türkische Verlage sind nicht in Google Books.' },
};

/**
 * Gibt einen Hinweis-Text zurück, wenn bookLanguage weniger Ergebnisse liefert.
 * Für zukünftige UI-Warnungen.
 */
export function getLowResultsHint(bookLanguage) {
  if (['el', 'tr'].includes(bookLanguage)) {
    return BOOK_LANGUAGE_HINTS[bookLanguage]?.note || null;
  }
  return null;
}