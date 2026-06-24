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
 * Lokalisierte Suchbegriffe pro Thema und Sprache.
 * Wird in bookService.js für Google Books Queries verwendet.
 * Englische Begriffe allein reichen nicht — langRestrict ist bei Google Books ein weicher Filter.
 */
export const LOCALIZED_TOPIC_QUERIES = {
  persoenliche_entwicklung: {
    de: ['persönliche entwicklung', 'selbstverbesserung', 'mentaltraining', 'wachstum'],
    en: ['personal development', 'self improvement', 'personal growth'],
    it: ['crescita personale', 'sviluppo personale', 'psicologia', 'benessere', 'consapevolezza'],
    fr: ['développement personnel', 'psychologie', 'bien-être', 'croissance personnelle'],
    es: ['desarrollo personal', 'psicología', 'bienestar', 'crecimiento personal'],
    tr: ['kişisel gelişim', 'psikoloji', 'farkındalık', 'öz gelişim'],
    el: ['προσωπική ανάπτυξη', 'ψυχολογία', 'αυτοβελτίωση', 'ευεξία'],
  },
  fokus_produktivitaet: {
    de: ['produktivität', 'zeitmanagement', 'fokus', 'gewohnheiten'],
    en: ['productivity', 'time management', 'focus', 'habits'],
    it: ['produttività', 'gestione del tempo', 'abitudini', 'concentrazione'],
    fr: ['productivité', 'gestion du temps', 'habitudes', 'concentration'],
    es: ['productividad', 'gestión del tiempo', 'hábitos', 'concentración'],
    tr: ['verimlilik', 'zaman yönetimi', 'alışkanlıklar', 'odaklanma'],
    el: ['παραγωγικότητα', 'διαχείριση χρόνου', 'συνήθειες', 'εστίαση'],
  },
  stress_ruhe: {
    de: ['stressbewältigung', 'achtsamkeit', 'entspannung', 'innere ruhe'],
    en: ['stress relief', 'mindfulness', 'calm', 'relaxation'],
    it: ['calma', 'serenità', 'mindfulness', 'gestione dello stress', 'rilassamento'],
    fr: ['calme', 'sérénité', 'pleine conscience', 'gestion du stress'],
    es: ['calma', 'serenidad', 'mindfulness', 'manejo del estrés'],
    tr: ['sakinlik', 'huzur', 'stres yönetimi', 'farkındalık meditasyon'],
    el: ['ηρεμία', 'γαλήνη', 'διαχείριση άγχους', 'mindfulness'],
  },
  business_finanzen: {
    de: ['business', 'finanzen', 'unternehmertum', 'investieren'],
    en: ['business', 'finance', 'entrepreneurship', 'investing'],
    it: ['business', 'finanza personale', 'imprenditoria', 'investimenti'],
    fr: ['business', 'finance personnelle', 'entrepreneuriat', 'investissement'],
    es: ['negocios', 'finanzas personales', 'emprendimiento', 'inversión'],
    tr: ['iş dünyası', 'kişisel finans', 'girişimcilik', 'yatırım'],
    el: ['επιχειρήσεις', 'προσωπικά οικονομικά', 'επιχειρηματικότητα'],
  },
  lernen_wissen: {
    de: ['lernen', 'wissenschaft', 'wissen', 'bildung'],
    en: ['learning', 'science', 'knowledge', 'education'],
    it: ['apprendimento', 'scienza', 'conoscenza', 'educazione'],
    fr: ['apprentissage', 'science', 'connaissance', 'éducation'],
    es: ['aprendizaje', 'ciencia', 'conocimiento', 'educación'],
    tr: ['öğrenme', 'bilim', 'bilgi', 'eğitim'],
    el: ['μάθηση', 'επιστήμη', 'γνώση', 'εκπαίδευση'],
  },
  gesellschaft: {
    de: ['gesellschaft', 'politik', 'soziologie'],
    en: ['society', 'politics', 'sociology'],
    it: ['società', 'politica', 'sociologia'],
    fr: ['société', 'politique', 'sociologie'],
    es: ['sociedad', 'política', 'sociología'],
    tr: ['toplum', 'siyaset', 'sosyoloji'],
    el: ['κοινωνία', 'πολιτική', 'κοινωνιολογία'],
  },
  selbstfindung: {
    de: ['selbstfindung', 'identität', 'sinnsuche'],
    en: ['self discovery', 'identity', 'meaning'],
    it: ['scoperta di sé', 'identità', 'ricerca del senso'],
    fr: ['découverte de soi', 'identité', 'quête de sens'],
    es: ['autodescubrimiento', 'identidad', 'búsqueda de sentido'],
    tr: ['kendini keşfetme', 'kimlik', 'anlam arayışı'],
    el: ['αυτογνωσία', 'ταυτότητα', 'αναζήτηση νοήματος'],
  },
  abenteuer: {
    de: ['abenteuer', 'spannung'],
    en: ['adventure', 'thriller'],
    it: ['avventura', 'thriller'],
    fr: ['aventure', 'thriller'],
    es: ['aventura', 'thriller'],
    tr: ['macera', 'gerilim'],
    el: ['περιπέτεια', 'θρίλερ'],
  },
  humor: {
    de: ['humor', 'komödie', 'satire'],
    en: ['humor', 'comedy', 'satire'],
    it: ['umorismo', 'commedia', 'satira'],
    fr: ['humour', 'comédie', 'satire'],
    es: ['humor', 'comedia', 'sátira'],
    tr: ['mizah', 'komedi', 'hiciv'],
    el: ['χιούμορ', 'κωμωδία', 'σάτιρα'],
  },
  romance: {
    de: ['liebesroman', 'romance'],
    en: ['romance', 'love story'],
    it: ['romanzo d\'amore', 'romance'],
    fr: ['roman d\'amour', 'romance'],
    es: ['novela romántica', 'romance'],
    tr: ['aşk romanı', 'romantik'],
    el: ['ερωτικό μυθιστόρημα', 'ρομάντζο'],
  },
  fantasy_scifi: {
    de: ['fantasy', 'science fiction'],
    en: ['fantasy', 'science fiction'],
    it: ['fantasy', 'fantascienza'],
    fr: ['fantasy', 'science-fiction'],
    es: ['fantasía', 'ciencia ficción'],
    tr: ['fantezi', 'bilim kurgu'],
    el: ['φανταστική λογοτεχνία', 'επιστημονική φαντασία'],
  },
  geschichte: {
    de: ['geschichte', 'historisch'],
    en: ['history', 'historical'],
    it: ['storia', 'storico'],
    fr: ['histoire', 'historique'],
    es: ['historia', 'histórico'],
    tr: ['tarih', 'tarihi'],
    el: ['ιστορία', 'ιστορικό'],
  },
};

/**
 * Gibt lokalisierte Suchbegriffe für ein Thema und eine Sprache zurück.
 * Fallback: englische Begriffe.
 */
export function getLocalizedTopicQueries(topic, lang) {
  const topicMap = LOCALIZED_TOPIC_QUERIES[topic];
  if (!topicMap) return [topic]; // raw fallback
  return topicMap[lang] || topicMap['en'] || [topic];
}

/**
 * Baut mehrere lokalisierte Query-Strings für mehrstufige Google-Books-Suche.
 * Gibt ein Array von Query-Strings zurück (priorisiert: sprachspezifisch zuerst).
 */
export function buildLocalizedQueries(mainTopics, lang) {
  const queries = new Set();
  for (const topic of (mainTopics || [])) {
    const terms = getLocalizedTopicQueries(topic, lang);
    terms.slice(0, 2).forEach(t => queries.add(t)); // max 2 Begriffe pro Thema
  }
  if (queries.size === 0) {
    // Allgemeine Fallbacks je Sprache
    const genericFallbacks = {
      it: 'narrativa italiana bestseller',
      fr: 'romans français populaires',
      es: 'novelas españolas populares',
      tr: 'türkçe roman bestseller',
      el: 'ελληνικά βιβλία δημοφιλή',
      de: 'deutsche Bücher Bestseller',
      en: 'popular books bestseller',
    };
    queries.add(genericFallbacks[lang] || genericFallbacks['en']);
  }
  return [...queries];
}

export const BOOK_LANGUAGE_HINTS = {
  de: null, en: null, fr: null, es: null, it: null,
  el: { note: 'langRestrict=el. Bei leeren Ergebnissen: ohne Sprachfilter suchen.' },
  tr: { note: 'langRestrict=tr. Viele türkische Verlage sind nicht in Google Books.' },
};

export function getLowResultsHint(bookLanguage) {
  if (['el', 'tr'].includes(bookLanguage)) {
    return BOOK_LANGUAGE_HINTS[bookLanguage]?.note || null;
  }
  return null;
}