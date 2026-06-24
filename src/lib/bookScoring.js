/**
 * bookScoring.js – Regelbasiertes Scoring, Begründungen und Lesepfad.
 *
 * Kein LLM, keine KI-Kosten. Alle Logik ist deterministisch.
 */

// ─── Score 0–100 ──────────────────────────────────────────────────────────────

/**
 * Berechnet einen Match-Score von 0–100 für ein Buch gegen ein Nutzerprofil.
 */
export function scoreBook(book, profile, ownedBookTitles = []) {
  let score = 0;

  const bookTags   = book.tags || book.categories || [];
  const bookStyle  = book.style || book.reading_style || [];
  const bookLang   = (book.language || '').toLowerCase();
  const bookDiff   = book.difficulty || 'einsteiger';
  const bookTime   = book.time_effort || book.timeEffort || 'mittel';
  const bookPages  = book.page_count || book.pageCount || null;

  // 1. Thema / Interessen (max 30)
  (profile.mainTopics || []).forEach(t => {
    if (bookTags.includes(t)) score += 20;
  });
  (profile.secondaryTopics || []).forEach(t => {
    if (bookTags.includes(t)) score += 5;
  });

  // 2. Buchsprache — strikte Priorität, konsistent mit bookService.js
  if (!profile.bookLanguage || profile.bookLanguage === 'any') {
    score += 10; // kein Filter → neutral
  } else if (bookLang === profile.bookLanguage) {
    score += 40; // starker Bonus: richtige Sprache immer vor falscher
  } else {
    score -= 40; // harte Strafe: falsche Sprache nie in Top 3 wenn korrekte Treffer da
  }

  // 3. Stil (max 15)
  (profile.style || []).forEach(s => {
    if (bookStyle.includes(s)) score += 5;
  });

  // 4. Schwierigkeitsgrad (max 15)
  const diffOrder = { einsteiger: 0, fortgeschritten: 1, erfahren: 2 };
  const profileDiff = diffOrder[profile.difficulty] ?? 0;
  const bookDiffVal = diffOrder[bookDiff] ?? 0;
  const diffDelta = Math.abs(profileDiff - bookDiffVal);
  if (diffDelta === 0) score += 15;
  else if (diffDelta === 1) score += 5;
  else score -= 5;

  // 5. Lesezeit / Umfang (max 10)
  const timeMatch = (profile.timeEffort === bookTime) ||
    (profile.timeEffort === 'kurz' && bookTime === 'kurz') ||
    (profile.timeEffort === 'lang' && bookTime === 'lang');
  if (timeMatch) score += 10;
  else if (profile.timeEffort && bookTime) score += 3;

  // 6. Seiten als Proxy für Lesezeit (Feinabstimmung ±5)
  if (bookPages) {
    if (profile.timeEffort === 'kurz' && bookPages <= 200) score += 5;
    else if (profile.timeEffort === 'mittel' && bookPages >= 150 && bookPages <= 350) score += 5;
    else if (profile.timeEffort === 'lang' && bookPages >= 300) score += 5;
    else score -= 2;
  }

  // 7. Leseziel (max 5)
  if (profile.readingGoal === 'entspannung') {
    const entertainTags = ['humor', 'romance', 'fantasy_scifi', 'abenteuer', 'thriller_krimi'];
    if (bookTags.some(t => entertainTags.includes(t))) score += 5;
  } else if (profile.readingGoal === 'wachstum') {
    const growthTags = ['persoenliche_entwicklung', 'fokus_produktivitaet', 'lernen_wissen', 'sinn_philosophie'];
    if (bookTags.some(t => growthTags.includes(t))) score += 5;
  }

  // 8. In der eigenen Bibliothek vorhanden (−10)
  if (ownedBookTitles.length > 0) {
    const titleLower = (book.title || '').toLowerCase();
    const isOwned = ownedBookTitles.some(t => {
      const tl = t.toLowerCase();
      return titleLower.includes(tl) || tl.includes(titleLower);
    });
    if (isOwned) score -= 10; // schon gelesen/besessen – weniger Priorität
  }

  // Normalisieren auf 0–100
  return Math.max(0, Math.min(100, score));
}

// ─── Begründung ───────────────────────────────────────────────────────────────

/**
 * Erzeugt eine strukturierte Begründung für ein Buch.
 * Gibt { whyFit, needsCovered, suitability, difficulty, timeEffort, language, isOwned } zurück.
 */
export function generateRichReason(book, profile, score, lang = 'de', ownedBookTitles = [], t) {
  const bookTags  = book.tags || book.categories || [];
  const bookStyle = book.style || book.reading_style || [];
  const bookLang  = (book.language || '').toLowerCase();
  const bookDiff  = book.difficulty || 'einsteiger';
  const bookTime  = book.time_effort || book.timeEffort || 'mittel';
  const bookPages = book.page_count || book.pageCount || null;

  // Warum passt dieses Buch?
  const topicMatch = (profile.mainTopics || []).find(t => bookTags.includes(t));
  const styleMatch = (profile.style || []).find(s => bookStyle.includes(s));
  const whyFit = book.isContrast
    ? tKey('reason.contrast', lang, t)
        .replace('{title}', book.title)
        .replace('{author}', book.author || (book.authors || [])[0] || '')
    : topicMatch
      ? tKey(`reason.topic.${topicMatch}`, lang, t) || book.description?.slice(0, 120) || ''
      : book.description?.slice(0, 120) || '';

  // Welchen Bedarf deckt es ab?
  const needCoveredKeys = {
    persoenliche_entwicklung: 'reason.need.growth',
    fokus_produktivitaet:     'reason.need.focus',
    stress_ruhe:              'reason.need.calm',
    beziehung_kommunikation:  'reason.need.relations',
    sinn_philosophie:         'reason.need.meaning',
    kreativitaet:             'reason.need.creativity',
    lernen_wissen:            'reason.need.knowledge',
    koerper_gesundheit:       'reason.need.health',
    fantasy_scifi:            'reason.need.escape',
    thriller_krimi:           'reason.need.thrill',
    romance:                  'reason.need.heart',
    historisch:               'reason.need.history',
    humor:                    'reason.need.joy',
    abenteuer:                'reason.need.adventure',
    freundschaft:             'reason.need.connection',
    magie:                    'reason.need.magic',
    selbstfindung:            'reason.need.identity',
    liebe:                    'reason.need.love',
  };
  const needKey = topicMatch ? (needCoveredKeys[topicMatch] || 'reason.need.general') : 'reason.need.general';
  const needsCovered = tKey(needKey, lang, t);

  // Geeignet für: Einstieg, Vertiefung, Ergänzung
  const diffOrder = { einsteiger: 0, fortgeschritten: 1, erfahren: 2 };
  const profileDiffVal = diffOrder[profile.difficulty ?? 'einsteiger'] ?? 0;
  const bookDiffVal    = diffOrder[bookDiff] ?? 0;
  let suitability;
  if (bookDiffVal === 0 && profileDiffVal === 0) suitability = tKey('reason.suit.entry', lang, t);
  else if (bookDiffVal === profileDiffVal) suitability = tKey('reason.suit.deepen', lang, t);
  else suitability = tKey('reason.suit.supplement', lang, t);

  // Schwierigkeitsgrad-Label
  const diffLabels = {
    einsteiger:      tKey('reason.diff.easy', lang, t),
    fortgeschritten: tKey('reason.diff.medium', lang, t),
    erfahren:        tKey('reason.diff.hard', lang, t),
  };
  const diffLabel = diffLabels[bookDiff] || diffLabels.einsteiger;

  // Zeitaufwand-Label
  const timeLabels = {
    kurz:  tKey('reason.time.short', lang, t),
    mittel: tKey('reason.time.medium', lang, t),
    lang:  tKey('reason.time.long', lang, t),
  };
  let timeLabel = timeLabels[bookTime] || timeLabels.mittel;
  if (bookPages) {
    const pagesLabel = tKey('reason.time.pages', lang, t).replace('{n}', bookPages);
    timeLabel = `${timeLabel} · ${pagesLabel}`;
  }

  // Sprach-Label
  const langFlags = { de: '🇩🇪', en: '🇬🇧', el: '🇬🇷', tr: '🇹🇷', fr: '🇫🇷', es: '🇪🇸', it: '🇮🇹' };
  const langNames = {
    de: 'Deutsch', en: 'English', el: 'Ελληνικά', tr: 'Türkçe', fr: 'Français', es: 'Español', it: 'Italiano'
  };
  const langFlag = langFlags[bookLang] || '📖';
  const langName = langNames[bookLang] || bookLang || '?';
  const languageLabel = `${langFlag} ${langName}`;

  // Bereits in Bibliothek?
  const titleLower = (book.title || '').toLowerCase();
  const isOwned = ownedBookTitles.length > 0 &&
    ownedBookTitles.some(ot => {
      const otl = ot.toLowerCase();
      return titleLower.includes(otl) || otl.includes(titleLower);
    });

  // Sprachwarnung (Buch nicht in gewünschter Sprache)
  const isWrongLang = profile.bookLanguage &&
    profile.bookLanguage !== 'any' &&
    bookLang &&
    bookLang !== profile.bookLanguage;

  return {
    whyFit,
    needsCovered,
    suitability,
    diffLabel,
    timeLabel,
    languageLabel,
    isOwned,
    isWrongLang,
    score,
    // Backwards-compat für BookCard (mainReason + bullets)
    mainReason: whyFit || book.description?.slice(0, 150) || '',
    bullets: [needsCovered, styleMatch ? tKey(`reason.style.${styleMatch}`, lang, t) : tKey('reason.fallback.style', lang, t), suitability],
  };
}

// Helper: t() mit Fallback falls t nicht übergeben oder Key fehlt
function tKey(key, lang, tFn) {
  if (tFn) {
    const result = tFn(key);
    if (result && result !== key) return result;
  }
  // static fallbacks für die neuen Keys
  const FALLBACKS = {
    'reason.need.growth':     { de: 'Unterstützt persönliches Wachstum', en: 'Supports personal growth', el: 'Υποστηρίζει προσωπική ανάπτυξη', tr: 'Kişisel gelişimi destekler', fr: 'Soutient la croissance personnelle', es: 'Apoya el crecimiento personal', it: 'Supporta la crescita personale' },
    'reason.need.focus':      { de: 'Hilft bei Fokus & Produktivität', en: 'Helps with focus & productivity', el: 'Βοηθά στην εστίαση & παραγωγικότητα', tr: 'Odak & verimliliğe yardımcı olur', fr: 'Aide la concentration & productivité', es: 'Ayuda con el foco & productividad', it: 'Aiuta con focus & produttività' },
    'reason.need.calm':       { de: 'Fördert innere Ruhe', en: 'Promotes inner calm', el: 'Προάγει την εσωτερική ηρεμία', tr: 'İç huzuru destekler', fr: 'Favorise la paix intérieure', es: 'Promueve la calma interior', it: 'Promuove la calma interiore' },
    'reason.need.relations':  { de: 'Stärkt Beziehungskompetenz', en: 'Strengthens relationship skills', el: 'Ενισχύει τις σχέσεις', tr: 'İlişki becerilerini güçlendirir', fr: 'Renforce les compétences relationnelles', es: 'Fortalece habilidades relacionales', it: 'Rafforza le competenze relazionali' },
    'reason.need.meaning':    { de: 'Berührt Sinnfragen', en: 'Touches on meaning', el: 'Αγγίζει ερωτήματα νοήματος', tr: 'Anlam sorularına değinir', fr: 'Aborde les questions de sens', es: 'Toca preguntas de sentido', it: 'Tocca domande di senso' },
    'reason.need.creativity': { de: 'Fördert Kreativität', en: 'Nurtures creativity', el: 'Καλλιεργεί δημιουργικότητα', tr: 'Yaratıcılığı besler', fr: 'Nourrit la créativité', es: 'Fomenta la creatividad', it: 'Nutre la creatività' },
    'reason.need.knowledge':  { de: 'Erweitert Wissen', en: 'Expands knowledge', el: 'Επεκτείνει γνώσεις', tr: 'Bilgiyi genişletir', fr: 'Élargit les connaissances', es: 'Amplía conocimientos', it: 'Amplia la conoscenza' },
    'reason.need.health':     { de: 'Unterstützt Gesundheit', en: 'Supports health', el: 'Υποστηρίζει υγεία', tr: 'Sağlığı destekler', fr: 'Soutient la santé', es: 'Apoya la salud', it: 'Supporta la salute' },
    'reason.need.escape':     { de: 'Entführt in andere Welten', en: 'Escapes to other worlds', el: 'Ταξιδεύει σε άλλους κόσμους', tr: 'Başka dünyalara kaçış', fr: 'S\'évade vers d\'autres mondes', es: 'Escapa a otros mundos', it: 'Evade in altri mondi' },
    'reason.need.thrill':     { de: 'Bietet Spannung & Nervenkitzel', en: 'Provides thrill & suspense', el: 'Προσφέρει αγωνία & συγκίνηση', tr: 'Gerilim & heyecan sunar', fr: 'Procure suspense & frissons', es: 'Ofrece emoción & suspenso', it: 'Offre emozione & suspense' },
    'reason.need.heart':      { de: 'Berührt das Herz', en: 'Touches the heart', el: 'Αγγίζει την καρδιά', tr: 'Kalbe dokunur', fr: 'Touche le cœur', es: 'Toca el corazón', it: 'Tocca il cuore' },
    'reason.need.history':    { de: 'Lässt Geschichte lebendig werden', en: 'Brings history to life', el: 'Ζωντανεύει ιστορία', tr: 'Tarihi canlandırır', fr: 'Donne vie à l\'histoire', es: 'Da vida a la historia', it: 'Dà vita alla storia' },
    'reason.need.joy':        { de: 'Bringt Freude & Leichtigkeit', en: 'Brings joy & lightness', el: 'Φέρνει χαρά & ελαφράδα', tr: 'Neşe & hafiflik getirir', fr: 'Apporte joie & légèreté', es: 'Trae alegría & ligereza', it: 'Porta gioia & leggerezza' },
    'reason.need.adventure':  { de: 'Nimmt mit auf Abenteuer', en: 'Takes on adventures', el: 'Παίρνει σε περιπέτειες', tr: 'Maceralara çıkarır', fr: 'Emmène en aventures', es: 'Lleva a aventuras', it: 'Porta in avventure' },
    'reason.need.connection': { de: 'Zeigt die Kraft von Gemeinschaft', en: 'Shows the power of connection', el: 'Δείχνει τη δύναμη της σύνδεσης', tr: 'Bağlantının gücünü gösterir', fr: 'Montre la force du lien', es: 'Muestra el poder de la conexión', it: 'Mostra il potere della connessione' },
    'reason.need.magic':      { de: 'Öffnet magische Welten', en: 'Opens magical worlds', el: 'Ανοίγει μαγικούς κόσμους', tr: 'Büyülü dünyalar açar', fr: 'Ouvre des mondes magiques', es: 'Abre mundos mágicos', it: 'Apre mondi magici' },
    'reason.need.identity':   { de: 'Hilft beim Selbst-Finden', en: 'Helps find yourself', el: 'Βοηθά στην αυτογνωσία', tr: 'Kendinizi bulmaya yardımcı olur', fr: 'Aide à se trouver', es: 'Ayuda a encontrarse', it: 'Aiuta a trovare se stessi' },
    'reason.need.love':       { de: 'Berührt mit Liebesgeschichten', en: 'Touches with love stories', el: 'Αγγίζει με ιστορίες αγάπης', tr: 'Aşk hikayeleriyle dokunur', fr: 'Touche avec des histoires d\'amour', es: 'Toca con historias de amor', it: 'Tocca con storie d\'amore' },
    'reason.need.general':    { de: 'Passt zu deinem Bedarf', en: 'Fits your needs', el: 'Ταιριάζει στις ανάγκες σου', tr: 'İhtiyaçlarına uygun', fr: 'Correspond à vos besoins', es: 'Se adapta a tus necesidades', it: 'Si adatta alle tue esigenze' },
    'reason.suit.entry':      { de: 'Geeignet als Einstieg', en: 'Suitable as entry point', el: 'Κατάλληλο ως εισαγωγή', tr: 'Giriş noktası olarak uygun', fr: 'Adapté pour débuter', es: 'Adecuado como punto de entrada', it: 'Adatto come punto di partenza' },
    'reason.suit.deepen':     { de: 'Ideal zur Vertiefung', en: 'Ideal for deepening', el: 'Ιδανικό για εμβάθυνση', tr: 'Derinleştirmek için ideal', fr: 'Idéal pour approfondir', es: 'Ideal para profundizar', it: 'Ideale per approfondire' },
    'reason.suit.supplement': { de: 'Perfekt als Ergänzung', en: 'Perfect as supplement', el: 'Τέλειο ως συμπλήρωμα', tr: 'Tamamlayıcı olarak mükemmel', fr: 'Parfait en complément', es: 'Perfecto como complemento', it: 'Perfetto come complemento' },
    'reason.diff.easy':       { de: '⭐ Leicht zugänglich', en: '⭐ Easily accessible', el: '⭐ Εύκολα προσιτό', tr: '⭐ Kolayca erişilebilir', fr: '⭐ Facilement accessible', es: '⭐ Fácilmente accesible', it: '⭐ Facilmente accessibile' },
    'reason.diff.medium':     { de: '⭐⭐ Mittel', en: '⭐⭐ Intermediate', el: '⭐⭐ Μέτριο', tr: '⭐⭐ Orta', fr: '⭐⭐ Intermédiaire', es: '⭐⭐ Intermedio', it: '⭐⭐ Intermedio' },
    'reason.diff.hard':       { de: '⭐⭐⭐ Anspruchsvoll', en: '⭐⭐⭐ Demanding', el: '⭐⭐⭐ Απαιτητικό', tr: '⭐⭐⭐ Zorlu', fr: '⭐⭐⭐ Exigeant', es: '⭐⭐⭐ Exigente', it: '⭐⭐⭐ Impegnativo' },
    'reason.time.short':      { de: '⏱ Kurze Lektüre', en: '⏱ Short read', el: '⏱ Σύντομη ανάγνωση', tr: '⏱ Kısa okuma', fr: '⏱ Lecture courte', es: '⏱ Lectura corta', it: '⏱ Lettura breve' },
    'reason.time.medium':     { de: '⏱ Mittlerer Aufwand', en: '⏱ Medium effort', el: '⏱ Μέτρια προσπάθεια', tr: '⏱ Orta çaba', fr: '⏱ Effort moyen', es: '⏱ Esfuerzo moderado', it: '⏱ Sforzo moderato' },
    'reason.time.long':       { de: '⏱ Umfangreiche Lektüre', en: '⏱ Long read', el: '⏱ Εκτεταμένη ανάγνωση', tr: '⏱ Uzun okuma', fr: '⏱ Lecture longue', es: '⏱ Lectura extensa', it: '⏱ Lettura lunga' },
    'reason.time.pages':      { de: '{n} Seiten', en: '{n} pages', el: '{n} σελίδες', tr: '{n} sayfa', fr: '{n} pages', es: '{n} páginas', it: '{n} pagine' },
  };
  const fb = FALLBACKS[key];
  if (fb) return fb[lang] || fb['de'] || key;
  return key;
}

// ─── Lesepfad ─────────────────────────────────────────────────────────────────

/**
 * Baut aus den vorhandenen Ergebnissen einen einfachen 5-Phasen-Lesepfad.
 * Rein regelbasiert, kein LLM.
 *
 * Phasen: entry → basics → deepen → apply → horizon
 */
export function buildReadingPath(mainBooks, horizonBooks, profile, lang = 'de') {
  if (!mainBooks || mainBooks.length === 0) return null;

  const diffOrder = { einsteiger: 0, fortgeschritten: 1, erfahren: 2 };

  // Bücher nach Schwierigkeit aufsteigend sortieren
  const sorted = [...mainBooks].sort((a, b) =>
    (diffOrder[a.difficulty || 'einsteiger'] || 0) - (diffOrder[b.difficulty || 'einsteiger'] || 0)
  );

  const easy   = sorted.filter(b => (b.difficulty || 'einsteiger') === 'einsteiger');
  const medium = sorted.filter(b => b.difficulty === 'fortgeschritten');
  const hard   = sorted.filter(b => b.difficulty === 'erfahren');

  // Phasen befüllen – max 2 Bücher pro Phase, keine Duplikate
  const used = new Set();
  function pick(pool, max = 2) {
    const result = [];
    for (const b of pool) {
      const key = b.id || b.isbn13 || b.title;
      if (!used.has(key) && result.length < max) {
        used.add(key);
        result.push(b);
      }
    }
    return result;
  }

  const phases = [
    { key: 'path.entry',   books: pick(easy.length > 0 ? easy : sorted, 2) },
    { key: 'path.basics',  books: pick(easy.length > 1 ? easy : sorted, 2) },
    { key: 'path.deepen',  books: pick(medium.length > 0 ? medium : sorted, 2) },
    { key: 'path.apply',   books: pick(hard.length > 0 ? hard : sorted, 2) },
    { key: 'path.horizon', books: pick(horizonBooks || [], 2) },
  ].filter(p => p.books.length > 0);

  return phases;
}