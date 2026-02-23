import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Target, MessageCircle, Plus, BookMarked, ChevronLeft, ChevronRight, X, ChevronDown, ChevronUp, Camera } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import ReadingProgressModal from '@/components/reading/ReadingProgressModal';
import BookScannerModal from '@/components/books/BookScannerModal';
import BookCover from '@/components/books/BookCover';
import ProgressModule from '@/components/stats/ProgressModule';

export default function Compass() {
  const [user, setUser] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);
  const [bookReflections, setBookReflections] = useState({}); // { bookId: { text, date } }
  const [todayReflection, setTodayReflection] = useState('');
  const [reflectionExpanded, setReflectionExpanded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [reflectionQuestion, setReflectionQuestion] = useState('');
  const [lastRecommendations, setLastRecommendations] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [allReadingLogs, setAllReadingLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCompassData();
  }, []);

  const loadCompassData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      // Alle Bücher laden
      const savedBooks = await base44.entities.SavedBook.filter({ is_completed: false }, '-created_date');
      if (savedBooks.length > 0) {
        setAllBooks(savedBooks);
        setCurrentBook(savedBooks[0]);

        // Fortschritt berechnen
        const logs = await base44.entities.ReadingLog.filter({ book_id: savedBooks[0].book_id });
        const totalPages = logs.reduce((sum, log) => sum + log.pages_read, 0);
        const bookPages = savedBooks[0].book_data.pageCount || 1;
        setProgress(Math.min(100, Math.round((totalPages / bookPages) * 100)));

        // Streak berechnen
        const allLogs = await base44.entities.ReadingLog.list('-reading_date');
        calculateStreak(allLogs);
      }

      // Buchspezifische Reflexionen laden
      if (currentUser.book_reflections) {
        setBookReflections(currentUser.book_reflections);
      }

      // Letzte Empfehlungen laden
      const recs = await base44.entities.Recommendation.list('-created_date', 1);
      if (recs.length > 0 && recs[0].books) {
        setLastRecommendations(recs[0].books.slice(0, 3));
      }

      // Reflexionsfrage generieren
      generateReflectionQuestion();
    } catch (error) {
      console.error('Error loading compass:', error);
      navigate('/Onboarding');
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
    const questions = [
      'Was hat dich heute beim Lesen überrascht oder irritiert?',
      'Welcher Gedanke aus dem Buch beschäftigt dich gerade am meisten?',
      'Was würdest du anders machen als die Person im Buch?',
      'Woran erinnert dich das Gelesene aus deinem eigenen Leben?',
      'Was verstehst du jetzt besser als vor dieser Lesesession?'
    ];
    setReflectionQuestion(questions[Math.floor(Math.random() * questions.length)]);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-stone-500 dark:text-stone-400">Lädt...</div>
      </div>
    );
  }

  if (!currentBook) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] px-4 py-12 pb-32">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-light text-stone-800 dark:text-stone-200">Dein Lesekompass</h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-12 text-center mb-6"
          >
            <BookOpen className="w-16 h-16 text-amber-600 dark:text-amber-500 mx-auto mb-6" />
            <h1 className="text-2xl font-light text-stone-800 dark:text-stone-200 mb-4">
              Bereit für dein nächstes Buch?
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mb-8">
              Lass uns gemeinsam das richtige Buch für dich finden.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate('/Home')}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Empfehlung erhalten
              </Button>
              <Button
                onClick={() => setShowScanner(true)}
                variant="outline"
                className="gap-2 border-amber-300 text-amber-800"
              >
                <Camera className="w-4 h-4" />
                Buch scannen
              </Button>
            </div>
          </motion.div>

          {/* Letzte Empfehlungen auch ohne aktuelles Buch anzeigen */}
          {lastRecommendations.length > 0 && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">Letzte Empfehlungen</h3>
                <button
                  onClick={() => navigate('/Home?showLastRecommendation=true')}
                  className="text-xs text-amber-600 dark:text-amber-500 hover:underline"
                >
                  Alle ansehen
                </button>
              </div>
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
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-stone-800 dark:text-stone-200">Dein Lesekompass</h1>
        </div>

        {/* Hauptkarte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-8 shadow-sm mb-6"
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
                {currentBookIndex + 1} von {allBooks.length} Büchern
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
              <h2 className="text-xl font-medium text-stone-800 dark:text-stone-200 mb-1">
                {currentBook.book_data.title}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mb-3">{currentBook.book_data.author}</p>
              <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {progress}% gelesen
                </span>
                {streak > 0 && (
                  <span className="flex items-center gap-1">
                    🔥 {streak} {streak === 1 ? 'Tag' : 'Tage'} Streak
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
                  Dein Gedanke vom {new Date(currentReflection.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
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
                <div className="text-xs font-medium text-blue-900 dark:text-blue-400 mb-1">Heute im Fokus</div>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Lies weiter und halte fest, was dich bewegt
                </p>
              </div>
            </div>
          </div>

          {/* Reflexionsfrage */}
          <div className="mb-6 p-4 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-stone-600 dark:text-stone-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">Reflexion für später</div>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-3 leading-relaxed">
                  {reflectionQuestion}
                </p>
                <textarea
                  value={todayReflection}
                  onChange={(e) => setTodayReflection(e.target.value)}
                  placeholder="Deine Gedanken..."
                  className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none bg-white dark:bg-[#1a1a1a] text-stone-800 dark:text-stone-200"
                  rows={3}
                />
                {todayReflection.trim() && (
                  <button
                    onClick={saveReflection}
                    className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Speichern
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
            Fortschritt eintragen
          </Button>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => navigate('/Home?startQuestions=true')}
            className="p-4 bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 transition-colors text-left"
          >
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-500 mb-2" />
            <div className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-1">Entdecken</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Empfehlungen</div>
          </button>
          <button
            onClick={() => setShowScanner(true)}
            className="p-4 bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 transition-colors text-left"
          >
            <Camera className="w-5 h-5 text-amber-600 dark:text-amber-500 mb-2" />
            <div className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-1">Scannen</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Buch hinzufügen</div>
          </button>
          <button
            onClick={() => navigate('/Account?tab=library')}
            className="p-4 bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-stone-700 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 transition-colors text-left"
          >
            <BookMarked className="w-5 h-5 text-amber-600 dark:text-amber-500 mb-2" />
            <div className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-1">Bibliothek</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Alle Bücher</div>
          </button>
        </div>

        {/* Letzte Empfehlungen */}
        {lastRecommendations.length > 0 && (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">Letzte Empfehlungen</h3>
              <button
                onClick={() => navigate('/Home?showLastRecommendation=true')}
                className="text-xs text-amber-600 dark:text-amber-500 hover:underline"
              >
                Alle ansehen
              </button>
            </div>
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
          </div>
        )}
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <BookScannerModal
          onClose={() => setShowScanner(false)}
          onBookAdded={loadCompassData}
        />
      )}

      {/* Progress Modal */}
      {showProgressModal && (
        <ReadingProgressModal
          book={currentBook.book_data}
          savedBookId={currentBook.id}
          onClose={() => setShowProgressModal(false)}
          onUpdate={loadCompassData}
        />
      )}
    </div>
  );
}