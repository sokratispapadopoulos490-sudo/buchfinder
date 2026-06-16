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
    de: 'Likes', en: 'Likes', el: 'Likes', tr: 'Beğeniler', fr: 'J\'aime', es: 'Me gusta', it: 'Mi piace',
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

  // ── Phase 2: Hinweise / Info ──────────────────────────────────────────────
  'discover.bookLangHint': {
    de: 'Hinweis: Für Griechisch und Türkisch sind weniger Bücher indexiert.',
    en: 'Note: Fewer books are indexed for Greek and Turkish.',
    el: 'Σημείωση: Λιγότερα βιβλία είναι διαθέσιμα για Ελληνικά.',
    tr: 'Not: Türkçe için daha az kitap dizine eklendi.',
    fr: 'Remarque : Moins de livres sont indexés pour le grec et le turc.',
    es: 'Nota: Hay menos libros indexados para griego y turco.',
    it: 'Nota: Meno libri sono indicizzati per greco e turco.',
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