import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, ChevronLeft } from 'lucide-react';
import QuestionCard from '@/components/books/QuestionCard';
import ProfileCard from '@/components/books/ProfileCard';
import BookCard from '@/components/books/BookCard';
import { getMatchingBooks } from '@/components/books/BookDatabase';

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

  const handleShowBooks = () => {
    const results = getMatchingBooks(profile);
    setRecommendations(results);
    setPhase('results');
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
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

  return (
    <div className="min-h-screen bg-stone-50">
      <AnimatePresence mode="wait">
        {/* Welcome Phase */}
        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-stone-800 flex items-center justify-center mb-8"
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-light text-stone-800 text-center mb-4"
            >
              Finde dein nächstes Buch
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-stone-500 text-center max-w-md mb-12 text-lg font-light"
            >
              Wenige einfache Fragen. Passende Empfehlungen.
              <br />
              Für Kinder, Jugendliche und Erwachsene.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-stone-800 hover:bg-stone-700 text-white px-8 py-6 text-lg rounded-xl gap-2 transition-all"
              >
                Starten
                <ArrowRight className="w-5 h-5" />
              </Button>
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
            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-8 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Zurück</span>
              </button>
            )}

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
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
          >
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
                className="bg-stone-800 hover:bg-stone-700 text-white px-8 py-6 text-lg rounded-xl gap-2"
              >
                Meine Buchempfehlungen
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
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
              </motion.div>

              <div className="space-y-6">
                {recommendations.recommendations.map((book, index) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    reasons={generateReasons(book, profile)}
                    index={index}
                    isContrast={false}
                  />
                ))}

                {recommendations.contrastBook && (
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