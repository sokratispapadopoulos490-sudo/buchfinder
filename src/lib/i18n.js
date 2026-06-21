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
    de: 'Suchen', en: 'Search', el: 'Αναζήτηση',
    tr: 'Ara', fr: 'Chercher', es: 'Buscar', it: 'Cerca',
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
  'btn.save': {
    de: 'Speichern', en: 'Save', el: 'Αποθήκευση',
    tr: 'Kaydet', fr: 'Enregistrer', es: 'Guardar', it: 'Salva',
  },
  'btn.saved': {
    de: 'Gespeichert', en: 'Saved', el: 'Αποθηκεύτηκε',
    tr: 'Kaydedildi', fr: 'Enregistré', es: 'Guardado', it: 'Salvato',
  },
  'book.unknownAuthor': {
    de: 'Unbekannter Autor', en: 'Unknown Author', el: 'Άγνωστος συγγραφέας',
    tr: 'Bilinmeyen yazar', fr: 'Auteur inconnu', es: 'Autor desconocido', it: 'Autore sconosciuto',
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
    de: 'Kostenlose Buchempfehlungen – kein Abo, keine Kreditkarte',
    en: 'Free book recommendations – no subscription, no credit card',
    el: 'Δωρεάν προτάσεις βιβλίων – χωρίς συνδρομή',
    tr: 'Ücretsiz kitap önerileri – abonelik yok',
    fr: 'Recommandations gratuites – sans abonnement',
    es: 'Recomendaciones gratuitas – sin suscripción',
    it: 'Consigli gratuiti – senza abbonamento',
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
  'account.loading': {
    de: 'Lädt...', en: 'Loading...', el: 'Φόρτωση...', tr: 'Yükleniyor...', fr: 'Chargement...', es: 'Cargando...', it: 'Caricamento...',
  },
  'account.editProfile': {
    de: 'Profil bearbeiten', en: 'Edit Profile', el: 'Επεξεργασία προφίλ', tr: 'Profili düzenle', fr: 'Modifier le profil', es: 'Editar perfil', it: 'Modifica profilo',
  },
  'account.editProfileSub': {
    de: 'Name, Bio, Genres anpassen', en: 'Adjust name, bio, genres', el: 'Όνομα, βιογραφικό, είδη', tr: 'İsim, bio, türler', fr: 'Nom, bio, genres', es: 'Nombre, bio, géneros', it: 'Nome, bio, generi',
  },
  'account.upgradePremium': {
    de: 'Auf Premium upgraden', en: 'Upgrade to Premium', el: 'Αναβάθμιση σε Premium', tr: 'Premium\'a geç', fr: 'Passer à Premium', es: 'Mejorar a Premium', it: 'Passa a Premium',
  },
  'account.betaBadge': {
    de: 'Kostenlos Beta', en: 'Free Beta', el: 'Δωρεάν Beta', tr: 'Ücretsiz Beta', fr: 'Beta gratuit', es: 'Beta gratuita', it: 'Beta gratuito',
  },
  'account.premiumBadge': {
    de: 'Premium', en: 'Premium', el: 'Premium', tr: 'Premium', fr: 'Premium', es: 'Premium', it: 'Premium',
  },
  'account.shoppingRegion': {
    de: 'Kaufregion', en: 'Shopping Region', el: 'Περιοχή αγορών', tr: 'Alışveriş bölgesi', fr: 'Région d\'achat', es: 'Región de compra', it: 'Regione di acquisto',
  },
  'account.shoppingRegionSub': {
    de: 'Bestimmt Buchläden & Marktplätze; unabhängig von App- und Buchsprache',
    en: 'Determines bookstores & marketplaces; independent of app & book language',
    el: 'Καθορίζει βιβλιοπωλεία & αγορές· ανεξάρτητο από γλώσσα εφαρμογής & βιβλίου',
    tr: 'Kitabevleri & pazar yerlerini belirler; uygulama ve kitap dilinden bağımsız',
    fr: 'Détermine librairies & marchés; indépendant de la langue de l\'app et du livre',
    es: 'Determina librerías y mercados; independiente del idioma de la app y del libro',
    it: 'Determina librerie e mercati; indipendente dalla lingua dell\'app e del libro',
  },
  'account.darkMode': {
    de: 'Dark Mode', en: 'Dark Mode', el: 'Σκοτεινή λειτουργία', tr: 'Karanlık mod', fr: 'Mode sombre', es: 'Modo oscuro', it: 'Modalità scura',
  },
  'account.darkModeSub': {
    de: 'Dunkles Design aktivieren', en: 'Enable dark design', el: 'Ενεργοποίηση σκοτεινού σχεδίου', tr: 'Koyu tasarımı etkinleştir', fr: 'Activer le design sombre', es: 'Activar diseño oscuro', it: 'Attiva design scuro',
  },
  'account.history': {
    de: 'Empfehlungsverlauf', en: 'Recommendation History', el: 'Ιστορικό προτάσεων', tr: 'Öneri geçmişi', fr: 'Historique des recommandations', es: 'Historial de recomendaciones', it: 'Cronologia consigli',
  },
  'account.noRecommendations': {
    de: 'Noch keine Empfehlungen erhalten', en: 'No recommendations yet', el: 'Δεν υπάρχουν ακόμα προτάσεις', tr: 'Henüz öneri yok', fr: 'Aucune recommandation encore', es: 'Aún no hay recomendaciones', it: 'Ancora nessun consiglio',
  },
  'account.firstRecommendation': {
    de: 'Erste Empfehlung erhalten', en: 'Get first recommendation', el: 'Πάρε την πρώτη σου πρόταση', tr: 'İlk öneriyi al', fr: 'Obtenir la première recommandation', es: 'Obtener primera recomendación', it: 'Ottieni il primo consiglio',
  },
  'account.moreAvailable': {
    de: 'weitere verfügbar', en: 'more available', el: 'περισσότερα διαθέσιμα', tr: 'daha fazlası mevcut', fr: 'de plus disponibles', es: 'más disponibles', it: 'altri disponibili',
  },
  'account.showWithPremium': {
    de: 'Mit Premium anzeigen', en: 'Show with Premium', el: 'Εμφάνιση με Premium', tr: 'Premium ile göster', fr: 'Afficher avec Premium', es: 'Mostrar con Premium', it: 'Mostra con Premium',
  },
  'account.moreResults': {
    de: 'weitere', en: 'more', el: 'περισσότερα', tr: 'daha fazla', fr: 'de plus', es: 'más', it: 'altri',
  },
  'account.deleteConfirm': {
    de: 'Möchtest du diese Empfehlung wirklich löschen?', en: 'Really delete this recommendation?', el: 'Να διαγραφεί αυτή η πρόταση;', tr: 'Bu öneriyi silmek istiyor musun?', fr: 'Supprimer cette recommandation ?', es: '¿Eliminar esta recomendación?', it: 'Eliminare questo consiglio?',
  },
  'account.settings': {
    de: 'Einstellungen', en: 'Settings', el: 'Ρυθμίσεις', tr: 'Ayarlar', fr: 'Paramètres', es: 'Configuración', it: 'Impostazioni',
  },
  'account.appLanguage': {
    de: 'App-Sprache', en: 'App Language', el: 'Γλώσσα εφαρμογής', tr: 'Uygulama dili', fr: 'Langue de l\'app', es: 'Idioma de la app', it: 'Lingua app',
  },
  'account.appLanguageSub': {
    de: 'Oberfläche – nicht die Buchsprache', en: 'Interface – not the book language', el: 'Διεπαφή – όχι γλώσσα βιβλίου', tr: 'Arayüz – kitap dili değil', fr: 'Interface – pas la langue du livre', es: 'Interfaz – no el idioma del libro', it: 'Interfaccia – non la lingua del libro',
  },
  'account.publicProfile': {
    de: 'Profil öffentlich', en: 'Public Profile', el: 'Δημόσιο προφίλ', tr: 'Herkese açık profil', fr: 'Profil public', es: 'Perfil público', it: 'Profilo pubblico',
  },
  'account.publicProfileSub': {
    de: 'Andere Nutzer können dein Profil sehen', en: 'Other users can see your profile', el: 'Άλλοι χρήστες μπορούν να δουν το προφίλ σου', tr: 'Diğer kullanıcılar profilini görebilir', fr: 'Les autres utilisateurs peuvent voir votre profil', es: 'Otros usuarios pueden ver tu perfil', it: 'Gli altri utenti possono vedere il tuo profilo',
  },
  'account.notifications': {
    de: 'Benachrichtigungen', en: 'Notifications', el: 'Ειδοποιήσεις', tr: 'Bildirimler', fr: 'Notifications', es: 'Notificaciones', it: 'Notifiche',
  },
  'account.notif.comments': {
    de: 'Kommentare', en: 'Comments', el: 'Σχόλια', tr: 'Yorumlar', fr: 'Commentaires', es: 'Comentarios', it: 'Commenti',
  },
  'account.notif.likes': {
    de: 'Likes', en: 'Likes', el: 'Μου αρέσει', tr: 'Beğeniler', fr: 'J\'aime', es: 'Me gusta', it: 'Mi piace',
  },
  'account.notif.messages': {
    de: 'Nachrichten', en: 'Messages', el: 'Μηνύματα', tr: 'Mesajlar', fr: 'Messages', es: 'Mensajes', it: 'Messaggi',
  },
  'account.exportData': {
    de: 'Daten exportieren', en: 'Export Data', el: 'Εξαγωγή δεδομένων', tr: 'Veriyi dışa aktar', fr: 'Exporter les données', es: 'Exportar datos', it: 'Esporta dati',
  },
  'account.exportDataSub': {
    de: 'Alle deine Daten herunterladen', en: 'Download all your data', el: 'Κατέβασε όλα τα δεδομένα σου', tr: 'Tüm verilerini indir', fr: 'Télécharger toutes vos données', es: 'Descargar todos tus datos', it: 'Scarica tutti i tuoi dati',
  },
  'account.exportConfirm': {
    de: 'Möchtest du alle deine Daten exportieren?', en: 'Export all your data?', el: 'Εξαγωγή όλων των δεδομένων;', tr: 'Tüm verilerini dışa aktarmak istiyor musun?', fr: 'Exporter toutes vos données ?', es: '¿Exportar todos tus datos?', it: 'Esportare tutti i tuoi dati?',
  },
  'account.logout': {
    de: 'Abmelden', en: 'Logout', el: 'Αποσύνδεση', tr: 'Çıkış yap', fr: 'Déconnexion', es: 'Cerrar sesión', it: 'Esci',
  },
  'account.goHome': {
    de: 'Zur Startseite', en: 'Go to Home', el: 'Αρχική σελίδα', tr: 'Ana sayfaya git', fr: 'Aller à l\'accueil', es: 'Ir a inicio', it: 'Vai alla home',
  },
  'account.legal': {
    de: 'Rechtliche Hinweise', en: 'Legal Notice', el: 'Νομικές πληροφορίες', tr: 'Yasal bildirim', fr: 'Mentions légales', es: 'Aviso legal', it: 'Note legali',
  },

  // ── Phase 2: Buchsprache (bookLanguage) ───────────────────────────────────
  'bookLang.label': {
    de: 'Buchsprache:', en: 'Book language:', el: 'Γλώσσα βιβλίου:',
    tr: 'Kitap dili:', fr: 'Langue du livre :', es: 'Idioma del libro:', it: 'Lingua del libro:',
  },
  'bookLang.all': {
    de: 'Alle Sprachen', en: 'All languages', el: 'Όλες οι γλώσσες',
    tr: 'Tüm diller', fr: 'Toutes les langues', es: 'Todos los idiomas', it: 'Tutte le lingue',
  },
  'bookLang.de': {
    de: 'Deutsch', en: 'German', el: 'Γερμανικά', tr: 'Almanca', fr: 'Allemand', es: 'Alemán', it: 'Tedesco',
  },
  'bookLang.en': {
    de: 'Englisch', en: 'English', el: 'Αγγλικά', tr: 'İngilizce', fr: 'Anglais', es: 'Inglés', it: 'Inglese',
  },
  'bookLang.el': {
    de: 'Griechisch', en: 'Greek', el: 'Ελληνικά', tr: 'Yunanca', fr: 'Grec', es: 'Griego', it: 'Greco',
  },
  'bookLang.tr': {
    de: 'Türkisch', en: 'Turkish', el: 'Τουρκικά', tr: 'Türkçe', fr: 'Turc', es: 'Turco', it: 'Turco',
  },
  'bookLang.fr': {
    de: 'Französisch', en: 'French', el: 'Γαλλικά', tr: 'Fransızca', fr: 'Français', es: 'Francés', it: 'Francese',
  },
  'bookLang.es': {
    de: 'Spanisch', en: 'Spanish', el: 'Ισπανικά', tr: 'İspanyolca', fr: 'Espagnol', es: 'Español', it: 'Spagnolo',
  },
  'bookLang.it': {
    de: 'Italienisch', en: 'Italian', el: 'Ιταλικά', tr: 'İtalyanca', fr: 'Italien', es: 'Italiano', it: 'Italiano',
  },

  // ── Phase 2: Shopping-Region ──────────────────────────────────────────────
  'region.label': {
    de: 'Einkaufsregion:', en: 'Shopping region:', el: 'Περιοχή αγορών:',
    tr: 'Alışveriş bölgesi:', fr: 'Région d\'achat :', es: 'Región de compra:', it: 'Regione di acquisto:',
  },
  'region.de': {
    de: 'Deutschland', en: 'Germany', el: 'Γερμανία', tr: 'Almanya', fr: 'Allemagne', es: 'Alemania', it: 'Germania',
  },
  'region.at': {
    de: 'Österreich', en: 'Austria', el: 'Αυστρία', tr: 'Avusturya', fr: 'Autriche', es: 'Austria', it: 'Austria',
  },
  'region.ch': {
    de: 'Schweiz', en: 'Switzerland', el: 'Ελβετία', tr: 'İsviçre', fr: 'Suisse', es: 'Suiza', it: 'Svizzera',
  },
  'region.gr': {
    de: 'Griechenland', en: 'Greece', el: 'Ελλάδα', tr: 'Yunanistan', fr: 'Grèce', es: 'Grecia', it: 'Grecia',
  },
  'region.tr': {
    de: 'Türkei', en: 'Turkey', el: 'Τουρκία', tr: 'Türkiye', fr: 'Turquie', es: 'Turquía', it: 'Turchia',
  },
  'region.fr': {
    de: 'Frankreich', en: 'France', el: 'Γαλλία', tr: 'Fransa', fr: 'France', es: 'Francia', it: 'Francia',
  },
  'region.es': {
    de: 'Spanien', en: 'Spain', el: 'Ισπανία', tr: 'İspanya', fr: 'Espagne', es: 'España', it: 'Spagna',
  },
  'region.it': {
    de: 'Italien', en: 'Italy', el: 'Ιταλία', tr: 'İtalya', fr: 'Italie', es: 'Italia', it: 'Italia',
  },
  'region.uk': {
    de: 'Großbritannien', en: 'United Kingdom', el: 'Ηνωμένο Βασίλειο', tr: 'Birleşik Krallık',
    fr: 'Royaume-Uni', es: 'Reino Unido', it: 'Regno Unito',
  },
  'region.us': {
    de: 'USA', en: 'United States', el: 'ΗΠΑ', tr: 'ABD', fr: 'États-Unis', es: 'EE.UU.', it: 'Stati Uniti',
  },
  'region.hint': {
    de: 'Bestimmt welche Buchläden angezeigt werden',
    en: 'Determines which bookstores are shown',
    el: 'Καθορίζει ποια βιβλιοπωλεία εμφανίζονται',
    tr: 'Hangi kitabevlerinin gösterileceğini belirler',
    fr: 'Détermine quelles librairies sont affichées',
    es: 'Determina qué librerías se muestran',
    it: 'Determina quali librerie vengono mostrate',
  },

  // ── Phase 3: Provider-Typen ───────────────────────────────────────────────
  'provider.new': {
    de: 'Neu', en: 'New', el: 'Νέο', tr: 'Yeni', fr: 'Neuf', es: 'Nuevo', it: 'Nuovo',
  },
  'provider.used': {
    de: 'Gebraucht', en: 'Used', el: 'Μεταχειρισμένο', tr: 'İkinci el', fr: 'Occasion', es: 'Usado', it: 'Usato',
  },
  'provider.marketplace': {
    de: 'Marktplatz', en: 'Marketplace', el: 'Αγορά', tr: 'Pazar yeri', fr: 'Marketplace', es: 'Mercado', it: 'Marketplace',
  },
  'provider.ebook': {
    de: 'E-Book', en: 'E-Book', el: 'E-Book', tr: 'E-Kitap', fr: 'Numérique', es: 'E-Book', it: 'E-Book',
  },
  'provider.audiobook': {
    de: 'Hörbuch', en: 'Audiobook', el: 'Ακουστικό', tr: 'Sesli kitap', fr: 'Audio', es: 'Audiolibro', it: 'Audiolibro',
  },
  'provider.discovery': {
    de: 'Vorschau', en: 'Preview', el: 'Προεπισκόπηση', tr: 'Önizleme', fr: 'Aperçu', es: 'Vista previa', it: 'Anteprima',
  },
  'provider.showUsed': {
    de: 'Gebraucht anzeigen', en: 'Show used', el: 'Μεταχειρισμένα', tr: 'İkinci el göster', fr: 'Voir occasion', es: 'Ver usados', it: 'Vedi usati',
  },
  'provider.hideUsed': {
    de: 'Gebraucht ausblenden', en: 'Hide used', el: 'Απόκρυψη', tr: 'Gizle', fr: 'Masquer', es: 'Ocultar', it: 'Nascondi',
  },
  'provider.buyNew': {
    de: 'Neu kaufen', en: 'Buy new', el: 'Αγορά νέου', tr: 'Yeni al', fr: 'Acheter neuf', es: 'Comprar nuevo', it: 'Acquista nuovo',
  },
  'provider.buyUsed': {
    de: 'Gebraucht kaufen', en: 'Buy used', el: 'Μεταχειρισμένο', tr: 'İkinci el al', fr: 'Acheter d\'occasion', es: 'Comprar usado', it: 'Acquista usato',
  },
  'provider.audioHint': {
    de: 'Verfügbarkeit unbekannt – Suche auf der Anbieter-Seite', en: 'Availability unknown – search on provider site',
    el: 'Διαθεσιμότητα άγνωστη', tr: 'Kullanılabilirlik bilinmiyor', fr: 'Disponibilité inconnue', es: 'Disponibilidad desconocida', it: 'Disponibilità sconosciuta',
  },
  'ai.limitReached': {
    de: 'Tägliches KI-Limit erreicht', en: 'Daily AI limit reached', el: 'Ημερήσιο όριο ΤΝ', tr: 'Günlük AI limiti', fr: 'Limite IA atteinte', es: 'Límite IA alcanzado', it: 'Limite IA raggiunto',
  },
  'ai.limitMessage': {
    de: 'Du hast dein tägliches KI-Limit von {n} Antworten erreicht. Morgen wieder verfügbar.',
    en: 'You have reached your daily AI limit of {n} responses. Available again tomorrow.',
    el: 'Έφτασες το ημερήσιο όριο {n} απαντήσεων ΤΝ. Διαθέσιμο ξανά αύριο.',
    tr: 'Günlük {n} AI yanıt limitine ulaştın. Yarın tekrar kullanılabilir.',
    fr: 'Vous avez atteint votre limite quotidienne de {n} réponses IA. Disponible demain.',
    es: 'Has alcanzado tu límite diario de {n} respuestas IA. Disponible mañana.',
    it: 'Hai raggiunto il limite giornaliero di {n} risposte IA. Disponibile domani.',
  },
  'ai.timeoutMessage': {
    de: 'Die KI hat leider nicht rechtzeitig geantwortet. Bitte versuche es später.',
    en: 'The AI did not respond in time. Please try again later.',
    el: 'Η ΤΝ δεν απάντησε εγκαίρως. Δοκίμασε ξανά αργότερα.',
    tr: 'AI zamanında yanıt vermedi. Lütfen daha sonra tekrar deneyin.',
    fr: 'L\'IA n\'a pas répondu à temps. Veuillez réessayer plus tard.',
    es: 'La IA no respondió a tiempo. Inténtalo más tarde.',
    it: 'L\'IA non ha risposto in tempo. Riprova più tardi.',
  },
  'ai.errorMessage': {
    de: 'Die KI-Antwort ist fehlgeschlagen. Bitte versuche es später.',
    en: 'AI response failed. Please try again later.',
    el: 'Η απάντηση ΤΝ απέτυχε. Δοκίμασε ξανά αργότερα.',
    tr: 'AI yanıtı başarısız oldu. Lütfen daha sonra tekrar deneyin.',
    fr: 'La réponse IA a échoué. Veuillez réessayer plus tard.',
    es: 'La respuesta IA falló. Inténtalo más tarde.',
    it: 'La risposta IA non è riuscita. Riprova più tardi.',
  },

  // ── Compass ───────────────────────────────────────────────────────────────
  'compass.title': {
    de: 'Dein Lese-Compass', en: 'Your Reading Compass', el: 'Η Πυξίδα Ανάγνωσής σου',
    tr: 'Okuma Pusulam', fr: 'Votre boussole lecture', es: 'Tu brújula de lectura', it: 'La tua bussola lettura',
  },
  'compass.newRecommendations': {
    de: 'Neue Empfehlungen holen', en: 'Get New Recommendations', el: 'Νέες προτάσεις',
    tr: 'Yeni öneriler al', fr: 'Nouvelles recommandations', es: 'Nuevas recomendaciones', it: 'Nuovi consigli',
  },
  'compass.todayFocus': {
    de: 'Heute im Fokus', en: 'Today\'s Focus', el: 'Εστίαση σήμερα',
    tr: 'Bugünün odağı', fr: 'Focus du jour', es: 'Foco de hoy', it: 'Focus di oggi',
  },
  'compass.todayFocusSub': {
    de: 'Lies weiter und halte fest, was dich bewegt', en: 'Keep reading and capture what moves you',
    el: 'Συνέχισε να διαβάζεις και κράτα σημειώσεις', tr: 'Okumaya devam et ve seni etkileyen şeyleri not et',
    fr: 'Continuez à lire et notez ce qui vous touche', es: 'Sigue leyendo y anota lo que te mueve', it: 'Continua a leggere e annota ciò che ti tocca',
  },
  'compass.reflectionLabel': {
    de: 'Reflexion für später', en: 'Reflection for later', el: 'Αναστοχασμός για αργότερα',
    tr: 'Sonrası için düşünce', fr: 'Réflexion pour plus tard', es: 'Reflexión para después', it: 'Riflessione per dopo',
  },
  'compass.reflectionPlaceholder': {
    de: 'Deine Gedanken...', en: 'Your thoughts...', el: 'Οι σκέψεις σου...',
    tr: 'Düşünceleriniz...', fr: 'Vos pensées...', es: 'Tus pensamientos...', it: 'I tuoi pensieri...',
  },
  'compass.saveReflection': {
    de: 'Speichern', en: 'Save', el: 'Αποθήκευση',
    tr: 'Kaydet', fr: 'Enregistrer', es: 'Guardar', it: 'Salva',
  },
  'compass.logProgress': {
    de: 'Fortschritt eintragen', en: 'Log Progress', el: 'Καταχώρηση προόδου',
    tr: 'İlerleme kaydet', fr: 'Enregistrer le progrès', es: 'Registrar progreso', it: 'Registra progresso',
  },
  'compass.weeklyProgress': {
    de: 'Wochenfortschritt', en: 'Weekly Progress', el: 'Εβδομαδιαία πρόοδος',
    tr: 'Haftalık ilerleme', fr: 'Progrès hebdomadaire', es: 'Progreso semanal', it: 'Progresso settimanale',
  },
  'compass.library': {
    de: 'Bibliothek', en: 'Library', el: 'Βιβλιοθήκη',
    tr: 'Kütüphane', fr: 'Bibliothèque', es: 'Biblioteca', it: 'Libreria',
  },
  'compass.yourLibrary': {
    de: 'Deine Bibliothek', en: 'Your Library', el: 'Η βιβλιοθήκη σου',
    tr: 'Kütüphanem', fr: 'Votre bibliothèque', es: 'Tu biblioteca', it: 'La tua libreria',
  },
  'compass.libraryEmpty': {
    de: 'Noch keine Bücher in deiner Bibliothek', en: 'No books in your library yet',
    el: 'Δεν υπάρχουν βιβλία στη βιβλιοθήκη σου', tr: 'Kütüphanende henüz kitap yok',
    fr: 'Pas encore de livres dans votre bibliothèque', es: 'Aún no hay libros en tu biblioteca', it: 'Ancora nessun libro nella tua libreria',
  },
  'compass.lastRecommendations': {
    de: 'Letzte Empfehlungen', en: 'Last Recommendations', el: 'Τελευταίες προτάσεις',
    tr: 'Son öneriler', fr: 'Dernières recommandations', es: 'Últimas recomendaciones', it: 'Ultimi consigli',
  },
  'compass.newAnalysis': {
    de: 'Neue Analyse', en: 'New Analysis', el: 'Νέα ανάλυση',
    tr: 'Yeni analiz', fr: 'Nouvelle analyse', es: 'Nuevo análisis', it: 'Nuova analisi',
  },
  'compass.readReady': {
    de: 'Bereit für dein nächstes Buch?', en: 'Ready for your next book?', el: 'Έτοιμος για το επόμενο βιβλίο σου;',
    tr: 'Bir sonraki kitabın için hazır mısın?', fr: 'Prêt pour votre prochain livre ?', es: '¿Listo para tu próximo libro?', it: 'Pronto per il tuo prossimo libro?',
  },
  'compass.readReadySub': {
    de: 'Lass uns gemeinsam das richtige Buch für dich finden.', en: 'Let\'s find the right book for you together.',
    el: 'Ας βρούμε μαζί το κατάλληλο βιβλίο για σένα.', tr: 'Birlikte sana uygun kitabı bulalım.',
    fr: 'Trouvons ensemble le bon livre pour vous.', es: 'Encontremos juntos el libro adecuado para ti.', it: 'Troviamo insieme il libro giusto per te.',
  },
  'compass.startRecommendation': {
    de: 'Buchempfehlung starten', en: 'Start Book Recommendation', el: 'Έναρξη πρότασης βιβλίου',
    tr: 'Kitap önerisi başlat', fr: 'Démarrer la recommandation', es: 'Iniciar recomendación', it: 'Avvia consiglio libro',
  },
  'compass.scanBook': {
    de: 'Buch scannen', en: 'Scan Book', el: 'Σάρωση βιβλίου',
    tr: 'Kitap tara', fr: 'Scanner le livre', es: 'Escanear libro', it: 'Scansiona libro',
  },
  'compass.recommendations': {
    de: 'Empfehlungen', en: 'Recommendations', el: 'Προτάσεις',
    tr: 'Öneriler', fr: 'Recommandations', es: 'Recomendaciones', it: 'Consigli',
  },
  'compass.analyzeStart': {
    de: 'Analyse starten', en: 'Start Analysis', el: 'Έναρξη ανάλυσης',
    tr: 'Analizi başlat', fr: 'Démarrer l\'analyse', es: 'Iniciar análisis', it: 'Avvia analisi',
  },
  'compass.scan': {
    de: 'Scannen', en: 'Scan', el: 'Σάρωση',
    tr: 'Tara', fr: 'Scanner', es: 'Escanear', it: 'Scansiona',
  },
  'compass.addBook': {
    de: 'Buch hinzufügen', en: 'Add Book', el: 'Προσθήκη βιβλίου',
    tr: 'Kitap ekle', fr: 'Ajouter un livre', es: 'Añadir libro', it: 'Aggiungi libro',
  },
  'compass.allBooks': {
    de: 'Alle Bücher', en: 'All Books', el: 'Όλα τα βιβλία',
    tr: 'Tüm kitaplar', fr: 'Tous les livres', es: 'Todos los libros', it: 'Tutti i libri',
  },
  'compass.read': {
    de: 'gelesen', en: 'read', el: 'διαβάστηκε',
    tr: 'okundu', fr: 'lu', es: 'leído', it: 'letto',
  },
  'compass.dayStreak': {
    de: 'Tag Streak', en: 'day streak', el: 'μέρα σερί',
    tr: 'gün seri', fr: 'jour de suite', es: 'día seguido', it: 'giorno consecutivo',
  },
  'compass.daysStreak': {
    de: 'Tage Streak', en: 'days streak', el: 'μέρες σερί',
    tr: 'gün seri', fr: 'jours de suite', es: 'días seguidos', it: 'giorni consecutivi',
  },
  'compass.ofBooks': {
    de: 'von', en: 'of', el: 'από',
    tr: '/', fr: 'sur', es: 'de', it: 'di',
  },
  'compass.booksLabel': {
    de: 'Büchern', en: 'books', el: 'βιβλία',
    tr: 'kitap', fr: 'livres', es: 'libros', it: 'libri',
  },
  'compass.yourThought': {
    de: 'Dein Gedanke vom', en: 'Your thought from', el: 'Η σκέψη σου από',
    tr: 'Düşüncen', fr: 'Votre pensée du', es: 'Tu pensamiento del', it: 'Il tuo pensiero del',
  },
  'compass.deleteBookConfirm': {
    de: 'Möchtest du dieses Buch wirklich aus deiner Bibliothek entfernen?',
    en: 'Really remove this book from your library?',
    el: 'Να αφαιρεθεί αυτό το βιβλίο από τη βιβλιοθήκη;',
    tr: 'Bu kitabı kütüphanenden çıkarmak istiyor musun?',
    fr: 'Supprimer ce livre de votre bibliothèque ?',
    es: '¿Eliminar este libro de tu biblioteca?',
    it: 'Rimuovere questo libro dalla libreria?',
  },
  'compass.loading': {
    de: 'Lädt...', en: 'Loading...', el: 'Φόρτωση...',
    tr: 'Yükleniyor...', fr: 'Chargement...', es: 'Cargando...', it: 'Caricamento...',
  },

  // ── BookSearch – Questions & Options ─────────────────────────────────────
  'booksearch.betaLabel': {
    de: 'Kostenlos in der Beta', en: 'Free in Beta', el: 'Δωρεάν στη Beta',
    tr: 'Beta\'da ücretsiz', fr: 'Gratuit en Beta', es: 'Gratis en Beta', it: 'Gratuito in Beta',
  },
  'booksearch.benefitPersonal': {
    de: 'Persönliche Buchempfehlung', en: 'Personal book recommendation', el: 'Προσωπική πρόταση βιβλίου',
    tr: 'Kişisel kitap önerisi', fr: 'Recommandation personnelle', es: 'Recomendación personal', it: 'Consiglio personale',
  },
  'booksearch.benefitFree': {
    de: 'Komplett kostenlos', en: 'Completely free', el: 'Εντελώς δωρεάν',
    tr: 'Tamamen ücretsiz', fr: 'Entièrement gratuit', es: 'Completamente gratis', it: 'Completamente gratuito',
  },
  'booksearch.benefitLanguages': {
    de: 'Mehrere Buchsprachen', en: 'Multiple book languages', el: 'Πολλές γλώσσες βιβλίων',
    tr: 'Birden fazla kitap dili', fr: 'Plusieurs langues', es: 'Varios idiomas', it: 'Più lingue',
  },
  'q.continueBtn': {
    de: 'Weiter', en: 'Continue', el: 'Συνέχεια',
    tr: 'Devam', fr: 'Continuer', es: 'Continuar', it: 'Continua',
  },
  'booksearch.readBooksTitle': {
    de: 'Welche Bücher hast du zuletzt gelesen?', en: 'Which books have you read recently?',
    el: 'Ποια βιβλία διάβασες πρόσφατα;', tr: 'Son zamanlarda hangi kitapları okudun?',
    fr: 'Quels livres avez-vous lus récemment ?', es: '¿Qué libros has leído recientemente?', it: 'Quali libri hai letto di recente?',
  },
  'booksearch.readBooksOptional': {
    de: 'Optional – hilft uns, Dopplungen zu vermeiden.', en: 'Optional – helps us avoid duplicates.',
    el: 'Προαιρετικό – μας βοηθά να αποφύγουμε επαναλήψεις.', tr: 'İsteğe bağlı – tekrarları önlememize yardımcı olur.',
    fr: 'Facultatif – nous aide à éviter les doublons.', es: 'Opcional – nos ayuda a evitar duplicados.', it: 'Opzionale – ci aiuta a evitare duplicati.',
  },
  'booksearch.questionOf': {
    de: 'Frage', en: 'Question', el: 'Ερώτηση',
    tr: 'Soru', fr: 'Question', es: 'Pregunta', it: 'Domanda',
  },
  'booksearch.of': {
    de: 'von', en: 'of', el: 'από',
    tr: '/', fr: 'sur', es: 'de', it: 'di',
  },
  'booksearch.top3Title': {
    de: '🏆 Deine Top 3 Empfehlungen', en: '🏆 Your Top 3 Recommendations', el: '🏆 Οι κορυφαίες 3 προτάσεις σου',
    tr: '🏆 İlk 3 Önerin', fr: '🏆 Vos 3 meilleures recommandations', es: '🏆 Tus 3 mejores recomendaciones', it: '🏆 I tuoi 3 migliori consigli',
  },
  'booksearch.top3Sub': {
    de: 'Die besten Treffer für dein Profil', en: 'The best matches for your profile',
    el: 'Οι καλύτερες αντιστοιχίες για το προφίλ σου', tr: 'Profiliniz için en iyi eşleşmeler',
    fr: 'Les meilleures correspondances pour votre profil', es: 'Los mejores resultados para tu perfil', it: 'Le migliori corrispondenze per il tuo profilo',
  },
  'booksearch.moreRecs': {
    de: 'Weitere Empfehlungen', en: 'More Recommendations', el: 'Περισσότερες προτάσεις',
    tr: 'Daha fazla öneri', fr: 'Plus de recommandations', es: 'Más recomendaciones', it: 'Altri consigli',
  },
  'booksearch.horizonTitle': {
    de: 'Etwas Neues wagen', en: 'Try Something New', el: 'Δοκίμασε κάτι νέο',
    tr: 'Yeni bir şey dene', fr: 'Oser quelque chose de nouveau', es: 'Atrévete con algo nuevo', it: 'Prova qualcosa di nuovo',
  },
  'booksearch.horizonSub': {
    de: 'Bücher, die deinen Horizont bewusst erweitern.', en: 'Books that deliberately expand your horizon.',
    el: 'Βιβλία που διευρύνουν σκόπιμα τον ορίζοντά σου.', tr: 'Ufkunu bilinçli olarak genişleten kitaplar.',
    fr: 'Des livres qui élargissent délibérément votre horizon.', es: 'Libros que amplían deliberadamente tu horizonte.', it: 'Libri che ampliano deliberatamente il tuo orizzonte.',
  },
  'booksearch.horizonBadge': {
    de: 'Horizont-Erweiterung', en: 'Horizon Expansion', el: 'Διεύρυνση οριζόντων',
    tr: 'Ufuk genişletme', fr: 'Élargissement d\'horizon', es: 'Expansión de horizonte', it: 'Espansione dell\'orizzonte',
  },
  'booksearch.rank1': {
    de: '#1 Bester Treffer', en: '#1 Best Match', el: '#1 Καλύτερη αντιστοιχία',
    tr: '#1 En İyi Eşleşme', fr: '#1 Meilleure correspondance', es: '#1 Mejor coincidencia', it: '#1 Miglior corrispondenza',
  },
  'booksearch.rank2': {
    de: '#2 Sehr gut', en: '#2 Very Good', el: '#2 Πολύ καλό',
    tr: '#2 Çok İyi', fr: '#2 Très bon', es: '#2 Muy bueno', it: '#2 Molto buono',
  },
  'booksearch.rank3': {
    de: '#3 Empfohlen', en: '#3 Recommended', el: '#3 Προτεινόμενο',
    tr: '#3 Önerilen', fr: '#3 Recommandé', es: '#3 Recomendado', it: '#3 Consigliato',
  },
  'booksearch.noBooksLang': {
    de: 'Noch keine lokalen Bücher auf', en: 'No local books yet in',
    el: 'Δεν υπάρχουν ακόμα τοπικά βιβλία σε', tr: 'Henüz yerel kitap yok:',
    fr: 'Pas encore de livres locaux en', es: 'Aún no hay libros locales en', it: 'Ancora nessun libro locale in',
  },
  'booksearch.noBooksGeneral': {
    de: 'Keine Bücher gefunden', en: 'No books found', el: 'Δεν βρέθηκαν βιβλία',
    tr: 'Kitap bulunamadı', fr: 'Aucun livre trouvé', es: 'No se encontraron libros', it: 'Nessun libro trovato',
  },
  'booksearch.noBooksSuggestDiscover': {
    de: 'Probiere die Buchsuche über BookDiscover – dort findest du Google Books auf', 
    en: 'Try book search via BookDiscover – find Google Books in',
    el: 'Δοκίμασε το BookDiscover – βρες Google Books σε', tr: 'BookDiscover\'ı dene – Google Books\'ta bul:',
    fr: 'Essayez BookDiscover – trouvez Google Books en', es: 'Prueba BookDiscover – encuentra Google Books en', it: 'Prova BookDiscover – trova Google Books in',
  },
  'booksearch.noBooksTryNew': {
    de: 'Versuche eine neue Suche mit anderen Einstellungen.', en: 'Try a new search with different settings.',
    el: 'Δοκίμασε νέα αναζήτηση με διαφορετικές ρυθμίσεις.', tr: 'Farklı ayarlarla yeni bir arama deneyin.',
    fr: 'Essayez une nouvelle recherche avec d\'autres paramètres.', es: 'Intenta una nueva búsqueda con otras configuraciones.', it: 'Prova una nuova ricerca con impostazioni diverse.',
  },
  'booksearch.toBookDiscover': {
    de: 'Zu BookDiscover →', en: 'Go to BookDiscover →', el: 'Στο BookDiscover →',
    tr: 'BookDiscover\'a git →', fr: 'Aller à BookDiscover →', es: 'Ir a BookDiscover →', it: 'Vai a BookDiscover →',
  },
  'booksearch.buchsprachePill': {
    de: 'Buchsprache', en: 'Book language', el: 'Γλώσσα βιβλίου',
    tr: 'Kitap dili', fr: 'Langue du livre', es: 'Idioma del libro', it: 'Lingua del libro',
  },
  'booksearch.kaufregionPill': {
    de: 'Kaufregion', en: 'Shopping region', el: 'Περιοχή αγορών',
    tr: 'Alışveriş bölgesi', fr: 'Région d\'achat', es: 'Región de compra', it: 'Regione di acquisto',
  },

  // ── Phase 2: Hinweise / Info ──────────────────────────────────────────────
  // ── ProgressModule ────────────────────────────────────────────────────────
  'progress.weeklyProgress': {
    de: 'Wochenfortschritt', en: 'Weekly Progress', el: 'Εβδομαδιαία πρόοδος',
    tr: 'Haftalık ilerleme', fr: 'Progrès hebdomadaire', es: 'Progreso semanal', it: 'Progresso settimanale',
  },
  'progress.monthlyProgress': {
    de: 'Monatsfortschritt', en: 'Monthly Progress', el: 'Μηνιαία πρόοδος',
    tr: 'Aylık ilerleme', fr: 'Progrès mensuel', es: 'Progreso mensual', it: 'Progresso mensile',
  },
  'progress.yearlyProgress': {
    de: 'Jahresfortschritt', en: 'Yearly Progress', el: 'Ετήσια πρόοδος',
    tr: 'Yıllık ilerleme', fr: 'Progrès annuel', es: 'Progreso anual', it: 'Progresso annuale',
  },
  'progress.pagesThisWeek': {
    de: 'Seiten diese Woche', en: 'Pages this week', el: 'Σελίδες αυτή την εβδομάδα',
    tr: 'Bu haftaki sayfalar', fr: 'Pages cette semaine', es: 'Páginas esta semana', it: 'Pagine questa settimana',
  },
  'progress.pages': {
    de: 'Seiten', en: 'Pages', el: 'Σελίδες',
    tr: 'Sayfalar', fr: 'Pages', es: 'Páginas', it: 'Pagine',
  },
  'progress.discovered': {
    de: 'Entdeckt', en: 'Discovered', el: 'Ανακαλύφθηκαν',
    tr: 'Keşfedildi', fr: 'Découverts', es: 'Descubiertos', it: 'Scoperti',
  },
  'progress.saved': {
    de: 'Gespeichert', en: 'Saved', el: 'Αποθηκεύτηκαν',
    tr: 'Kaydedildi', fr: 'Sauvegardés', es: 'Guardados', it: 'Salvati',
  },
  'progress.monthView': {
    de: 'Monatsansicht', en: 'Month view', el: 'Μηνιαία προβολή',
    tr: 'Aylık görünüm', fr: 'Vue mensuelle', es: 'Vista mensual', it: 'Vista mensile',
  },
  'progress.yearView': {
    de: 'Jahresansicht', en: 'Year view', el: 'Ετήσια προβολή',
    tr: 'Yıllık görünüm', fr: 'Vue annuelle', es: 'Vista anual', it: 'Vista annuale',
  },
  'progress.total': {
    de: 'Gesamt:', en: 'Total:', el: 'Σύνολο:',
    tr: 'Toplam:', fr: 'Total :', es: 'Total:', it: 'Totale:',
  },
  'progress.week': {
    de: 'Woche', en: 'Week', el: 'Εβδομάδα',
    tr: 'Hafta', fr: 'Semaine', es: 'Semana', it: 'Settimana',
  },
  'progress.month': {
    de: 'Monat', en: 'Month', el: 'Μήνας',
    tr: 'Ay', fr: 'Mois', es: 'Mes', it: 'Mese',
  },
  'progress.year': {
    de: 'Jahr', en: 'Year', el: 'Έτος',
    tr: 'Yıl', fr: 'Année', es: 'Año', it: 'Anno',
  },
  'progress.books': {
    de: 'Bücher', en: 'Books', el: 'Βιβλία',
    tr: 'Kitaplar', fr: 'Livres', es: 'Libros', it: 'Libri',
  },
  'progress.streak': {
    de: 'Streak', en: 'Streak', el: 'Σερί',
    tr: 'Seri', fr: 'Série', es: 'Racha', it: 'Serie',
  },
  'progress.dayMo': { de: 'Mo', en: 'Mo', el: 'Δε', tr: 'Pzt', fr: 'Lu', es: 'Lu', it: 'Lu' },
  'progress.dayTu': { de: 'Di', en: 'Tu', el: 'Τρ', tr: 'Sa', fr: 'Ma', es: 'Ma', it: 'Ma' },
  'progress.dayWe': { de: 'Mi', en: 'We', el: 'Τε', tr: 'Ça', fr: 'Me', es: 'Mi', it: 'Me' },
  'progress.dayTh': { de: 'Do', en: 'Th', el: 'Πέ', tr: 'Pe', fr: 'Je', es: 'Ju', it: 'Gi' },
  'progress.dayFr': { de: 'Fr', en: 'Fr', el: 'Πα', tr: 'Cu', fr: 'Ve', es: 'Vi', it: 'Ve' },
  'progress.daySa': { de: 'Sa', en: 'Sa', el: 'Σά', tr: 'Ct', fr: 'Sa', es: 'Sá', it: 'Sa' },
  'progress.daySu': { de: 'So', en: 'Su', el: 'Κυ', tr: 'Pz', fr: 'Di', es: 'Do', it: 'Do' },
  'progress.month.jan': { de: 'Jan', en: 'Jan', el: 'Ιαν', tr: 'Oca', fr: 'Jan', es: 'Ene', it: 'Gen' },
  'progress.month.feb': { de: 'Feb', en: 'Feb', el: 'Φεβ', tr: 'Şub', fr: 'Fév', es: 'Feb', it: 'Feb' },
  'progress.month.mar': { de: 'Mär', en: 'Mar', el: 'Μάρ', tr: 'Mar', fr: 'Mar', es: 'Mar', it: 'Mar' },
  'progress.month.apr': { de: 'Apr', en: 'Apr', el: 'Απρ', tr: 'Nis', fr: 'Avr', es: 'Abr', it: 'Apr' },
  'progress.month.may': { de: 'Mai', en: 'May', el: 'Μάι', tr: 'May', fr: 'Mai', es: 'May', it: 'Mag' },
  'progress.month.jun': { de: 'Jun', en: 'Jun', el: 'Ιούν', tr: 'Haz', fr: 'Jun', es: 'Jun', it: 'Giu' },
  'progress.month.jul': { de: 'Jul', en: 'Jul', el: 'Ιούλ', tr: 'Tem', fr: 'Jul', es: 'Jul', it: 'Lug' },
  'progress.month.aug': { de: 'Aug', en: 'Aug', el: 'Αύγ', tr: 'Ağu', fr: 'Aoû', es: 'Ago', it: 'Ago' },
  'progress.month.sep': { de: 'Sep', en: 'Sep', el: 'Σεπ', tr: 'Eyl', fr: 'Sep', es: 'Sep', it: 'Set' },
  'progress.month.oct': { de: 'Okt', en: 'Oct', el: 'Οκτ', tr: 'Eki', fr: 'Oct', es: 'Oct', it: 'Ott' },
  'progress.month.nov': { de: 'Nov', en: 'Nov', el: 'Νοε', tr: 'Kas', fr: 'Nov', es: 'Nov', it: 'Nov' },
  'progress.month.dec': { de: 'Dez', en: 'Dec', el: 'Δεκ', tr: 'Ara', fr: 'Déc', es: 'Dic', it: 'Dic' },
  'progress.vsPrevWeek': {
    de: 'vs. Vorwoche', en: 'vs. last week', el: 'σε σχέση με την προηγούμενη εβδομάδα',
    tr: 'geçen haftaya göre', fr: 'vs sem. préc.', es: 'vs semana ant.', it: 'vs sett. prec.',
  },
  'progress.letsGo': {
    de: '📚 Los geht\'s!', en: '📚 Let\'s go!', el: '📚 Πάμε!',
    tr: '📚 Hadi gidelim!', fr: '📚 C\'est parti !', es: '📚 ¡Vamos!', it: '📚 Andiamo!',
  },
  'progress.keepGoing': {
    de: '💪 Weiter so!', en: '💪 Keep it up!', el: '💪 Συνέχισε!',
    tr: '💪 Devam et!', fr: '💪 Continue !', es: '💪 ¡Sigue así!', it: '💪 Continua così!',
  },

  // ── CreateEventModal ──────────────────────────────────────────────────────
  'createEvent.title': {
    de: 'Neuer Lese-Termin', en: 'New Reading Event', el: 'Νέα εκδήλωση ανάγνωσης',
    tr: 'Yeni okuma etkinliği', fr: 'Nouvel événement lecture', es: 'Nuevo evento de lectura', it: 'Nuovo evento di lettura',
  },
  'createEvent.titleLabel': {
    de: 'Titel', en: 'Title', el: 'Τίτλος',
    tr: 'Başlık', fr: 'Titre', es: 'Título', it: 'Titolo',
  },
  'createEvent.titlePlaceholder': {
    de: 'z.B. Club-Treffen, Buch kaufen…', en: 'E.g. Club meeting, buy book…',
    el: 'π.χ. Συνάντηση λέσχης, αγορά βιβλίου…', tr: 'Örn. Kulüp toplantısı, kitap al…',
    fr: 'Ex. réunion club, acheter livre…', es: 'Ej. Reunión del club, comprar libro…', it: 'Es. Riunione club, acquistare libro…',
  },
  'createEvent.categoryLabel': {
    de: 'Kategorie', en: 'Category', el: 'Κατηγορία',
    tr: 'Kategori', fr: 'Catégorie', es: 'Categoría', it: 'Categoria',
  },
  'createEvent.dateLabel': {
    de: 'Datum', en: 'Date', el: 'Ημερομηνία',
    tr: 'Tarih', fr: 'Date', es: 'Fecha', it: 'Data',
  },
  'createEvent.timeLabel': {
    de: 'Uhrzeit', en: 'Time', el: 'Ώρα',
    tr: 'Saat', fr: 'Heure', es: 'Hora', it: 'Ora',
  },
  'createEvent.linkBook': {
    de: 'Buch verknüpfen (optional)', en: 'Link a book (optional)', el: 'Σύνδεση βιβλίου (προαιρετικό)',
    tr: 'Kitap bağla (isteğe bağlı)', fr: 'Lier un livre (optionnel)', es: 'Vincular un libro (opcional)', it: 'Collega un libro (opzionale)',
  },
  'createEvent.notesLabel': {
    de: 'Notizen (optional)', en: 'Notes (optional)', el: 'Σημειώσεις (προαιρετικό)',
    tr: 'Notlar (isteğe bağlı)', fr: 'Notes (optionnel)', es: 'Notas (opcional)', it: 'Note (opzionale)',
  },
  'createEvent.notesPlaceholder': {
    de: 'Details, Links, Erinnerungen…', en: 'Details, links, reminders…', el: 'Λεπτομέρειες, σύνδεσμοι, υπενθυμίσεις…',
    tr: 'Detaylar, bağlantılar, hatırlatmalar…', fr: 'Détails, liens, rappels…', es: 'Detalles, enlaces, recordatorios…', it: 'Dettagli, link, promemoria…',
  },
  'createEvent.cancel': {
    de: 'Abbrechen', en: 'Cancel', el: 'Άκυρο',
    tr: 'İptal', fr: 'Annuler', es: 'Cancelar', it: 'Annulla',
  },
  'createEvent.save': {
    de: 'Termin erstellen', en: 'Create Event', el: 'Δημιουργία εκδήλωσης',
    tr: 'Etkinlik oluştur', fr: 'Créer l\'événement', es: 'Crear evento', it: 'Crea evento',
  },
  'createEvent.saving': {
    de: 'Speichern…', en: 'Saving…', el: 'Αποθήκευση…',
    tr: 'Kaydediliyor…', fr: 'Enregistrement…', es: 'Guardando…', it: 'Salvataggio…',
  },

  // ── EventsList ────────────────────────────────────────────────────────────
  'events.title': {
    de: 'Lese-Termine', en: 'Reading Events', el: 'Εκδηλώσεις ανάγνωσης',
    tr: 'Okuma etkinlikleri', fr: 'Événements lecture', es: 'Eventos de lectura', it: 'Eventi di lettura',
  },
  'events.new': {
    de: 'Neu', en: 'New', el: 'Νέο',
    tr: 'Yeni', fr: 'Nouveau', es: 'Nuevo', it: 'Nuovo',
  },
  'events.loading': {
    de: 'Lädt...', en: 'Loading...', el: 'Φόρτωση...',
    tr: 'Yükleniyor...', fr: 'Chargement...', es: 'Cargando...', it: 'Caricamento...',
  },
  'events.empty': {
    de: 'Noch keine Termine – jetzt erstellen', en: 'No events yet – create one now',
    el: 'Δεν υπάρχουν εκδηλώσεις – δημιουργήστε τώρα', tr: 'Henüz etkinlik yok – şimdi oluşturun',
    fr: 'Pas encore d\'événements – créez-en un', es: 'Aún no hay eventos – crea uno ahora', it: 'Nessun evento ancora – creane uno ora',
  },
  'events.cat.lesen':     { de: '📖 Buch lesen', en: '📖 Read Book', el: '📖 Ανάγνωση βιβλίου', tr: '📖 Kitap oku', fr: '📖 Lire un livre', es: '📖 Leer libro', it: '📖 Leggi libro' },
  'events.cat.challenge': { de: '🏆 Challenge', en: '🏆 Challenge', el: '🏆 Πρόκληση', tr: '🏆 Meydan okuma', fr: '🏆 Défi', es: '🏆 Reto', it: '🏆 Sfida' },
  'events.cat.club':      { de: '👥 Buchclub', en: '👥 Book Club', el: '👥 Λέσχη βιβλίου', tr: '👥 Kitap kulübü', fr: '👥 Club lecture', es: '👥 Club del libro', it: '👥 Club del libro' },
  'events.cat.diskussion':{ de: '💬 Diskussion', en: '💬 Discussion', el: '💬 Συζήτηση', tr: '💬 Tartışma', fr: '💬 Discussion', es: '💬 Discusión', it: '💬 Discussione' },
  'events.cat.geschenk':  { de: '🎁 Geschenk', en: '🎁 Gift', el: '🎁 Δώρο', tr: '🎁 Hediye', fr: '🎁 Cadeau', es: '🎁 Regalo', it: '🎁 Regalo' },
  'events.cat.sonstiges': { de: '📌 Sonstiges', en: '📌 Other', el: '📌 Άλλο', tr: '📌 Diğer', fr: '📌 Autre', es: '📌 Otro', it: '📌 Altro' },
  'events.today': {
    de: 'Heute', en: 'Today', el: 'Σήμερα',
    tr: 'Bugün', fr: 'Aujourd\'hui', es: 'Hoy', it: 'Oggi',
  },

  // ── QuotesSection ─────────────────────────────────────────────────────────
  'quotes.title': {
    de: 'Meine Zitate', en: 'My Quotes', el: 'Τα αποσπάσματά μου',
    tr: 'Alıntılarım', fr: 'Mes citations', es: 'Mis citas', it: 'Le mie citazioni',
  },
  'quotes.new': {
    de: 'Neu', en: 'New', el: 'Νέο',
    tr: 'Yeni', fr: 'Nouveau', es: 'Nuevo', it: 'Nuovo',
  },
  'quotes.empty': {
    de: 'Noch keine Zitate hinzugefügt', en: 'No quotes added yet',
    el: 'Δεν έχουν προστεθεί αποσπάσματα', tr: 'Henüz alıntı eklenmedi',
    fr: 'Aucune citation ajoutée', es: 'Aún no hay citas', it: 'Nessuna citazione ancora',
  },
  'quotes.camera': {
    de: 'Kamera', en: 'Camera', el: 'Κάμερα',
    tr: 'Kamera', fr: 'Caméra', es: 'Cámara', it: 'Fotocamera',
  },
  'quotes.manual': {
    de: 'Manuell', en: 'Manual', el: 'Χειροκίνητα',
    tr: 'Manuel', fr: 'Manuel', es: 'Manual', it: 'Manuale',
  },
  'quotes.placeholder': {
    de: 'Zitat eingeben...', en: 'Enter quote...', el: 'Εισάγετε απόσπασμα...',
    tr: 'Alıntı girin...', fr: 'Saisir une citation...', es: 'Ingresar cita...', it: 'Inserisci citazione...',
  },
  'quotes.pageNumber': {
    de: 'Seitenzahl (optional)', en: 'Page number (optional)', el: 'Αριθμός σελίδας (προαιρετικό)',
    tr: 'Sayfa numarası (isteğe bağlı)', fr: 'Numéro de page (optionnel)', es: 'Número de página (opcional)', it: 'Numero pagina (opzionale)',
  },
  'quotes.saving': {
    de: 'Wird bearbeitet...', en: 'Saving...', el: 'Αποθήκευση...',
    tr: 'Kaydediliyor...', fr: 'Enregistrement...', es: 'Guardando...', it: 'Salvataggio...',
  },
  'quotes.save': {
    de: 'Speichern', en: 'Save', el: 'Αποθήκευση',
    tr: 'Kaydet', fr: 'Enregistrer', es: 'Guardar', it: 'Salva',
  },
  'quotes.cancel': {
    de: 'Abbrechen', en: 'Cancel', el: 'Άκυρο',
    tr: 'İptal', fr: 'Annuler', es: 'Cancelar', it: 'Annulla',
  },
  'quotes.cameraHint': {
    de: 'Fotografiere den Zitat-Text oder lade ein Bild hoch', en: 'Photograph the quote text or upload an image',
    el: 'Φωτογράφισε το κείμενο ή ανέβασε εικόνα', tr: 'Alıntı metnini fotoğrafla veya resim yükle',
    fr: 'Photographiez le texte ou téléchargez une image', es: 'Fotografía el texto o sube una imagen', it: 'Fotografa il testo o carica un\'immagine',
  },
  'quotes.captureSuccess': { de: 'Text erfasst', en: 'Text captured', el: 'Το κείμενο καταγράφηκε', tr: 'Metin yakalandı', fr: 'Texte capturé', es: 'Texto capturado', it: 'Testo catturato' },
  'quotes.captureError':   { de: 'Fehler beim Erfassen', en: 'Error capturing text', el: 'Σφάλμα κατά την καταγραφή', tr: 'Metin yakalama hatası', fr: 'Erreur de capture', es: 'Error al capturar', it: 'Errore nella cattura' },
  'quotes.errorEmpty':     { de: 'Bitte gib ein Zitat ein', en: 'Please enter a quote', el: 'Παρακαλώ εισάγετε ένα απόσπασμα', tr: 'Lütfen bir alıntı girin', fr: 'Veuillez saisir une citation', es: 'Por favor ingresa una cita', it: 'Per favore inserisci una citazione' },
  'quotes.saveError':      { de: 'Fehler beim Speichern', en: 'Error saving quote', el: 'Σφάλμα αποθήκευσης', tr: 'Kaydetme hatası', fr: 'Erreur d\'enregistrement', es: 'Error al guardar', it: 'Errore nel salvataggio' },
  'quotes.added':          { de: 'Zitat hinzugefügt', en: 'Quote added', el: 'Το απόσπασμα προστέθηκε', tr: 'Alıntı eklendi', fr: 'Citation ajoutée', es: 'Cita añadida', it: 'Citazione aggiunta' },
  'quotes.unknown':        { de: 'Unbekannt', en: 'Unknown', el: 'Άγνωστο', tr: 'Bilinmiyor', fr: 'Inconnu', es: 'Desconocido', it: 'Sconosciuto' },
  'quotes.pageAbbrev': {
    de: 'S.', en: 'p.', el: 'σ.',
    tr: 's.', fr: 'p.', es: 'p.', it: 'p.',
  },

  // ── ChallengesSection ─────────────────────────────────────────────────────
  'challenges.joinedToast':   { de: 'Challenge beigetreten!', en: 'Joined challenge!', el: 'Συμμετείχες στην πρόκληση!', tr: 'Meydan okumaya katıldın!', fr: 'Défi rejoint !', es: '¡Te uniste al reto!', it: 'Sfida unita!' },
  'challenges.joinErrorToast':{ de: 'Fehler beim Beitreten', en: 'Error joining', el: 'Σφάλμα συμμετοχής', tr: 'Katılım hatası', fr: 'Erreur d\'adhésion', es: 'Error al unirse', it: 'Errore nell\'adesione' },
  'challenges.leftToast':     { de: 'Challenge verlassen!', en: 'Left challenge!', el: 'Αποχώρησες από την πρόκληση!', tr: 'Meydan okumadan ayrıldın!', fr: 'Défi quitté !', es: '¡Abandonaste el reto!', it: 'Sfida abbandonata!' },
  'challenges.leaveErrorToast':{ de: 'Fehler beim Verlassen', en: 'Error leaving', el: 'Σφάλμα αποχώρησης', tr: 'Ayrılma hatası', fr: 'Erreur de départ', es: 'Error al abandonar', it: 'Errore nell\'uscita' },
  'challenges.title': {
    de: 'Reading Challenges', en: 'Reading Challenges', el: 'Προκλήσεις ανάγνωσης',
    tr: 'Okuma meydan okumaları', fr: 'Défis lecture', es: 'Retos de lectura', it: 'Sfide lettura',
  },
  'challenges.active': {
    de: 'Deine aktiven Challenges:', en: 'Your active challenges:', el: 'Οι ενεργές προκλήσεις σου:',
    tr: 'Aktif meydan okumalarım:', fr: 'Vos défis actifs :', es: 'Tus retos activos:', it: 'Le tue sfide attive:',
  },
  'challenges.more': {
    de: 'Weitere Challenges', en: 'More Challenges', el: 'Περισσότερες προκλήσεις',
    tr: 'Daha fazla meydan okuma', fr: 'Plus de défis', es: 'Más retos', it: 'Altre sfide',
  },
  'challenges.none': {
    de: 'Keine Challenges verfügbar', en: 'No challenges available', el: 'Δεν υπάρχουν διαθέσιμες προκλήσεις',
    tr: 'Mevcut meydan okuma yok', fr: 'Aucun défi disponible', es: 'No hay retos disponibles', it: 'Nessuna sfida disponibile',
  },
  'challenges.allJoined': {
    de: 'Du hast an allen Challenges teilgenommen 🎉', en: 'You\'ve joined all challenges 🎉',
    el: 'Συμμετέχεις σε όλες τις προκλήσεις 🎉', tr: 'Tüm meydan okumalara katıldın 🎉',
    fr: 'Vous avez rejoint tous les défis 🎉', es: '¡Participas en todos los retos! 🎉', it: 'Hai partecipato a tutte le sfide 🎉',
  },
  'challenges.join': {
    de: 'Beitreten', en: 'Join', el: 'Συμμετοχή',
    tr: 'Katıl', fr: 'Rejoindre', es: 'Unirse', it: 'Partecipa',
  },
  'challenges.joining': {
    de: 'Wird beigetreten...', en: 'Joining...', el: 'Γίνεται συμμετοχή...',
    tr: 'Katılınıyor...', fr: 'Adhésion...', es: 'Uniéndose...', it: 'Partecipazione...',
  },
  'challenges.leave': {
    de: 'Verlassen', en: 'Leave', el: 'Αποχώρηση',
    tr: 'Ayrıl', fr: 'Quitter', es: 'Abandonar', it: 'Lascia',
  },
  'challenges.easy': {
    de: 'Einfach', en: 'Easy', el: 'Εύκολο',
    tr: 'Kolay', fr: 'Facile', es: 'Fácil', it: 'Facile',
  },
  'challenges.medium': {
    de: 'Mittel', en: 'Medium', el: 'Μεσαίο',
    tr: 'Orta', fr: 'Moyen', es: 'Medio', it: 'Medio',
  },
  'challenges.hard': {
    de: 'Schwer', en: 'Hard', el: 'Δύσκολο',
    tr: 'Zor', fr: 'Difficile', es: 'Difícil', it: 'Difficile',
  },
  'challenges.booksUnit': {
    de: 'Bücher', en: 'books', el: 'βιβλία',
    tr: 'kitap', fr: 'livres', es: 'libros', it: 'libri',
  },
  'challenges.pagesUnit': {
    de: 'Seiten', en: 'pages', el: 'σελίδες',
    tr: 'sayfa', fr: 'pages', es: 'páginas', it: 'pagine',
  },
  'challenges.participants': {
    de: 'Teilnehmer', en: 'participants', el: 'συμμετέχοντες',
    tr: 'katılımcı', fr: 'participants', es: 'participantes', it: 'partecipanti',
  },

  // ── FollowingSection ──────────────────────────────────────────────────────
  'network.title': {
    de: 'Mein Netzwerk', en: 'My Network', el: 'Το δίκτυό μου',
    tr: 'Ağım', fr: 'Mon réseau', es: 'Mi red', it: 'La mia rete',
  },
  'network.iFollow': {
    de: 'Ich folge', en: 'I follow', el: 'Ακολουθώ',
    tr: 'Takip ettiklerim', fr: 'Je suis', es: 'Sigo', it: 'Seguo',
  },
  'network.followMe': {
    de: 'Folgen mir', en: 'Follow me', el: 'Με ακολουθούν',
    tr: 'Beni takip edenler', fr: 'Me suivent', es: 'Me siguen', it: 'Mi seguono',
  },
  'network.noFollowing': {
    de: 'Du folgst noch niemandem.', en: 'You\'re not following anyone yet.',
    el: 'Δεν ακολουθείς κανέναν ακόμα.', tr: 'Henüz kimseyi takip etmiyorsun.',
    fr: 'Vous ne suivez personne pour l\'instant.', es: 'Aún no sigues a nadie.', it: 'Non stai ancora seguendo nessuno.',
  },
  'network.noFollowers': {
    de: 'Noch keine Follower.', en: 'No followers yet.',
    el: 'Δεν υπάρχουν ακόλουθοι ακόμα.', tr: 'Henüz takipçi yok.',
    fr: 'Pas encore de followers.', es: 'Aún no hay seguidores.', it: 'Ancora nessun follower.',
  },
  'network.showAll': {
    de: 'Alle', en: 'Show all', el: 'Όλοι',
    tr: 'Tümünü göster', fr: 'Voir tous', es: 'Ver todos', it: 'Vedi tutti',
  },

  // ── Compass reflection questions ──────────────────────────────────────────
  'compass.rq1': {
    de: 'Was hat dich heute beim Lesen überrascht oder irritiert?',
    en: 'What surprised or puzzled you while reading today?',
    el: 'Τι σε εξέπληξε ή σε μπέρδεψε κατά την ανάγνωση σήμερα;',
    tr: 'Bugün okurken seni şaşırtan ya da rahatsız eden ne oldu?',
    fr: 'Qu\'est-ce qui vous a surpris ou dérangé lors de votre lecture aujourd\'hui ?',
    es: '¿Qué te sorprendió o desconcertó mientras leías hoy?',
    it: 'Cosa ti ha sorpreso o turbato mentre leggevi oggi?',
  },
  'compass.rq2': {
    de: 'Welcher Gedanke aus dem Buch beschäftigt dich gerade am meisten?',
    en: 'Which thought from the book is occupying you most right now?',
    el: 'Ποια σκέψη από το βιβλίο σε απασχολεί περισσότερο τώρα;',
    tr: 'Kitaptan hangi düşünce şu anda seni en çok meşgul ediyor?',
    fr: 'Quelle pensée du livre vous occupe le plus en ce moment ?',
    es: '¿Qué pensamiento del libro te ocupa más ahora mismo?',
    it: 'Quale pensiero del libro ti occupa di più in questo momento?',
  },
  'compass.rq3': {
    de: 'Was würdest du anders machen als die Person im Buch?',
    en: 'What would you do differently from the person in the book?',
    el: 'Τι θα έκανες διαφορετικά από τον χαρακτήρα στο βιβλίο;',
    tr: 'Kitaptaki kişiden farklı ne yapardın?',
    fr: 'Que feriez-vous différemment de la personne dans le livre ?',
    es: '¿Qué harías diferente a la persona del libro?',
    it: 'Cosa faresti diversamente dalla persona nel libro?',
  },
  'compass.rq4': {
    de: 'Woran erinnert dich das Gelesene aus deinem eigenen Leben?',
    en: 'What from your own life does the reading remind you of?',
    el: 'Σε τι από τη ζωή σου σε θυμίζει αυτό που διάβασες;',
    tr: 'Okuduklarınız kendi hayatınızdan neyi hatırlatıyor?',
    fr: 'À quoi de votre vie personnelle cette lecture vous fait-elle penser ?',
    es: '¿De qué de tu propia vida te recuerda lo leído?',
    it: 'A cosa della tua vita ti ricorda ciò che hai letto?',
  },
  'compass.rq5': {
    de: 'Was verstehst du jetzt besser als vor dieser Lesesession?',
    en: 'What do you understand better now than before this reading session?',
    el: 'Τι καταλαβαίνεις τώρα καλύτερα από ό,τι πριν;',
    tr: 'Bu okuma oturumundan önceye göre şimdi neyi daha iyi anlıyorsun?',
    fr: 'Qu\'est-ce que vous comprenez mieux maintenant qu\'avant cette session de lecture ?',
    es: '¿Qué entiendes mejor ahora que antes de esta sesión de lectura?',
    it: 'Cosa capisci meglio ora rispetto a prima di questa sessione di lettura?',
  },

  // ── BookSearch – Step label ───────────────────────────────────────────────
  'booksearch.step': {
    de: 'Schritt {n} von {total}', en: 'Step {n} of {total}', el: 'Βήμα {n} από {total}',
    tr: 'Adım {n} / {total}', fr: 'Étape {n} sur {total}', es: 'Paso {n} de {total}', it: 'Passo {n} di {total}',
  },

  // ── BookSearch – Question: age ────────────────────────────────────────────
  'q.age.question': {
    de: 'Für wen suchst du ein Buch?', en: 'Who are you looking for a book for?',
    el: 'Για ποιον ψάχνεις βιβλίο;', tr: 'Kime kitap arıyorsunuz?',
    fr: 'Pour qui cherchez-vous un livre ?', es: '¿Para quién buscas un libro?', it: 'Per chi stai cercando un libro?',
  },
  'q.age.kinder': {
    de: 'Für Kinder (6-12 Jahre)', en: 'For Children (6-12)', el: 'Για Παιδιά (6-12)',
    tr: 'Çocuklar için (6-12)', fr: 'Pour Enfants (6-12)', es: 'Para Niños (6-12)', it: 'Per Bambini (6-12)',
  },
  'q.age.jugendliche': {
    de: 'Für Jugendliche (13-17 Jahre)', en: 'For Teens (13-17)', el: 'Για Εφήβους (13-17)',
    tr: 'Gençler için (13-17)', fr: 'Pour Adolescents (13-17)', es: 'Para Jóvenes (13-17)', it: 'Per Ragazzi (13-17)',
  },
  'q.age.erwachsene': {
    de: 'Für Erwachsene (18+ Jahre)', en: 'For Adults (18+)', el: 'Για Ενήλικες (18+)',
    tr: 'Yetişkinler için (18+)', fr: 'Pour Adultes (18+)', es: 'Para Adultos (18+)', it: 'Per Adulti (18+)',
  },

  // ── BookSearch – Question: book_language ──────────────────────────────────
  'q.bookLang.question': {
    de: 'In welcher Sprache soll das Buch sein?', en: 'In which language should the book be?',
    el: 'Σε ποια γλώσσα να είναι το βιβλίο;', tr: 'Kitap hangi dilde olmalı?',
    fr: 'Dans quelle langue doit être le livre ?', es: '¿En qué idioma debe estar el libro?', it: 'In quale lingua deve essere il libro?',
  },
  'q.bookLang.any': {
    de: '🌍 Mehrere / egal', en: '🌍 Multiple / any', el: '🌍 Πολλές / ό,τι',
    tr: '🌍 Birden fazla / farketmez', fr: '🌍 Plusieurs / peu importe', es: '🌍 Varias / da igual', it: '🌍 Più lingue / qualsiasi',
  },

  // ── BookSearch – Question: age_range (Kinder) ─────────────────────────────
  'q.ageRange.question': {
    de: 'Wie alt bist du?', en: 'How old are you?', el: 'Πόσο χρονών είσαι;',
    tr: 'Kaç yaşındasın?', fr: 'Quel âge as-tu ?', es: '¿Cuántos años tienes?', it: 'Quanti anni hai?',
  },
  'q.ageRange.6-8':  { de: '6–8 Jahre 📚', en: '6–8 years 📚', el: '6–8 χρονών 📚', tr: '6–8 yaş 📚', fr: '6–8 ans 📚', es: '6–8 años 📚', it: '6–8 anni 📚' },
  'q.ageRange.9-10': { de: '9–10 Jahre 🌟', en: '9–10 years 🌟', el: '9–10 χρονών 🌟', tr: '9–10 yaş 🌟', fr: '9–10 ans 🌟', es: '9–10 años 🌟', it: '9–10 anni 🌟' },
  'q.ageRange.11-12':{ de: '11–12 Jahre 🚀', en: '11–12 years 🚀', el: '11–12 χρονών 🚀', tr: '11–12 yaş 🚀', fr: '11–12 ans 🚀', es: '11–12 años 🚀', it: '11–12 anni 🚀' },

  // ── BookSearch – Question: topic (Kinder) ─────────────────────────────────
  'q.topicKids.question': {
    de: 'Was magst du am liebsten?', en: 'What do you like most?', el: 'Τι σου αρέσει περισσότερο;',
    tr: 'En çok neyi seviyorsun?', fr: 'Qu\'aimes-tu le plus ?', es: '¿Qué te gusta más?', it: 'Cosa ti piace di più?',
  },
  'q.topic.abenteuer.kids':    { de: '🗺️ Abenteuer & Spannung', en: '🗺️ Adventure & Excitement', el: '🗺️ Περιπέτεια & Συναρπαστικό', tr: '🗺️ Macera & Heyecan', fr: '🗺️ Aventure & Suspense', es: '🗺️ Aventura & Emoción', it: '🗺️ Avventura & Brivido' },
  'q.topic.magie':             { de: '✨ Magie & Fantasie', en: '✨ Magic & Fantasy', el: '✨ Μαγεία & Φαντασία', tr: '✨ Sihir & Fantezi', fr: '✨ Magie & Fantaisie', es: '✨ Magia & Fantasía', it: '✨ Magia & Fantasia' },
  'q.topic.freundschaft.kids': { de: '🤝 Freundschaft', en: '🤝 Friendship', el: '🤝 Φιλία', tr: '🤝 Arkadaşlık', fr: '🤝 Amitié', es: '🤝 Amistad', it: '🤝 Amicizia' },
  'q.topic.lustiges':          { de: '😄 Lustige Bücher', en: '😄 Funny Books', el: '😄 Αστεία βιβλία', tr: '😄 Komik kitaplar', fr: '😄 Livres drôles', es: '😄 Libros divertidos', it: '😄 Libri divertenti' },
  'q.topic.tiere':             { de: '🐾 Tiere & Natur', en: '🐾 Animals & Nature', el: '🐾 Ζώα & Φύση', tr: '🐾 Hayvanlar & Doğa', fr: '🐾 Animaux & Nature', es: '🐾 Animales & Naturaleza', it: '🐾 Animali & Natura' },
  'q.topic.schule.kids':       { de: '🎒 Schule & Rätsel', en: '🎒 School & Puzzles', el: '🎒 Σχολείο & Γρίφοι', tr: '🎒 Okul & Bulmacalar', fr: '🎒 École & Énigmes', es: '🎒 Escuela & Acertijos', it: '🎒 Scuola & Indovinelli' },

  // ── BookSearch – Question: length (Kinder) ───────────────────────────────
  'q.lengthKids.question': {
    de: 'Wie lange möchtest du lesen?', en: 'How long do you want to read?', el: 'Πόσο θέλεις να διαβάσεις;',
    tr: 'Ne kadar okumak istiyorsun?', fr: 'Combien de temps veux-tu lire ?', es: '¿Cuánto tiempo quieres leer?', it: 'Quanto tempo vuoi leggere?',
  },
  'q.length.kurz.kids':  { de: '⏱️ Kurz (10–20 Min.)', en: '⏱️ Short (10–20 min)', el: '⏱️ Σύντομο (10–20 λεπτά)', tr: '⏱️ Kısa (10–20 dk)', fr: '⏱️ Court (10–20 min)', es: '⏱️ Corto (10–20 min)', it: '⏱️ Breve (10–20 min)' },
  'q.length.mittel.kids':{ de: '📖 Ein Kapitel täglich', en: '📖 A chapter a day', el: '📖 Ένα κεφάλαιο καθημερινά', tr: '📖 Günde bir bölüm', fr: '📖 Un chapitre par jour', es: '📖 Un capítulo diario', it: '📖 Un capitolo al giorno' },
  'q.length.lang.kids':  { de: '📚 Richtig eintauchen', en: '📚 Really dive in', el: '📚 Να βυθιστείς', tr: '📚 Gerçekten dalmak', fr: '📚 Vraiment plonger', es: '📚 Sumergirse de verdad', it: '📚 Immergersi davvero' },

  // ── BookSearch – Question: occasion (Jugendliche) ────────────────────────
  'q.occasion.question': {
    de: 'Wonach suchst du gerade?', en: 'What are you looking for right now?', el: 'Τι ψάχνεις αυτή τη στιγμή;',
    tr: 'Şu an ne arıyorsunuz?', fr: 'Que cherchez-vous en ce moment ?', es: '¿Qué buscas ahora mismo?', it: 'Cosa stai cercando in questo momento?',
  },
  'q.occasion.freizeit':  { de: '🎧 Einfach Spaß & Ablenkung', en: '🎧 Just fun & distraction', el: '🎧 Απλή διασκέδαση', tr: '🎧 Sadece eğlence', fr: '🎧 Juste du fun', es: '🎧 Solo diversión', it: '🎧 Solo divertimento' },
  'q.occasion.entdecken': { de: '🌍 Etwas Neues entdecken', en: '🌍 Discover something new', el: '🌍 Ανακαλύψτε κάτι νέο', tr: '🌍 Yeni şeyler keşfet', fr: '🌍 Découvrir quelque chose', es: '🌍 Descubrir algo nuevo', it: '🌍 Scoprire qualcosa' },
  'q.occasion.verstehen': { de: '💭 Mich selbst besser verstehen', en: '💭 Understand myself better', el: '💭 Να καταλάβω τον εαυτό μου', tr: '💭 Kendimi daha iyi anlamak', fr: '💭 Mieux me comprendre', es: '💭 Entenderme mejor', it: '💭 Capire meglio me stesso' },
  'q.occasion.schule':    { de: '📝 Etwas für die Schule', en: '📝 Something for school', el: '📝 Κάτι για το σχολείο', tr: '📝 Okul için bir şeyler', fr: '📝 Quelque chose pour l\'école', es: '📝 Algo para el colegio', it: '📝 Qualcosa per la scuola' },

  // ── BookSearch – Question: topic (Jugendliche) ───────────────────────────
  'q.topicTeens.question': {
    de: 'Was interessiert dich?', en: 'What interests you?', el: 'Τι σε ενδιαφέρει;',
    tr: 'Seni ne ilgilendiriyor?', fr: 'Qu\'est-ce qui vous intéresse ?', es: '¿Qué te interesa?', it: 'Cosa ti interessa?',
  },
  'q.topic.abenteuer.teens':    { de: '⚔️ Abenteuer & Fantasy', en: '⚔️ Adventure & Fantasy', el: '⚔️ Περιπέτεια & Φαντασία', tr: '⚔️ Macera & Fantezi', fr: '⚔️ Aventure & Fantasy', es: '⚔️ Aventura & Fantasía', it: '⚔️ Avventura & Fantasy' },
  'q.topic.liebe':              { de: '💕 Liebe & Gefühle', en: '💕 Love & Feelings', el: '💕 Αγάπη & Συναισθήματα', tr: '💕 Aşk & Duygular', fr: '💕 Amour & Émotions', es: '💕 Amor & Sentimientos', it: '💕 Amore & Sentimenti' },
  'q.topic.freundschaft.teens': { de: '🤜 Freundschaft & Zusammenhalt', en: '🤜 Friendship & Solidarity', el: '🤜 Φιλία & Αλληλεγγύη', tr: '🤜 Arkadaşlık & Dayanışma', fr: '🤜 Amitié & Solidarité', es: '🤜 Amistad & Unión', it: '🤜 Amicizia & Solidarietà' },
  'q.topic.selbstfindung':      { de: '🔍 Wer bin ich?', en: '🔍 Who am I?', el: '🔍 Ποιος είμαι;', tr: '🔍 Ben kimim?', fr: '🔍 Qui suis-je ?', es: '🔍 ¿Quién soy yo?', it: '🔍 Chi sono?' },
  'q.topic.gesellschaft':       { de: '🌐 Die Welt verstehen', en: '🌐 Understand the world', el: '🌐 Να καταλάβω τον κόσμο', tr: '🌐 Dünyayı anlamak', fr: '🌐 Comprendre le monde', es: '🌐 Entender el mundo', it: '🌐 Capire il mondo' },
  'q.topic.thriller_krimi.teens':{ de: '🕵️ Spannung & Krimi', en: '🕵️ Thriller & Crime', el: '🕵️ Θρίλερ & Αστυνομικά', tr: '🕵️ Gerilim & Suç', fr: '🕵️ Suspense & Policier', es: '🕵️ Suspense & Crimen', it: '🕵️ Suspense & Giallo' },

  // ── BookSearch – Question: length (Jugendliche) ──────────────────────────
  'q.lengthTeens.question': {
    de: 'Wie viel Zeit hast du?', en: 'How much time do you have?', el: 'Πόσο χρόνο έχεις;',
    tr: 'Ne kadar vaktin var?', fr: 'Combien de temps as-tu ?', es: '¿Cuánto tiempo tienes?', it: 'Quanto tempo hai?',
  },
  'q.length.kurz.teens':  { de: '⚡ 15–30 Minuten', en: '⚡ 15–30 minutes', el: '⚡ 15–30 λεπτά', tr: '⚡ 15–30 dakika', fr: '⚡ 15–30 minutes', es: '⚡ 15–30 minutos', it: '⚡ 15–30 minuti' },
  'q.length.mittel.teens':{ de: '📖 Ein paar Kapitel täglich', en: '📖 A few chapters daily', el: '📖 Μερικά κεφάλαια καθημερινά', tr: '📖 Günde birkaç bölüm', fr: '📖 Quelques chapitres par jour', es: '📖 Algunos capítulos diarios', it: '📖 Qualche capitolo al giorno' },
  'q.length.lang.teens':  { de: '🏊 Ich tauche gerne tief ein', en: '🏊 I like to dive deep', el: '🏊 Μου αρέσει να βυθίζομαι βαθιά', tr: '🏊 Derin dalmayı seviyorum', fr: '🏊 J\'aime plonger profondément', es: '🏊 Me gusta sumergirme', it: '🏊 Mi piace immergermi a fondo' },

  // ── BookSearch – Question: reading_goal (Erwachsene) ─────────────────────
  'q.readingGoal.question': {
    de: 'Was ist dein Hauptziel beim Lesen?', en: 'What is your main reading goal?', el: 'Ποιος είναι ο κύριος στόχος σου στην ανάγνωση;',
    tr: 'Okuma amacın nedir?', fr: 'Quel est votre objectif principal de lecture ?', es: '¿Cuál es tu objetivo principal al leer?', it: 'Qual è il tuo obiettivo principale di lettura?',
  },
  'q.readingGoal.wachstum':    { de: 'Persönliches Wachstum & Wissen', en: 'Personal Growth & Knowledge', el: 'Προσωπική ανάπτυξη & Γνώση', tr: 'Kişisel gelişim & Bilgi', fr: 'Croissance personnelle & Savoir', es: 'Crecimiento personal & Conocimiento', it: 'Crescita personale & Conoscenza' },
  'q.readingGoal.entspannung': { de: 'Entspannung & Unterhaltung', en: 'Relaxation & Entertainment', el: 'Χαλάρωση & Ψυχαγωγία', tr: 'Rahatlama & Eğlence', fr: 'Détente & Divertissement', es: 'Relajación & Entretenimiento', it: 'Relax & Intrattenimento' },
  'q.readingGoal.beide':       { de: 'Beides – je nach Stimmung', en: 'Both – depending on mood', el: 'Και τα δύο – ανάλογα με τη διάθεση', tr: 'İkisi de – ruh haline göre', fr: 'Les deux – selon l\'humeur', es: 'Ambos – según el estado de ánimo', it: 'Entrambi – a seconda dell\'umore' },

  // ── BookSearch – Question: topic (Erwachsene) ────────────────────────────
  'q.topicAdults.question': {
    de: 'Was interessiert dich am meisten?', en: 'What interests you most?', el: 'Τι σε ενδιαφέρει περισσότερο;',
    tr: 'Sizi en çok ne ilgilendiriyor?', fr: 'Qu\'est-ce qui vous intéresse le plus ?', es: '¿Qué te interesa más?', it: 'Cosa ti interessa di più?',
  },
  'q.topic.persoenliche_entwicklung': { de: 'Persönliche Entwicklung', en: 'Personal Development', el: 'Προσωπική ανάπτυξη', tr: 'Kişisel gelişim', fr: 'Développement personnel', es: 'Desarrollo personal', it: 'Sviluppo personale' },
  'q.topic.stress_ruhe':               { de: 'Ruhe & Gelassenheit', en: 'Calm & Serenity', el: 'Ηρεμία & Γαλήνη', tr: 'Sakinlik & Huzur', fr: 'Calme & Sérénité', es: 'Calma & Serenidad', it: 'Calma & Serenità' },
  'q.topic.fokus_produktivitaet':      { de: 'Fokus & Produktivität', en: 'Focus & Productivity', el: 'Εστίαση & Παραγωγικότητα', tr: 'Odak & Verimlilik', fr: 'Focus & Productivité', es: 'Foco & Productividad', it: 'Focus & Produttività' },
  'q.topic.beziehung_kommunikation':   { de: 'Beziehungen & Kommunikation', en: 'Relationships & Communication', el: 'Σχέσεις & Επικοινωνία', tr: 'İlişkiler & İletişim', fr: 'Relations & Communication', es: 'Relaciones & Comunicación', it: 'Relazioni & Comunicazione' },
  'q.topic.sinn_philosophie':          { de: 'Sinn & Lebensphilosophie', en: 'Meaning & Life Philosophy', el: 'Νόημα & Φιλοσοφία ζωής', tr: 'Anlam & Yaşam felsefesi', fr: 'Sens & Philosophie de vie', es: 'Sentido & Filosofía de vida', it: 'Senso & Filosofia di vita' },
  'q.topic.glaube_spiritualitaet':     { de: 'Glaube & Spiritualität', en: 'Faith & Spirituality', el: 'Πίστη & Πνευματικότητα', tr: 'İnanç & Maneviyat', fr: 'Foi & Spiritualité', es: 'Fe & Espiritualidad', it: 'Fede & Spiritualità' },
  'q.topic.kreativitaet':              { de: 'Kreativität', en: 'Creativity', el: 'Δημιουργικότητα', tr: 'Yaratıcılık', fr: 'Créativité', es: 'Creatividad', it: 'Creatività' },
  'q.topic.lernen_wissen':             { de: 'Lernen & Wissen', en: 'Learning & Knowledge', el: 'Μάθηση & Γνώση', tr: 'Öğrenme & Bilgi', fr: 'Apprentissage & Savoir', es: 'Aprendizaje & Conocimiento', it: 'Apprendimento & Conoscenza' },
  'q.topic.koerper_gesundheit':        { de: 'Körper & Gesundheit', en: 'Body & Health', el: 'Σώμα & Υγεία', tr: 'Beden & Sağlık', fr: 'Corps & Santé', es: 'Cuerpo & Salud', it: 'Corpo & Salute' },
  'q.topic.fantasy_scifi':             { de: 'Fantasy & Science-Fiction', en: 'Fantasy & Science-Fiction', el: 'Φαντασία & Επιστημονική φαντασία', tr: 'Fantezi & Bilim kurgu', fr: 'Fantasy & Science-Fiction', es: 'Fantasía & Ciencia ficción', it: 'Fantasy & Fantascienza' },
  'q.topic.thriller_krimi':            { de: 'Thriller & Krimis', en: 'Thriller & Crime', el: 'Θρίλερ & Αστυνομικά', tr: 'Gerilim & Polisiye', fr: 'Thriller & Policier', es: 'Thriller & Crimen', it: 'Thriller & Giallo' },
  'q.topic.romance':                   { de: 'Romantik & Liebesromane', en: 'Romance & Love Stories', el: 'Ρομάντζο & Ιστορίες αγάπης', tr: 'Romantizm & Aşk romanları', fr: 'Romance & Histoires d\'amour', es: 'Romance & Novelas de amor', it: 'Romantico & Storie d\'amore' },
  'q.topic.historisch':                { de: 'Historische Romane', en: 'Historical Novels', el: 'Ιστορικά μυθιστορήματα', tr: 'Tarihi romanlar', fr: 'Romans historiques', es: 'Novelas históricas', it: 'Romanzi storici' },
  'q.topic.literatur':                 { de: 'Anspruchsvolle Literatur', en: 'Serious Literature', el: 'Απαιτητική λογοτεχνία', tr: 'Edebiyat', fr: 'Littérature exigeante', es: 'Literatura exigente', it: 'Letteratura impegnativa' },
  'q.topic.humor':                     { de: 'Humor & Unterhaltung', en: 'Humor & Entertainment', el: 'Χιούμορ & Ψυχαγωγία', tr: 'Mizah & Eğlence', fr: 'Humour & Divertissement', es: 'Humor & Entretenimiento', it: 'Umorismo & Intrattenimento' },

  // ── BookSearch – Question: style (Erwachsene) ────────────────────────────
  'q.style.question': {
    de: 'Wie liest du am liebsten?', en: 'How do you prefer to read?', el: 'Πώς προτιμάς να διαβάζεις;',
    tr: 'Nasıl okumayı tercih edersin?', fr: 'Comment préférez-vous lire ?', es: '¿Cómo prefieres leer?', it: 'Come preferisci leggere?',
  },
  'q.style.praktisch':       { de: 'Praktisch & direkt umsetzbar', en: 'Practical & directly applicable', el: 'Πρακτικό & άμεσα εφαρμόσιμο', tr: 'Pratik & doğrudan uygulanabilir', fr: 'Pratique & directement applicable', es: 'Práctico & directamente aplicable', it: 'Pratico & direttamente applicabile' },
  'q.style.wissenschaftlich':{ de: 'Wissenschaftlich fundiert', en: 'Scientifically grounded', el: 'Επιστημονικά τεκμηριωμένο', tr: 'Bilimsel temelli', fr: 'Fondé scientifiquement', es: 'Científicamente fundamentado', it: 'Scientificamente fondato' },
  'q.style.story':           { de: 'Erzählerisch & biografisch', en: 'Narrative & biographical', el: 'Αφηγηματικό & βιογραφικό', tr: 'Anlatı & biyografik', fr: 'Narratif & biographique', es: 'Narrativo & biográfico', it: 'Narrativo & biografico' },
  'q.style.reflektierend':   { de: 'Philosophisch & tiefgründig', en: 'Philosophical & deep', el: 'Φιλοσοφικό & βαθύ', tr: 'Felsefi & derin', fr: 'Philosophique & profond', es: 'Filosófico & profundo', it: 'Filosofico & profondo' },

  // ── BookSearch – Question: level (Erwachsene) ────────────────────────────
  'q.level.question': {
    de: 'Wie erfahren bist du als Leser?', en: 'How experienced are you as a reader?', el: 'Πόσο έμπειρος αναγνώστης είσαι;',
    tr: 'Okuyucu olarak ne kadar deneyimlisin?', fr: 'Quelle est votre expérience de lecture ?', es: '¿Cuánta experiencia tienes como lector?', it: 'Quanto sei esperto come lettore?',
  },
  'q.level.einsteiger':     { de: 'Einsteiger – zugänglich & flüssig', en: 'Beginner – accessible & fluent', el: 'Αρχάριος – προσιτό & ευανάγνωστο', tr: 'Başlangıç – erişilebilir & akıcı', fr: 'Débutant – accessible & fluide', es: 'Principiante – accesible & fluido', it: 'Principiante – accessibile & scorrevole' },
  'q.level.fortgeschritten':{ de: 'Fortgeschritten – anspruchsvoller Inhalt', en: 'Advanced – more demanding content', el: 'Προχωρημένος – πιο απαιτητικό', tr: 'İleri – daha zorlu içerik', fr: 'Avancé – contenu plus exigeant', es: 'Avanzado – contenido más exigente', it: 'Avanzato – contenuto più impegnativo' },
  'q.level.erfahren':       { de: 'Erfahren – komplexe Werke willkommen', en: 'Experienced – complex works welcome', el: 'Έμπειρος – σύνθετα έργα ευπρόσδεκτα', tr: 'Deneyimli – karmaşık eserler memnuniyetle', fr: 'Expérimenté – œuvres complexes bienvenues', es: 'Experimentado – obras complejas bienvenidas', it: 'Esperto – opere complesse benvenute' },

  // ── BookSearch – Question: format (Erwachsene) ───────────────────────────
  'q.format.question': {
    de: 'In welchem Format möchtest du lesen?', en: 'In which format would you like to read?', el: 'Σε ποια μορφή θέλεις να διαβάσεις;',
    tr: 'Hangi formatta okumak istersin?', fr: 'Dans quel format souhaitez-vous lire ?', es: '¿En qué formato quieres leer?', it: 'In quale formato vuoi leggere?',
  },
  'q.format.print':    { de: '📖 Gedrucktes Buch', en: '📖 Printed Book', el: '📖 Έντυπο βιβλίο', tr: '📖 Basılı kitap', fr: '📖 Livre imprimé', es: '📖 Libro impreso', it: '📖 Libro stampato' },
  'q.format.ebook':    { de: '📱 E-Book', en: '📱 E-Book', el: '📱 E-Book', tr: '📱 E-Kitap', fr: '📱 E-Book', es: '📱 E-Book', it: '📱 E-Book' },
  'q.format.audiobook':{ de: '🎧 Hörbuch', en: '🎧 Audiobook', el: '🎧 Ακουστικό βιβλίο', tr: '🎧 Sesli kitap', fr: '🎧 Livre audio', es: '🎧 Audiolibro', it: '🎧 Audiolibro' },
  'q.format.any':      { de: '🔀 Egal / alle Formate', en: '🔀 Any / all formats', el: '🔀 Ό,τι / όλες οι μορφές', tr: '🔀 Farketmez / her format', fr: '🔀 Peu importe / tous formats', es: '🔀 Da igual / todos los formatos', it: '🔀 Qualsiasi formato' },

  // ── BookSearch – Question: length (Erwachsene) ───────────────────────────
  'q.lengthAdults.question': {
    de: 'Wie viel Zeit möchtest du investieren?', en: 'How much time do you want to invest?', el: 'Πόσο χρόνο θέλεις να αφιερώσεις;',
    tr: 'Ne kadar zaman harcamak istiyorsun?', fr: 'Combien de temps souhaitez-vous investir ?', es: '¿Cuánto tiempo quieres invertir?', it: 'Quanto tempo vuoi investire?',
  },
  'q.length.kurz.adults':  { de: 'Kurze Sessions (5–15 Min.)', en: 'Short sessions (5–15 min)', el: 'Σύντομες συνεδρίες (5–15 λεπτά)', tr: 'Kısa seanslar (5–15 dk)', fr: 'Courtes sessions (5–15 min)', es: 'Sesiones cortas (5–15 min)', it: 'Sessioni brevi (5–15 min)' },
  'q.length.mittel.adults':{ de: 'In meinem eigenen Tempo', en: 'At my own pace', el: 'Στο δικό μου ρυθμό', tr: 'Kendi hızımda', fr: 'À mon propre rythme', es: 'A mi propio ritmo', it: 'Al mio ritmo' },
  'q.length.lang.adults':  { de: 'Intensiv & umfassend', en: 'Intensive & comprehensive', el: 'Εντατικό & ολοκληρωμένο', tr: 'Yoğun & kapsamlı', fr: 'Intensif & complet', es: 'Intensivo & exhaustivo', it: 'Intensivo & completo' },

  // ── BookSearch – ReadBooks placeholder texts ──────────────────────────────
  'q.readBooks.placeholder.kinder': {
    de: 'z.B. Harry Potter, Gregs Tagebuch ...', en: 'e.g. Harry Potter, Diary of a Wimpy Kid ...',
    el: 'π.χ. Harry Potter, Ημερολόγιο ενός ...', tr: 'örn. Harry Potter, Çaylak Günlüğü ...',
    fr: 'ex. Harry Potter, Journal d\'un dégonflé ...', es: 'ej. Harry Potter, Diario de Greg ...', it: 'es. Harry Potter, Diario di una schiappa ...',
  },
  'q.readBooks.placeholder.jugendliche': {
    de: 'z.B. Die Tribute von Panem, Tschick ...', en: 'e.g. The Hunger Games, The Perks of Being ...',
    el: 'π.χ. Hunger Games, Divergent ...', tr: 'örn. Açlık Oyunları, Tschick ...',
    fr: 'ex. Hunger Games, Le Prince de la nuit ...', es: 'ej. Los Juegos del Hambre, Tschick ...', it: 'es. Hunger Games, La fattoria degli animali ...',
  },
  'q.readBooks.placeholder.erwachsene': {
    de: 'z.B. Atomic Habits, Sapiens, Der kleine Prinz ...', en: 'e.g. Atomic Habits, Sapiens, The Little Prince ...',
    el: 'π.χ. Atomic Habits, Sapiens, Ο Μικρός Πρίγκιπας ...', tr: 'örn. Atomic Habits, Sapiens ...',
    fr: 'ex. Atomic Habits, Sapiens, Le Petit Prince ...', es: 'ej. Atomic Habits, Sapiens, El Principito ...', it: 'es. Atomic Habits, Sapiens, Il Piccolo Principe ...',
  },

  // ── ProfileCard ───────────────────────────────────────────────────────────
  'profile.title': {
    de: 'Dein Leseprofil', en: 'Your Reading Profile', el: 'Το προφίλ ανάγνωσής σου',
    tr: 'Okuma profilim', fr: 'Votre profil de lecture', es: 'Tu perfil de lectura', it: 'Il tuo profilo di lettura',
  },
  'profile.mainTopics': {
    de: 'Deine Hauptthemen', en: 'Your Main Topics', el: 'Τα κύρια θέματά σου',
    tr: 'Ana konularım', fr: 'Vos thèmes principaux', es: 'Tus temas principales', it: 'I tuoi temi principali',
  },
  'profile.preferredStyle': {
    de: 'Bevorzugter Stil', en: 'Preferred Style', el: 'Προτιμώμενο στυλ',
    tr: 'Tercih edilen stil', fr: 'Style préféré', es: 'Estilo preferido', it: 'Stile preferito',
  },
  'profile.depth': {
    de: 'Empfohlene Tiefe', en: 'Recommended Depth', el: 'Προτεινόμενο βάθος',
    tr: 'Önerilen derinlik', fr: 'Profondeur recommandée', es: 'Profundidad recomendada', it: 'Profondità consigliata',
  },
  'profile.style.praktisch': {
    de: 'Praktisch umsetzbar', en: 'Practically applicable', el: 'Πρακτικά εφαρμόσιμο',
    tr: 'Pratik uygulanabilir', fr: 'Pratique et applicable', es: 'Práctico y aplicable', it: 'Praticamente applicabile',
  },
  'profile.style.wissenschaftlich': {
    de: 'Wissenschaftlich fundiert', en: 'Scientifically grounded', el: 'Επιστημονικά τεκμηριωμένο',
    tr: 'Bilimsel temelli', fr: 'Fondé scientifiquement', es: 'Científicamente fundamentado', it: 'Scientificamente fondato',
  },
  'profile.style.story': {
    de: 'Erzählerisch', en: 'Narrative', el: 'Αφηγηματικό',
    tr: 'Anlatı', fr: 'Narratif', es: 'Narrativo', it: 'Narrativo',
  },
  'profile.style.reflektierend': {
    de: 'Zum Nachdenken', en: 'Thought-provoking', el: 'Στοχαστικό',
    tr: 'Düşündürücü', fr: 'Qui donne à réfléchir', es: 'Para reflexionar', it: 'Riflessivo',
  },
  'profile.style.kurz': {
    de: 'Kompakt', en: 'Compact', el: 'Συμπαγές',
    tr: 'Kompakt', fr: 'Compact', es: 'Compacto', it: 'Compatto',
  },
  'profile.style.anspruchsvoll': {
    de: 'Tiefgehend', en: 'In-depth', el: 'Σε βάθος',
    tr: 'Derinlemesine', fr: 'Approfondi', es: 'En profundidad', it: 'Approfondito',
  },
  'profile.diff.einsteiger': {
    de: 'Einsteiger', en: 'Beginner', el: 'Αρχάριος',
    tr: 'Başlangıç', fr: 'Débutant', es: 'Principiante', it: 'Principiante',
  },
  'profile.diff.fortgeschritten': {
    de: 'Fortgeschritten', en: 'Advanced', el: 'Προχωρημένος',
    tr: 'İleri', fr: 'Avancé', es: 'Avanzado', it: 'Avanzato',
  },
  'profile.diff.erfahren': {
    de: 'Sehr erfahren', en: 'Experienced', el: 'Έμπειρος',
    tr: 'Deneyimli', fr: 'Expérimenté', es: 'Experimentado', it: 'Esperto',
  },

  // ── BookCard ──────────────────────────────────────────────────────────────
  'book.pages': {
    de: 'Seiten', en: 'pages', el: 'σελίδες',
    tr: 'sayfa', fr: 'pages', es: 'páginas', it: 'pagine',
  },
  'book.myRating': {
    de: 'Meine Bewertung', en: 'My Rating', el: 'Η αξιολόγησή μου',
    tr: 'Değerlendirmem', fr: 'Mon évaluation', es: 'Mi valoración', it: 'La mia valutazione',
  },
  'book.myNotes': {
    de: 'Meine Notizen', en: 'My Notes', el: 'Οι σημειώσεις μου',
    tr: 'Notlarım', fr: 'Mes notes', es: 'Mis notas', it: 'Le mie note',
  },
  'book.edit': {
    de: 'Bearbeiten', en: 'Edit', el: 'Επεξεργασία',
    tr: 'Düzenle', fr: 'Modifier', es: 'Editar', it: 'Modifica',
  },
  'book.saveAction': {
    de: 'Speichern', en: 'Save', el: 'Αποθήκευση',
    tr: 'Kaydet', fr: 'Enregistrer', es: 'Guardar', it: 'Salva',
  },
  'book.reviewPlaceholder': {
    de: 'Was hat dir gefallen oder nicht gefallen?', en: 'What did you like or dislike?',
    el: 'Τι σου άρεσε ή δεν σου άρεσε;', tr: 'Ne hoşuna gitti veya gitmedi?',
    fr: 'Qu\'avez-vous aimé ou pas ?', es: '¿Qué te gustó o no?', it: 'Cosa ti è piaciuto o no?',
  },
  'book.notesPlaceholder': {
    de: 'Z.B. Seite 42 ist interessant...', en: 'E.g. page 42 is interesting...',
    el: 'π.χ. η σελίδα 42 είναι ενδιαφέρουσα...', tr: 'Örn. 42. sayfa ilginç...',
    fr: 'Ex. la page 42 est intéressante...', es: 'Ej. la página 42 es interesante...', it: 'Es. pagina 42 interessante...',
  },
  'book.noNotes': {
    de: 'Noch keine Notizen hinzugefügt', en: 'No notes added yet',
    el: 'Δεν έχουν προστεθεί σημειώσεις', tr: 'Henüz not eklenmedi',
    fr: 'Aucune note ajoutée', es: 'Aún no hay notas', it: 'Nessuna nota aggiunta',
  },
  'book.buy': {
    de: 'Kaufen', en: 'Buy', el: 'Αγορά',
    tr: 'Satın Al', fr: 'Acheter', es: 'Comprar', it: 'Acquista',
  },
  'book.author': {
    de: 'Autor', en: 'Author', el: 'Συγγραφέας',
    tr: 'Yazar', fr: 'Auteur', es: 'Autor', it: 'Autore',
  },
  'book.year': {
    de: 'Erscheinungsjahr', en: 'Publication Year', el: 'Έτος έκδοσης',
    tr: 'Yayın yılı', fr: 'Année de publication', es: 'Año de publicación', it: 'Anno di pubblicazione',
  },
  'book.pageCount': {
    de: 'Seitenzahl', en: 'Page Count', el: 'Αριθμός σελίδων',
    tr: 'Sayfa sayısı', fr: 'Nombre de pages', es: 'Número de páginas', it: 'Numero pagine',
  },
  'book.publisher': {
    de: 'Verlag', en: 'Publisher', el: 'Εκδότης',
    tr: 'Yayınevi', fr: 'Éditeur', es: 'Editorial', it: 'Editore',
  },
  'book.popularity': {
    de: 'Popularität', en: 'Popularity', el: 'Δημοτικότητα',
    tr: 'Popülerlik', fr: 'Popularité', es: 'Popularidad', it: 'Popolarità',
  },
  'book.description': {
    de: 'Beschreibung', en: 'Description', el: 'Περιγραφή',
    tr: 'Açıklama', fr: 'Description', es: 'Descripción', it: 'Descrizione',
  },
  'book.timesRead': {
    de: '× gelesen', en: '× read', el: '× διαβάστηκε',
    tr: '× okundu', fr: '× lu', es: '× leído', it: '× letto',
  },
  'book.previewMore': {
    de: 'Leseproben & Mehr', en: 'Previews & More', el: 'Αποσπάσματα & Περισσότερα',
    tr: 'Önizleme & Daha fazla', fr: 'Extraits & Plus', es: 'Vistas previas & Más', it: 'Anteprime & Altro',
  },
  'book.previewGoogle': {
    de: 'Leseprobe & Details anzeigen', en: 'Preview & show details', el: 'Προεπισκόπηση & λεπτομέρειες',
    tr: 'Önizleme ve detaylar', fr: 'Aperçu & détails', es: 'Vista previa y detalles', it: 'Anteprima e dettagli',
  },
  'book.previewAmazon': {
    de: '"Blick ins Buch"', en: '"Look Inside"', el: '"Ματιά στο βιβλίο"',
    tr: '"Kitaba bak"', fr: '"Feuilleter"', es: '"Mirar dentro"', it: '"Guarda dentro"',
  },
  'book.close': {
    de: 'Schließen', en: 'Close', el: 'Κλείσιμο',
    tr: 'Kapat', fr: 'Fermer', es: 'Cerrar', it: 'Chiudi',
  },
  'book.unknownAuthorFallback': {
    de: 'Unbekannter Autor', en: 'Unknown Author', el: 'Άγνωστος συγγραφέας',
    tr: 'Bilinmeyen yazar', fr: 'Auteur inconnu', es: 'Autor desconocido', it: 'Autore sconosciuto',
  },

  // ── ReadBooksInput ────────────────────────────────────────────────────────
  'readBooks.continue': {
    de: 'Weiter', en: 'Continue', el: 'Συνέχεια',
    tr: 'Devam', fr: 'Continuer', es: 'Continuar', it: 'Continua',
  },
  'readBooks.skip': {
    de: 'Überspringen', en: 'Skip', el: 'Παράλειψη',
    tr: 'Geç', fr: 'Ignorer', es: 'Omitir', it: 'Salta',
  },
  'readBooks.remove': {
    de: '{title} entfernen', en: 'Remove {title}', el: 'Αφαίρεση {title}',
    tr: '{title} kaldır', fr: 'Retirer {title}', es: 'Quitar {title}', it: 'Rimuovi {title}',
  },

  // ── generateReasons (BookSearch) ─────────────────────────────────────────
  'reason.topic.persoenliche_entwicklung': {
    de: 'Spricht dein Bedürfnis nach Selbstentwicklung an',
    en: 'Addresses your need for self-development',
    el: 'Απευθύνεται στην ανάγκη σου για αυτοανάπτυξη',
    tr: 'Kişisel gelişim ihtiyacına hitap eder',
    fr: 'Répond à votre besoin de développement personnel',
    es: 'Responde a tu necesidad de desarrollo personal',
    it: 'Risponde al tuo bisogno di sviluppo personale',
  },
  'reason.topic.stress_ruhe': {
    de: 'Hilft dir, mehr Ruhe zu finden', en: 'Helps you find more calm',
    el: 'Σε βοηθά να βρεις περισσότερη ηρεμία', tr: 'Daha fazla huzur bulmanı sağlar',
    fr: 'Vous aide à trouver plus de calme', es: 'Te ayuda a encontrar más calma', it: 'Ti aiuta a trovare più calma',
  },
  'reason.topic.fokus_produktivitaet': {
    de: 'Unterstützt dich bei Fokus und Produktivität', en: 'Supports your focus and productivity',
    el: 'Υποστηρίζει την εστίαση και παραγωγικότητά σου', tr: 'Odak ve verimliliğini destekler',
    fr: 'Soutient votre concentration et productivité', es: 'Apoya tu enfoque y productividad', it: 'Supporta il tuo focus e produttività',
  },
  'reason.topic.beziehung_kommunikation': {
    de: 'Stärkt deine Beziehungskompetenz', en: 'Strengthens your relationship skills',
    el: 'Ενισχύει τις δεξιότητες σχέσεών σου', tr: 'İlişki becerilerini güçlendirir',
    fr: 'Renforce vos compétences relationnelles', es: 'Fortalece tus habilidades relacionales', it: 'Rafforza le tue competenze relazionali',
  },
  'reason.topic.sinn_philosophie': {
    de: 'Berührt die großen Lebensfragen', en: 'Touches on life\'s big questions',
    el: 'Αγγίζει τα μεγάλα ερωτήματα ζωής', tr: 'Hayatın büyük sorularına değinir',
    fr: 'Aborde les grandes questions de la vie', es: 'Toca las grandes preguntas de la vida', it: 'Tocca le grandi domande della vita',
  },
  'reason.topic.kreativitaet': {
    de: 'Fördert deine kreative Seite', en: 'Nurtures your creative side',
    el: 'Καλλιεργεί την δημιουργική σου πλευρά', tr: 'Yaratıcı yanını besler',
    fr: 'Nourrit votre côté créatif', es: 'Nutre tu lado creativo', it: 'Nutre il tuo lato creativo',
  },
  'reason.topic.lernen_wissen': {
    de: 'Erweitert dein Wissen', en: 'Expands your knowledge',
    el: 'Διευρύνει τις γνώσεις σου', tr: 'Bilgini genişletir',
    fr: 'Élargit vos connaissances', es: 'Amplía tus conocimientos', it: 'Amplia le tue conoscenze',
  },
  'reason.topic.koerper_gesundheit': {
    de: 'Unterstützt deine Gesundheit', en: 'Supports your health',
    el: 'Υποστηρίζει την υγεία σου', tr: 'Sağlığını destekler',
    fr: 'Soutient votre santé', es: 'Apoya tu salud', it: 'Supporta la tua salute',
  },
  'reason.topic.fantasy_scifi': {
    de: 'Entführt dich in faszinierende Fantasiewelten', en: 'Takes you to fascinating fantasy worlds',
    el: 'Σε μεταφέρει σε συναρπαστικούς κόσμους φαντασίας', tr: 'Seni büyüleyici fantezi dünyalarına götürür',
    fr: 'Vous emmène dans des mondes de fantaisie fascinants', es: 'Te lleva a mundos de fantasía fascinantes', it: 'Ti porta in affascinanti mondi fantasy',
  },
  'reason.topic.thriller_krimi': {
    de: 'Fesselt dich mit Spannung bis zur letzten Seite', en: 'Grips you with suspense to the last page',
    el: 'Σε κρατά αγωνία ως την τελευταία σελίδα', tr: 'Son sayfaya kadar gerilimle bağlar',
    fr: 'Vous captive jusqu\'à la dernière page', es: 'Te atrapa con suspenso hasta la última página', it: 'Ti cattura con suspense fino all\'ultima pagina',
  },
  'reason.topic.romance': {
    de: 'Berührt dein Herz mit emotionalen Geschichten', en: 'Touches your heart with emotional stories',
    el: 'Αγγίζει την καρδιά σου με συναισθηματικές ιστορίες', tr: 'Duygusal hikayelerle kalbine dokunur',
    fr: 'Touche votre cœur avec des histoires émouvantes', es: 'Toca tu corazón con historias emotivas', it: 'Tocca il tuo cuore con storie emozionanti',
  },
  'reason.topic.historisch': {
    de: 'Lässt vergangene Epochen lebendig werden', en: 'Brings past eras to life',
    el: 'Ζωντανεύει περασμένες εποχές', tr: 'Geçmiş çağları canlandırır',
    fr: 'Donne vie aux époques passées', es: 'Da vida a épocas pasadas', it: 'Dà vita alle epoche passate',
  },
  'reason.topic.literatur': {
    de: 'Bietet tiefgründige, kunstvolle Erzählkunst', en: 'Offers profound, artful storytelling',
    el: 'Προσφέρει βαθιά, καλλιτεχνική αφήγηση', tr: 'Derin, sanatsal anlatıcılık sunar',
    fr: 'Offre une narration profonde et artistique', es: 'Ofrece una narrativa profunda y artística', it: 'Offre una narrativa profonda e artistica',
  },
  'reason.topic.humor': {
    de: 'Bringt dich zum Lachen und Schmunzeln', en: 'Makes you laugh and smile',
    el: 'Σε κάνει να γελάς και να χαμογελάς', tr: 'Güldürür ve gülümsetir',
    fr: 'Vous fait rire et sourire', es: 'Te hace reír y sonreír', it: 'Ti fa ridere e sorridere',
  },
  'reason.topic.abenteuer': {
    de: 'Nimmt dich mit auf spannende Reisen', en: 'Takes you on exciting journeys',
    el: 'Σε παίρνει σε συναρπαστικά ταξίδια', tr: 'Seni heyecanlı yolculuklara çıkarır',
    fr: 'Vous emmène dans des voyages palpitants', es: 'Te lleva a emocionantes aventuras', it: 'Ti porta in emozionanti avventure',
  },
  'reason.topic.freundschaft': {
    de: 'Zeigt die Kraft von Freundschaft', en: 'Shows the power of friendship',
    el: 'Δείχνει τη δύναμη της φιλίας', tr: 'Dostluğun gücünü gösterir',
    fr: 'Montre la force de l\'amitié', es: 'Muestra el poder de la amistad', it: 'Mostra il potere dell\'amicizia',
  },
  'reason.topic.magie': {
    de: 'Entführt dich in magische Welten', en: 'Takes you to magical worlds',
    el: 'Σε μεταφέρει σε μαγικούς κόσμους', tr: 'Seni büyülü dünyalara götürür',
    fr: 'Vous emmène dans des mondes magiques', es: 'Te lleva a mundos mágicos', it: 'Ti porta in mondi magici',
  },
  'reason.topic.selbstfindung': {
    de: 'Hilft dir, dich selbst zu verstehen', en: 'Helps you understand yourself',
    el: 'Σε βοηθά να κατανοήσεις τον εαυτό σου', tr: 'Kendini anlamana yardımcı olur',
    fr: 'Vous aide à vous comprendre', es: 'Te ayuda a entenderte', it: 'Ti aiuta a capire te stesso',
  },
  'reason.topic.liebe': {
    de: 'Berührt das Herz', en: 'Touches the heart',
    el: 'Αγγίζει την καρδιά', tr: 'Kalbe dokunur',
    fr: 'Touche le cœur', es: 'Toca el corazón', it: 'Tocca il cuore',
  },
  'reason.style.praktisch': {
    de: 'Der praktische Stil passt zu deiner Vorliebe für Umsetzbarkeit',
    en: 'The practical style suits your preference for applicability',
    el: 'Το πρακτικό στυλ ταιριάζει στην προτίμησή σου για εφαρμοσιμότητα',
    tr: 'Pratik stil, uygulanabilirlik tercihinize uygundur',
    fr: 'Le style pratique correspond à votre goût pour l\'applicabilité',
    es: 'El estilo práctico se adapta a tu preferencia por la aplicabilidad',
    it: 'Lo stile pratico si adatta alla tua preferenza per l\'applicabilità',
  },
  'reason.style.wissenschaftlich': {
    de: 'Wissenschaftlich fundiert – genau wie du es magst',
    en: 'Scientifically grounded – just the way you like it',
    el: 'Επιστημονικά τεκμηριωμένο – ακριβώς όπως το προτιμάς',
    tr: 'Bilimsel temelli – tam istediğin gibi',
    fr: 'Fondé scientifiquement – exactement comme vous l\'aimez',
    es: 'Científicamente fundamentado – justo como te gusta',
    it: 'Scientificamente fondato – esattamente come piace a te',
  },
  'reason.style.story': {
    de: 'Erzählerisch geschrieben – für deinen bevorzugten Lesestil',
    en: 'Narratively written – for your preferred reading style',
    el: 'Γραμμένο αφηγηματικά – για το αγαπημένο σου στυλ ανάγνωσης',
    tr: 'Anlatı tarzında yazılmış – tercih ettiğin okuma stili için',
    fr: 'Écrit de façon narrative – pour votre style de lecture préféré',
    es: 'Escrito de forma narrativa – para tu estilo de lectura preferido',
    it: 'Scritto in modo narrativo – per il tuo stile di lettura preferito',
  },
  'reason.style.reflektierend': {
    de: 'Lädt zum Nachdenken ein – passend zu deinem Stil',
    en: 'Invites reflection – matching your style',
    el: 'Προσκαλεί σε στοχασμό – ταιριάζει στο στυλ σου',
    tr: 'Düşünmeye davet eder – stilinize uygun',
    fr: 'Invite à la réflexion – en accord avec votre style',
    es: 'Invita a la reflexión – acorde a tu estilo',
    it: 'Invita alla riflessione – in linea con il tuo stile',
  },
  'reason.style.kurz': {
    de: 'Kompakt und prägnant – ideal für deine Lesezeit',
    en: 'Compact and concise – ideal for your reading time',
    el: 'Συμπαγές και περιεκτικό – ιδανικό για τον χρόνο ανάγνωσής σου',
    tr: 'Kompakt ve öz – okuma süreniz için ideal',
    fr: 'Compact et concis – idéal pour votre temps de lecture',
    es: 'Compacto y conciso – ideal para tu tiempo de lectura',
    it: 'Compatto e conciso – ideale per il tuo tempo di lettura',
  },
  'reason.style.anspruchsvoll': {
    de: 'Mit Tiefgang – genau richtig für dich', en: 'In-depth – just right for you',
    el: 'Σε βάθος – ακριβώς κατάλληλο για σένα', tr: 'Derinlemesine – tam senin için',
    fr: 'En profondeur – parfaitement adapté pour vous', es: 'En profundidad – justo para ti', it: 'Approfondito – perfetto per te',
  },
  'reason.fallback.topic': {
    de: 'Passt thematisch zu deinen Interessen', en: 'Fits your interests thematically',
    el: 'Ταιριάζει θεματικά στα ενδιαφέροντά σου', tr: 'Tematik olarak ilgi alanlarına uygun',
    fr: 'Correspond thématiquement à vos intérêts', es: 'Encaja temáticamente con tus intereses', it: 'Si adatta tematicamente ai tuoi interessi',
  },
  'reason.fallback.style': {
    de: 'Angenehm zu lesen', en: 'Enjoyable to read',
    el: 'Ευχάριστο στην ανάγνωση', tr: 'Okuması keyifli',
    fr: 'Agréable à lire', es: 'Agradable de leer', it: 'Piacevole da leggere',
  },
  'reason.fallback.gain': {
    de: 'Bietet wertvolle Erkenntnisse für den Alltag', en: 'Offers valuable insights for everyday life',
    el: 'Προσφέρει πολύτιμες γνώσεις για την καθημερινότητα', tr: 'Günlük hayat için değerli içgörüler sunar',
    fr: 'Offre des insights précieux pour le quotidien', es: 'Ofrece valiosas perspectivas para el día a día', it: 'Offre preziosi spunti per la vita quotidiana',
  },
  'reason.contrast': {
    de: '"{title}" erweitert deinen Horizont mit einem anderen Blickwinkel – {author} bietet eine frische Perspektive.',
    en: '"{title}" expands your horizon with a different angle – {author} offers a fresh perspective.',
    el: '"{title}" διευρύνει τον ορίζοντά σου με διαφορετική οπτική – {author} προσφέρει μια νέα προοπτική.',
    tr: '"{title}" farklı bir açıyla ufkunu genişletiyor – {author} taze bir bakış açısı sunuyor.',
    fr: '"{title}" élargit votre horizon avec un angle différent – {author} offre une perspective nouvelle.',
    es: '"{title}" amplía tu horizonte con un ángulo diferente – {author} ofrece una perspectiva fresca.',
    it: '"{title}" amplia il tuo orizzonte con un angolo diverso – {author} offre una prospettiva fresca.',
  },

  // ── ProviderLinks dual-region headers ────────────────────────────────────
  'provider.langRegionTitle': {
    de: 'Passend zur Buchsprache', en: 'Matching book language', el: 'Ταιριάζει στη γλώσσα βιβλίου',
    tr: 'Kitap diline uygun', fr: 'En accord avec la langue du livre', es: 'Acorde al idioma del libro', it: 'Adatto alla lingua del libro',
  },
  'provider.langRegionSub': {
    de: '{lang}sprachige Anbieter', en: '{lang} providers', el: 'Πάροχοι {lang}',
    tr: '{lang} sağlayıcıları', fr: 'Fournisseurs {lang}', es: 'Proveedores {lang}', it: 'Fornitori {lang}',
  },
  'provider.shopRegionTitle': {
    de: 'In deiner Kaufregion', en: 'In your shopping region', el: 'Στην περιοχή αγορών σου',
    tr: 'Alışveriş bölgendeki', fr: 'Dans votre région d\'achat', es: 'En tu región de compra', it: 'Nella tua regione di acquisto',
  },
  'provider.shopRegionSub': {
    de: 'Suche in {region}', en: 'Search in {region}', el: 'Αναζήτηση σε {region}',
    tr: '{region} içinde ara', fr: 'Rechercher en {region}', es: 'Buscar en {region}', it: 'Cerca in {region}',
  },
  'provider.usedMarketplace': {
    de: 'Gebraucht & Marktplatz', en: 'Used & Marketplace', el: 'Μεταχειρισμένα & Αγορά',
    tr: 'İkinci el & Pazar yeri', fr: 'Occasion & Marketplace', es: 'Usado & Mercado', it: 'Usato & Marketplace',
  },

  'discover.bookLangHint': {
    de: 'Hinweis: Für Griechisch und Türkisch sind weniger Bücher indexiert.',
    en: 'Note: Fewer books are indexed for Greek and Turkish.',
    el: 'Σημείωση: Λιγότερα βιβλία είναι διαθέσιμα για Ελληνικά.',
    tr: 'Not: Türkçe için daha az kitap dizine eklendi.',
    fr: 'Remarque : Moins de livres sont indexés pour le grec et le turc.',
    es: 'Nota: Hay menos libros indexados para griego y turco.',
    it: 'Nota: Meno libri sono indicizzati per greco e turco.',
  },

  // ── Public Profile / Find Readers ────────────────────────────────────────
  'profile.follow': {
    de: 'Folgen', en: 'Follow', el: 'Ακολούθησε',
    tr: 'Takip et', fr: 'Suivre', es: 'Seguir', it: 'Segui',
  },
  'profile.private': {
    de: 'Dieses Profil ist privat.', en: 'This profile is private.',
    el: 'Αυτό το προφίλ είναι ιδιωτικό.', tr: 'Bu profil gizlidir.',
    fr: 'Ce profil est privé.', es: 'Este perfil es privado.', it: 'Questo profilo è privato.',
  },
  'profile.noPosts': {
    de: 'Noch keine öffentlichen Beiträge.', en: 'No public posts yet.',
    el: 'Δεν υπάρχουν δημόσιες αναρτήσεις.', tr: 'Henüz herkese açık gönderi yok.',
    fr: 'Pas encore de publications publiques.', es: 'Aún no hay publicaciones públicas.', it: 'Ancora nessun post pubblico.',
  },
  'profile.username': {
    de: 'Username', en: 'Username', el: 'Όνομα χρήστη',
    tr: 'Kullanıcı adı', fr: 'Nom d\'utilisateur', es: 'Nombre de usuario', it: 'Nome utente',
  },
  'profile.usernamePlaceholder': {
    de: 'dein_name', en: 'your_name', el: 'το_ονομα_σου',
    tr: 'kullanici_adin', fr: 'ton_nom', es: 'tu_nombre', it: 'il_tuo_nome',
  },
  'profile.usernameHint': {
    de: 'Buchstaben, Zahlen, Unterstriche. 2–30 Zeichen.',
    en: 'Letters, numbers, underscores. 2–30 characters.',
    el: 'Γράμματα, αριθμοί, underscores. 2–30 χαρακτήρες.',
    tr: 'Harfler, rakamlar, alt çizgi. 2–30 karakter.',
    fr: 'Lettres, chiffres, tirets bas. 2–30 caractères.',
    es: 'Letras, números, guiones bajos. 2–30 caracteres.',
    it: 'Lettere, numeri, trattini bassi. 2–30 caratteri.',
  },
  'profile.usernameError': {
    de: 'Nur Buchstaben, Zahlen und _ erlaubt (2–30 Zeichen).',
    en: 'Only letters, numbers and _ allowed (2–30 chars).',
    el: 'Μόνο γράμματα, αριθμοί και _ (2–30 χαρακτήρες).',
    tr: 'Sadece harf, rakam ve _ kullanılabilir (2–30 karakter).',
    fr: 'Uniquement lettres, chiffres et _ (2–30 caractères).',
    es: 'Solo letras, números y _ (2–30 caracteres).',
    it: 'Solo lettere, numeri e _ (2–30 caratteri).',
  },
  'profile.bio': {
    de: 'Über mich', en: 'About me', el: 'Σχετικά με μένα',
    tr: 'Hakkımda', fr: 'À propos de moi', es: 'Sobre mí', it: 'Su di me',
  },
  'profile.bioPlaceholder': {
    de: 'Kurz über dich und deine Lesevorlieben...', en: 'A bit about you and your reading preferences...',
    el: 'Λίγα λόγια για σένα και τις προτιμήσεις σου...', tr: 'Kendin ve okuma tercihlerinle ilgili...',
    fr: 'Un peu sur vous et vos préférences de lecture...', es: 'Algo sobre ti y tus preferencias de lectura...', it: 'Un po\' su di te e le tue preferenze...',
  },
  'profile.favoriteGenres': {
    de: 'Lieblingsgenres', en: 'Favorite Genres', el: 'Αγαπημένα είδη',
    tr: 'Sevdiğim türler', fr: 'Genres préférés', es: 'Géneros favoritos', it: 'Generi preferiti',
  },
  'profile.maxGenres': {
    de: 'max. 5', en: 'max. 5', el: 'μέγ. 5', tr: 'maks. 5', fr: 'max. 5', es: 'máx. 5', it: 'max. 5',
  },
  'profile.readingGoal': {
    de: 'Wöchentliches Leseziel (Seiten)', en: 'Weekly reading goal (pages)', el: 'Εβδομαδιαίος στόχος ανάγνωσης (σελίδες)',
    tr: 'Haftalık okuma hedefi (sayfa)', fr: 'Objectif lecture hebdomadaire (pages)', es: 'Objetivo semanal de lectura (páginas)', it: 'Obiettivo lettura settimanale (pagine)',
  },
  'profile.readingGoalHint': {
    de: 'Setze dir ein realistisches Ziel', en: 'Set a realistic goal', el: 'Θέσε έναν ρεαλιστικό στόχο',
    tr: 'Gerçekçi bir hedef belirle', fr: 'Fixez-vous un objectif réaliste', es: 'Establece un objetivo realista', it: 'Stabilisci un obiettivo realistico',
  },
  'profile.saving': {
    de: 'Wird gespeichert...', en: 'Saving...', el: 'Αποθήκευση...',
    tr: 'Kaydediliyor...', fr: 'Enregistrement...', es: 'Guardando...', it: 'Salvataggio...',
  },
  'findReaders.title': {
    de: 'Leser finden', en: 'Find Readers', el: 'Βρες αναγνώστες',
    tr: 'Okuyucu bul', fr: 'Trouver des lecteurs', es: 'Encontrar lectores', it: 'Trova lettori',
  },
  'findReaders.searchPlaceholder': {
    de: 'Name oder Username suchen...', en: 'Search name or username...',
    el: 'Αναζήτηση ονόματος ή username...', tr: 'İsim veya kullanıcı adı ara...',
    fr: 'Rechercher nom ou pseudo...', es: 'Buscar nombre o usuario...', it: 'Cerca nome o username...',
  },
  'findReaders.activeReaders': {
    de: 'Aktive Community-Autoren', en: 'Active community readers',
    el: 'Ενεργοί αναγνώστες κοινότητας', tr: 'Aktif topluluk okuyucuları',
    fr: 'Lecteurs actifs de la communauté', es: 'Lectores activos de la comunidad', it: 'Lettori attivi della community',
  },
  'findReaders.noResults': {
    de: 'Keine Leser gefunden.', en: 'No readers found.',
    el: 'Δεν βρέθηκαν αναγνώστες.', tr: 'Okuyucu bulunamadı.',
    fr: 'Aucun lecteur trouvé.', es: 'No se encontraron lectores.', it: 'Nessun lettore trovato.',
  },
  'findReaders.empty': {
    de: 'Suche nach Lesern oder filtere nach Genre.', en: 'Search for readers or filter by genre.',
    el: 'Αναζήτηση αναγνωστών ή φιλτράρισμα ανά είδος.', tr: 'Okuyucu ara veya türe göre filtrele.',
    fr: 'Cherchez des lecteurs ou filtrez par genre.', es: 'Busca lectores o filtra por género.', it: 'Cerca lettori o filtra per genere.',
  },
  'profile.readingLanguages': {
    de: 'Lesesprachen', en: 'Reading Languages', el: 'Γλώσσες ανάγνωσης',
    tr: 'Okuma dilleri', fr: 'Langues de lecture', es: 'Idiomas de lectura', it: 'Lingue di lettura',
  },
  'profile.readingLanguagesHint': {
    de: 'In welchen Sprachen liest du Bücher?', en: 'Which languages do you read books in?',
    el: 'Σε ποιες γλώσσες διαβάζεις βιβλία;', tr: 'Hangi dillerde kitap okuyorsun?',
    fr: 'Dans quelles langues lisez-vous des livres ?', es: '¿En qué idiomas lees libros?', it: 'In quali lingue leggi libri?',
  },
  'profile.profileVisibility': {
    de: 'Profil-Sichtbarkeit', en: 'Profile Visibility', el: 'Ορατότητα προφίλ',
    tr: 'Profil görünürlüğü', fr: 'Visibilité du profil', es: 'Visibilidad del perfil', it: 'Visibilità del profilo',
  },
  'profile.profilePublic': {
    de: 'Profil öffentlich', en: 'Profile public', el: 'Προφίλ δημόσιο',
    tr: 'Profil herkese açık', fr: 'Profil public', es: 'Perfil público', it: 'Profilo pubblico',
  },
  'profile.profilePrivate': {
    de: 'Profil privat', en: 'Profile private', el: 'Προφίλ ιδιωτικό',
    tr: 'Profil gizli', fr: 'Profil privé', es: 'Perfil privado', it: 'Profilo privato',
  },
  'profile.profileVisibilityHint': {
    de: 'Wenn privat: Andere Nutzer sehen nur, dass das Profil existiert, aber keine Details.',
    en: 'If private: Other users only see that the profile exists, but no details.',
    el: 'Αν ιδιωτικό: Άλλοι χρήστες βλέπουν μόνο ότι το προφίλ υπάρχει, χωρίς λεπτομέρειες.',
    tr: 'Gizliyse: Diğer kullanıcılar yalnızca profilin var olduğunu görür, ayrıntıları değil.',
    fr: 'Si privé : les autres voient seulement que le profil existe, sans les détails.',
    es: 'Si privado: otros solo ven que el perfil existe, sin detalles.',
    it: 'Se privato: gli altri vedono solo che il profilo esiste, ma non i dettagli.',
  },
  'profile.noEmail': {
    de: 'Kein Profil ausgewählt.', en: 'No profile selected.',
    el: 'Δεν έχει επιλεγεί προφίλ.', tr: 'Hiçbir profil seçilmedi.',
    fr: 'Aucun profil sélectionné.', es: 'Ningún perfil seleccionado.', it: 'Nessun profilo selezionato.',
  },
  'profile.noEmailHint': {
    de: 'Bitte öffne ein Profil über die Community oder die Follower-Liste.',
    en: 'Please open a profile via the Community or follower list.',
    el: 'Άνοιξε ένα προφίλ μέσω της Κοινότητας ή της λίστας ακόλουθων.',
    tr: 'Lütfen bir profili Topluluk veya takipçi listesi üzerinden aç.',
    fr: 'Veuillez ouvrir un profil via la Communauté ou la liste de followers.',
    es: 'Por favor abre un perfil desde la Comunidad o la lista de seguidores.',
    it: 'Apri un profilo dalla Community o dalla lista dei follower.',
  },
  'profile.notFound': {
    de: 'Profil nicht gefunden.', en: 'Profile not found.',
    el: 'Το προφίλ δεν βρέθηκε.', tr: 'Profil bulunamadı.',
    fr: 'Profil introuvable.', es: 'Perfil no encontrado.', it: 'Profilo non trovato.',
  },
  'profile.notFoundHint': {
    de: 'Der Username existiert nicht oder das Profil wurde gelöscht.',
    en: 'The username does not exist or the profile was deleted.',
    el: 'Το username δεν υπάρχει ή το προφίλ διαγράφηκε.',
    tr: 'Kullanıcı adı mevcut değil veya profil silinmiş.',
    fr: 'Le nom d\'utilisateur n\'existe pas ou le profil a été supprimé.',
    es: 'El nombre de usuario no existe o el perfil fue eliminado.',
    it: 'Il nome utente non esiste o il profilo è stato eliminato.',
  },
  'profile.usernameRequired': {
    de: 'Username erforderlich für öffentliches Profil',
    en: 'Username required for public profile',
    el: 'Απαιτείται username για δημόσιο προφίλ',
    tr: 'Herkese açık profil için kullanıcı adı gerekli',
    fr: 'Nom d\'utilisateur requis pour un profil public',
    es: 'Se requiere nombre de usuario para perfil público',
    it: 'Nome utente richiesto per profilo pubblico',
  },
  'profile.usernameRequiredHint': {
    de: 'Lege einen Username fest, damit andere dein Profil über einen Link öffnen können.',
    en: 'Set a username so others can open your profile via a link.',
    el: 'Ορίσου ένα username ώστε άλλοι να μπορούν να ανοίξουν το προφίλ σου μέσω συνδέσμου.',
    tr: 'Diğerlerinin profilini bağlantı üzerinden açabilmesi için kullanıcı adı belirle.',
    fr: 'Définissez un nom d\'utilisateur pour que d\'autres puissent ouvrir votre profil via un lien.',
    es: 'Establece un nombre de usuario para que otros puedan abrir tu perfil mediante un enlace.',
    it: 'Imposta un nome utente in modo che altri possano aprire il tuo profilo tramite un link.',
  },
  'notif.follow.title': {
    de: 'Neuer Follower', en: 'New Follower', el: 'Νέος ακόλουθος',
    tr: 'Yeni takipçi', fr: 'Nouveau follower', es: 'Nuevo seguidor', it: 'Nuovo follower',
  },
  'notif.follow.action': {
    de: 'folgt dir jetzt', en: 'is now following you', el: 'σε ακολουθεί τώρα',
    tr: 'seni takip ediyor', fr: 'vous suit maintenant', es: 'te está siguiendo ahora', it: 'ti sta seguendo ora',
  },
  'notif.follow.message': {
    de: '{actor} folgt dir jetzt', en: '{actor} is now following you', el: 'Ο/Η {actor} σε ακολουθεί τώρα',
    tr: '{actor} seni takip ediyor', fr: '{actor} vous suit maintenant', es: '{actor} te está siguiendo ahora', it: '{actor} ti sta seguendo ora',
  },

  // ── Notification texts ───────────────────────────────────────────────────
  'notif.empty': {
    de: 'Keine Benachrichtigungen', en: 'No notifications', el: 'Δεν υπάρχουν ειδοποιήσεις',
    tr: 'Bildirim yok', fr: 'Aucune notification', es: 'Sin notificaciones', it: 'Nessuna notifica',
  },
  'notif.markAllRead': {
    de: 'Alle als gelesen', en: 'Mark all read', el: 'Σήμανση όλων ως αναγνωσμένα',
    tr: 'Tümünü okundu say', fr: 'Tout marquer lu', es: 'Marcar todo leído', it: 'Segna tutto letto',
  },
  'notif.like.title': {
    de: 'Neuer Like', en: 'New Like', el: 'Νέο Like',
    tr: 'Yeni Beğeni', fr: 'Nouveau like', es: 'Nuevo like', it: 'Nuovo like',
  },
  'notif.like.message': {
    de: '{actor} hat deinen Post „{postTitle}" geliked',
    en: '{actor} liked your post "{postTitle}"',
    el: 'Ο/Η {actor} έκανε like στην ανάρτησή σου „{postTitle}"',
    tr: '{actor}, "{postTitle}" gönderini beğendi',
    fr: '{actor} a aimé votre post « {postTitle} »',
    es: '{actor} le dio like a tu publicación "{postTitle}"',
    it: '{actor} ha messo like al tuo post "{postTitle}"',
  },
  'notif.comment.title': {
    de: 'Neuer Kommentar', en: 'New Comment', el: 'Νέο σχόλιο',
    tr: 'Yeni Yorum', fr: 'Nouveau commentaire', es: 'Nuevo comentario', it: 'Nuovo commento',
  },
  'notif.comment.message': {
    de: '{actor} hat deinen Post „{postTitle}" kommentiert',
    en: '{actor} commented on your post "{postTitle}"',
    el: 'Ο/Η {actor} σχολίασε την ανάρτησή σου „{postTitle}"',
    tr: '{actor}, "{postTitle}" gönderini yorumladı',
    fr: '{actor} a commenté votre post « {postTitle} »',
    es: '{actor} comentó tu publicación "{postTitle}"',
    it: '{actor} ha commentato il tuo post "{postTitle}"',
  },

  // ── Community ─────────────────────────────────────────────────────────────
  'community.title': {
    de: 'Community', en: 'Community', el: 'Κοινότητα',
    tr: 'Topluluk', fr: 'Communauté', es: 'Comunidad', it: 'Comunità',
  },
  'community.moderation': {
    de: 'Moderation', en: 'Moderation', el: 'Συντονισμός',
    tr: 'Moderasyon', fr: 'Modération', es: 'Moderación', it: 'Moderazione',
  },
  'community.clubs': {
    de: 'Clubs', en: 'Clubs', el: 'Λέσχες',
    tr: 'Kulüpler', fr: 'Clubs', es: 'Clubes', it: 'Club',
  },
  'community.tab.posts': {
    de: 'Beiträge', en: 'Posts', el: 'Αναρτήσεις',
    tr: 'Gönderiler', fr: 'Publications', es: 'Publicaciones', it: 'Post',
  },
  'community.tab.messages': {
    de: 'Nachrichten', en: 'Messages', el: 'Μηνύματα',
    tr: 'Mesajlar', fr: 'Messages', es: 'Mensajes', it: 'Messaggi',
  },
  'community.tab.following': {
    de: 'Following', en: 'Following', el: 'Ακολουθώ',
    tr: 'Takip', fr: 'Abonnements', es: 'Siguiendo', it: 'Seguiti',
  },
  'community.newPost': {
    de: 'Neuer Post', en: 'New Post', el: 'Νέα ανάρτηση',
    tr: 'Yeni gönderi', fr: 'Nouveau post', es: 'Nueva publicación', it: 'Nuovo post',
  },
  'community.searchPlaceholder': {
    de: 'Posts durchsuchen...', en: 'Search posts...', el: 'Αναζήτηση αναρτήσεων...',
    tr: 'Gönderi ara...', fr: 'Rechercher des posts...', es: 'Buscar publicaciones...', it: 'Cerca post...',
  },
  'community.filter.all': {
    de: 'Alle', en: 'All', el: 'Όλα',
    tr: 'Tümü', fr: 'Tous', es: 'Todos', it: 'Tutti',
  },
  'community.filter.allgemein': {
    de: 'Allgemein', en: 'General', el: 'Γενικά',
    tr: 'Genel', fr: 'Général', es: 'General', it: 'Generale',
  },
  'community.filter.buchempfehlung': {
    de: 'Buchempfehlung', en: 'Book Rec.', el: 'Πρόταση βιβλίου',
    tr: 'Kitap önerisi', fr: 'Recommandation', es: 'Recomendación', it: 'Consiglio libro',
  },
  'community.filter.diskussion': {
    de: 'Diskussion', en: 'Discussion', el: 'Συζήτηση',
    tr: 'Tartışma', fr: 'Discussion', es: 'Discusión', it: 'Discussione',
  },
  'community.filter.frage': {
    de: 'Frage', en: 'Question', el: 'Ερώτηση',
    tr: 'Soru', fr: 'Question', es: 'Pregunta', it: 'Domanda',
  },
  'community.empty.all': {
    de: 'Noch keine Beiträge. Sei der Erste!', en: 'No posts yet. Be the first!', el: 'Δεν υπάρχουν αναρτήσεις. Γίνε ο πρώτος!',
    tr: 'Henüz gönderi yok. İlk sen ol!', fr: 'Aucune publication. Soyez le premier !', es: '¡Sin publicaciones aún. ¡Sé el primero!', it: 'Nessun post ancora. Sii il primo!',
  },
  'community.empty.category': {
    de: 'Keine Beiträge in dieser Kategorie', en: 'No posts in this category', el: 'Δεν υπάρχουν αναρτήσεις σε αυτή την κατηγορία',
    tr: 'Bu kategoride gönderi yok', fr: 'Aucune publication dans cette catégorie', es: 'Sin publicaciones en esta categoría', it: 'Nessun post in questa categoria',
  },
  'community.loading': {
    de: 'Lädt...', en: 'Loading...', el: 'Φόρτωση...',
    tr: 'Yükleniyor...', fr: 'Chargement...', es: 'Cargando...', it: 'Caricamento...',
  },
  'community.premium.title': {
    de: 'Premium-Vorteil', en: 'Premium Benefit', el: 'Πλεονέκτημα Premium',
    tr: 'Premium avantajı', fr: 'Avantage Premium', es: 'Ventaja Premium', it: 'Vantaggio Premium',
  },
  'community.premium.desc': {
    de: 'Als Premium-Mitglied kannst du die Book Compass KI in Diskussionen einbinden.',
    en: 'As a Premium member you can include the Book Compass AI in discussions.',
    el: 'Ως Premium μέλος μπορείς να χρησιμοποιείς την ΤΝ του Book Compass στις συζητήσεις.',
    tr: 'Premium üye olarak Book Compass AI\'ı tartışmalara dahil edebilirsin.',
    fr: 'En tant que membre Premium, vous pouvez intégrer l\'IA Book Compass dans les discussions.',
    es: 'Como miembro Premium puedes incluir la IA de Book Compass en las discusiones.',
    it: 'Come membro Premium puoi includere l\'IA Book Compass nelle discussioni.',
  },
  'community.premium.upgrade': {
    de: 'Jetzt upgraden', en: 'Upgrade now', el: 'Αναβάθμιση τώρα',
    tr: 'Şimdi yükselt', fr: 'Passer Premium', es: 'Mejorar ahora', it: 'Aggiorna ora',
  },
  'community.messages.title': {
    de: 'Nachrichten', en: 'Messages', el: 'Μηνύματα',
    tr: 'Mesajlar', fr: 'Messages', es: 'Mensajes', it: 'Messaggi',
  },
  'community.messages.new': {
    de: 'Neue Nachricht', en: 'New Message', el: 'Νέο μήνυμα',
    tr: 'Yeni mesaj', fr: 'Nouveau message', es: 'Nuevo mensaje', it: 'Nuovo messaggio',
  },
  'community.messages.selectConversation': {
    de: 'Wähle eine Konversation aus', en: 'Select a conversation', el: 'Επίλεξε μια συνομιλία',
    tr: 'Bir konuşma seç', fr: 'Choisissez une conversation', es: 'Selecciona una conversación', it: 'Seleziona una conversazione',
  },
  'community.following.iFollow': {
    de: 'Ich folge', en: 'I follow', el: 'Ακολουθώ',
    tr: 'Takip ettiklerim', fr: 'Je suis', es: 'Sigo', it: 'Seguo',
  },
  'community.following.myFollowers': {
    de: 'Meine Follower', en: 'My Followers', el: 'Οι ακόλουθοί μου',
    tr: 'Takipçilerim', fr: 'Mes abonnés', es: 'Mis seguidores', it: 'I miei follower',
  },
  'community.following.noFollowing': {
    de: 'Du folgst noch niemandem', en: 'You\'re not following anyone', el: 'Δεν ακολουθείς κανέναν',
    tr: 'Henüz kimseyi takip etmiyorsun', fr: 'Vous ne suivez personne', es: 'No sigues a nadie', it: 'Non segui nessuno',
  },
  'community.following.noFollowers': {
    de: 'Noch keine Follower', en: 'No followers yet', el: 'Δεν υπάρχουν ακόλουθοι',
    tr: 'Henüz takipçi yok', fr: 'Pas encore de followers', es: 'Sin seguidores aún', it: 'Ancora nessun follower',
  },
  'community.following.unfollow': {
    de: 'Entfolgen', en: 'Unfollow', el: 'Διακοπή παρακολούθησης',
    tr: 'Takibi bırak', fr: 'Ne plus suivre', es: 'Dejar de seguir', it: 'Smetti di seguire',
  },
  'community.deleteConfirm': {
    de: 'Post wirklich löschen?', en: 'Really delete this post?', el: 'Να διαγραφεί αυτή η ανάρτηση;',
    tr: 'Bu gönderiyi silmek istiyor musun?', fr: 'Supprimer ce post ?', es: '¿Eliminar esta publicación?', it: 'Eliminare questo post?',
  },
  // ── PostCard ──────────────────────────────────────────────────────────────
  'post.you': {
    de: 'Du', en: 'You', el: 'Εσύ',
    tr: 'Sen', fr: 'Vous', es: 'Tú', it: 'Tu',
  },
  'post.anon': {
    de: 'Anonym', en: 'Anonymous', el: 'Ανώνυμος',
    tr: 'Anonim', fr: 'Anonyme', es: 'Anónimo', it: 'Anonimo',
  },
  'post.report': {
    de: 'Melden', en: 'Report', el: 'Αναφορά',
    tr: 'Şikayet et', fr: 'Signaler', es: 'Reportar', it: 'Segnala',
  },
  'post.delete': {
    de: 'Löschen', en: 'Delete', el: 'Διαγραφή',
    tr: 'Sil', fr: 'Supprimer', es: 'Eliminar', it: 'Elimina',
  },
  'post.message': {
    de: 'Nachricht', en: 'Message', el: 'Μήνυμα',
    tr: 'Mesaj', fr: 'Message', es: 'Mensaje', it: 'Messaggio',
  },
  'post.addComment': {
    de: 'Kommentar hinzufügen', en: 'Add comment', el: 'Προσθήκη σχολίου',
    tr: 'Yorum ekle', fr: 'Ajouter un commentaire', es: 'Añadir comentario', it: 'Aggiungi commento',
  },
  'post.cat.allgemein': {
    de: 'Allgemein', en: 'General', el: 'Γενικά',
    tr: 'Genel', fr: 'Général', es: 'General', it: 'Generale',
  },
  'post.cat.buchempfehlung': {
    de: 'Buchempfehlung', en: 'Book Rec.', el: 'Πρόταση βιβλίου',
    tr: 'Kitap önerisi', fr: 'Recommandation', es: 'Recomendación', it: 'Consiglio libro',
  },
  'post.cat.diskussion': {
    de: 'Diskussion', en: 'Discussion', el: 'Συζήτηση',
    tr: 'Tartışma', fr: 'Discussion', es: 'Discusión', it: 'Discussione',
  },
  'post.cat.frage': {
    de: 'Frage', en: 'Question', el: 'Ερώτηση',
    tr: 'Soru', fr: 'Question', es: 'Pregunta', it: 'Domanda',
  },
  // ── CommentSection ────────────────────────────────────────────────────────
  'comment.placeholder': {
    de: 'Schreibe einen Kommentar...', en: 'Write a comment...', el: 'Γράψε ένα σχόλιο...',
    tr: 'Yorum yaz...', fr: 'Écrire un commentaire...', es: 'Escribe un comentario...', it: 'Scrivi un commento...',
  },
  'comment.send': {
    de: 'Senden', en: 'Send', el: 'Αποστολή',
    tr: 'Gönder', fr: 'Envoyer', es: 'Enviar', it: 'Invia',
  },
  'comment.askAI': {
    de: 'Book Compass fragen', en: 'Ask Book Compass', el: 'Ρώτα το Book Compass',
    tr: 'Book Compass\'a sor', fr: 'Demander à Book Compass', es: 'Preguntar a Book Compass', it: 'Chiedi a Book Compass',
  },
  'comment.askAILoading': {
    de: 'Book Compass denkt nach...', en: 'Book Compass is thinking...', el: 'Το Book Compass σκέφτεται...',
    tr: 'Book Compass düşünüyor...', fr: 'Book Compass réfléchit...', es: 'Book Compass está pensando...', it: 'Book Compass sta pensando...',
  },
  'comment.empty': {
    de: 'Noch keine Kommentare. Sei der Erste!', en: 'No comments yet. Be the first!', el: 'Δεν υπάρχουν σχόλια. Γίνε ο πρώτος!',
    tr: 'Henüz yorum yok. İlk sen ol!', fr: 'Aucun commentaire. Soyez le premier !', es: 'Sin comentarios aún. ¡Sé el primero!', it: 'Nessun commento ancora. Sii il primo!',
  },
  'comment.aiLabel': {
    de: 'KI', en: 'AI', el: 'ΤΝ',
    tr: 'YZ', fr: 'IA', es: 'IA', it: 'IA',
  },
  // ── CreatePostModal ───────────────────────────────────────────────────────
  'createPost.title': {
    de: 'Neuer Post', en: 'New Post', el: 'Νέα ανάρτηση',
    tr: 'Yeni gönderi', fr: 'Nouveau post', es: 'Nueva publicación', it: 'Nuovo post',
  },
  'createPost.category': {
    de: 'Kategorie', en: 'Category', el: 'Κατηγορία',
    tr: 'Kategori', fr: 'Catégorie', es: 'Categoría', it: 'Categoria',
  },
  'createPost.titleLabel': {
    de: 'Titel', en: 'Title', el: 'Τίτλος',
    tr: 'Başlık', fr: 'Titre', es: 'Título', it: 'Titolo',
  },
  'createPost.titlePlaceholder': {
    de: 'Worum geht es?', en: 'What is it about?', el: 'Περί τίνος πρόκειται;',
    tr: 'Ne hakkında?', fr: 'De quoi s\'agit-il ?', es: '¿De qué trata?', it: 'Di cosa si tratta?',
  },
  'createPost.contentLabel': {
    de: 'Inhalt', en: 'Content', el: 'Περιεχόμενο',
    tr: 'İçerik', fr: 'Contenu', es: 'Contenido', it: 'Contenuto',
  },
  'createPost.contentPlaceholder': {
    de: 'Teile deine Gedanken...', en: 'Share your thoughts...', el: 'Μοιράσου τις σκέψεις σου...',
    tr: 'Düşüncelerini paylaş...', fr: 'Partagez vos pensées...', es: 'Comparte tus pensamientos...', it: 'Condividi i tuoi pensieri...',
  },
  'createPost.linkBook': {
    de: 'Buch verknüpfen (optional)', en: 'Link a book (optional)', el: 'Σύνδεση βιβλίου (προαιρετικό)',
    tr: 'Kitap bağla (isteğe bağlı)', fr: 'Lier un livre (optionnel)', es: 'Vincular un libro (opcional)', it: 'Collega un libro (opzionale)',
  },
  'createPost.noBook': {
    de: 'Kein Buch', en: 'No book', el: 'Χωρίς βιβλίο',
    tr: 'Kitap yok', fr: 'Aucun livre', es: 'Sin libro', it: 'Nessun libro',
  },
  'createPost.cancel': {
    de: 'Abbrechen', en: 'Cancel', el: 'Άκυρο',
    tr: 'İptal', fr: 'Annuler', es: 'Cancelar', it: 'Annulla',
  },
  'createPost.publish': {
    de: 'Veröffentlichen', en: 'Publish', el: 'Δημοσίευση',
    tr: 'Yayımla', fr: 'Publier', es: 'Publicar', it: 'Pubblica',
  },
  'createPost.publishing': {
    de: 'Wird veröffentlicht...', en: 'Publishing...', el: 'Δημοσίευση...',
    tr: 'Yayımlanıyor...', fr: 'Publication...', es: 'Publicando...', it: 'Pubblicazione...',
  },
  // ── ReportModal ───────────────────────────────────────────────────────────
  'report.title': {
    de: 'Post melden', en: 'Report Post', el: 'Αναφορά ανάρτησης',
    tr: 'Gönderiyi şikayet et', fr: 'Signaler le post', es: 'Reportar publicación', it: 'Segnala post',
  },
  'report.reasonLabel': {
    de: 'Grund', en: 'Reason', el: 'Λόγος',
    tr: 'Sebep', fr: 'Motif', es: 'Motivo', it: 'Motivo',
  },
  'report.descLabel': {
    de: 'Beschreibung (optional)', en: 'Description (optional)', el: 'Περιγραφή (προαιρετικό)',
    tr: 'Açıklama (isteğe bağlı)', fr: 'Description (optionnel)', es: 'Descripción (opcional)', it: 'Descrizione (opzionale)',
  },
  'report.descPlaceholder': {
    de: 'Weitere Details...', en: 'More details...', el: 'Περισσότερες λεπτομέρειες...',
    tr: 'Daha fazla detay...', fr: 'Plus de détails...', es: 'Más detalles...', it: 'Più dettagli...',
  },
  'report.cancel': {
    de: 'Abbrechen', en: 'Cancel', el: 'Άκυρο',
    tr: 'İptal', fr: 'Annuler', es: 'Cancelar', it: 'Annulla',
  },
  'report.submit': {
    de: 'Melden', en: 'Report', el: 'Αναφορά',
    tr: 'Şikayet et', fr: 'Signaler', es: 'Reportar', it: 'Segnala',
  },
  'report.submitting': {
    de: 'Wird gemeldet...', en: 'Reporting...', el: 'Υποβολή αναφοράς...',
    tr: 'Şikayet ediliyor...', fr: 'Signalement...', es: 'Reportando...', it: 'Segnalazione...',
  },
  'report.reason.spam': {
    de: 'Spam oder Werbung', en: 'Spam or Advertising', el: 'Spam ή Διαφήμιση',
    tr: 'Spam veya Reklam', fr: 'Spam ou publicité', es: 'Spam o publicidad', it: 'Spam o pubblicità',
  },
  'report.reason.inappropriate': {
    de: 'Unangemessener Inhalt', en: 'Inappropriate Content', el: 'Ακατάλληλο περιεχόμενο',
    tr: 'Uygunsuz içerik', fr: 'Contenu inapproprié', es: 'Contenido inapropiado', it: 'Contenuto inappropriato',
  },
  'report.reason.harassment': {
    de: 'Belästigung oder Mobbing', en: 'Harassment or Bullying', el: 'Παρενόχληση ή Εκφοβισμός',
    tr: 'Taciz veya zorbalık', fr: 'Harcèlement ou intimidation', es: 'Acoso o intimidación', it: 'Molestie o bullismo',
  },
  'report.reason.misinformation': {
    de: 'Falschinformationen', en: 'Misinformation', el: 'Παραπληροφόρηση',
    tr: 'Yanlış bilgi', fr: 'Désinformation', es: 'Desinformación', it: 'Disinformazione',
  },
  'report.reason.other': {
    de: 'Anderer Grund', en: 'Other Reason', el: 'Άλλος λόγος',
    tr: 'Başka sebep', fr: 'Autre raison', es: 'Otro motivo', it: 'Altro motivo',
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