import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Compass, Crown, ArrowRight, BookOpen, Sparkles, Clock, User as UserIcon, Bookmark, Search, Trash2, MessageSquare, TrendingUp, Plus, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import BookCard from '@/components/books/BookCard';
import StarRating from '@/components/books/StarRating';
import WeeklyStats from '@/components/reading/WeeklyStats';
import ReadingProgressModal from '@/components/reading/ReadingProgressModal';

export default function Account() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [readingLogs, setReadingLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookForProgress, setSelectedBookForProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const recs = await base44.entities.Recommendation.list('-created_date');
      setRecommendations(recs);

      const books = await base44.entities.SavedBook.list('-created_date');
      setSavedBooks(books);

      const logs = await base44.entities.ReadingLog.list('-reading_date');
      setReadingLogs(logs);
    } catch (error) {
      console.error('Error loading account:', error);
      base44.auth.redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Lädt...</div>
      </div>
    );
  }

  const isPremium = user?.is_premium || false;
  const freeLimit = 3;
  const usedRecommendations = recommendations.length;

  const filteredBooks = savedBooks.filter(book => 
    book.book_data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.book_data.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedBooksCount = savedBooks.filter(book => book.is_completed).length;

  const handleToggleCompleted = async (savedBook) => {
    try {
      await base44.entities.SavedBook.update(savedBook.id, {
        is_completed: !savedBook.is_completed,
        completed_date: !savedBook.is_completed ? new Date().toISOString().split('T')[0] : null
      });
      await loadAccountData();
    } catch (error) {
      console.error('Error toggling completed status:', error);
    }
  };

  const handleDeleteRecommendation = async (recId) => {
    if (confirm('Möchtest du diese Empfehlung wirklich löschen?')) {
      try {
        await base44.entities.Recommendation.delete(recId);
        setRecommendations(recommendations.filter(r => r.id !== recId));
      } catch (error) {
        console.error('Error deleting recommendation:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-stone-500 hover:text-stone-700 transition-colors"
          >
            ← Zurück zur Startseite
          </button>

          {recommendations.length > 0 && (
            <button
              onClick={() => navigate('/?showLastRecommendation=true')}
              className="text-amber-600 hover:text-amber-700 transition-colors font-medium"
            >
              Zu den Ergebnissen →
            </button>
          )}
        </div>

        {/* Header mit Premium Status */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 mb-8 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-stone-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-stone-800">{user.full_name}</h1>
                  <p className="text-stone-500 text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            {isPremium ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                <Crown className="w-4 h-4" />
                Premium Mitglied
              </div>
            ) : (
              <Button
                onClick={() => navigate('/Premium')}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white gap-2"
              >
                <Crown className="w-4 h-4" />
                Auf Premium upgraden
              </Button>
            )}
          </div>

          {/* Nutzungsstatistik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <Compass className="w-4 h-4" />
                Empfehlungen erhalten
              </div>
              <div className="text-2xl font-light text-stone-800">
                {isPremium ? (
                  <span className="flex items-center gap-2">
                    {usedRecommendations}
                    <span className="text-sm text-amber-600 font-medium">unbegrenzt</span>
                  </span>
                ) : (
                  <span>{usedRecommendations} / {freeLimit}</span>
                )}
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <Bookmark className="w-4 h-4" />
                Gespeicherte Bücher
              </div>
              <div className="text-2xl font-light text-stone-800">
                {savedBooks.length}
                {completedBooksCount > 0 && (
                  <span className="text-sm text-green-600 ml-2">
                    ({completedBooksCount} abgeschlossen)
                  </span>
                )}
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                Seiten diese Woche
              </div>
              <div className="text-2xl font-light text-stone-800">
                {readingLogs
                  .filter(log => {
                    const logDate = new Date(log.reading_date);
                    const now = new Date();
                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1));
                    return logDate >= weekStart;
                  })
                  .reduce((sum, log) => sum + log.pages_read, 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Features Info */}
        {!isPremium && usedRecommendations >= freeLimit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-light text-stone-800 mb-2">
                  Du hast alle kostenlosen Empfehlungen genutzt
                </h3>
                <p className="text-stone-600 mb-4">
                  Upgrade auf Premium für unbegrenzte Empfehlungen und exklusive Features
                </p>
                <Button
                  onClick={() => navigate('/Premium')}
                  className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                >
                  Premium freischalten
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-stone-200 p-2 mb-8 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Übersicht
          </button>
          <button
            onClick={() => setActiveTab('reading')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'reading'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Lesefortschritt
            </div>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Bookmark className="w-4 h-4" />
              Bücher ({savedBooks.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 min-w-fit px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Verlauf
          </button>
        </div>

        {/* Lesefortschritt Tab */}
        {activeTab === 'reading' && (
          <div className="space-y-6">
            <WeeklyStats readingLogs={readingLogs} completedBooksCount={completedBooksCount} />

            {savedBooks.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h2 className="text-xl font-light text-stone-800 mb-4">Schnellzugriff</h2>
                <div className="space-y-3">
                  {savedBooks.slice(0, 3).map((saved) => (
                    <div key={saved.id} className="flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:border-stone-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-14 rounded ${saved.book_data.coverColor || 'bg-stone-100'} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-xl font-serif text-stone-400">
                            {saved.book_data.title.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-stone-800">{saved.book_data.title}</div>
                          <div className="text-sm text-stone-500">{saved.book_data.author}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {saved.is_completed && (
                          <div className="text-green-600 text-xs flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                        <Button
                          onClick={() => setSelectedBookForProgress({ book: saved.book_data, savedBookId: saved.id })}
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Fortschritt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gespeicherte Bücher Tab */}
        {activeTab === 'saved' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light text-stone-800">Deine gespeicherten Bücher</h2>
              <div className="text-sm text-stone-500">{savedBooks.length} Bücher</div>
            </div>

            {savedBooks.length > 0 && (
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Bücher durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {savedBooks.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 mb-4">Noch keine Bücher gespeichert</p>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-stone-800 hover:bg-stone-700 text-white"
                >
                  Bücher entdecken
                </Button>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500">Keine Bücher gefunden</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBooks.map((saved, index) => (
                  <div key={saved.id} className="space-y-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <BookCard
                          book={saved.book_data}
                          reasons={saved.recommendation_reason}
                          index={index}
                          isContrast={false}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => setSelectedBookForProgress({ book: saved.book_data, savedBookId: saved.id })}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Fortschritt hinzufügen
                      </Button>
                      <Button
                        onClick={() => handleToggleCompleted(saved)}
                        size="sm"
                        variant={saved.is_completed ? "default" : "outline"}
                        className={saved.is_completed ? "bg-green-600 hover:bg-green-700 text-white gap-2" : "gap-2"}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {saved.is_completed ? "Abgeschlossen" : "Als abgeschlossen markieren"}
                      </Button>
                    </div>
                    
                    {/* Zeige Bewertung und Kommentar als Vorschau */}
                    {(saved.rating || saved.comment) && (
                      <div className="ml-4 pl-4 border-l-2 border-stone-200 space-y-2">
                        {saved.rating && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-500">Meine Bewertung:</span>
                            <StarRating rating={saved.rating} size="sm" />
                          </div>
                        )}
                        {saved.comment && (
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-3 h-3 text-stone-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-stone-600">{saved.comment}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Verlauf Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-stone-800">
              {isPremium ? 'Dein Empfehlungsverlauf' : 'Deine Empfehlungen'}
            </h2>
            {isPremium && (
              <div className="text-sm text-stone-500">
                {recommendations.length} gespeichert
              </div>
            )}
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <Compass className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 mb-4">Noch keine Empfehlungen erhalten</p>
              <Button
                onClick={() => navigate('/')}
                className="bg-stone-800 hover:bg-stone-700 text-white"
              >
                Erste Empfehlung erhalten
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.slice(0, isPremium ? undefined : freeLimit).map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-stone-200 rounded-xl p-6 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(rec.created_date), { addSuffix: true, locale: de })}
                    </div>
                    <div className="flex items-center gap-2">
                      {rec.is_premium && (
                        <div className="flex items-center gap-1 text-amber-600 text-xs">
                          <Crown className="w-3 h-3" />
                          Premium
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteRecommendation(rec.id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-stone-500 mb-2">Empfohlene Bücher:</div>
                      <div className="flex flex-wrap gap-2">
                        {rec.books?.slice(0, 3).map((book, i) => (
                          <div key={i} className="bg-stone-50 px-3 py-1 rounded-full text-sm text-stone-700">
                            {book.title}
                          </div>
                        ))}
                        {rec.books?.length > 3 && (
                          <div className="bg-stone-100 px-3 py-1 rounded-full text-sm text-stone-600">
                            +{rec.books.length - 3} weitere
                          </div>
                        )}
                      </div>
                    </div>

                    {rec.profile && (
                      <div>
                        <div className="text-xs text-stone-500 mb-2">Dein Profil:</div>
                        <div className="flex flex-wrap gap-2">
                          {rec.profile.mainTopics?.map((topic, i) => (
                            <div key={i} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs">
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {!isPremium && recommendations.length > freeLimit && (
                <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl p-6 text-center">
                  <p className="text-stone-600 mb-3">
                    {recommendations.length - freeLimit} weitere Empfehlungen verfügbar
                  </p>
                  <Button
                    onClick={() => navigate('/Premium')}
                    variant="outline"
                    className="gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    Mit Premium anzeigen
                  </Button>
                </div>
              )}
            </div>
          )}
          </div>
        )}

        {/* Übersicht Tab - bleibt wie vorher */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8">
            <h2 className="text-xl font-light text-stone-800 mb-6">Schnellzugriff</h2>
            <div className="grid gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:border-stone-300 hover:bg-stone-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="font-medium text-stone-800">Neue Empfehlung</div>
                    <div className="text-sm text-stone-500">Starte eine neue Büchersuche</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-400" />
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className="flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:border-stone-300 hover:bg-stone-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="font-medium text-stone-800">Gespeicherte Bücher</div>
                    <div className="text-sm text-stone-500">{savedBooks.length} Bücher markiert</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-400" />
              </button>
            </div>
          </div>
          )}

          {/* Reading Progress Modal */}
          {selectedBookForProgress && (
          <ReadingProgressModal
            book={selectedBookForProgress.book}
            savedBookId={selectedBookForProgress.savedBookId}
            onClose={() => setSelectedBookForProgress(null)}
            onUpdate={loadAccountData}
          />
          )}

          {/* Account Actions */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => base44.auth.logout()}
            variant="ghost"
            className="text-stone-500 hover:text-stone-700"
          >
            Abmelden
          </Button>
        </div>
      </div>
    </div>
  );
}