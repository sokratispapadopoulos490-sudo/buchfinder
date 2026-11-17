/**
 * i18n-extra.js – Ergänzende Übersetzungen.
 *
 * i18n.js enthält das Haupt-Dictionary und ist an der Dateigrößen-Grenze.
 * Neue Keys kommen hier hinein und werden in i18n.js per Object.assign
 * in das Haupt-Dictionary gemischt.
 *
 * Sprachen: de, en, el, tr, fr, es, it (Fallback: de)
 */

const extraDict = {
  // ── Physische Bibliothek (LibraryCapture) ─────────────────────────────────
  'lib.capture.title': {
    de: 'Buch erfassen', en: 'Add a book', el: 'Προσθήκη βιβλίου',
    tr: 'Kitap ekle', fr: 'Ajouter un livre', es: 'Añadir un libro', it: 'Aggiungi un libro',
  },
  'lib.capture.subtitle': {
    de: 'Suche nach Titel, ISBN oder scanne den Barcode',
    en: 'Search by title, ISBN or scan the barcode',
    el: 'Αναζήτηση με τίτλο, ISBN ή σάρωση barcode',
    tr: 'Başlık, ISBN ile ara veya barkodu tara',
    fr: 'Rechercher par titre, ISBN ou scanner le code-barres',
    es: 'Busca por título, ISBN o escanea el código de barras',
    it: 'Cerca per titolo, ISBN o scansiona il codice a barre',
  },
  'lib.capture.searchPlaceholder': {
    de: 'Titel oder Autor suchen…', en: 'Search title or author…',
    el: 'Αναζήτηση τίτλου ή συγγραφέα…', tr: 'Başlık veya yazar ara…',
    fr: 'Rechercher un titre ou un auteur…', es: 'Buscar título o autor…',
    it: 'Cerca titolo o autore…',
  },
  'lib.capture.scanBarcode': {
    de: 'Barcode scannen', en: 'Scan barcode', el: 'Σάρωση barcode',
    tr: 'Barkod tara', fr: 'Scanner le code-barres', es: 'Escanear código de barras',
    it: 'Scansiona codice a barre',
  },
  'lib.capture.scanning': {
    de: 'Kamera startet…', en: 'Starting camera…', el: 'Εκκίνηση κάμερας…',
    tr: 'Kamera başlatılıyor…', fr: 'Démarrage de la caméra…', es: 'Iniciando cámara…',
    it: 'Avvio fotocamera…',
  },
  'lib.capture.scanUnsupported': {
    de: 'Barcode-Scan wird in diesem Browser nicht unterstützt. Bitte ISBN eingeben.',
    en: 'Barcode scanning is not supported in this browser. Please enter the ISBN.',
    el: 'Η σάρωση barcode δεν υποστηρίζεται σε αυτό το πρόγραμμα περιήγησης. Εισάγετε το ISBN.',
    tr: 'Bu tarayıcı barkod taramayı desteklemiyor. Lütfen ISBN girin.',
    fr: "Le scan de code-barres n'est pas pris en charge par ce navigateur. Veuillez saisir l'ISBN.",
    es: 'Este navegador no admite el escaneo de códigos de barras. Introduce el ISBN.',
    it: "La scansione dei codici a barre non è supportata in questo browser. Inserisci l'ISBN.",
  },
  'lib.capture.isbnPlaceholder': {
    de: 'ISBN eingeben…', en: 'Enter ISBN…', el: 'Εισαγωγή ISBN…',
    tr: 'ISBN gir…', fr: "Saisir l'ISBN…", es: 'Introduce el ISBN…', it: "Inserisci l'ISBN…",
  },
  'lib.capture.noResults': {
    de: 'Keine Treffer gefunden', en: 'No results found', el: 'Δεν βρέθηκαν αποτελέσματα',
    tr: 'Sonuç bulunamadı', fr: 'Aucun résultat', es: 'No se encontraron resultados',
    it: 'Nessun risultato',
  },
  'lib.capture.saved': {
    de: 'Gespeichert', en: 'Saved', el: 'Αποθηκεύτηκε',
    tr: 'Kaydedildi', fr: 'Enregistré', es: 'Guardado', it: 'Salvato',
  },
  'lib.capture.save': {
    de: 'Hinzufügen', en: 'Add', el: 'Προσθήκη',
    tr: 'Ekle', fr: 'Ajouter', es: 'Añadir', it: 'Aggiungi',
  },
  'lib.capture.physical': {
    de: 'Physisches Exemplar', en: 'Physical copy', el: 'Φυσικό αντίτυπο',
    tr: 'Fiziksel kopya', fr: 'Exemplaire physique', es: 'Ejemplar físico', it: 'Copia fisica',
  },
  'lib.capture.condition': {
    de: 'Zustand', en: 'Condition', el: 'Κατάσταση',
    tr: 'Durum', fr: 'État', es: 'Estado', it: 'Condizione',
  },
  'lib.capture.location': {
    de: 'Standort (z. B. Regal Wohnzimmer)', en: 'Location (e.g. living room shelf)',
    el: 'Τοποθεσία (π.χ. ράφι σαλονιού)', tr: 'Konum (ör. salon rafı)',
    fr: 'Emplacement (ex. étagère du salon)', es: 'Ubicación (p. ej. estante del salón)',
    it: 'Posizione (es. scaffale soggiorno)',
  },
  'lib.capture.skip': {
    de: 'Überspringen', en: 'Skip', el: 'Παράλειψη',
    tr: 'Atla', fr: 'Passer', es: 'Omitir', it: 'Salta',
  },
  'lib.capture.done': {
    de: 'Fertig', en: 'Done', el: 'Έτοιμο',
    tr: 'Bitti', fr: 'Terminé', es: 'Listo', it: 'Fatto',
  },

  // ── Konto ────────────────────────────────────────────────────────────────
  'lib.account.myLibrary': {
    de: 'Meine Bibliothek', en: 'My library', el: 'Η βιβλιοθήκη μου',
    tr: 'Kitaplığım', fr: 'Ma bibliothèque', es: 'Mi biblioteca', it: 'La mia biblioteca',
  },
  'lib.account.myLibrarySub': {
    de: 'Physische Bücher erfassen & verwalten',
    en: 'Add and manage physical books',
    el: 'Καταγραφή και διαχείριση φυσικών βιβλίων',
    tr: 'Fiziksel kitapları ekle ve yönet',
    fr: 'Ajouter et gérer vos livres physiques',
    es: 'Añade y gestiona tus libros físicos',
    it: 'Aggiungi e gestisci i libri fisici',
  },

  // ── Seitentitel ──────────────────────────────────────────────────────────
  'clubs.title': {
    de: 'Buchclubs', en: 'Book clubs', el: 'Λέσχες ανάγνωσης',
    tr: 'Kitap kulüpleri', fr: 'Clubs de lecture', es: 'Clubes de lectura', it: 'Club del libro',
  },
  'clubs.detail': {
    de: 'Club-Details', en: 'Club details', el: 'Λεπτομέρειες λέσχης',
    tr: 'Kulüp detayları', fr: 'Détails du club', es: 'Detalles del club', it: 'Dettagli del club',
  },
  'legal.title': {
    de: 'Rechtliches', en: 'Legal', el: 'Νομικά',
    tr: 'Yasal', fr: 'Mentions légales', es: 'Legal', it: 'Note legali',
  },
  'moderation.title': {
    de: 'Moderation', en: 'Moderation', el: 'Συντονισμός',
    tr: 'Moderasyon', fr: 'Modération', es: 'Moderación', it: 'Moderazione',
  },
  'notfound.title': {
    de: 'Seite nicht gefunden', en: 'Page not found', el: 'Η σελίδα δεν βρέθηκε',
    tr: 'Sayfa bulunamadı', fr: 'Page introuvable', es: 'Página no encontrada', it: 'Pagina non trovata',
  },
  'notfound.text': {
    de: 'Diese Seite gibt es nicht (mehr). Vielleicht hat sich der Link geändert.',
    en: "This page doesn't exist (anymore). The link may have changed.",
    el: 'Αυτή η σελίδα δεν υπάρχει (πια). Ίσως άλλαξε ο σύνδεσμος.',
    tr: 'Bu sayfa (artık) yok. Bağlantı değişmiş olabilir.',
    fr: "Cette page n'existe pas (ou plus). Le lien a peut-être changé.",
    es: 'Esta página no existe (ya). Puede que el enlace haya cambiado.',
    it: 'Questa pagina non esiste (più). Il link potrebbe essere cambiato.',
  },
  'notfound.back': {
    de: 'Zum Kompass', en: 'Go to Compass', el: 'Στην πυξίδα',
    tr: 'Pusulaya git', fr: 'Aller à la boussole', es: 'Ir al compás', it: 'Vai alla bussola',
  },
  'affiliate.title': {
    de: 'Affiliate-Statistik', en: 'Affiliate analytics', el: 'Στατιστικά affiliate',
    tr: 'Affiliate istatistikleri', fr: "Statistiques d'affiliation",
    es: 'Estadísticas de afiliados', it: 'Statistiche affiliate',
  },
};

export default extraDict;