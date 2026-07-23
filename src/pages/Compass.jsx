import React, { useState, useEffect, useRef } from 'react';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Target, MessageCircle, Plus, BookMarked, ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp, Camera, Compass as CompassIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/language/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import BookScannerModal from '@/components/books/BookScannerModal';
import BookCover from '@/components/books/BookCover';
import ProgressModule from '@/components/stats/ProgressModule';
import EventsList from '@/components/compass/EventsList';
import ReadingProgressModal from '@/components/reading/ReadingProgressModal';
import LibraryView from '@/components/library/LibraryView';
import QuotesSection from '@/components/compass/QuotesSection';
import ChallengesSection from '@/components/compass/ChallengesSection';
import FollowingSection from '@/components/compass/FollowingSection';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// Module-level cache – überlebt Re-Mounts, nicht aber Page-Reloads oder User-Wechsel
let _compassCache = null;

// Snap-Key enthält User-ID, sodass Nutzerwechsel keinen alten Cache zeigen
function getSnapKey() {
  try { return `compassSnap_v2_${localStorage.getItem('bc_current_user_id') || 'anon'}`; } catch { return 'compassSnap_v2_anon'; }
}
function getSnap() { try { return JSON.parse(localStorage.getItem(getSnapKey()) || 'null'); } catch { return null; } }
function setSnap(d) { try { localStorage.setItem(getSnapKey(), JSON.stringify(d)); } catch {} }
function clearSnap() { try { localStorage.removeItem(getSnapKey()); } catch {} }

// Reagiert auf User-Wechsel (AuthContext dispatcht 'bc:user_changed')
if (typeof window !== 'undefined') {
  window.addEventListener('bc:user_changed', () => {
    _compassCache = null;
    clearSnap();
  });
}


export default function Compass() {
  const { t } = useLanguage();
  useDocumentTitle(t('compass.title'));
  const [user, setUser] = useState(null);

  // Sofort aus Cache (Modul oder localStorage) initialisieren – kein Flackern
  // Der Snap-Key enthält die User-ID, daher ist Cross-User-Cache strukturell ausgeschlossen.
  const _initial = (() => {
    try {
      return _compassCache ?? getSnap();
    } catch { return null; }
  })();
  const [currentBook, setCurrentBook] = useState(() => _initial?.currentBook ?? null);
  const [bookReflections, setBookReflections] = useState({});
  const [todayReflection, setTodayReflection] = useState('');
  const [reflectionExpanded, setReflectionExpanded] = useState(false);
  const [streak, setStreak] = useState(() => _initial?.streak ?? 0);
  const [progress, setProgress] = useState(() => _initial?.progress ?? 0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [reflectionQuestion, setReflectionQuestion] = useState('');
  const [lastRecommendations, setLastRecommendations] = useState(() => _initial?.lastRecommendations ?? []);
  const [allBooks, setAllBooks] = useState(() => _initial?.allBooks ?? []);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  // Wenn wir Daten aus Cache haben → kein Ladespinner
  const [loading, setLoading] = useState(() => _initial === null);
  const [showScanner, setShowScanner] = useState(false);
  const [allReadingLogs, setAllReadingLogs] = useState(() => _initial?.allReadingLogs ?? []);
  const [generatedBooksCount, setGeneratedBooksCount] = useState(() => _initial?.generatedBooksCount ?? 0);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedBookForProgress, setSelectedBookForProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    generateReflectionQuestion();
    // Wenn Modul-Cache vorhanden → Daten im Hintergrund still aktualisieren (kein Spinner)
    if (_compassCache !== null) {
      loadCompassData(true);
      return;
    }
    // Beim Page-Reload: localStorage-Snapshot vorhanden → sofort anzeigen, dann stille Aktualisierung
    if (getSnap() !== null) {
      loadCompassData(true); // still (kein Spinner)
    } else {
      loadCompassData(false);
    }
  }, []);

  const loadCompassData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const currentUser = await base44.auth.me();
      const [savedBooks, allLogs] = await Promise.all([
        base44.entities.SavedBook.list('-created_date', 50),
        base44.entities.ReadingLog.list('-reading_date', 1000),
      ]);

      setAllReadingLogs(allLogs);
      calculateStreak(allLogs);

      const inProgressBooks = savedBooks.filter(b => !b.is_completed);
      setAllBooks(savedBooks);
      let activeBook = null;
      let activeProgress = 0;
      if (inProgressBooks.length > 0) {
        activeBook = inProgressBooks[0];
        setCurrentBook(activeBook);
        const logs = allLogs.filter(l => l.book_id === inProgressBooks[0].book_id);
        const totalPages = logs.reduce((sum, log) => sum + log.pages_read, 0);
        const bookPages = inProgressBooks[0].book_data.pageCount || 1;
        activeProgress = Math.min(100, Math.round((totalPages / bookPages) * 100));
        setProgress(activeProgress);
      }

      generateReflectionQuestion();

      // Empfehlungen im Hintergrund laden – nur eindeutig eigene Datensätze anzeigen
      let ownRecs = [];
      let totalGenerated = 0;
      try {
        const recs = await base44.entities.Recommendation.list('-created_date', 5);
        // Defensiver Zusatz-Check über RLS hinaus: nur Datensätze, die eindeutig dem
        // aktuellen Nutzer gehören (created_by === eigene E-Mail), sonst nicht anzeigen.
        ownRecs = (recs || []).filter(r => r.created_by && currentUser?.email && r.created_by === currentUser.email);
        setLastRecommendations(ownRecs.length > 0 && ownRecs[0].books ? ownRecs[0].books.slice(0, 3) : []);
        totalGenerated = ownRecs.reduce((sum, rec) => sum + (rec.books ? rec.books.length : 0), 0);
        setGeneratedBooksCount(totalGenerated);
      } catch (e) {
        console.error('Background recommendation load failed:', e);
        setLastRecommendations([]);
      }

      // Cache persistieren (Modul + localStorage)
      const snap = {
        currentBook: activeBook,
        allBooks: savedBooks,
        allReadingLogs: allLogs,
        streak: 0,
        progress: activeProgress,
        lastRecommendations: ownRecs.length > 0 && ownRecs[0].books ? ownRecs[0].books.slice(0, 3) : [],
        generatedBooksCount: totalGenerated,
      };
      _compassCache = snap;
      setSnap(snap);
    } catch (error) {
      console.error('Error loading compass:', error);
      // Nur zu Onboarding wenn kein Cache existiert (erster Besuch, nicht eingeloggt)
      if (_compassCache === null && getSnap() === null) {
        navigate('/Onboarding');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (logs) => {
    if (logs.length === 0) {
      setStreak(0);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const uniqueDates = [...new Set(logs.map(log => log.reading_date))].sort().reverse();
    let currentStreak = 0;
    let checkDate = new Date(today);

    for (const dateStr of uniqueDates) {
      const logDate = new Date(dateStr);
      logDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((checkDate - logDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0 || diffDays === 1) {
        currentStreak++;
        checkDate = logDate;
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const generateReflectionQuestion = () => {
    const keys = ['compass.rq1', 'compass.rq2', 'compass.rq3', 'compass.rq4', 'compass.rq5'];
    setReflectionQuestion(keys[Math.floor(Math.random() * keys.length)]);
  };

  const switchBook = async (newIndex) => {
    const book = allBooks[newIndex];
    setCurrentBookIndex(newIndex);
    setCurrentBook(book);
    setTodayReflection('');
    const logs = await base44.entities.ReadingLog.filter({ book_id: book.book_id });
    const totalPages = logs.reduce((sum, log) => sum + log.pages_read, 0);
    const bookPages = book.book_data.pageCount || 1;
    setProgress(Math.min(100, Math.round((totalPages / bookPages) * 100)));
  };

  const saveReflection = async () => {
    if (!todayReflection.trim() || !currentBook) return;

    try {
      const bookId = String(currentBook.book_id);
      const updated = {
        ...bookReflections,
        [bookId]: { text: todayReflection, date: new Date().toISOString() }
      };
      await base44.auth.updateMe({ book_reflections: updated });
      setBookReflections(updated);
      setTodayReflection('');
    } catch (error) {
      console.error('Error saving reflection:', error);
    }
  };

  const deleteReflection = async () => {
    if (!currentBook) return;
    try {
      const bookId = String(currentBook.book_id);
      const updated = { ...bookReflections };
      delete updated[bookId];
      await base44.auth.updateMe({ book_reflections: updated });
      setBookReflections(updated);
    } catch (error) {
      console.error('Error deleting reflection:', error);
    }
  };

  const currentReflection = currentBook ? bookReflections[String(currentBook.book_id)] : null;

  const handleToggleCompleted = async (savedBook) => {
    await base44.entities.SavedBook.update(savedBook.id, {
      is_completed: !savedBook.is_completed,
      completed_date: !savedBook.is_completed ? new Date().toISOString().split('T')[0] : null
    });
    _compassCache = null; clearSnap();
    await loadCompassData();
  };

  const handleDeleteSavedBook = async (savedBookId) => {
    if (confirm(t('compass.deleteBookConfirm'))) {
      await base44.entities.SavedBook.delete(savedBookId);
      _compassCache = null; clearSnap();
      await loadCompassData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-stone-500 dark:text-stone-400">{t('compass.loading')}</div>
      </div>
    );
  }

  // Gemeinsame Empfehlungs-Karte: zeigt echte, eigene Empfehlungen oder einen
  // neutralen leeren Zustand mit CTA – nie fremde/veraltete Daten.
  const recommendationsCard = (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">{t('compass.lastRecommendations')}</h3>
        {lastRecommendations.length > 0 && (
          <button
            onClick={() => navigate('/BookSearch')}
            className="text-xs text-amber-600 dark:text-amber-500 hover:underline"
          >
            {t('compass.newAnalysis')}
          </button>
        )}
      </div>
      {lastRecommendations.length > 0 ? (
        <div className="space-y-3">
          {lastRecommendations.map((book, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <BookCover bookData={book} width="w-10" height="h-14" textSize="text-lg" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{book.title}</div>
                <div className="text-xs text-stone-500 dark:text-stone-400 truncate">{book.author}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <Sparkles className="w-8 h-8 text-stone-300 mx-auto mb-3" />
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">{t('compass.noRecommendations')}</p>
          <Button onClick={() => navigate('/BookSearch')} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
            {t('compass.startRecommendation')}
          </Button>
        </div>
      )}
    </div>
  );

  if (!currentBook) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] px-4 py-12 pb-32">
        <div className="max-w-xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-light text-stone-800 dark:text-stone-200">{t('compass.title')}</h1>
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-full flex-shrink-0">
              {t('account.betaBadge')}
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-8 sm:p-10 text-center mb-6"
          >
            <BookOpen className="w-14 h-14 text-amber-600 dark:text-amber-500 mx-auto mb-5" />
            <h1 className="text-xl sm:text-2xl font-light text-stone-800 dark:text-stone-200 mb-3">
              {t('compass.readReady')}
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mb-7">
              {t('compass.readReadySub')}
            </p>
            <div className="flex flex-col gap-3 mb-8">
              <Button
                onClick={() => navigate('/BookSearch')}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
              >
                <Sparkles className="w-4 h-4" />
                 {t('compass.startRecommendation')}
              </Button>
              <Button
                onClick={() => setShowScanner(true)}
                variant="outline"
                className="gap-2 border-amber-300 text-amber-800"
              >
                <Camera className="w-4 h-4" />
                 {t('compass.scanBook')} / {t('compass.addBook')}
              </Button>
            </div>

            {/* 3 kompakte Schritte */}
            <div className="grid grid-cols-3 gap-3 text-left border-t border-stone-100 dark:border-stone-700 pt-6">
              {[t('compass.step1'), t('compass.step2'), t('compass.step3')].map((label, idx) => (
                <div key={idx}>
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-semibold mb-2">
                    {idx + 1}
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* First-User-State: nie alte Recommendation-Historie zeigen, nur leere Karte + CTA */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
            <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-4">{t('compass.lastRecommendations')}</h3>
            <div className="text-center py-6">
              <Sparkles className="w-8 h-8 text-stone-300 mx-auto mb-3" />
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">{t('compass.noRecommendations')}</p>
              <Button onClick={() => navigate('/BookSearch')} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                {t('compass.startRecommendation')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] px-4 py-8 md:py-12" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header mit Logo */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-md flex-shrink-0">
            <CompassIcon className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-semibold text-stone-900 dark:text-white">{t('compass.title')}</span>
        </div>

        {/* CTA: Neue Buchempfehlung */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/BookSearch')}
            className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-400">{t('compass.newRecommendations')}</span>
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-500">→</span>
          </button>
        </div>

        {/* Hauptkarte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 sm:p-8 shadow-sm mb-6"
        >
          {/* Buch-Navigation */}
          {allBooks.length > 1 && (
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => switchBook(Math.max(0, currentBookIndex - 1))}
                disabled={currentBookIndex === 0}
                className="p-2 rounded-full border border-stone-200 dark:border-stone-700 disabled:opacity-30 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              </button>
              <span className="text-xs text-stone-400 dark:text-stone-500">
                 {currentBookIndex + 1} {t('compass.ofBooks')} {allBooks.length} {t('compass.booksLabel')}
               </span>
              <button
                onClick={() => switchBook(Math.min(allBooks.length - 1, currentBookIndex + 1))}
                disabled={currentBookIndex === allBooks.length - 1}
                className="p-2 rounded-full border border-stone-200 dark:border-stone-700 disabled:opacity-30 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              </button>
            </div>
          )}

          {/* Aktuelles Buch */}
          <div className="flex items-start gap-4 mb-6">
            <BookCover bookData={currentBook.book_data} width="w-20" height="h-28" textSize="text-3xl" className="shadow-md" placeholderClassName="shadow-md" />
            <div className="flex-1">
              <h2 className="text-xl font-medium text-stone-800 dark:text-stone-200 mb-1 line-clamp-2">
                {currentBook.book_data.title}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mb-3">{currentBook.book_data.author}</p>
              <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1">
                   <BookOpen className="w-4 h-4" />
                   {progress}% {t('compass.read')}
                 </span>
                 {streak > 0 && (
                   <span className="flex items-center gap-1">
                     🔥 {streak} {streak === 1 ? t('compass.dayStreak') : t('compass.daysStreak')}
                   </span>
                 )}
              </div>
            </div>
          </div>

          {/* Fortschrittsbalken */}
          <div className="mb-8">
            <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Letzter Gedanke – buchspezifisch, aufklappbar */}
          {currentReflection && (
            <div className="mb-6 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-100 dark:border-amber-800 overflow-hidden">
              <button
                onClick={() => setReflectionExpanded(prev => !prev)}
                className="w-full flex items-center gap-2 px-4 py-3 text-left"
              >
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                <span className="text-xs font-medium text-amber-900 dark:text-amber-400 flex-1">
                  {t('compass.yourThought')} {new Date(currentReflection.date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteReflection(); }}
                  className="p-1 rounded hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors mr-1"
                >
                  <X className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                </button>
                {reflectionExpanded
                  ? <ChevronUp className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                }
              </button>
              {reflectionExpanded && (
                <div className="px-4 pb-3">
                  <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                    "{currentReflection.text}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Heute im Fokus */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-medium text-blue-900 dark:text-blue-400 mb-1">{t('compass.todayFocus')}</div>
                 <p className="text-sm text-blue-800 dark:text-blue-300">
                   {t('compass.todayFocusSub')}
                 </p>
              </div>
            </div>
          </div>

          {/* Reflexionsfrage */}
          <div className="mb-6 p-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-stone-600 dark:text-stone-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">{t('compass.reflectionLabel')}</div>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-3 leading-relaxed">
                  {t(reflectionQuestion)}
                </p>
                <textarea
                  value={todayReflection}
                  onChange={(e) => setTodayReflection(e.target.value)}
                  placeholder={t('compass.reflectionPlaceholder')}
                  className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none bg-white dark:bg-[#1a1a1a] text-stone-800 dark:text-stone-200"
                  rows={3}
                />
                {todayReflection.trim() && (
                  <button
                    onClick={saveReflection}
                    className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                    {t('compass.saveReflection')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => setShowProgressModal(true)}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('compass.logProgress')}
          </Button>
        </motion.div>

        {/* Fortschritts-Modul */}
        <div className="mb-6">
          <ProgressModule
            readingLogs={allReadingLogs}
            completedBooksCount={allBooks.filter(b => b.is_completed).length}
            savedBooksCount={allBooks.length}
            generatedBooksCount={generatedBooksCount}
          />
        </div>

        {/* Lese-Termine */}
        <div className="mb-6">
          <EventsList />
        </div>

        {/* Zitate */}
        <div className="mb-6">
          <QuotesSection />
        </div>

        {/* Challenges */}
        <div className="mb-6">
          <ChallengesSection />
        </div>

        {/* Mein Netzwerk */}
        <FollowingSection />

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => navigate('/BookSearch')}
            className="p-3 sm:p-4 bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 transition-colors text-left"
          >
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-500 mb-2" />
            <div className="text-[11px] sm:text-sm font-medium text-stone-800 dark:text-stone-200 mb-1 leading-tight">{t('compass.recommendations')}</div>
            <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 leading-tight">{t('compass.analyzeStart')}</div>
          </button>
          <button
            onClick={() => setShowScanner(true)}
            className="p-3 sm:p-4 bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 transition-colors text-left"
          >
            <Camera className="w-5 h-5 text-amber-600 dark:text-amber-500 mb-2" />
            <div className="text-[11px] sm:text-sm font-medium text-stone-800 dark:text-stone-200 mb-1 leading-tight">{t('compass.scan')}</div>
            <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 leading-tight">{t('compass.addBook')}</div>
          </button>
          <button
            onClick={() => setShowLibrary(v => !v)}
            className="p-3 sm:p-4 bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 transition-colors text-left"
          >
            <BookMarked className="w-5 h-5 text-amber-600 dark:text-amber-500 mb-2" />
            <div className="text-[11px] sm:text-sm font-medium text-stone-800 dark:text-stone-200 mb-1 leading-tight">{t('compass.library')}</div>
            <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 leading-tight">{t('compass.allBooks')}</div>
          </button>
        </div>

        {/* Bibliothek */}
        {showLibrary && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-light text-stone-800 dark:text-stone-200">{t('compass.yourLibrary')}</h2>
            </div>
            {allBooks.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700">
                <BookMarked className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500">{t('compass.libraryEmpty')}</p>
              </div>
            ) : (
              <LibraryView
                savedBooks={allBooks}
                onToggleComplete={handleToggleCompleted}
                onDelete={handleDeleteSavedBook}
                onProgressClick={(saved) => setSelectedBookForProgress({ book: saved.book_data, savedBookId: saved.id })}
                onRefresh={loadCompassData}
              />
            )}
          </div>
        )}

        {/* Letzte Empfehlungen */}
        {recommendationsCard}
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <BookScannerModal
          onClose={() => setShowScanner(false)}
          onBookAdded={loadCompassData}
        />
      )}

      {/* Progress Modal (current book) */}
      {showProgressModal && currentBook && (
        <ReadingProgressModal
          book={currentBook.book_data}
          savedBookId={currentBook.id}
          onClose={() => setShowProgressModal(false)}
          onUpdate={() => { _compassCache = null; clearSnap(); loadCompassData(); }}
        />
      )}

      {/* Progress Modal (from library) */}
      {selectedBookForProgress && (
        <ReadingProgressModal
          book={selectedBookForProgress.book}
          savedBookId={selectedBookForProgress.savedBookId}
          onClose={() => setSelectedBookForProgress(null)}
          onUpdate={() => { _compassCache = null; clearSnap(); loadCompassData(); }}
        />
      )}
    </div>
  );
}