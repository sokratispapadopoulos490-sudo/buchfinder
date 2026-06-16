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
import { useLanguage, LanguageProvider } from '@/components/language/LanguageContext';
import { setBookLanguage } from '@/lib/shoppingRegion';

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



const generateReasons = (book, profile, t) => {
  const bookTags = book.tags || book.categories || [];
  const bookStyle = book.style || book.reading_style || [];
  const topicMatch = (profile.mainTopics || []).find(topic => bookTags.includes(topic));
  const styleMatch = (profile.style || []).find(s => bookStyle.includes(s));

  const bookSpecificReason = book.description;

  return {
    mainReason: book.isContrast
      ? t('reason.contrast')
          .replace('{title}', book.title)
          .replace('{author}', book.author || (book.authors || [])[0] || '')
      : bookSpecificReason,
    bullets: [
      topicMatch ? t(`reason.topic.${topicMatch}`) || t('reason.fallback.topic') : t('reason.fallback.topic'),
      styleMatch ? t(`reason.style.${styleMatch}`) || t('reason.fallback.style') : t('reason.fallback.style'),
      topicMatch ? t(`reason.topic.${topicMatch}`) || t('reason.fallback.gain') : t('reason.fallback.gain'),
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
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Always call hooks at top level – no try/catch around hooks (React rules)
  const langCtx = useLanguage();
  const t = langCtx?.t || ((k) => k);
  const contextBookLanguage = langCtx?.bookLanguage || null;

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

  const handleStart = () => {
    // Primary: direct React state update
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
                {t('booksearch.title')}
              </h1>
              <p className="text-stone-500 dark:text-stone-400 text-lg font-light max-w-xs mx-auto leading-relaxed">
                {t('booksearch.subtitle')}
              </p>
            </motion.div>

            <div className="flex flex-col items-center gap-4 relative z-10">
              <button
                type="button"
                onClick={handleStart}
                style={{ backgroundColor: '#d97706', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 40px', fontSize: '1rem', fontWeight: 500, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', cursor: 'pointer', border: 'none' }}
              >
                {t('btn.startSearch')}
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-stone-400 dark:text-stone-500">{t('booksearch.betaLabel')}</p>
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
                      <div className="mb-8">
                        <div className="flex justify-between text-sm text-stone-400 dark:text-stone-500 mb-2">
                          <span>{t('booksearch.questionOf')} {currentQuestion + 1}</span>
                          <span>{currentQuestion + 1} {t('booksearch.of')} {translatedQuestions.length}</span>
                        </div>
                        <div className="h-1 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div className="h-full bg-stone-800 dark:bg-amber-500 transition-all" style={{ width: `${((currentQuestion + 1) / translatedQuestions.length) * 100}%` }} />
                        </div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-light text-stone-800 dark:text-stone-100 mb-2 leading-relaxed">
                        {t('booksearch.readBooksTitle')}
                      </h2>
                      <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
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

                const top3 = mainBooks.slice(0, 3);
                const rest7 = mainBooks.slice(3);
                return (
                  <>
                    {/* Sektion 1: Top 3 */}
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                              {t('booksearch.top3Title')}
                            </h3>
                            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{t('booksearch.top3Sub')}</p>
                        </div>
                        <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700 ml-2" />
                      </div>
                      <div className="space-y-6">
                        {top3.map((book, idx) => {
                          const labels = [t('booksearch.rank1'), t('booksearch.rank2'), t('booksearch.rank3')];
                          return (
                            <div key={book.id || book.isbn13 || idx} className="space-y-2">
                              <div className="flex items-center gap-2 px-1">
                                <span className={`text-xs font-semibold uppercase tracking-wide ${idx === 0 ? 'text-amber-600' : 'text-stone-400 dark:text-stone-500'}`}>
                                  {labels[idx]}
                                </span>
                              </div>
                              <BookCard book={book} reasons={generateReasons(book, profile, t)} index={idx} isContrast={false} isAuthenticated={isAuthenticated} analysisBookLanguage={profile?.bookLanguage} />
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
                            {t('booksearch.moreRecs')}
                          </h3>
                          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
                        </div>
                        <div className="space-y-4">
                          {rest7.map((book, idx) => (
                            <div key={book.id || book.isbn13 || `r-${idx}`} className="space-y-1">
                              <BookCard book={book} reasons={generateReasons(book, profile, t)} index={Math.min(3 + idx, 5)} isContrast={false} isAuthenticated={isAuthenticated} analysisBookLanguage={profile?.bookLanguage} />
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
                            <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100">{t('booksearch.horizonTitle')}</h3>
                            </div>
                            <p className="text-xs text-stone-400 dark:text-stone-500 ml-10">{t('booksearch.horizonSub')}</p>
                        </div>
                        <div className="space-y-6">
                          {horizonBooks.map((book, idx) => (
                            <div key={book.id || book.isbn13 || `h-${idx}`}>
                              <BookCard book={book} reasons={generateReasons(book, profile, t)} index={Math.min(5 + idx, 7)} isContrast={true} isAuthenticated={isAuthenticated} analysisBookLanguage={profile?.bookLanguage} />
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

// Wrap in LanguageProvider so direct preview (no Layout) never throws from useLanguage()
export default function BookSearch() {
  return (
    <LanguageProvider>
      <BookSearchContent />
    </LanguageProvider>
  );
}