import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight, ChevronLeft, User, LogOut } from 'lucide-react';
import QuestionCard from '@/components/books/QuestionCard';
import ProfileCard from '@/components/books/ProfileCard';
import BookCard from '@/components/books/BookCard';
import { getMatchingBooks } from '@/components/books/BookDatabaseLogic';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/language/LanguageContext';
import LanguageSelector from '@/components/language/LanguageSelector';
import { useTranslatedText } from '@/components/language/useTranslatedText';

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

const questionSets = {
  kinder: [
    ageQuestion,
    {
      id: 'topic',
      question: "Was interessiert dich gerade am meisten?",
      options: [
        { value: "abenteuer", label: "🗺️ Spannende Abenteuer" },
        { value: "freundschaft", label: "🤝 Freundschaft und Zusammenhalt" },
        { value: "magie", label: "✨ Magie und Fantasie" },
        { value: "lustiges", label: "😄 Lustige Geschichten" },
        { value: "mut", label: "💪 Mutig sein" },
        { value: "schule", label: "🎒 Schule und Lernen" }
      ]
    },
    {
      id: 'mood',
      question: "Wie fühlst du dich gerade?",
      options: [
        { value: "neugierig", label: "Ich möchte etwas Neues entdecken" },
        { value: "aufgeregt", label: "Ich will Action und Spannung" },
        { value: "ruhig", label: "Ich möchte mich entspannen" },
        { value: "mutig", label: "Ich suche Inspiration" }
      ]
    },
    {
      id: 'style',
      question: "Welche Geschichten magst du am liebsten?",
      options: [
        { value: "story", label: "Abenteuergeschichten" },
        { value: "reflektierend", label: "Geschichten zum Nachdenken" }
      ]
    },
    {
      id: 'length',
      question: "Wie lange möchtest du lesen?",
      options: [
        { value: "kurz", label: "Kurze Geschichten (10-20 Min.)" },
        { value: "mittel", label: "Ein Kapitel am Tag" },
        { value: "lang", label: "Längere, spannende Bücher" }
      ]
    },
    {
      id: 'read_books',
      question: "Nenne 3 Bücher, die du bereits gelesen und geliebt hast",
      description: "Damit wir Dopplungen vermeiden und besser verstehen, was dir gefällt",
      isTextInput: true,
      placeholder: "z.B. Harry Potter, Das magische Baumhaus, Der kleine Prinz"
    }
  ],
  jugendliche: [
    ageQuestion,
    {
      id: 'topic',
      question: "Was interessiert dich gerade am meisten?",
      options: [
        { value: "selbstfindung", label: "Mich selbst besser verstehen" },
        { value: "freundschaft", label: "Freundschaft und Beziehungen" },
        { value: "abenteuer", label: "Abenteuer und Fantasy" },
        { value: "liebe", label: "Liebe und erste Beziehungen" },
        { value: "gesellschaft", label: "Die Welt verstehen" },
        { value: "mut", label: "Mut und innere Stärke" }
      ]
    },
    {
      id: 'mood',
      question: "Was beschreibt deine Situation am besten?",
      options: [
        { value: "suchend", label: "Ich suche nach Orientierung" },
        { value: "neugierig", label: "Ich will neue Perspektiven" },
        { value: "herausfordernd", label: "Ich stehe vor Herausforderungen" },
        { value: "inspiriert", label: "Ich will inspiriert werden" }
      ]
    },
    {
      id: 'style',
      question: "Welche Bücher bevorzugst du?",
      options: [
        { value: "story", label: "Spannende Geschichten" },
        { value: "reflektierend", label: "Zum Nachdenken" },
        { value: "praktisch", label: "Mit Tipps fürs Leben" }
      ]
    },
    {
      id: 'length',
      question: "Wie viel Zeit hast du zum Lesen?",
      options: [
        { value: "kurz", label: "15-30 Minuten am Tag" },
        { value: "mittel", label: "Ein paar Kapitel täglich" },
        { value: "lang", label: "Ich tauche gerne tief ein" }
      ]
    },
    {
      id: 'read_books',
      question: "Nenne 3 Bücher, die du bereits gelesen und geliebt hast",
      description: "Damit wir Dopplungen vermeiden und besser verstehen, was dir gefällt",
      isTextInput: true,
      placeholder: "z.B. Die Tribute von Panem, Tschick, Das Schicksal ist ein mieser Verräter"
    }
  ],
  erwachsene: [
    ageQuestion,
    {
      id: 'reading_goal',
      question: "Was ist dein Hauptziel beim Lesen?",
      options: [
        { value: "wachstum", label: "Persönliches Wachstum & Wissen" },
        { value: "entspannung", label: "Entspannung & Unterhaltung" },
        { value: "beide", label: "Beides – je nach Stimmung" }
      ]
    },
    {
      id: 'topic',
      question: "Was interessiert dich am meisten?",
      options: [
        // Sachbuch-Themen
        { value: "persoenliche_entwicklung", label: "Persönliche Entwicklung" },
        { value: "stress_ruhe", label: "Ruhe und Gelassenheit" },
        { value: "fokus_produktivitaet", label: "Fokus & Produktivität" },
        { value: "beziehung_kommunikation", label: "Beziehungen & Kommunikation" },
        { value: "sinn_philosophie", label: "Sinn & Lebensphilosophie" },
        { value: "glaube_spiritualitaet", label: "Glaube & Spiritualität" },
        { value: "kreativitaet", label: "Kreativität" },
        { value: "lernen_wissen", label: "Lernen & Wissenserweiterung" },
        { value: "koerper_gesundheit", label: "Körper & Gesundheit" },
        // Belletristik-Genres
        { value: "fantasy_scifi", label: "Fantasy & Science-Fiction" },
        { value: "thriller_krimi", label: "Thriller & Krimis" },
        { value: "romance", label: "Romantik & Liebesromane" },
        { value: "historisch", label: "Historische Romane" },
        { value: "literatur", label: "Anspruchsvolle Literatur" },
        { value: "humor", label: "Humor & Leichte Unterhaltung" }
      ]
    },
    {
      id: 'mood',
      question: "Wie würdest du deine Situation beschreiben?",
      options: [
        { value: "ueberfordert", label: "Ich suche Orientierung" },
        { value: "neugierig", label: "Ich will Neues entdecken" },
        { value: "antriebslos", label: "Ich brauche frische Impulse" },
        { value: "wachsend", label: "Ich will mich weiterentwickeln" }
      ]
    },
    {
      id: 'style',
      question: "Welcher Lesestil passt zu dir?",
      options: [
        { value: "praktisch", label: "Praktisch & umsetzbar" },
        { value: "wissenschaftlich", label: "Wissenschaftlich fundiert" },
        { value: "story", label: "Erzählerisch & biografisch" },
        { value: "reflektierend", label: "Philosophisch & tiefgründig" }
      ]
    },
    {
      id: 'length',
      question: "Wie viel Zeit möchtest du investieren?",
      options: [
        { value: "kurz", label: "Kurze Sessions (5-15 Min.)" },
        { value: "mittel", label: "In meinem eigenen Tempo" },
        { value: "lang", label: "Intensiv & umfassend" }
      ]
    },
    {
      id: 'level',
      question: "Wie tief möchtest du eintauchen?",
      options: [
        { value: "einsteiger", label: "Einsteigerfreundlich" },
        { value: "fortgeschritten", label: "Mit Tiefgang" },
        { value: "erfahren", label: "Sehr tiefgehend" }
      ]
    },
    {
      id: 'setting',
      question: "Welche Welten ziehen dich an?",
      options: [
        { value: "real", label: "Realistische, greifbare Geschichten" },
        { value: "fantastisch", label: "Fantastische, magische Welten" },
        { value: "historisch", label: "Vergangene Epochen" },
        { value: "zukunft", label: "Zukunft & Science-Fiction" },
        { value: "egal", label: "Hauptsache gute Geschichte" }
      ]
    },
    {
      id: 'read_books',
      question: "Nenne 3 Bücher, die du bereits gelesen und geliebt hast",
      description: "Damit wir Dopplungen vermeiden und besser verstehen, was dir gefällt",
      isTextInput: true,
      placeholder: "z.B. Atomic Habits, Der kleine Prinz, Sapiens"
    }
  ]
};

// Statische UI-Texte außerhalb der Komponente definieren
const UI_TEXTS = {
  welcomeTitle: "Book Compass",
  welcomeSubtitle: "Dein Wegweiser zum perfekten Buch",
  welcomeDescription: "Wenige einfache Fragen führen dich zu Büchern, die genau zu dir passen – für jedes Alter.",
  freeStart: "Kostenlos starten",
  freeDescription: "3 personalisierte Empfehlungen – komplett kostenlos, keine Kreditkarte nötig",
  premiumTitle: "Premium für 4,99€/Monat",
  premiumDescription: "Unbegrenzte Empfehlungen, erweiterte Profile und regelmäßig neue Bücher",
  startButton: "Entdeckungsreise starten",
  backButton: "Zurück",
  backToStart: "Zum Start",
  backToProfile: "Zurück zum Profil",
  analysisComplete: "Analyse abgeschlossen",
  myRecommendationsButton: "Meine Buchempfehlungen",
  loading: "Wird geladen...",
  yourRecommendations: "Deine Empfehlungen",
  selectedByNeeds: "Ausgewählt nach deinen Bedürfnissen und deinem Lesestil",
  freeVersion: "Kostenlose Version:",
  recommendationsUsed: "von 3 Empfehlungen genutzt",
  upgradePremium: "Auf Premium upgraden",
  bestMatch: "Passt am besten zu deinem Thema",
  perfectChoice: "Deine perfekte Wahl für genau jetzt",
  secondBest: "Ebenfalls eine starke Wahl",
  deepensTheme: "Vertieft dein Thema aus einem anderen Blickwinkel",
  somethingDifferent: "Wenn du etwas ganz anderes lesen willst",
  expandHorizon: "Erweitert deinen Horizont mit neuen Perspektiven",
  newAnalysis: "Neue Analyse starten",
  myAccount: "Mein Account",
  login: "Anmelden"
};

const generateReasons = (book, profile) => {
  const topicMatch = profile.mainTopics.find(t => book.tags.includes(t));
  const styleMatch = profile.style.find(s => book.style.includes(s));

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

  // Individuelle Gründe basierend auf Buchtitel und Autor
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

function HomeContent() {
  const [phase, setPhase] = useState('welcome'); // welcome, questions, profile, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [ageGroup, setAgeGroup] = useState('erwachsene');
  const [questions, setQuestions] = useState(questionSets.erwachsene);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );
  const [showBookOpen, setShowBookOpen] = useState(
    () => sessionStorage.getItem('bookAnimShown') !== 'true'
  );
  const [recommendationCount, setRecommendationCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translatedQuestions, setTranslatedQuestions] = useState(questionSets.erwachsene);
  const [cameFromCompass, setCameFromCompass] = useState(false);
  const { language, changeLanguage, translateObject, isLoading: langLoading, supportedLanguages } = useLanguage();
  
  const uiTexts = useTranslatedText(UI_TEXTS);

  useEffect(() => {
    const init = async () => {
      // checkAuth nur wenn noch kein gültiger Cache vorhanden
      const cachedAuth = localStorage.getItem('isAuthenticated') === 'true';
      let isAuth = cachedAuth;

      if (!cachedAuth) {
        isAuth = await checkAuth();
      }
      
      if (isAuth && user === null) {
        // User-Daten im Hintergrund laden (kein Blockieren)
        checkAuth();
        loadRecommendationCount();
      }
      
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('showLastRecommendation') === 'true' && isAuth) {
        setCameFromCompass(true);
        await loadLastRecommendation();
      } else if (urlParams.get('startQuestions') === 'true') {
        setPhase('questions');
      }
    };
    init();
    
    // Buch-Animation nur einmal zeigen
    const timer = setTimeout(() => {
      setShowBookOpen(false);
      sessionStorage.setItem('bookAnimShown', 'true');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fragen aktualisieren wenn sich die Altersgruppe ändert
  useEffect(() => {
    if (questionSets[ageGroup]) {
      setTranslatedQuestions(questionSets[ageGroup]);
    }
  }, [ageGroup]);

  const checkAuth = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsPremium(currentUser.is_premium || currentUser.role === 'admin');
      return true;
    } catch (error) {
      // Nur ausloggen wenn noch nie eingeloggt – nicht bei Netzwerkfehlern
      const wasPreviouslyAuth = localStorage.getItem('isAuthenticated') === 'true';
      if (!wasPreviouslyAuth) {
        setIsAuthenticated(false);
      }
      return wasPreviouslyAuth;
    }
  };

  const loadRecommendationCount = async () => {
    try {
      const recommendations = await base44.entities.Recommendation.list();
      setRecommendationCount(recommendations.length);
    } catch (error) {
      console.error('Fehler beim Laden der Empfehlungen:', error);
    }
  };

  const loadLastRecommendation = async () => {
    try {
      const recs = await base44.entities.Recommendation.list('-created_date', 1);
      if (recs.length > 0) {
        const lastRec = recs[0];
        setProfile(lastRec.profile || { mainTopics: [], secondaryTopics: [], style: [] });
        setRecommendations(lastRec.books || []);
        setPhase('results');
      }
    } catch (error) {
      console.error('Fehler beim Laden der letzten Empfehlung:', error);
    }
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin();
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleStart = () => {
    setPhase('questions');
  };

  const handleAnswer = (value) => {
    const currentQuestionId = translatedQuestions?.[currentQuestion]?.id;
    if (!currentQuestionId) return;

    const newAnswers = { ...answers, [currentQuestionId]: value };
    setAnswers(newAnswers);

    // Wenn die Altersfrage beantwortet wird, Fragenset aktualisieren
    const isAgeQuestion = currentQuestionId === 'age';
    const activeQuestions = isAgeQuestion ? questionSets[value] : translatedQuestions;

    if (isAgeQuestion) {
      setAgeGroup(value);
      setQuestions(activeQuestions);
      setTranslatedQuestions(activeQuestions);
    }

    // Bei Textfragen nicht automatisch weiter
    if (activeQuestions[currentQuestion].isTextInput) {
      return;
    }

    setTimeout(() => {
      if (currentQuestion < activeQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Analyse abschließen
        const userProfile = analyzeAnswers(newAnswers);
        setProfile(userProfile);
        setPhase('profile');
      }
    }, 300);
  };

  const handleTextSubmit = () => {
    const newAnswers = { ...answers, [translatedQuestions[currentQuestion].id]: answers[translatedQuestions[currentQuestion].id] || '' };
    
    setTimeout(() => {
      if (currentQuestion < translatedQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Analyse abschließen
        const userProfile = analyzeAnswers(newAnswers);
        setProfile(userProfile);
        setPhase('profile');
      }
    }, 300);
  };

  const analyzeAnswers = (ans) => {
    const mainTopics = [ans.topic];
    const secondaryTopics = [];
    
    // Stimmung/Situation zu Themen mappen - altersabhängig
    if (ageGroup === 'erwachsene') {
      const moodTopics = {
        ueberfordert: ["stress_ruhe"],
        neugierig: ["lernen_wissen"],
        antriebslos: ["persoenliche_entwicklung"],
        wachsend: ["sinn_philosophie"]
      };
      secondaryTopics.push(...(moodTopics[ans.mood] || []));
    } else if (ageGroup === 'jugendliche') {
      const moodTopics = {
        suchend: ["selbstfindung"],
        neugierig: ["abenteuer"],
        herausfordernd: ["mut"],
        inspiriert: ["leben"]
      };
      secondaryTopics.push(...(moodTopics[ans.mood] || []));
    } else if (ageGroup === 'kinder') {
      const moodTopics = {
        neugierig: ["magie"],
        aufgeregt: ["abenteuer"],
        ruhig: ["freundschaft"],
        mutig: ["mut"]
      };
      secondaryTopics.push(...(moodTopics[ans.mood] || []));
    }

    const style = [ans.style];
    if (ans.length === "kurz") style.push("kurz");
    if (ans.length === "lang") style.push("anspruchsvoll");

    // Gelesene Bücher parsen
    const readBooks = ans.read_books ? ans.read_books.split(',').map(b => b.trim().toLowerCase()) : [];

    return {
      mainTopics,
      secondaryTopics,
      style,
      difficulty: ans.level || "einsteiger",
      timeEffort: ans.length,
      ageGroup: ageGroup,
      readBooks
    };
  };

  const handleShowBooks = async () => {
    setLoading(true);

    // Bereits gespeicherte Buch-IDs laden
    let savedBookIds = [];
    if (isAuthenticated) {
      try {
        const savedBooks = await base44.entities.SavedBook.list();
        savedBookIds = savedBooks.map(sb => sb.book_id);
      } catch (error) {
        console.error('Fehler beim Laden der Bibliothek:', error);
      }
    }

    const profileWithSaved = { ...profile, savedBookIds };
    let results = getMatchingBooks(profileWithSaved);
    
    // Speichere Empfehlung (wenn authentifiziert)
    if (isAuthenticated) {
      try {
        await base44.entities.Recommendation.create({
          books: results,
          profile: profileWithSaved,
          is_premium: isPremium
        });
        setRecommendationCount(recommendationCount + 1);
      } catch (error) {
        console.error('Fehler beim Speichern:', error);
      }
    }
    
    setRecommendations(results);
    setPhase('results');
    setLoading(false);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      // Wenn wir bei der ersten Frage sind, zurück zum Welcome
      setPhase('welcome');
      setCurrentQuestion(0);
      setAnswers({});
    }
  };

  const handleBackFromProfile = () => {
    setPhase('questions');
    setCurrentQuestion(questions.length - 1);
  };

  const handleBackFromResults = () => {
    setPhase('profile');
  };

  const handleRestart = () => {
    setPhase('welcome');
    setCurrentQuestion(0);
    setAnswers({});
    setProfile(null);
    setRecommendations(null);
    setAgeGroup('erwachsene');
    setQuestions(questionSets.erwachsene);
  };

  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/Premium');
  };



  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] pb-28">
      {/* Buttons oben rechts auf Welcome-Phase */}
      {phase === 'welcome' && (
        <div style={{ position: 'fixed', top: '12px', right: '12px', zIndex: 9999, display: 'flex', gap: '8px' }}>
          {isAuthenticated ? (
            <Button
              onClick={() => navigate('/Compass')}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            >
              <Compass className="w-4 h-4" />
              Zum Kompass
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              variant="outline"
              size="sm"
              className="gap-2 border-amber-300 hover:bg-amber-50 text-amber-900"
            >
              <User className="w-4 h-4" />
              {uiTexts.login}
            </Button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Welcome Phase */}
        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden dark:bg-[#0a0a0a]"
          >
            {/* Buch-Aufklapp-Animation */}
            <AnimatePresence>
              {showBookOpen && (
                <>
                  {/* Linke Buchseite */}
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 bg-amber-50 dark:bg-[#1a1a1a] origin-right z-50 border-r-2 border-amber-200 dark:border-amber-800"
                    style={{ transformOrigin: "right center" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-l from-amber-100/50 to-transparent" />
                  </motion.div>
                  
                  {/* Rechte Buchseite */}
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 bg-amber-50 dark:bg-[#1a1a1a] origin-left z-50 border-l-2 border-amber-200 dark:border-amber-800"
                    style={{ transformOrigin: "left center" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-transparent" />
                  </motion.div>

                  {/* Buch-Mitte (Buchrücken) */}
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="fixed inset-y-0 left-1/2 w-2 bg-amber-800 z-50 -ml-1"
                  />
                </>
              )}
            </AnimatePresence>

            {/* Kompass-Icon mit Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: showBookOpen ? 1.5 : 0.2 }}
              className="relative mb-8"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg">
                <Compass className="w-10 h-10 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-amber-300 opacity-30"
              />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: showBookOpen ? 1.6 : 0.3 }}
              className="text-4xl md:text-5xl font-light text-stone-800 dark:text-stone-200 text-center mb-2"
            >
              {uiTexts.welcomeTitle}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: showBookOpen ? 1.7 : 0.4 }}
              className="text-amber-700 dark:text-amber-500 text-center text-sm uppercase tracking-wider mb-8 font-medium"
            >
              {uiTexts.welcomeSubtitle}
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: showBookOpen ? 1.8 : 0.5 }}
              className="text-stone-500 dark:text-stone-400 text-center max-w-md mb-8 text-base font-light"
            >
              {uiTexts.welcomeDescription}
            </motion.p>

            {/* Freemium Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: showBookOpen ? 1.85 : 0.55 }}
              className="bg-white dark:bg-[#1a1a1a] backdrop-blur-sm border border-amber-200 dark:border-stone-700 rounded-xl p-6 max-w-lg mx-auto mb-8 shadow-sm"
            >
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-3">
                    ✨ {uiTexts.freeStart}
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 text-sm">
                    {uiTexts.freeDescription}
                  </p>
                </div>
                
                <div className="border-t border-stone-200 dark:border-stone-700 pt-4">
                  <div className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-400">
                    <Compass className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-stone-800 dark:text-stone-200 mb-1">{uiTexts.premiumTitle}</p>
                      <p className="text-xs leading-relaxed">
                        {uiTexts.premiumDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: showBookOpen ? 1.9 : 0.6 }}
              className="relative z-10"
            >
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-6 text-lg rounded-xl gap-2 transition-all shadow-lg"
              >
                {uiTexts.startButton}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Dekorative Elemente */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
          </motion.div>
        )}

        {/* Questions Phase */}
        {phase === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col px-6 py-12 dark:bg-[#0a0a0a]"
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 mb-8 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">{currentQuestion > 0 ? uiTexts.backButton : uiTexts.backToStart}</span>
            </button>

            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {translatedQuestions[currentQuestion] && (
                  <QuestionCard
                    key={currentQuestion}
                    question={translatedQuestions[currentQuestion].question}
                    options={translatedQuestions[currentQuestion].options}
                    onSelect={handleAnswer}
                    selectedValue={answers[translatedQuestions[currentQuestion].id]}
                    questionNumber={currentQuestion + 1}
                    totalQuestions={translatedQuestions.length}
                    isTextInput={translatedQuestions[currentQuestion].isTextInput}
                    placeholder={translatedQuestions[currentQuestion].placeholder}
                    description={translatedQuestions[currentQuestion].description}
                    onTextSubmit={handleTextSubmit}
                  />
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
            className="min-h-screen flex flex-col px-6 py-12 dark:bg-[#0a0a0a]"
          >
            <button
              onClick={handleBackFromProfile}
              className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 mb-8 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">{uiTexts.backButton}</span>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-stone-500 text-sm uppercase tracking-wide mb-6"
              >
                {uiTexts.analysisComplete}
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
                  {loading ? uiTexts.loading : uiTexts.myRecommendationsButton}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Results Phase */}
        {phase === 'results' && recommendations && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-6 py-12 dark:bg-[#0a0a0a]"
          >
            <div className="max-w-2xl mx-auto">
              {/* Header mit Navigation */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <button
                    onClick={cameFromCompass ? () => navigate('/Compass') : handleBackFromResults}
                    className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm">{cameFromCompass ? 'Zurück zum Kompass' : uiTexts.backToProfile}</span>
                  </button>

                  </div>
              </div>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-light text-stone-800 dark:text-stone-200 mb-3">
                  {uiTexts.yourRecommendations}
                </h2>
                <p className="text-stone-500 dark:text-stone-400 font-light">
                  {uiTexts.selectedByNeeds}
                </p>
                
                {/* Freemium-Hinweis */}
                {!isPremium && isAuthenticated && (
                  <div className="mt-6 inline-block">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4">
                      <p className="text-sm text-amber-800 mb-2">
                        <strong>{uiTexts.freeVersion}</strong> {recommendationCount} {uiTexts.recommendationsUsed}
                      </p>
                      {recommendationCount >= 3 && (
                        <Button
                          onClick={handleUpgrade}
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          {uiTexts.upgradePremium}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="space-y-8">
                {Array.isArray(recommendations) && recommendations.map((book, idx) => {
                  const isContrast = book.isContrast;
                  const placement = book.placement || idx + 1;
                  const badgeColor = idx === 0
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600'
                    : idx === 1
                    ? 'bg-gradient-to-br from-stone-400 to-stone-500'
                    : isContrast
                    ? 'bg-gradient-to-br from-purple-400 to-purple-500'
                    : 'bg-gradient-to-br from-amber-300 to-amber-400';

                  let title, subtitle;
                  if (isContrast) {
                    title = uiTexts.somethingDifferent;
                    subtitle = uiTexts.expandHorizon;
                  } else if (idx === 0) {
                    title = uiTexts.bestMatch;
                    subtitle = uiTexts.perfectChoice;
                  } else if (idx === 1) {
                    title = uiTexts.secondBest;
                    subtitle = uiTexts.deepensTheme;
                  } else {
                    title = `Empfehlung #${placement}`;
                    subtitle = 'Passt zu deinen Interessen';
                  }

                  return (
                    <div key={book.id} className="space-y-3">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${badgeColor}`}>
                          {placement}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-stone-800 dark:text-stone-200">{title}</h3>
                          <p className="text-sm text-stone-500 dark:text-stone-400">{subtitle}</p>
                        </div>
                      </div>
                      <BookCard
                        book={book}
                        reasons={generateReasons(book, profile)}
                        index={idx}
                        isContrast={isContrast}
                      />
                    </div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-center"
              >
                <button
                  onClick={handleRestart}
                  className="text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-sm underline underline-offset-4 transition-colors"
                >
                  {uiTexts.newAnalysis}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}