import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, ChevronLeft } from 'lucide-react';
import QuestionCard from '@/components/books/QuestionCard';
import ProfileCard from '@/components/books/ProfileCard';
import BookCard from '@/components/books/BookCard';
import { getMatchingBooks } from '@/components/books/BookDatabase';

const questions = [
  {
    id: 'topic',
    question: "Was beschäftigt dich gerade am meisten?",
    options: [
      { value: "persoenliche_entwicklung", label: "Mich selbst besser verstehen & entwickeln" },
      { value: "stress_ruhe", label: "Mehr Ruhe und weniger Stress finden" },
      { value: "fokus_produktivitaet", label: "Fokussierter und produktiver werden" },
      { value: "beziehung_kommunikation", label: "Bessere Beziehungen & Kommunikation" },
      { value: "sinn_philosophie", label: "Sinn, Werte und die großen Fragen" },
      { value: "kreativitaet", label: "Kreativität & Selbstausdruck" }
    ]
  },
  {
    id: 'situation',
    question: "Wie würdest du deine aktuelle Situation beschreiben?",
    options: [
      { value: "ueberfordert", label: "Etwas überfordert – ich suche Orientierung" },
      { value: "neugierig", label: "Neugierig – ich will etwas Neues entdecken" },
      { value: "antriebslos", label: "Antriebslos – ich brauche frische Impulse" },
      { value: "stabil", label: "Stabil – ich will mich weiterentwickeln" },
      { value: "konkret", label: "Ich habe ein konkretes Thema vor Augen" }
    ]
  },
  {
    id: 'style',
    question: "Wie liest du am liebsten?",
    options: [
      { value: "praktisch", label: "Praktisch – mit Übungen und konkreten Tipps" },
      { value: "wissenschaftlich", label: "Wissenschaftlich – fundiert und sachlich" },
      { value: "story", label: "Erzählerisch – Geschichten & Biografien" },
      { value: "reflektierend", label: "Philosophisch – zum Nachdenken und Innehalten" }
    ]
  },
  {
    id: 'effort',
    question: "Wie viel Zeit möchtest du investieren?",
    options: [
      { value: "kurz", label: "Kurze Sessions (5–15 Minuten am Tag)" },
      { value: "mittel", label: "Kapitelweise, in meinem eigenen Tempo" },
      { value: "lang", label: "Intensiv – ich nehme mir Zeit für längere Werke" }
    ]
  },
  {
    id: 'experience',
    question: "Wie erfahren bist du mit Sachbüchern & Ratgebern?",
    options: [
      { value: "einsteiger", label: "Einsteiger – ich lese selten solche Bücher" },
      { value: "fortgeschritten", label: "Fortgeschritten – ich habe einige gelesen" },
      { value: "erfahren", label: "Sehr erfahren – ich suche tiefere Impulse" }
    ]
  }
];

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

  const handleStart = () => {
    setPhase('questions');
  };

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

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
    
    // Situation zu Themen mappen
    const situationTopics = {
      ueberfordert: ["stress_ruhe"],
      neugierig: ["lernen_wissen"],
      antriebslos: ["persoenliche_entwicklung"],
      stabil: ["sinn_philosophie"],
      konkret: []
    };
    secondaryTopics.push(...(situationTopics[ans.situation] || []));

    const style = [ans.style];
    if (ans.effort === "kurz") style.push("kurz");
    if (ans.effort === "lang") style.push("anspruchsvoll");

    return {
      mainTopics,
      secondaryTopics,
      style,
      difficulty: ans.experience,
      timeEffort: ans.effort
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
              Fünf kurze Fragen. Passende Empfehlungen.
              <br />
              Für genau das, was dich gerade bewegt.
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