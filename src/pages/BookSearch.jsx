import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight, ChevronLeft, ScanLine, Search, BookOpen } from 'lucide-react';
import QuestionCard from '@/components/books/QuestionCard';
import ReadBooksInput from '@/components/books/ReadBooksInput';
import ProfileCard from '@/components/books/ProfileCard';
import BookCard from '@/components/books/BookCard';
import LibraryCapture from '@/components/books/LibraryCapture';
import RecommendationMeta from '@/components/books/RecommendationMeta';
import ReadingPath from '@/components/books/ReadingPath';
import { getMatchingBooksFromDB } from '@/lib/bookService';
import { scoreBook, generateRichReason, buildReadingPath } from '@/lib/bookScoring';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/language/LanguageContext';
import { setBookLanguage } from '@/lib/shoppingRegion';
import { libraryDict } from '@/lib/i18n-library';

// read_books ist kein normaler Frageschritt – wird separat als Chip-Screen behandelt
const readBooksStep = { id: 'read_books', isReadBooksInput: true };

// Build localized question sets. Called inside component so t() uses current language.
function buildQuestionSets(t) {
  const ageQuestion = {
    id: 'age',
    question: t('q.age.question'),
    options: [
      { value: "kinder",      label: t('q.age.kinder') },
      { value: "jugendliche", label: t('q.age.jugendliche') },
      { value: "erwachsene",  label: t('q.age.erwachsene') },
    ]
  };

  const bookLanguageQuestion = {
    id: 'book_language',
    question: t('q.bookLang.question'),
    options: [
      { value: "de",  label: `🇩🇪 ${t('bookLang.de')}` },
      { value: "en",  label: `🇬🇧 ${t('bookLang.en')}` },
      { value: "fr",  label: `🇫🇷 ${t('bookLang.fr')}` },
      { value: "es",  label: `🇪🇸 ${t('bookLang.es')}` },
      { value: "it",  label: `🇮🇹 ${t('bookLang.it')}` },
      { value: "el",  label: `🇬🇷 ${t('bookLang.el')}` },
      { value: "tr",  label: `🇹🇷 ${t('bookLang.tr')}` },
      { value: "any", label: t('q.bookLang.any') },
    ]
  };

  return {
    kinder: [
      ageQuestion,
      bookLanguageQuestion,
      {
        id: 'age_range',
        question: t('q.ageRange.question'),
        options: [
          { value: "6-8",   label: t('q.ageRange.6-8') },
          { value: "9-10",  label: t('q.ageRange.9-10') },
          { value: "11-12", label: t('q.ageRange.11-12') },
        ]
      },
      {
        id: 'topic',
        question: t('q.topicKids.question'),
        options: [
          { value: "abenteuer",    label: t('q.topic.abenteuer.kids') },
          { value: "magie",        label: t('q.topic.magie') },
          { value: "freundschaft", label: t('q.topic.freundschaft.kids') },
          { value: "lustiges",     label: t('q.topic.lustiges') },
          { value: "tiere",        label: t('q.topic.tiere') },
          { value: "schule",       label: t('q.topic.schule.kids') },
        ]
      },
      {
        id: 'length',
        question: t('q.lengthKids.question'),
        options: [
          { value: "kurz",   label: t('q.length.kurz.kids') },
          { value: "mittel", label: t('q.length.mittel.kids') },
          { value: "lang",   label: t('q.length.lang.kids') },
        ]
      },
      readBooksStep,
    ],

    jugendliche: [
      ageQuestion,
      bookLanguageQuestion,
      {
        id: 'occasion',
        question: t('q.occasion.question'),
        options: [
          { value: "freizeit",   label: t('q.occasion.freizeit') },
          { value: "entdecken",  label: t('q.occasion.entdecken') },
          { value: "verstehen",  label: t('q.occasion.verstehen') },
          { value: "schule",     label: t('q.occasion.schule') },
        ]
      },
      {
        id: 'topic',
        question: t('q.topicTeens.question'),
        options: [
          { value: "abenteuer",     label: t('q.topic.abenteuer.teens') },
          { value: "liebe",         label: t('q.topic.liebe') },
          { value: "freundschaft",  label: t('q.topic.freundschaft.teens') },
          { value: "selbstfindung", label: t('q.topic.selbstfindung') },
          { value: "gesellschaft",  label: t('q.topic.gesellschaft') },
          { value: "thriller_krimi",label: t('q.topic.thriller_krimi.teens') },
        ]
      },
      {
        id: 'length',
        question: t('q.lengthTeens.question'),
        options: [
          { value: "kurz",   label: t('q.length.kurz.teens') },
          { value: "mittel", label: t('q.length.mittel.teens') },
          { value: "lang",   label: t('q.length.lang.teens') },
        ]
      },
      readBooksStep,
    ],

    erwachsene: [
      ageQuestion,
      bookLanguageQuestion,
      {
        id: 'reading_goal',
        question: t('q.readingGoal.question'),
        options: [
          { value: "wachstum",    label: t('q.readingGoal.wachstum') },
          { value: "entspannung", label: t('q.readingGoal.entspannung') },
          { value: "beide",       label: t('q.readingGoal.beide') },
        ]
      },
      {
        id: 'topic',
        question: t('q.topicAdults.question'),
        options: [
          { value: "persoenliche_entwicklung",  label: t('q.topic.persoenliche_entwicklung') },
          { value: "stress_ruhe",               label: t('q.topic.stress_ruhe') },
          { value: "fokus_produktivitaet",      label: t('q.topic.fokus_produktivitaet') },
          { value: "beziehung_kommunikation",   label: t('q.topic.beziehung_kommunikation') },
          { value: "sinn_philosophie",          label: t('q.topic.sinn_philosophie') },
          { value: "glaube_spiritualitaet",     label: t('q.topic.glaube_spiritualitaet') },
          { value: "kreativitaet",              label: t('q.topic.kreativitaet') },
          { value: "lernen_wissen",             label: t('q.topic.lernen_wissen') },
          { value: "koerper_gesundheit",        label: t('q.topic.koerper_gesundheit') },
          { value: "fantasy_scifi",             label: t('q.topic.fantasy_scifi') },
          { value: "thriller_krimi",            label: t('q.topic.thriller_krimi') },
          { value: "romance",                   label: t('q.topic.romance') },
          { value: "historisch",                label: t('q.topic.historisch') },
          { value: "literatur",                 label: t('q.topic.literatur') },
          { value: "humor",                     label: t('q.topic.humor') },
        ]
      },
      {
        id: 'style',
        question: t('q.style.question'),
        options: [
          { value: "praktisch",        label: t('q.style.praktisch') },
          { value: "wissenschaftlich", label: t('q.style.wissenschaftlich') },
          { value: "story",            label: t('q.style.story') },
          { value: "reflektierend",    label: t('q.style.reflektierend') },
        ]
      },
      {
        id: 'level',
        question: t('q.level.question'),
        options: [
          { value: "einsteiger",      label: t('q.level.einsteiger') },
          { value: "fortgeschritten", label: t('q.level.fortgeschritten') },
          { value: "erfahren",        label: t('q.level.erfahren') },
        ]
      },
      {
        id: 'format',
        question: t('q.format.question'),
        options: [
          { value: "print",     label: t('q.format.print') },
          { value: "ebook",     label: t('q.format.ebook') },
          { value: "audiobook", label: t('q.format.audiobook') },
          { value: "any",       label: t('q.format.any') },
        ]
      },
      {
        id: 'length',
        question: t('q.lengthAdults.question'),
        options: [
          { value: "kurz",   label: t('q.length.kurz.adults') },
          { value: "mittel", label: t('q.length.mittel.adults') },
          { value: "lang",   label: t('q.length.lang.adults') },
        ]
      },
      readBooksStep,
    ],
  };
}



// generateReasons is now a thin wrapper around generateRichReason from bookScoring.js
// kept for backwards compatibility with BookCard's existing props interface.

function BookSearchContent() {
  const [phase, setPhase] = useState('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [readBooks, setReadBooks] = useState([]);   // Array von Titeln (Chips)
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [ageGroup, setAgeGroup] = useState('erwachsene');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLibraryCapture, setShowLibraryCapture] = useState(false);
  const [libraryCaptureConfig, setLibraryCaptureConfig] = useState({ scan: false });
  const [ownedBookTitles, setOwnedBookTitles] = useState([]);
  const [readingPath, setReadingPath] = useState(null);
  const [languageFallbackUsed, setLanguageFallbackUsed] = useState(false);

  // Always call hooks at top level – no try/catch around hooks (React rules)
  const langCtx = useLanguage();
  const t = langCtx?.t || ((k) => k);
  const language = langCtx?.language || 'de';
  const contextBookLanguage = langCtx?.bookLanguage || null;

  const tLib = (key, fb) => {
    const entry = libraryDict[key];
    if (entry) return entry[language] || entry['de'] || fb || key;
    return fb || key;
  };

  // Rebuild question sets whenever language changes
  const questionSets = buildQuestionSets(t);

  // Robust start path: read ?startQuestions=1 on mount and set phase.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('startQuestions') === '1') {
      setPhase('questions');
      setCurrentQuestion(0);
      params.delete('startQuestions');
      const newSearch = params.toString();
      history.replaceState(null, '', window.location.pathname + (newSearch ? '?' + newSearch : ''));
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  // Always use the freshly-built set (language + age group reactive, no stale state)
  const translatedQuestions = questionSets[ageGroup] || questionSets.erwachsene;

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

  const handleStart = (e) => {
    // Prevent any default behavior or event bubbling issues
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Direct React state update – the only path into questions phase
    setPhase('questions');
    setCurrentQuestion(0);
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

    // Load saved books & owned library titles for scoring
    let savedBookIds = [];
    let ownedTitles = [];
    if (isAuthenticated) {
      try {
        const saved = await base44.entities.SavedBook.list();
        savedBookIds = saved.map(s => s.book_id).filter(Boolean);
        // Owned library: books with physical_copy=true or ownership_status in [owned, read]
        ownedTitles = saved
          .filter(s => s.ownership_status === 'owned' || s.ownership_status === 'read' || s.physical_copy)
          .map(s => (s.book_data?.title || '')).filter(Boolean);
      } catch {
        savedBookIds = [];
      }
    }
    setOwnedBookTitles(ownedTitles);

    const profileWithSaved = { ...profile, savedBookIds };
    let results;
    try {
      results = await getMatchingBooksFromDB(profileWithSaved);
    } catch (err) {
      console.error('getMatchingBooksFromDB error:', err);
      results = [];
    }

    if (!Array.isArray(results)) results = [];

    // Enrich each book with a rich score
    const enriched = results.map(book => ({
      ...book,
      _matchScore: scoreBook(book, profile, ownedTitles),
    }));

    // Re-sort main books by enriched score (keep isContrast flag for horizon section)
    const mainEnriched = enriched
      .filter(b => !b.isContrast)
      .sort((a, b) => b._matchScore - a._matchScore);
    const horizonEnriched = enriched.filter(b => b.isContrast);
    const finalResults = [...mainEnriched, ...horizonEnriched];

    // Language fallback metadata
    const meta = results._meta || {};
    setLanguageFallbackUsed(!!(meta.languageFallbackUsed));

    // Build reading path
    const path = buildReadingPath(mainEnriched, horizonEnriched, profile, language);
    setReadingPath(path);

    setRecommendations(finalResults);
    setPhase('results');
    setLoading(false);

    // Fire-and-forget: persist recommendation (non-blocking)
    if (isAuthenticated && finalResults.length > 0) {
      base44.entities.Recommendation.create({
        books: finalResults,
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
    setReadingPath(null);
    setLanguageFallbackUsed(false);
    setOwnedBookTitles([]);
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
          >
            <div className="flex flex-col items-center px-6 pt-12 pb-36">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center mb-8 max-w-sm w-full"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-600 flex items-center justify-center shadow-md">
                  <Compass className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-light text-stone-800 dark:text-stone-100 mb-4 tracking-tight">
                  {t('booksearch.title')}
                </h1>
                <p className="text-stone-500 dark:text-stone-400 text-base font-light leading-relaxed mb-8">
                  {t('booksearch.subtitle')}
                </p>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-600 text-sm">✦</span>
                    </div>
                    <span className="text-sm text-stone-600 dark:text-stone-300">{t('booksearch.benefitPersonal')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 text-sm">✓</span>
                    </div>
                    <span className="text-sm text-stone-600 dark:text-stone-300">{t('booksearch.benefitFree')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">🌐</span>
                    </div>
                    <span className="text-sm text-stone-600 dark:text-stone-300">{t('booksearch.benefitLanguages')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Primärer CTA – direkt unter den Benefits, weit weg von der BottomNav */}
              <div className="w-full max-w-sm flex flex-col items-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-base font-medium rounded-xl shadow-sm transition-colors cursor-pointer select-none touch-manipulation"
                >
                  {t('btn.startSearch')}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-stone-400 dark:text-stone-500">{t('booksearch.betaLabel')}</p>
              </div>

              {/* Library capture section – optional, darunter */}
              <div className="w-full max-w-sm mb-8">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                      {tLib('lib.booksearch.libraryTitle', 'Hast du Bücher zuhause?')}
                    </h3>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mb-3 ml-6">
                    {tLib('lib.booksearch.librarySubtitle', 'Du kannst dein Regal jetzt erfassen oder später nachholen.')}
                  </p>
                  <div className="flex flex-wrap gap-2 ml-6">
                    <button
                      type="button"
                      onClick={() => { setLibraryCaptureConfig({ scan: true }); setShowLibraryCapture(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      {tLib('lib.booksearch.scanBtn', 'Bücher scannen')}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLibraryCaptureConfig({ scan: false }); setShowLibraryCapture(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-lg transition-colors hover:bg-amber-50"
                    >
                      <Search className="w-3.5 h-3.5" />
                      {tLib('lib.booksearch.enterBtn', 'Titel eingeben')}
                    </button>
                    <button
                      type="button"
                      onClick={handleStart}
                      className="px-3 py-1.5 text-amber-600 dark:text-amber-400 text-xs font-medium hover:underline"
                    >
                      {tLib('lib.booksearch.skipBtn', 'Später machen')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
                      <div className="mb-6">
                        <div className="flex justify-between text-xs font-medium text-stone-400 dark:text-stone-500 mb-2">
                          <span>{t('booksearch.questionOf')} {currentQuestion + 1} {t('booksearch.of')} {translatedQuestions.length}</span>
                          <span>{Math.round(((currentQuestion + 1) / translatedQuestions.length) * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div className="h-full bg-stone-800 dark:bg-amber-500 transition-all duration-500 rounded-full" style={{ width: `${((currentQuestion + 1) / translatedQuestions.length) * 100}%` }} />
                        </div>
                      </div>
                      <h2 className="text-xl md:text-2xl font-light text-stone-800 dark:text-stone-100 mb-1 leading-relaxed">
                        {t('booksearch.readBooksTitle')}
                      </h2>
                      <p className="text-stone-400 dark:text-stone-500 text-xs mb-5">
                        {t('booksearch.readBooksOptional')}
                      </p>
                      <ReadBooksInput
                        value={readBooks}
                        onChange={setReadBooks}
                        onSkip={handleReadBooksDone}
                        placeholder={t(`q.readBooks.placeholder.${ageGroup}`)}
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
                      stepLabel={t('booksearch.step')
                        .replace('{n}', currentQuestion + 1)
                        .replace('{total}', translatedQuestions.length)}
                      continueLabel={t('q.continueBtn')}
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

              {/* Buchsprache + Kaufregion pills – strikt getrennt, keine Ableitung */}
              {(() => {
                const langCode = profile.bookLanguage;
                // shoppingRegion bleibt immer was der User gesetzt hat (z.B. DE), unabhängig von Buchsprache
                const regionCode = (langCtx?.shoppingRegion || 'DE').toUpperCase();
                if (!langCode && !regionCode) return null;

                const langLabels   = { de: t('bookLang.de'), en: t('bookLang.en'), el: t('bookLang.el'), tr: t('bookLang.tr'), fr: t('bookLang.fr'), es: t('bookLang.es'), it: t('bookLang.it') };
                const regionLabels = { DE: t('region.de'), AT: t('region.at'), CH: t('region.ch'), GR: t('region.gr'), TR: t('region.tr'), FR: t('region.fr'), ES: t('region.es'), IT: t('region.it'), UK: t('region.uk'), US: t('region.us') };
                const langFlags    = { de: '🇩🇪', en: '🇬🇧', el: '🇬🇷', tr: '🇹🇷', fr: '🇫🇷', es: '🇪🇸', it: '🇮🇹' };
                const regionFlags  = { DE: '🇩🇪', AT: '🇦🇹', CH: '🇨🇭', GR: '🇬🇷', TR: '🇹🇷', FR: '🇫🇷', ES: '🇪🇸', IT: '🇮🇹', UK: '🇬🇧', US: '🇺🇸' };
                return (
                  <div className="flex flex-wrap gap-2 justify-center mt-4 mb-1">
                    {langCode && langCode !== 'any' && (
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                        <span className="opacity-60 text-[10px] mr-0.5">{t('booksearch.buchsprachePill')}</span>
                        {langFlags[langCode] || '📖'} {langLabels[langCode] || langCode} <span className="opacity-50">({langCode})</span>
                      </span>
                    )}
                    {regionCode && (
                      <span className="inline-flex items-center gap-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 px-3 py-1 rounded-full text-xs font-medium">
                        <span className="opacity-60 text-[10px] mr-0.5">{t('booksearch.kaufregionPill')}</span>
                        {regionFlags[regionCode] || '🛒'} {regionLabels[regionCode] || regionCode} <span className="opacity-50">({regionCode})</span>
                      </span>
                    )}
                  </div>
                );
              })()}

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
                  const langName = lang ? t(`bookLang.${lang}`) || lang : lang;
                  return (
                    <div className="text-center py-16 text-stone-400">
                      <p className="text-2xl mb-3">📚</p>
                      <p className="text-lg mb-2 text-stone-600 dark:text-stone-300">
                        {lang && lang !== 'any' ? `${t('booksearch.noBooksLang')} ${langName}` : t('booksearch.noBooksGeneral')}
                      </p>
                      <p className="text-sm mb-4">
                        {lang && lang !== 'any'
                          ? `${t('booksearch.noBooksSuggestDiscover')} ${langName}.`
                          : t('booksearch.noBooksTryNew')}
                      </p>
                      {lang && lang !== 'any' && (
                        <a href="/BookDiscover" className="inline-block text-sm text-amber-600 underline underline-offset-4 hover:text-amber-700">
                          {t('booksearch.toBookDiscover')}
                        </a>
                      )}
                    </div>
                  );
                }

                // Language fallback notice
                const langFallbackNotice = languageFallbackUsed && profile?.bookLanguage && profile.bookLanguage !== 'any';

                const top3 = mainBooks.slice(0, 3);
                const rest7 = mainBooks.slice(3);
                return (
                  <>
                    {/* Language fallback notice */}
                    {langFallbackNotice && (
                      <div className="mb-6 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl text-sm text-orange-700 dark:text-orange-300">
                        ⚠ {t('booksearch.langFallbackNotice') || `Wenige Bücher auf ${t(`bookLang.${profile.bookLanguage}`) || profile.bookLanguage} gefunden – Ergebnisse wurden erweitert.`}
                      </div>
                    )}

                    {/* Sektion 1: Top 3 */}
                    <div className="mb-12">
                      <div className="flex items-center gap-3 mb-5">
                        <div>
                          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                              {t('booksearch.top3Title')}
                            </h3>
                            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{t('booksearch.top3Sub')}</p>
                        </div>
                        <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
                      </div>
                      <div className="space-y-5">
                        {top3.map((book, idx) => {
                          const labels = [t('booksearch.rank1'), t('booksearch.rank2'), t('booksearch.rank3')];
                          const richReason = generateRichReason(book, profile, book._matchScore || 0, language, ownedBookTitles, t);
                          return (
                            <div key={book.id || book.isbn13 || idx}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className={`text-[11px] font-semibold uppercase tracking-widest ${idx === 0 ? 'text-amber-600' : 'text-stone-400 dark:text-stone-500'}`}>
                                  {labels[idx]}
                                </span>
                                {idx === 0 && <span className="h-px flex-1 bg-amber-200 dark:bg-amber-800" />}
                              </div>
                              <BookCard book={book} reasons={richReason} index={idx} isContrast={false} isAuthenticated={isAuthenticated} analysisBookLanguage={profile?.bookLanguage} />
                              <RecommendationMeta reasons={richReason} />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sektion 2: Weitere 7 */}
                    {rest7.length > 0 && (
                      <div className="mb-10">
                        <div className="mb-4">
                          <h3 className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                            {t('booksearch.moreRecs')}
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {rest7.map((book, idx) => {
                            const richReason = generateRichReason(book, profile, book._matchScore || 0, language, ownedBookTitles, t);
                            return (
                              <div key={book.id || book.isbn13 || `r-${idx}`}>
                                <BookCard book={book} reasons={richReason} index={Math.min(3 + idx, 5)} isContrast={false} isAuthenticated={isAuthenticated} analysisBookLanguage={profile?.bookLanguage} />
                                <RecommendationMeta reasons={richReason} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Sektion 3: Horizont-Erweiterungen */}
                    {horizonBooks.length > 0 && (
                      <div className="mb-12">
                        <div className="border-t border-stone-200 dark:border-stone-700 pt-8 mb-5">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-violet-500 dark:text-violet-400 text-[10px]">✦</span>
                            </div>
                            <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400">{t('booksearch.horizonTitle')}</h3>
                            </div>
                            <p className="text-[11px] text-stone-400 dark:text-stone-500 ml-8">{t('booksearch.horizonSub')}</p>
                        </div>
                        <div className="space-y-4 opacity-90">
                          {horizonBooks.map((book, idx) => {
                            const richReason = generateRichReason(book, profile, book._matchScore || 0, language, ownedBookTitles, t);
                            return (
                              <div key={book.id || book.isbn13 || `h-${idx}`}>
                                <BookCard book={book} reasons={richReason} index={Math.min(5 + idx, 7)} isContrast={true} isAuthenticated={isAuthenticated} analysisBookLanguage={profile?.bookLanguage} />
                                <RecommendationMeta reasons={richReason} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Lesepfad */}
                    <ReadingPath phases={readingPath} />
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

      {showLibraryCapture && (
        <LibraryCapture
          initialTab="search"
          autoStartScan={libraryCaptureConfig.scan}
          onDone={() => setShowLibraryCapture(false)}
          onSkip={() => setShowLibraryCapture(false)}
        />
      )}
    </div>
  );
}

export default function BookSearch() {
  return <BookSearchContent />;
}