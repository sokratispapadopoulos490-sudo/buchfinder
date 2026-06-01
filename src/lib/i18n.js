/**
 * i18n – Statisches Übersetzungs-Dictionary für Book Compass.
 *
 * Sprachen: de, en, el, tr, fr, es, it
 * Fallback: de → key (kein Crash bei fehlendem Key)
 *
 * Verwendung:
 *   import { t } from '@/lib/i18n';
 *   t('nav.community', 'de')   // → "Community"
 *
 * Oder via useLanguage():
 *   const { t } = useLanguage();
 *   t('nav.community')         // → automatisch aktuelle Sprache
 */

const dict = {
  // ── Navigation ────────────────────────────────────────────────────────────
  'nav.community': {
    de: 'Community', en: 'Community', el: 'Κοινότητα',
    tr: 'Topluluk', fr: 'Communauté', es: 'Comunidad', it: 'Comunità',
  },
  'nav.compass': {
    de: 'Kompass', en: 'Compass', el: 'Πυξίδα',
    tr: 'Pusula', fr: 'Boussole', es: 'Brújula', it: 'Bussola',
  },
  'nav.discover': {
    de: 'Entdecken', en: 'Discover', el: 'Ανακάλυψη',
    tr: 'Keşfet', fr: 'Découvrir', es: 'Descubrir', it: 'Scopri',
  },
  'nav.account': {
    de: 'Account', en: 'Account', el: 'Λογαριασμός',
    tr: 'Hesap', fr: 'Compte', es: 'Cuenta', it: 'Account',
  },

  // ── Gemeinsame Buttons ────────────────────────────────────────────────────
  'btn.back': {
    de: 'Zurück', en: 'Back', el: 'Πίσω',
    tr: 'Geri', fr: 'Retour', es: 'Volver', it: 'Indietro',
  },
  'btn.backToStart': {
    de: 'Zum Start', en: 'To Start', el: 'Στην αρχή',
    tr: 'Başa dön', fr: 'Au début', es: 'Al inicio', it: 'All\'inizio',
  },
  'btn.backToProfile': {
    de: 'Zurück zum Profil', en: 'Back to Profile', el: 'Πίσω στο προφίλ',
    tr: 'Profile dön', fr: 'Retour au profil', es: 'Volver al perfil', it: 'Torna al profilo',
  },
  'btn.backToCompass': {
    de: 'Zurück zum Kompass', en: 'Back to Compass', el: 'Πίσω στην πυξίδα',
    tr: 'Pusulaya dön', fr: 'Retour à la boussole', es: 'Volver a la brújula', it: 'Torna alla bussola',
  },
  'btn.start': {
    de: 'Entdeckungsreise starten', en: 'Start Discovery', el: 'Ξεκινήστε',
    tr: 'Keşfe başla', fr: 'Commencer', es: 'Comenzar', it: 'Inizia',
  },
  'btn.startSearch': {
    de: 'Neue Suche starten', en: 'Start New Search', el: 'Νέα αναζήτηση',
    tr: 'Yeni arama', fr: 'Nouvelle recherche', es: 'Nueva búsqueda', it: 'Nuova ricerca',
  },
  'btn.myRecommendations': {
    de: 'Meine Buchempfehlungen', en: 'My Book Recommendations', el: 'Οι προτάσεις μου',
    tr: 'Kitap önerilerim', fr: 'Mes recommandations', es: 'Mis recomendaciones', it: 'I miei consigli',
  },
  'btn.newAnalysis': {
    de: 'Neue Analyse starten', en: 'New Analysis', el: 'Νέα ανάλυση',
    tr: 'Yeni analiz', fr: 'Nouvelle analyse', es: 'Nuevo análisis', it: 'Nuova analisi',
  },
  'btn.upgradePremium': {
    de: 'Auf Premium upgraden', en: 'Upgrade to Premium', el: 'Αναβάθμιση Premium',
    tr: 'Premium\'a geç', fr: 'Passer Premium', es: 'Mejorar a Premium', it: 'Passa a Premium',
  },
  'btn.login': {
    de: 'Anmelden', en: 'Login', el: 'Σύνδεση',
    tr: 'Giriş yap', fr: 'Connexion', es: 'Iniciar sesión', it: 'Accedi',
  },
  'btn.loadMore': {
    de: 'Mehr laden', en: 'Load more', el: 'Φόρτωση περισσότερων',
    tr: 'Daha fazla', fr: 'Charger plus', es: 'Cargar más', it: 'Carica altri',
  },

  // ── Status / Loading ──────────────────────────────────────────────────────
  'status.loading': {
    de: 'Wird geladen...', en: 'Loading...', el: 'Φόρτωση...',
    tr: 'Yükleniyor...', fr: 'Chargement...', es: 'Cargando...', it: 'Caricamento...',
  },
  'status.allLoaded': {
    de: 'Alle Ergebnisse geladen', en: 'All results loaded', el: 'Όλα τα αποτελέσματα',
    tr: 'Tüm sonuçlar yüklendi', fr: 'Tous les résultats', es: 'Todos los resultados', it: 'Tutti i risultati',
  },

  // ── Home / BookSearch – Welcome ───────────────────────────────────────────
  'home.title': {
    de: 'Book Compass', en: 'Book Compass', el: 'Book Compass',
    tr: 'Book Compass', fr: 'Book Compass', es: 'Book Compass', it: 'Book Compass',
  },
  'home.subtitle': {
    de: 'Dein Wegweiser zum perfekten Buch', en: 'Your guide to the perfect book',
    el: 'Ο οδηγός σου για το τέλειο βιβλίο', tr: 'Mükemmel kitabın rehberi',
    fr: 'Votre guide vers le livre parfait', es: 'Tu guía al libro perfecto', it: 'La tua guida al libro perfetto',
  },
  'home.description': {
    de: 'Wenige einfache Fragen führen dich zu Büchern, die genau zu dir passen – für jedes Alter.',
    en: 'A few simple questions lead you to books that perfectly match you – for all ages.',
    el: 'Λίγες ερωτήσεις σε οδηγούν σε βιβλία που σου ταιριάζουν.',
    tr: 'Birkaç soru, sana mükemmel uyan kitaplara götürür.',
    fr: 'Quelques questions vous guident vers des livres faits pour vous.',
    es: 'Unas preguntas te llevan a libros que encajan contigo.',
    it: 'Poche domande ti portano ai libri perfetti per te.',
  },
  'home.freeStart': {
    de: 'Kostenlos starten', en: 'Start for free', el: 'Δωρεάν εκκίνηση',
    tr: 'Ücretsiz başla', fr: 'Commencer gratuitement', es: 'Empezar gratis', it: 'Inizia gratis',
  },
  'home.freeDescription': {
    de: '3 personalisierte Empfehlungen – komplett kostenlos, keine Kreditkarte nötig',
    en: '3 personalized recommendations – completely free, no credit card needed',
    el: '3 εξατομικευμένες προτάσεις – εντελώς δωρεάν',
    tr: '3 kişiselleştirilmiş öneri – tamamen ücretsiz',
    fr: '3 recommandations personnalisées – totalement gratuites',
    es: '3 recomendaciones personalizadas – completamente gratis',
    it: '3 consigli personalizzati – completamente gratis',
  },
  'home.premiumTitle': {
    de: 'Premium für 4,99€/Monat', en: 'Premium for €4.99/month', el: 'Premium για 4,99€/μήνα',
    tr: 'Aylık 4,99€ Premium', fr: 'Premium à 4,99€/mois', es: 'Premium por 4,99€/mes', it: 'Premium a 4,99€/mese',
  },
  'home.premiumDescription': {
    de: 'Unbegrenzte Empfehlungen, erweiterte Profile und regelmäßig neue Bücher',
    en: 'Unlimited recommendations, extended profiles and regularly new books',
    el: 'Απεριόριστες προτάσεις και νέα βιβλία',
    tr: 'Sınırsız öneriler ve düzenli yeni kitaplar',
    fr: 'Recommandations illimitées et nouveaux livres réguliers',
    es: 'Recomendaciones ilimitadas y libros nuevos regularmente',
    it: 'Consigli illimitati e nuovi libri regolarmente',
  },

  // ── Empfehlungen / Results ────────────────────────────────────────────────
  'results.title': {
    de: 'Deine Empfehlungen', en: 'Your Recommendations', el: 'Οι προτάσεις σου',
    tr: 'Önerileriniz', fr: 'Vos recommandations', es: 'Tus recomendaciones', it: 'I tuoi consigli',
  },
  'results.subtitle': {
    de: 'Ausgewählt nach deinen Bedürfnissen und deinem Lesestil',
    en: 'Selected based on your needs and reading style',
    el: 'Επιλεγμένα με βάση τις ανάγκες σου',
    tr: 'İhtiyaçlarına göre seçildi',
    fr: 'Sélectionnés selon vos besoins',
    es: 'Seleccionados según tus necesidades',
    it: 'Selezionati in base alle tue esigenze',
  },
  'results.analysisComplete': {
    de: 'Analyse abgeschlossen', en: 'Analysis complete', el: 'Ανάλυση ολοκληρώθηκε',
    tr: 'Analiz tamamlandı', fr: 'Analyse terminée', es: 'Análisis completado', it: 'Analisi completata',
  },
  'results.freeVersion': {
    de: 'Kostenlose Version:', en: 'Free version:', el: 'Δωρεάν έκδοση:',
    tr: 'Ücretsiz sürüm:', fr: 'Version gratuite :', es: 'Versión gratuita:', it: 'Versione gratuita:',
  },
  'results.recommendationsUsed': {
    de: 'von 3 Empfehlungen genutzt', en: 'of 3 recommendations used', el: 'από 3 προτάσεις',
    tr: '3 öneriden kullanıldı', fr: 'sur 3 recommandations utilisées', es: 'de 3 recomendaciones usadas', it: 'di 3 consigli usati',
  },
  'results.bestMatch': {
    de: 'Passt am besten zu deinem Thema', en: 'Best match for your topic', el: 'Καλύτερη αντιστοιχία',
    tr: 'Konunuza en uygun', fr: 'Meilleure correspondance', es: 'Mejor coincidencia', it: 'Miglior corrispondenza',
  },
  'results.perfectChoice': {
    de: 'Deine perfekte Wahl für genau jetzt', en: 'Your perfect choice for right now', el: 'Η τέλεια επιλογή σου',
    tr: 'Şu an için mükemmel seçim', fr: 'Votre choix parfait pour maintenant', es: 'Tu elección perfecta ahora', it: 'La tua scelta perfetta ora',
  },
  'results.secondBest': {
    de: 'Ebenfalls eine starke Wahl', en: 'Also a strong choice', el: 'Επίσης εξαιρετική επιλογή',
    tr: 'Aynı zamanda güçlü bir seçim', fr: 'Également un bon choix', es: 'También una gran elección', it: 'Anche un\'ottima scelta',
  },
  'results.deepensTheme': {
    de: 'Vertieft dein Thema aus einem anderen Blickwinkel', en: 'Deepens your theme from another angle',
    el: 'Εμβαθύνει το θέμα σου', tr: 'Konuyu başka açıdan derinleştirir',
    fr: 'Approfondit votre thème', es: 'Profundiza tu tema', it: 'Approfondisce il tuo tema',
  },
  'results.somethingDifferent': {
    de: 'Wenn du etwas ganz anderes lesen willst', en: 'If you want something completely different',
    el: 'Αν θέλεις κάτι εντελώς διαφορετικό', tr: 'Tamamen farklı bir şey istiyorsan',
    fr: 'Si vous voulez quelque chose de différent', es: 'Si quieres algo completamente diferente', it: 'Se vuoi qualcosa di completamente diverso',
  },
  'results.expandHorizon': {
    de: 'Erweitert deinen Horizont mit neuen Perspektiven', en: 'Expands your horizon with new perspectives',
    el: 'Διευρύνει τον ορίζοντά σου', tr: 'Ufkunuzu genişletir',
    fr: 'Élargit vos horizons', es: 'Amplía tu horizonte', it: 'Amplia il tuo orizzonte',
  },
  'results.recommendation': {
    de: 'Empfehlung', en: 'Recommendation', el: 'Πρόταση',
    tr: 'Öneri', fr: 'Recommandation', es: 'Recomendación', it: 'Consiglio',
  },
  'results.fitsInterests': {
    de: 'Passt zu deinen Interessen', en: 'Fits your interests', el: 'Ταιριάζει στα ενδιαφέροντά σου',
    tr: 'İlgi alanlarına uygun', fr: 'Correspond à vos intérêts', es: 'Encaja con tus intereses', it: 'Si adatta ai tuoi interessi',
  },

  // ── BookSearch – Startseite ───────────────────────────────────────────────
  'booksearch.title': {
    de: 'Buchsuche', en: 'Book Search', el: 'Αναζήτηση βιβλίων',
    tr: 'Kitap Arama', fr: 'Recherche de livres', es: 'Búsqueda de libros', it: 'Ricerca libri',
  },
  'booksearch.subtitle': {
    de: 'Finde dein perfektes nächstes Buch', en: 'Find your perfect next book',
    el: 'Βρες το επόμενο τέλειο βιβλίο σου', tr: 'Bir sonraki mükemmel kitabını bul',
    fr: 'Trouvez votre prochain livre parfait', es: 'Encuentra tu próximo libro perfecto', it: 'Trova il tuo prossimo libro perfetto',
  },

  // ── BookDiscover ──────────────────────────────────────────────────────────
  'discover.title': {
    de: 'Bücher entdecken', en: 'Discover Books', el: 'Ανακαλύψτε βιβλία',
    tr: 'Kitapları Keşfet', fr: 'Découvrir des livres', es: 'Descubrir libros', it: 'Scopri libri',
  },
  'discover.searchPlaceholder': {
    de: 'Titel, Autor oder ISBN suchen…', en: 'Search title, author or ISBN…',
    el: 'Αναζήτηση τίτλου, συγγραφέα ή ISBN…', tr: 'Başlık, yazar veya ISBN ara…',
    fr: 'Rechercher titre, auteur ou ISBN…', es: 'Buscar título, autor o ISBN…', it: 'Cerca titolo, autore o ISBN…',
  },
  'discover.languageFilter': {
    de: 'Sprache:', en: 'Language:', el: 'Γλώσσα:', tr: 'Dil:', fr: 'Langue :', es: 'Idioma:', it: 'Lingua:',
  },
  'discover.allLanguages': {
    de: 'Alle Sprachen', en: 'All Languages', el: 'Όλες οι γλώσσες',
    tr: 'Tüm diller', fr: 'Toutes les langues', es: 'Todos los idiomas', it: 'Tutte le lingue',
  },
  'discover.topicsLabel': {
    de: 'Themen entdecken', en: 'Discover topics', el: 'Ανακαλύψτε θέματα',
    tr: 'Konuları keşfet', fr: 'Découvrir des thèmes', es: 'Descubrir temas', it: 'Scopri argomenti',
  },
  'discover.results': {
    de: 'Bücher gefunden', en: 'books found', el: 'βιβλία βρέθηκαν',
    tr: 'kitap bulundu', fr: 'livres trouvés', es: 'libros encontrados', it: 'libri trovati',
  },
  'discover.localResults': {
    de: 'Lokale Ergebnisse', en: 'Local results', el: 'Τοπικά αποτελέσματα',
    tr: 'Yerel sonuçlar', fr: 'Résultats locaux', es: 'Resultados locales', it: 'Risultati locali',
  },
  'discover.empty': {
    de: 'Keine Bücher gefunden', en: 'No books found', el: 'Δεν βρέθηκαν βιβλία',
    tr: 'Kitap bulunamadı', fr: 'Aucun livre trouvé', es: 'No se encontraron libros', it: 'Nessun libro trovato',
  },
  'discover.emptyHint': {
    de: 'Versuche andere Suchbegriffe', en: 'Try different search terms', el: 'Δοκίμασε άλλους όρους αναζήτησης',
    tr: 'Farklı arama terimleri deneyin', fr: 'Essayez d\'autres termes', es: 'Prueba otros términos', it: 'Prova altri termini',
  },
  'discover.startHint': {
    de: 'Suche in Millionen von Büchern weltweit', en: 'Search millions of books worldwide',
    el: 'Αναζήτηση σε εκατομμύρια βιβλία', tr: 'Dünya genelinde milyonlarca kitapta ara',
    fr: 'Recherchez parmi des millions de livres', es: 'Busca en millones de libros', it: 'Cerca in milioni di libri',
  },

  // ── Quick Search Labels ───────────────────────────────────────────────────
  'discover.qs.selfHelp': {
    de: 'Persönliche Entwicklung', en: 'Self Improvement', el: 'Αυτοβελτίωση',
    tr: 'Kişisel Gelişim', fr: 'Développement personnel', es: 'Desarrollo personal', it: 'Sviluppo personale',
  },
  'discover.qs.philosophy': {
    de: 'Philosophie', en: 'Philosophy', el: 'Φιλοσοφία',
    tr: 'Felsefe', fr: 'Philosophie', es: 'Filosofía', it: 'Filosofia',
  },
  'discover.qs.fantasy': {
    de: 'Fantasy', en: 'Fantasy', el: 'Φαντασία',
    tr: 'Fantezi', fr: 'Fantasy', es: 'Fantasía', it: 'Fantasy',
  },
  'discover.qs.thriller': {
    de: 'Thriller', en: 'Thriller', el: 'Θρίλερ',
    tr: 'Gerilim', fr: 'Thriller', es: 'Thriller', it: 'Thriller',
  },
  'discover.qs.history': {
    de: 'Geschichte', en: 'History', el: 'Ιστορία',
    tr: 'Tarih', fr: 'Histoire', es: 'Historia', it: 'Storia',
  },
  'discover.qs.science': {
    de: 'Wissenschaft', en: 'Science', el: 'Επιστήμη',
    tr: 'Bilim', fr: 'Science', es: 'Ciencia', it: 'Scienza',
  },
  'discover.qs.biography': {
    de: 'Biografien', en: 'Biography', el: 'Βιογραφίες',
    tr: 'Biyografi', fr: 'Biographies', es: 'Biografías', it: 'Biografie',
  },
  'discover.qs.romance': {
    de: 'Romantik', en: 'Romance', el: 'Ρομάντζο',
    tr: 'Romantizm', fr: 'Romance', es: 'Romance', it: 'Romanzo',
  },

  // ── Account / Settings ────────────────────────────────────────────────────
  'account.title': {
    de: 'Mein Account', en: 'My Account', el: 'Ο λογαριασμός μου',
    tr: 'Hesabım', fr: 'Mon compte', es: 'Mi cuenta', it: 'Il mio account',
  },
};

/**
 * t(key, lang, fallback?)
 * Gibt die Übersetzung zurück. Kein Crash bei fehlendem Key.
 */
export function t(key, lang = 'de', fallback) {
  const entry = dict[key];
  if (!entry) return fallback !== undefined ? fallback : key;
  return entry[lang] || entry['de'] || fallback || key;
}

export default dict;