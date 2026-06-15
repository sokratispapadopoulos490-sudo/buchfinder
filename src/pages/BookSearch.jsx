import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight, ChevronLeft } from 'lucide-react';
import QuestionCard from '@/components/books/QuestionCard';
import ReadBooksInput from '@/components/books/ReadBooksInput';
import ProfileCard from '@/components/books/ProfileCard';
import BookCard from '@/components/books/BookCard';
import { getMatchingBooksFromDB } from '@/lib/bookService';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/language/LanguageContext';
import { setBookLanguage } from '@/lib/shoppingRegion';

// Erste Frage für alle - Altersgruppe ermitteln
const ageQuestion = {
  id: 'age',
  question: "Für wen suchst du ein Buch?",
  options: [
    { value: "kinder", label: "Für Kinder (6-12 Jahre)" },
    { value: "jugendliche", label: "Für Jugendliche (13-17 Jahre)" },
    { value: "erwachsene", label: "Für Erwachsene (18+ Jahre)" }
  ]
};

// Buchsprachen-Frage für alle Gruppen (Schritt 2)
const bookLanguageQuestion = {
  id: 'book_language',
  question: "In welcher Sprache soll das Buch sein?",
  options: [
    { value: "de", label: "🇩🇪 Deutsch" },
    { value: "en", label: "🇬🇧 Englisch" },
    { value: "fr", label: "🇫🇷 Französisch" },
    { value: "es", label: "🇪🇸 Spanisch" },
    { value: "it", label: "🇮🇹 Italienisch" },
    { value: "el", label: "🇬🇷 Griechisch" },
    { value: "tr", label: "🇹🇷 Türkisch" },
    { value: "any", label: "🌍 Mehrere / egal" },
  ]
};

// read_books ist kein normaler Frageschritt – wird separat als Chip-Screen behandelt
// Marker-Objekt, damit der Flow weiß: hier ReadBooksInput rendern
const readBooksStep = { id: 'read_books', isReadBooksInput: true };

const questionSets = {
  // ── Kinder (5 Schritte inkl. readBooks) ──────────────────────────────────
  kinder: [
    ageQuestion,
    bookLanguageQuestion,
    {
      id: 'age_range',
      question: "Wie alt bist du?",
      options: [
        { value: "6-8",  label: "6–8 Jahre 📚" },
        { value: "9-10", label: "9–10 Jahre 🌟" },
        { value: "11-12", label: "11–12 Jahre 🚀" },
      ]
    },
    {
      id: 'topic',
      question: "Was magst du am liebsten?",
      options: [
        { value: "abenteuer",   label: "🗺️ Abenteuer & Spannung" },
        { value: "magie",       label: "✨ Magie & Fantasie" },
        { value: "freundschaft",label: "🤝 Freundschaft" },
        { value: "lustiges",    label: "😄 Lustige Bücher" },
        { value: "tiere",       label: "🐾 Tiere & Natur" },
        { value: "schule",      label: "🎒 Schule & Rätsel" },
      ]
    },
    {
      id: 'length',
      question: "Wie lange möchtest du lesen?",
      options: [
        { value: "kurz",  label: "⏱️ Kurz (10–20 Min.)" },
        { value: "mittel",label: "📖 Ein Kapitel täglich" },
        { value: "lang",  label: "📚 Richtig eintauchen" },
      ]
    },
    readBooksStep,
  ],

  // ── Jugendliche (5 Schritte inkl. readBooks) ─────────────────────────────
  jugendliche: [
    ageQuestion,
    bookLanguageQuestion,
    {
      id: 'occasion',
      question: "Wonach suchst du gerade?",
      options: [
        { value: "freizeit",   label: "🎧 Einfach Spaß & Ablenkung" },
        { value: "entdecken",  label: "🌍 Etwas Neues entdecken" },
        { value: "verstehen",  label: "💭 Mich selbst besser verstehen" },
        { value: "schule",     label: "📝 Etwas für die Schule" },
      ]
    },
    {
      id: 'topic',
      question: "Was interessiert dich?",
      options: [
        { value: "abenteuer",    label: "⚔️ Abenteuer & Fantasy" },
        { value: "liebe",        label: "💕 Liebe & Gefühle" },
        { value: "freundschaft", label: "🤜 Freundschaft & Zusammenhalt" },
        { value: "selbstfindung",label: "🔍 Wer bin ich?" },
        { value: "gesellschaft", label: "🌐 Die Welt verstehen" },
        { value: "thriller_krimi",label: "🕵️ Spannung & Krimi" },
      ]
    },
    {
      id: 'length',
      question: "Wie viel Zeit hast du?",
      options: [
        { value: "kurz",  label: "⚡ 15–30 Minuten" },
        { value: "mittel",label: "📖 Ein paar Kapitel täglich" },
        { value: "lang",  label: "🏊 Ich tauche gerne tief ein" },
      ]
    },
    readBooksStep,
  ],

  // ── Erwachsene (6 Schritte inkl. readBooks) ──────────────────────────────
  erwachsene: [
    ageQuestion,
    bookLanguageQuestion,
    {
      id: 'reading_goal',
      question: "Was ist dein Hauptziel beim Lesen?",
      options: [
        { value: "wachstum",    label: "Persönliches Wachstum & Wissen" },
        { value: "entspannung", label: "Entspannung & Unterhaltung" },
        { value: "beide",       label: "Beides – je nach Stimmung" },
      ]
    },
    {
      id: 'topic',
      question: "Was interessiert dich am meisten?",
      options: [
        { value: "persoenliche_entwicklung",  label: "Persönliche Entwicklung" },
        { value: "stress_ruhe",               label: "Ruhe & Gelassenheit" },
        { value: "fokus_produktivitaet",      label: "Fokus & Produktivität" },
        { value: "beziehung_kommunikation",   label: "Beziehungen & Kommunikation" },
        { value: "sinn_philosophie",          label: "Sinn & Lebensphilosophie" },
        { value: "glaube_spiritualitaet",     label: "Glaube & Spiritualität" },
        { value: "kreativitaet",              label: "Kreativität" },
        { value: "lernen_wissen",             label: "Lernen & Wissen" },
        { value: "koerper_gesundheit",        label: "Körper & Gesundheit" },
        { value: "fantasy_scifi",             label: "Fantasy & Science-Fiction" },
        { value: "thriller_krimi",            label: "Thriller & Krimis" },
        { value: "romance",                   label: "Romantik & Liebesromane" },
        { value: "historisch",                label: "Historische Romane" },
        { value: "literatur",                 label: "Anspruchsvolle Literatur" },
        { value: "humor",                     label: "Humor & Unterhaltung" },
      ]
    },
    {
      id: 'style',
      question: "Wie liest du am liebsten?",
      options: [
        { value: "praktisch",       label: "Praktisch & direkt umsetzbar" },
        { value: "wissenschaftlich",label: "Wissenschaftlich fundiert" },
        { value: "story",           label: "Erzählerisch & biografisch" },
        { value: "reflektierend",   label: "Philosophisch & tiefgründig" },
      ]
    },
    {
      id: 'level',
      question: "Wie erfahren bist du als Leser?",
      options: [
        { value: "einsteiger",     label: "Einsteiger – zugänglich & flüssig" },
        { value: "fortgeschritten",label: "Fortgeschritten – anspruchsvoller Inhalt" },
        { value: "erfahren",       label: "Erfahren – komplexe Werke willkommen" },
      ]
    },
    {
      id: 'format',
      question: "In welchem Format möchtest du lesen?",
      options: [
        { value: "print",     label: "📖 Gedrucktes Buch" },
        { value: "ebook",     label: "📱 E-Book" },
        { value: "audiobook", label: "🎧 Hörbuch" },
        { value: "any",       label: "🔀 Egal / alle Formate" },
      ]
    },
    {
      id: 'length',
      question: "Wie viel Zeit möchtest du investieren?",
      options: [
        { value: "kurz",  label: "Kurze Sessions (5–15 Min.)" },
        { value: "mittel",label: "In meinem eigenen Tempo" },
        { value: "lang",  label: "Intensiv & umfassend" },
      ]
    },
    readBooksStep,
  ],
};



const generateReasons = (book, profile) => {
  const bookTags = book.tags || book.categories || [];
  const bookStyle = book.style || book.reading_style || [];
  const topicMatch = (profile.mainTopics || []).find(t => bookTags.includes(t));
  const styleMatch = (profile.style || []).find(s => bookStyle.includes(s));

  const topicReasons = {
    persoenliche_entwicklung: "Spricht dein Bedürfnis nach Selbstentwicklung an",
    stress_ruhe: "Hilft dir, mehr Ruhe zu finden",
    fokus_produktivitaet: "Unterstützt dich bei Fokus und Produktivität",
    beziehung_kommunikation: "Stärkt deine Beziehungskompetenz",
    sinn_philosophie: "Berührt die großen Lebensfragen",
    kreativitaet: "Fördert deine kreative Seite",
    lernen_wissen: "Erweitert dein Wissen",
    koerper_gesundheit: "Unterstützt deine Gesundheit",
    fantasy_scifi: "Entführt dich in faszinierende Fantasiewelten",
    thriller_krimi: "Fesselt dich mit Spannung bis zur letzten Seite",
    romance: "Berührt dein Herz mit emotionalen Geschichten",
    historisch: "Lässt vergangene Epochen lebendig werden",
    literatur: "Bietet tiefgründige, kunstvolle Erzählkunst",
    humor: "Bringt dich zum Lachen und Schmunzeln",
    abenteuer: "Nimmt dich mit auf spannende Reisen",
    freundschaft: "Zeigt die Kraft von Freundschaft",
    magie: "Entführt dich in magische Welten",
    lustiges: "Bringt dich zum Lachen",
    mut: "Inspiriert zu mutigen Schritten",
    schule: "Begleitet durch den Schulalltag",
    selbstfindung: "Hilft dir, dich selbst zu verstehen",
    liebe: "Berührt das Herz"
  };

  const styleReasons = {
    praktisch: "Der praktische Stil passt zu deiner Vorliebe für Umsetzbarkeit",
    wissenschaftlich: "Wissenschaftlich fundiert – genau wie du es magst",
    story: "Erzählerisch geschrieben – für deinen bevorzugten Lesestil",
    reflektierend: "Lädt zum Nachdenken ein – passend zu deinem Stil",
    kurz: "Kompakt und prägnant – ideal für deine Lesezeit",
    anspruchsvoll: "Mit Tiefgang – genau richtig für dich"
  };

  const bookSpecificReasons = {
    "Atomic Habits": "Dieses Buch zeigt dir, wie kleinste Veränderungen große Wirkung haben – perfekt für nachhaltigen Wandel.",
    "Die Kunst des klaren Denkens": "52 kompakte Denkfehler-Analysen – jede für sich ein Aha-Moment.",
    "Der Weg des Künstlers": "Ein bewährtes 12-Wochen-Programm, das schon Tausende kreativer gemacht hat.",
    "Stille": "Kagges Polarerfahrungen machen Stille greifbar – ein Gegenpol zur lauten Welt.",
    "Deep Work": "Newport zeigt wissenschaftlich, wie du in einer Ablenkungswelt fokussiert bleibst.",
    "Gewaltfreie Kommunikation": "Rosenbergs Methode hat Beziehungen weltweit verändert – auch deine?",
    "Der Mönch, der seinen Ferrari verkaufte": "Eine inspirierende Parabel über das Wesentliche im Leben.",
    "Thinking, Fast and Slow": "Kahnemans Forschung erklärt, warum wir denken, wie wir denken.",
    "Ikigai": "Das japanische Konzept des Lebenszwecks – kurz und einprägsam erklärt.",
    "Essentialism": "McKeown zeigt, wie 'weniger aber besser' dein Leben vereinfacht.",
    "Der kleine Prinz": "Die zeitlose Geschichte über Freundschaft, die Generationen berührt.",
    "Das magische Baumhaus": "Zeitreisen machen Geschichte lebendig und spannend.",
    "Greg's Tagebuch": "Comics und Text perfekt kombiniert – Lesespaß garantiert.",
    "Die Schule der magischen Tiere": "Jeder bekommt sein perfektes Tier – welches wäre deins?",
    "Harry Potter und der Stein der Weisen": "Der Beginn einer Saga, die Millionen verzaubert hat.",
    "Matilda": "Dahls Geschichte über ein kluges Mädchen, das sich behauptet.",
    "Die Tribute von Panem": "Katniss' Mut inspiriert – eine Geschichte über Widerstand.",
    "Das Schicksal ist ein mieser Verräter": "John Green berührt mit seiner ehrlichen Erzählweise.",
    "Tschick": "Ein deutscher Klassiker über Freundschaft und Freiheit."
  };

  const bookSpecificReason = bookSpecificReasons[book.title] || book.description;

  const practicalGains = {
    persoenliche_entwicklung: "Konkrete Werkzeuge für persönliches Wachstum",
    stress_ruhe: "Praktische Methoden für mehr Gelassenheit im Alltag",
    fokus_produktivitaet: "Umsetzbare Strategien für mehr Klarheit",
    beziehung_kommunikation: "Direkt anwendbare Kommunikationstechniken",
    sinn_philosophie: "Neue Perspektiven für eigene Reflexion",
    glaube_spiritualitaet: "Spirituelle Einsichten und innere Orientierung",
    kreativitaet: "Impulse, die du sofort ausprobieren kannst",
    lernen_wissen: "Wissen, das dich weiterbringt",
    fantasy_scifi: "Vollkommenes Eintauchen in andere Welten",
    thriller_krimi: "Nervenaufreibende Spannung und clevere Rätsel",
    romance: "Emotionale Tiefe und hoffnungsvolle Geschichten",
    historisch: "Faszinierende Einblicke in vergangene Zeiten",
    literatur: "Sprachliche Schönheit und gedankliche Tiefe",
    humor: "Leichtigkeit und Unterhaltung pur",
    abenteuer: "Spannung, die dich fesselt",
    freundschaft: "Geschichten, die ans Herz gehen"
  };

  return {
    mainReason: book.isContrast 
      ? `"${book.title}" erweitert deinen Horizont mit einem anderen Blickwinkel – ${book.author} bietet eine frische Perspektive.`
      : bookSpecificReason,
    bullets: [
      topicReasons[topicMatch] || "Passt thematisch zu deinen Interessen",
      styleReasons[styleMatch] || "Angenehm zu lesen",
      practicalGains[topicMatch] || "Bietet wertvolle Erkenntnisse für den Alltag"
    ]
  };
};

function BookSearchContent() {
  const [phase, setPhase] = useState('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [readBooks, setReadBooks] = useState([]);   // Array von Titeln (Chips)
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [ageGroup, setAgeGroup] = useState('erwachsene');
  const [questions, setQuestions] = useState(questionSets.erwachsene);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translatedQuestions, setTranslatedQuestions] = useState(questionSets.erwachsene);

  // Safe language hook – LanguageProvider may not be present in direct preview
  let t = (k) => k;
  let contextBookLanguage = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const lang = useLanguage();
    t = lang.t;
    contextBookLanguage = lang.bookLanguage;
  } catch {
    // No LanguageProvider – use fallback
  }

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (questionSets[ageGroup]) {
      setTranslatedQuestions(questionSets[ageGroup]);
    }
  }, [ageGroup]);

  const checkAuth = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleStart = () => {
    setPhase('questions');
  };

  const advanceOrFinish = (newAnswers) => {
    if (currentQuestion < translatedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const userProfile = analyzeAnswers(newAnswers);
      setProfile(userProfile);
      setPhase('profile');
    }
  };

  const handleAnswer = (value) => {
    const currentQ = translatedQuestions?.[currentQuestion];
    if (!currentQ) return;

    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (currentQ.id === 'age') {
      setAgeGroup(value);
      setQuestions(questionSets[value]);
    }

    // readBooksInput wird über handleReadBooksDone gesteuert, nicht hier
    if (currentQ.isReadBooksInput) return;

    setTimeout(() => advanceOrFinish(newAnswers), 300);
  };

  // Wird aufgerufen wenn Nutzer "Weiter" / "Überspringen" im ReadBooksInput drückt
  const handleReadBooksDone = () => {
    setTimeout(() => advanceOrFinish(answers), 300);
  };

  const analyzeAnswers = (ans) => {
    const mainTopics = ans.topic ? [ans.topic] : [];
    const secondaryTopics = [];

    // Sekundär-Topics aus Anlass/Ziel ableiten
    if (ageGroup === 'erwachsene') {
      const goalTopics = {
        wachstum:     ['persoenliche_entwicklung', 'fokus_produktivitaet'],
        entspannung:  ['humor', 'romance'],
        beide:        [],
      };
      secondaryTopics.push(...(goalTopics[ans.reading_goal] || []));
    } else if (ageGroup === 'jugendliche') {
      const occasionTopics = {
        freizeit:    ['abenteuer', 'humor'],
        entdecken:   ['gesellschaft', 'selbstfindung'],
        verstehen:   ['selbstfindung'],
        schule:      ['lernen_wissen'],
      };
      secondaryTopics.push(...(occasionTopics[ans.occasion] || []));
    } else if (ageGroup === 'kinder') {
      // topic ist bereits Haupttopic, kein separater mood mehr
    }

    const style = ans.style ? [ans.style] : ['story'];
    if (ans.length === 'kurz') style.push('kurz');
    if (ans.length === 'lang') style.push('anspruchsvoll');

    // readBooks: Array von Strings (Chip-Eingabe), lowercase für Matching
    const readBooksNormalized = readBooks.map(b => b.trim().toLowerCase()).filter(Boolean);

    // Buchsprache: nutze explizite Antwort, sonst Kontext-Präferenz (z.B. 'el' für Griechen)
    const answeredLang = ans.book_language; // undefined wenn nicht beantwortet
    const bookLang = answeredLang && answeredLang !== 'any'
      ? answeredLang
      : (contextBookLanguage || null);

    // Nur persistieren wenn User explizit eine Sprache gewählt hat
    if (answeredLang && answeredLang !== 'any') {
      setBookLanguage(answeredLang);
    }

    return {
      mainTopics,
      secondaryTopics,
      style,
      difficulty: ans.level || 'einsteiger',
      format: ans.format || 'any',
      timeEffort: ans.length || 'mittel',
      ageGroup,
      ageRange: ans.age_range || null,
      occasion: ans.occasion || null,
      readingGoal: ans.reading_goal || null,
      bookLanguage: bookLang,
      readBooks: readBooksNormalized,
    };
  };

  const handleShowBooks = async () => {
    setLoading(true);

    // Populate savedBookIds so already-saved books are excluded from results
    let savedBookIds = [];
    if (isAuthenticated) {
      try {
        const saved = await base44.entities.SavedBook.list();
        savedBookIds = saved.map(s => s.book_id).filter(Boolean);
      } catch {
        savedBookIds = [];
      }
    }

    const profileWithSaved = { ...profile, savedBookIds };
    let results;
    try {
      results = await getMatchingBooksFromDB(profileWithSaved);
    } catch (err) {
      console.error('getMatchingBooksFromDB error:', err);
      results = [];
    }

    if (!Array.isArray(results)) results = [];

    setRecommendations(results);
    setPhase('results');
    setLoading(false);

    // Fire-and-forget: persist recommendation (non-blocking, never delays/blocks results)
    if (isAuthenticated && results.length > 0) {
      base44.entities.Recommendation.create({
        books: results,
        profile: profileWithSaved,
      }).catch(() => {});
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setPhase('start');
      setCurrentQuestion(0);
      setAnswers({});
    }
  };

  const handleBackFromProfile = () => {
    setPhase('questions');
    setCurrentQuestion(translatedQuestions.length - 1);
  };

  const handleBackFromResults = () => {
    setPhase('profile');
  };

  const handleRestart = () => {
    setPhase('start');
    setCurrentQuestion(0);
    setAnswers({});
    setReadBooks([]);
    setProfile(null);
    setRecommendations(null);
    setAgeGroup('erwachsene');
    setQuestions(questionSets.erwachsene);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] pb-24 relative">
      <AnimatePresence mode="wait">
        {/* Start Phase */}
        {phase === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center mb-10"
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-amber-600 flex items-center justify-center shadow-lg">
                <Compass className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-stone-800 dark:text-stone-100 mb-3 tracking-tight">
                Buchsuche
              </h1>
              <p className="text-stone-500 dark:text-stone-400 text-lg font-light max-w-xs mx-auto leading-relaxed">
                Finde dein perfektes nächstes Buch
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-4 relative z-10"
            >
              <button
                type="button"
                onClick={handleStart}
                style={{ backgroundColor: '#d97706', color: '#ffffff' }}
                className="flex items-center gap-2 px-10 py-4 text-base font-medium rounded-xl shadow-sm hover:opacity-90 active:opacity-80 transition-opacity cursor-pointer"
              >
                Neue Suche starten
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-stone-400 dark:text-stone-500">Kostenlos in der Beta</p>
            </motion.div>
          </motion.div>
        )}

        {/* Questions Phase */}
        {phase === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col px-6 py-12"
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-8 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">{currentQuestion > 0 ? t('btn.back') : t('btn.backToStart')}</span>
            </button>

            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {translatedQuestions[currentQuestion] && (
                  translatedQuestions[currentQuestion].isReadBooksInput ? (
                    <motion.div key="readbooks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-xl mx-auto">
                      {/* Progress */}
                      <div className="mb-8">
                        <div className="flex justify-between text-sm text-stone-400 dark:text-stone-500 mb-2">
                          <span>Frage {currentQuestion + 1}</span>
                          <span>{currentQuestion + 1} von {translatedQuestions.length}</span>
                        </div>
                        <div className="h-1 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div className="h-full bg-stone-800 dark:bg-amber-500 transition-all" style={{ width: `${((currentQuestion + 1) / translatedQuestions.length) * 100}%` }} />
                        </div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-light text-stone-800 dark:text-stone-100 mb-2 leading-relaxed">
                        Welche Bücher hast du zuletzt gelesen?
                      </h2>
                      <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
                        Optional – hilft uns, Dopplungen zu vermeiden.
                      </p>
                      <ReadBooksInput
                        value={readBooks}
                        onChange={setReadBooks}
                        onSkip={handleReadBooksDone}
                        placeholder={
                          ageGroup === 'kinder' ? 'z.B. Harry Potter, Gregs Tagebuch ...'
                          : ageGroup === 'jugendliche' ? 'z.B. Die Tribute von Panem, Tschick ...'
                          : 'z.B. Atomic Habits, Sapiens, Der kleine Prinz ...'
                        }
                      />
                    </motion.div>
                  ) : (
                    <QuestionCard
                      key={currentQuestion}
                      question={translatedQuestions[currentQuestion].question}
                      options={translatedQuestions[currentQuestion].options}
                      onSelect={handleAnswer}
                      selectedValue={answers[translatedQuestions[currentQuestion].id]}
                      questionNumber={currentQuestion + 1}
                      totalQuestions={translatedQuestions.length}
                      description={translatedQuestions[currentQuestion].description}
                    />
                  )
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Profile Phase */}
        {phase === 'profile' && profile && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col px-6 py-12"
          >
            <button
              onClick={handleBackFromProfile}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-8 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">{t('btn.back')}</span>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-stone-500 text-sm uppercase tracking-wide mb-6"
              >
                {t('results.analysisComplete')}
              </motion.p>

              <ProfileCard profile={profile} />

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Button
                  onClick={handleShowBooks}
                  size="lg"
                  disabled={loading}
                  className="bg-stone-800 hover:bg-stone-700 text-white px-8 py-6 text-lg rounded-xl gap-2"
                >
                  {loading ? t('status.loading') : t('btn.myRecommendations')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Results Phase */}
        {phase === 'results' && recommendations !== null && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-6 py-12"
          >
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <button
                  onClick={handleBackFromResults}
                  className="flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">{t('btn.backToProfile')}</span>
                </button>
              </div>

              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-10"
              >
                <h2 className="text-2xl md:text-3xl font-light text-stone-800 dark:text-stone-100 mb-1">
                  {t('results.title')}
                </h2>
                <p className="text-stone-400 dark:text-stone-500 text-sm font-light">
                  {t('results.subtitle')}
                </p>
              </motion.div>

              {/* Robuste Trennung: main vs. contrast */}
              {(() => {
                const mainBooks = Array.isArray(recommendations) ? recommendations.filter(b => !b.isContrast) : [];
                const horizonBooks = Array.isArray(recommendations) ? recommendations.filter(b => b.isContrast) : [];

                if (mainBooks.length === 0) {
                  const lang = profile?.bookLanguage;
                  const langNames = { el: 'Griechisch', tr: 'Türkisch', fr: 'Französisch', es: 'Spanisch', it: 'Italienisch', en: 'Englisch' };
                  const langName = langNames[lang] || lang;
                  return (
                    <div className="text-center py-16 text-stone-400">
                      <p className="text-2xl mb-3">📚</p>
                      <p className="text-lg mb-2 text-stone-600 dark:text-stone-300">
                        {lang && lang !== 'any' ? `Noch keine lokalen Bücher auf ${langName}` : 'Keine Bücher gefunden'}
                      </p>
                      <p className="text-sm mb-4">
                        {lang && lang !== 'any'
                          ? `Probiere die Buchsuche über BookDiscover – dort findest du Google Books auf ${langName}.`
                          : 'Versuche eine neue Suche mit anderen Einstellungen.'}
                      </p>
                      {lang && lang !== 'any' && (
                        <a href="/BookDiscover" className="inline-block text-sm text-amber-600 underline underline-offset-4 hover:text-amber-700">
                          Zu BookDiscover →
                        </a>
                      )}
                    </div>
                  );
                }

                const top3 = mainBooks.slice(0, 3);
                const rest7 = mainBooks.slice(3);
                return (
                  <>
                    {/* Sektion 1: Top 3 */}
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                            🏆 Deine Top 3 Empfehlungen
                          </h3>
                          <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">Die besten Treffer für dein Profil</p>
                        </div>
                        <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700 ml-2" />
                      </div>
                      <div className="space-y-6">
                        {top3.map((book, idx) => {
                          const labels = ['#1 Bester Treffer', '#2 Sehr gut', '#3 Empfohlen'];
                          return (
                            <div key={book.id || book.isbn13 || idx} className="space-y-2">
                              <div className="flex items-center gap-2 px-1">
                                <span className={`text-xs font-semibold uppercase tracking-wide ${idx === 0 ? 'text-amber-600' : 'text-stone-400 dark:text-stone-500'}`}>
                                  {labels[idx]}
                                </span>
                              </div>
                              <BookCard book={book} reasons={generateReasons(book, profile)} index={idx} isContrast={false} isAuthenticated={isAuthenticated} />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sektion 2: Weitere 7 */}
                    {rest7.length > 0 && (
                      <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                          <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                            Weitere Empfehlungen
                          </h3>
                          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
                        </div>
                        <div className="space-y-4">
                          {rest7.map((book, idx) => (
                            <div key={book.id || book.isbn13 || `r-${idx}`} className="space-y-1">
                              <BookCard book={book} reasons={generateReasons(book, profile)} index={Math.min(3 + idx, 5)} isContrast={false} isAuthenticated={isAuthenticated} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sektion 3: Horizont-Erweiterungen */}
                    {horizonBooks.length > 0 && (
                      <div className="mb-14">
                        <div className="border-t-2 border-dashed border-stone-200 dark:border-stone-700 pt-10 mb-6">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-violet-600 dark:text-violet-400 text-xs">✦</span>
                            </div>
                            <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100">Etwas Neues wagen</h3>
                          </div>
                          <p className="text-xs text-stone-400 dark:text-stone-500 ml-10">Bücher, die deinen Horizont bewusst erweitern.</p>
                        </div>
                        <div className="space-y-6">
                          {horizonBooks.map((book, idx) => (
                            <div key={book.id || book.isbn13 || `h-${idx}`} className="space-y-1">
                              <div className="flex items-center gap-2 px-1">
                                <span className="text-xs font-medium text-violet-500 dark:text-violet-400 uppercase tracking-wide">Horizont-Erweiterung</span>
                              </div>
                              <BookCard book={book} reasons={generateReasons(book, profile)} index={Math.min(5 + idx, 7)} isContrast={true} isAuthenticated={isAuthenticated} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
              >
                <button
                  onClick={handleRestart}
                  className="text-stone-500 hover:text-stone-700 text-sm underline underline-offset-4 transition-colors"
                >
                  {t('btn.newAnalysis')}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BookSearchContent;