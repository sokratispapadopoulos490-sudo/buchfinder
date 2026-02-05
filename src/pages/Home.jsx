import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight, ChevronLeft, User, LogOut } from 'lucide-react';
import QuestionCard from '@/components/books/QuestionCard';
import ProfileCard from '@/components/books/ProfileCard';
import BookCard from '@/components/books/BookCard';
import { getMatchingBooks } from '@/components/books/BookDatabase';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

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
    }
  ],
  erwachsene: [
    ageQuestion,
    {
      id: 'topic',
      question: "Was beschäftigt dich gerade am meisten?",
      options: [
        { value: "persoenliche_entwicklung", label: "Persönliche Entwicklung" },
        { value: "stress_ruhe", label: "Ruhe und Gelassenheit" },
        { value: "fokus_produktivitaet", label: "Fokus & Produktivität" },
        { value: "beziehung_kommunikation", label: "Beziehungen & Kommunikation" },
        { value: "sinn_philosophie", label: "Sinn & Lebensphilosophie" },
        { value: "kreativitaet", label: "Kreativität" },
        { value: "lernen_wissen", label: "Lernen & Wissenserweiterung" },
        { value: "koerper_gesundheit", label: "Körper & Gesundheit" }
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
    }
  ]
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
    kreativitaet: "Fördert deine kreative Seite"
  };
  
  const styleReasons = {
    praktisch: "Der praktische Stil passt zu deiner Vorliebe für Umsetzbarkeit",
    wissenschaftlich: "Wissenschaftlich fundiert – genau wie du es magst",
    story: "Erzählerisch geschrieben – für deinen bevorzugten Lesestil",
    reflektierend: "Lädt zum Nachdenken ein – passend zu deinem Stil"
  };
  
  const practicalGains = {
    persoenliche_entwicklung: "Konkrete Werkzeuge für persönliches Wachstum",
    stress_ruhe: "Praktische Methoden für mehr Gelassenheit im Alltag",
    fokus_produktivitaet: "Umsetzbare Strategien für mehr Klarheit",
    beziehung_kommunikation: "Direkt anwendbare Kommunikationstechniken",
    sinn_philosophie: "Neue Perspektiven für eigene Reflexion",
    kreativitaet: "Impulse, die du sofort ausprobieren kannst"
  };

  return {
    mainReason: book.isContrast 
      ? "Dieses Buch erweitert deinen Horizont mit einem anderen Blickwinkel."
      : `Dieses Buch passt jetzt zu dir – es verbindet ${topicReasons[topicMatch]?.toLowerCase() || 'deine Interessen'} mit einem Stil, der dir liegt.`,
    bullets: [
      topicReasons[topicMatch] || "Passt thematisch zu deinen Interessen",
      styleReasons[styleMatch] || "Angenehm zu lesen",
      practicalGains[topicMatch] || "Bietet wertvolle Erkenntnisse für den Alltag"
    ]
  };
};

export default function Home() {
  const [phase, setPhase] = useState('welcome'); // welcome, questions, profile, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [ageGroup, setAgeGroup] = useState('erwachsene');
  const [questions, setQuestions] = useState(questionSets.erwachsene);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showBookOpen, setShowBookOpen] = useState(true);
  const [recommendationCount, setRecommendationCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await loadRecommendationCount();
    };
    init();
    
    // Buch-Animation nach 2 Sekunden ausblenden
    const timer = setTimeout(() => {
      setShowBookOpen(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setIsAuthenticated(true);
        setIsPremium(currentUser.is_premium || false);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const loadRecommendationCount = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const recommendations = await base44.entities.Recommendation.list();
        setRecommendationCount(recommendations.length);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Empfehlungen:', error);
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
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    // Wenn die Altersfrage beantwortet wird, Fragenset aktualisieren
    if (questions[currentQuestion].id === 'age') {
      setAgeGroup(value);
      setQuestions(questionSets[value]);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
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

    return {
      mainTopics,
      secondaryTopics,
      style,
      difficulty: ans.level || "einsteiger",
      timeEffort: ans.length,
      ageGroup: ageGroup
    };
  };

  const handleShowBooks = async () => {
    setLoading(true);
    const results = getMatchingBooks(profile);
    
    // Prüfe ob Freemium-Limit erreicht
    const freeLimit = 3;
    const canView = isPremium || recommendationCount < freeLimit;
    
    if (canView && isAuthenticated) {
      try {
        // Speichere Empfehlung
        await base44.entities.Recommendation.create({
          books: results.recommendations,
          profile: profile,
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50">
      {/* Header mit Login/Logout */}
      <div className="fixed top-0 right-0 p-6 z-40">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/Account')}
              variant="outline"
              size="sm"
              className="gap-2 border-stone-300 hover:bg-stone-50"
            >
              <User className="w-4 h-4" />
              Mein Account
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleLogin}
            variant="outline"
            size="sm"
            className="gap-2 border-amber-300 hover:bg-amber-50 text-amber-900"
          >
            <User className="w-4 h-4" />
            Anmelden
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Welcome Phase */}
        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
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
                    className="fixed inset-0 bg-amber-50 origin-right z-50 border-r-2 border-amber-200"
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
                    className="fixed inset-0 bg-amber-50 origin-left z-50 border-l-2 border-amber-200"
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
              className="text-4xl md:text-5xl font-light text-stone-800 text-center mb-2"
            >
              Book Compass
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: showBookOpen ? 1.7 : 0.4 }}
              className="text-amber-700 text-center text-sm uppercase tracking-wider mb-8 font-medium"
            >
              Dein Wegweiser zum perfekten Buch
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: showBookOpen ? 1.8 : 0.5 }}
              className="text-stone-500 text-center max-w-md mb-8 text-base font-light"
            >
              Wenige einfache Fragen führen dich zu Büchern,
              <br />
              die genau zu dir passen – für jedes Alter.
            </motion.p>

            {/* Freemium Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: showBookOpen ? 1.85 : 0.55 }}
              className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl p-6 max-w-lg mx-auto mb-8 shadow-sm"
            >
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-3">
                    ✨ Kostenlos starten
                  </div>
                  <p className="text-stone-700 text-sm">
                    <strong>3 personalisierte Empfehlungen</strong> – komplett kostenlos, keine Kreditkarte nötig
                  </p>
                </div>
                
                <div className="border-t border-stone-200 pt-4">
                  <div className="flex items-start gap-3 text-sm text-stone-600">
                    <Compass className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-stone-800 mb-1">Premium für 4,99€/Monat</p>
                      <p className="text-xs leading-relaxed">
                        Unbegrenzte Empfehlungen, erweiterte Profile und regelmäßig neue Bücher
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
            >
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-6 text-lg rounded-xl gap-2 transition-all shadow-lg"
              >
                Entdeckungsreise starten
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Dekorative Elemente */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-200 rounded-full blur-3xl opacity-20" />
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
              <span className="text-sm">{currentQuestion > 0 ? 'Zurück' : 'Zum Start'}</span>
            </button>

            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <QuestionCard
                  key={currentQuestion}
                  question={questions[currentQuestion].question}
                  options={questions[currentQuestion].options}
                  onSelect={handleAnswer}
                  selectedValue={answers[questions[currentQuestion].id]}
                  questionNumber={currentQuestion + 1}
                  totalQuestions={questions.length}
                />
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
              <span className="text-sm">Zurück</span>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-stone-500 text-sm uppercase tracking-wide mb-6"
              >
                Analyse abgeschlossen
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
                  {loading ? 'Wird geladen...' : 'Meine Buchempfehlungen'}
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
            className="min-h-screen px-6 py-12"
          >
            <div className="max-w-2xl mx-auto">
              <button
                onClick={handleBackFromResults}
                className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-8 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Zurück zum Profil</span>
              </button>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-light text-stone-800 mb-3">
                  Deine Empfehlungen
                </h2>
                <p className="text-stone-500 font-light">
                  Ausgewählt nach deinen Bedürfnissen und deinem Lesestil
                </p>
                
                {/* Freemium-Hinweis */}
                {!isPremium && isAuthenticated && (
                  <div className="mt-6 inline-block">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4">
                      <p className="text-sm text-amber-800 mb-2">
                        <strong>Kostenlose Version:</strong> {recommendationCount} von 3 Empfehlungen genutzt
                      </p>
                      {recommendationCount >= 3 && (
                        <Button
                          onClick={handleUpgrade}
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          Auf Premium upgraden
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="space-y-6">
                {/* Zeige erste 3 Bücher kostenlos, Rest nur für Premium */}
                {recommendations.recommendations.slice(0, isPremium ? undefined : 3).map((book, index) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    reasons={generateReasons(book, profile)}
                    index={index}
                    isContrast={false}
                  />
                ))}

                {/* Premium-Sperre für weitere Bücher */}
                {!isPremium && recommendations.recommendations.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-8 text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-600 flex items-center justify-center">
                      <Compass className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-light text-stone-800 mb-3">
                      Noch mehr passende Bücher
                    </h3>
                    <p className="text-stone-600 mb-6 max-w-md mx-auto">
                      Mit Premium erhältst du {recommendations.recommendations.length - 3} weitere personalisierte Empfehlungen 
                      und unbegrenzten Zugang zu allen Funktionen.
                    </p>
                    <Button
                      onClick={handleUpgrade}
                      size="lg"
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Premium freischalten
                    </Button>
                  </motion.div>
                )}

                {(isPremium || recommendations.recommendations.length <= 3) && recommendations.contrastBook && (
                  <BookCard
                    book={recommendations.contrastBook}
                    reasons={generateReasons(recommendations.contrastBook, profile)}
                    index={recommendations.recommendations.length}
                    isContrast={true}
                  />
                )}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-center"
              >
                <button
                  onClick={handleRestart}
                  className="text-stone-500 hover:text-stone-700 text-sm underline underline-offset-4 transition-colors"
                >
                  Neue Analyse starten
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}