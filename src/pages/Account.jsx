import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Compass, Crown, ArrowRight, Sparkles, Clock, User as UserIcon, Bookmark, Search, Trash2, MessageSquare, TrendingUp, Plus, CheckCircle, Library as LibraryIcon, Settings as SettingsIcon, Globe, Users, Edit, Target, Mail, Award, List, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import BookCard from '@/components/books/BookCard';
import StarRating from '@/components/books/StarRating';
import WeeklyStats from '@/components/reading/WeeklyStats';
import ReadingProgressModal from '@/components/reading/ReadingProgressModal';
import { useLanguage, LanguageProvider } from '@/components/language/LanguageContext';
import ProfileEditModal from '@/components/profile/ProfileEditModal';
import NotificationBell from '@/components/notifications/NotificationBell';
import ConversationList from '@/components/messages/ConversationList';
import ChatWindow from '@/components/messages/ChatWindow';
import NewMessageModal from '@/components/messages/NewMessageModal';
import YearlyStats from '@/components/stats/YearlyStats';
import ReadingStreak from '@/components/stats/ReadingStreak';
import GlobalSearch from '@/components/search/GlobalSearch';
import DarkModeToggle from '@/components/settings/DarkModeToggle';

function AccountContent() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [readingLogs, setReadingLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookForProgress, setSelectedBookForProgress] = useState(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const navigate = useNavigate();
  const { language, changeLanguage, supportedLanguages } = useLanguage();

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

  const isPremium = user?.is_premium || user?.role === 'admin';
  const freeLimit = 3;
  const usedRecommendations = recommendations.length;

  const completedBooks = savedBooks.filter(book => book.is_completed);
  const inProgressBooks = savedBooks.filter(book => !book.is_completed);

  const calculateReadingProgress = (bookId) => {
    const bookLogs = readingLogs.filter(log => log.book_id === bookId);
    const totalPagesRead = bookLogs.reduce((sum, log) => sum + log.pages_read, 0);
    const totalBookPages = savedBooks.find(b => b.book_id === bookId)?.book_data?.pageCount || 1;
    return Math.min(100, Math.round((totalPagesRead / totalBookPages) * 100));
  };

  const filteredLibraryBooks = savedBooks.filter(book =>
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

  const handleDeleteSavedBook = async (savedBookId) => {
    if (confirm('Möchtest du dieses Buch wirklich aus deiner Bibliothek entfernen?')) {
      try {
        await base44.entities.SavedBook.delete(savedBookId);
        await loadAccountData();
      } catch (error) {
        console.error('Error deleting saved book:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 px-4 py-6 md:px-6 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-stone-500 hover:text-stone-700 transition-colors"
          >
            ← Zurück
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGlobalSearch(true)}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              title="Suchen"
            >
              <Search className="w-5 h-5 text-stone-600" />
            </button>
            <NotificationBell />
          </div>
        </div>

        {/* Header mit Premium Status */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden mb-8 shadow-sm">
          {/* Gradient Header */}
          <div className="bg-gradient-to-br from-amber-50 to-stone-50 p-6 border-b border-stone-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-2xl font-light shadow-lg flex-shrink-0">
                {user.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h1 className="text-xl font-medium text-stone-800 truncate">{user.full_name}</h1>
                  <button
                    onClick={() => setShowProfileEdit(true)}
                    className="text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-stone-500 text-sm truncate">{user.email}</p>
                {user.bio && (
                  <p className="text-stone-600 text-sm mt-2 line-clamp-2">{user.bio}</p>
                )}
                {user.favorite_genres && user.favorite_genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.favorite_genres.slice(0, 3).map((genre, i) => (
                      <span key={i} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        {genre}
                      </span>
                    ))}
                    {user.favorite_genres.length > 3 && (
                      <span className="text-xs text-stone-500">+{user.favorite_genres.length - 3}</span>
                    )}
                  </div>
                )}
                {isPremium && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                      <Crown className="w-3 h-3" />
                      Premium
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {!isPremium && (
              <Button
                onClick={() => navigate('/Premium')}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white gap-2 shadow-lg"
              >
                <Crown className="w-4 h-4" />
                Auf Premium upgraden
              </Button>
            )}
          </div>

          {/* Nutzungsstatistik */}
          <div className="grid grid-cols-3 gap-3 p-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <Compass className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-xl font-semibold text-stone-800 mb-0.5">
                {isPremium ? usedRecommendations : `${usedRecommendations}/${freeLimit}`}
              </div>
              <div className="text-xs text-stone-500 leading-tight">
                {isPremium ? 'Empfehlungen' : 'von 3'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-xl font-semibold text-stone-800 mb-0.5">{savedBooks.length}</div>
              <div className="text-xs text-stone-500 leading-tight">
                {completedBooksCount > 0 ? `${completedBooksCount} fertig` : 'Bücher'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-xl font-semibold text-stone-800 mb-0.5">
                {readingLogs
                  .filter(log => {
                    const logDate = new Date(log.reading_date);
                    const now = new Date();
                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1));
                    return logDate >= weekStart;
                  })
                  .reduce((sum, log) => sum + log.pages_read, 0)}
                {user.reading_goal_pages > 0 && `/${user.reading_goal_pages}`}
              </div>
              <div className="text-xs text-stone-500 leading-tight">
                {user.reading_goal_pages > 0 ? 'Ziel/Woche' : 'Seiten/Woche'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-stone-200 p-1.5 mb-8 flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Übersicht
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'library'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Bibliothek
          </button>
          <button
            onClick={() => setActiveTab('reading')}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'reading'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Fortschritt
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Verlauf
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Einstellungen
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'messages'
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Nachrichten
          </button>
        </div>

        {/* Übersicht Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <YearlyStats savedBooks={savedBooks} readingLogs={readingLogs} />
              <ReadingStreak readingLogs={readingLogs} />
            </div>

            {/* Schnellzugriff */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-lg font-medium text-stone-800 mb-4">Schnellzugriff</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex flex-col items-center justify-center p-4 border border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
                >
                  <Compass className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-xs font-medium text-stone-800 text-center">Neue Empfehlung</span>
                </button>

                <button
                  onClick={() => setActiveTab('library')}
                  className="flex flex-col items-center justify-center p-4 border border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
                >
                  <LibraryIcon className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-xs font-medium text-stone-800 text-center">Bibliothek</span>
                </button>

                <button
                  onClick={() => navigate('/Community')}
                  className="flex flex-col items-center justify-center p-4 border border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
                >
                  <Users className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-xs font-medium text-stone-800 text-center">Community</span>
                </button>

                <button
                  onClick={() => navigate('/Clubs')}
                  className="flex flex-col items-center justify-center p-4 border border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
                >
                  <Users className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-xs font-medium text-stone-800 text-center">Clubs</span>
                </button>

                <button
                  onClick={() => navigate('/Challenges')}
                  className="flex flex-col items-center justify-center p-4 border border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
                >
                  <Target className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-xs font-medium text-stone-800 text-center">Challenges</span>
                </button>

                <button
                  onClick={() => navigate('/Quotes')}
                  className="flex flex-col items-center justify-center p-4 border border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
                >
                  <MessageSquare className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-xs font-medium text-stone-800 text-center">Zitate</span>
                </button>

                <button
                  onClick={() => setActiveTab('reading')}
                  className="flex flex-col items-center justify-center p-4 border border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
                >
                  <TrendingUp className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-xs font-medium text-stone-800 text-center">Fortschritt</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className="flex flex-col items-center justify-center p-4 border border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
                >
                  <Mail className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-xs font-medium text-stone-800 text-center">Nachrichten</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bibliothek Tab */}
        {activeTab === 'library' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light text-stone-800">Deine Bibliothek</h2>
            </div>

            {savedBooks.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Bücher durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
            )}

            {filteredLibraryBooks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                <LibraryIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 mb-4">Noch keine Bücher in deiner Bibliothek</p>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-stone-800 hover:bg-stone-700 text-white"
                >
                  Bücher entdecken
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {inProgressBooks.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h3 className="text-lg font-medium text-stone-800 mb-4">
                      Aktuell im Lesen ({inProgressBooks.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {inProgressBooks.map((saved) => (
                        <div key={saved.id} className="relative group border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-colors">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`w-12 h-16 rounded ${saved.book_data.coverColor || 'bg-stone-100'} flex items-center justify-center flex-shrink-0`}>
                              <span className="text-xl font-serif text-stone-400">
                                {saved.book_data.title.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-stone-800 text-sm truncate">{saved.book_data.title}</h4>
                              <p className="text-xs text-stone-500 truncate">{saved.book_data.author}</p>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-stone-500 mb-1">
                              <span>Fortschritt</span>
                              <span>{calculateReadingProgress(saved.book_id)}%</span>
                            </div>
                            <div className="w-full bg-stone-100 rounded-full h-1.5">
                              <div 
                                className="bg-amber-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${calculateReadingProgress(saved.book_id)}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => setSelectedBookForProgress({ book: saved.book_data, savedBookId: saved.id })}
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs h-8"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleToggleCompleted(saved)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs h-8"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDeleteSavedBook(saved.id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs h-8"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {completedBooks.length > 0 && (
                  <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <h3 className="text-lg font-medium text-stone-800 mb-4">
                      Abgeschlossene Bücher ({completedBooks.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {completedBooks.map((saved) => (
                        <div key={saved.id} className="relative group border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-colors">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`w-12 h-16 rounded ${saved.book_data.coverColor || 'bg-stone-100'} flex items-center justify-center flex-shrink-0`}>
                              <span className="text-xl font-serif text-stone-400">
                                {saved.book_data.title.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-stone-800 text-sm truncate">{saved.book_data.title}</h4>
                              <p className="text-xs text-stone-500 truncate">{saved.book_data.author}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-3 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            <span>Abgeschlossen</span>
                          </div>

                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleToggleCompleted(saved)}
                              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs h-8"
                            >
                              <Sparkles className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDeleteSavedBook(saved.id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs h-8"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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

        {/* Einstellungen Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8">
            <h2 className="text-xl font-light text-stone-800 mb-6">Meine Einstellungen</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-stone-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-stone-600" />
                  <div>
                    <div className="font-medium text-stone-800">Sprache</div>
                    <div className="text-sm text-stone-500">App-Sprache ändern</div>
                  </div>
                </div>
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="appearance-none bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 pr-8 text-sm text-stone-700 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <DarkModeToggle />

              <button
                onClick={async () => {
                  if (confirm('Möchtest du alle deine Daten exportieren?')) {
                    const data = {
                      user,
                      savedBooks,
                      readingLogs,
                      recommendations
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `book-compass-export-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }
                }}
                className="w-full flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-stone-600" />
                  <div>
                    <div className="font-medium text-stone-800">Daten exportieren</div>
                    <div className="text-sm text-stone-500">Alle deine Daten herunterladen</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Nachrichten Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h2 className="text-xl font-light text-stone-800">Nachrichten</h2>
              <Button
                onClick={() => setShowNewMessage(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                size="sm"
              >
                <Mail className="w-4 h-4" />
                Neue Nachricht
              </Button>
            </div>
            <div className="grid lg:grid-cols-[320px,1fr] h-[600px]">
              <ConversationList
                currentUser={user}
                onSelectConversation={setSelectedConversation}
                selectedConversationId={selectedConversation?.conversation_id}
              />
              {selectedConversation ? (
                <ChatWindow
                  conversation={selectedConversation}
                  currentUser={user}
                  onBack={() => setSelectedConversation(null)}
                />
              ) : (
                <div className="hidden lg:flex items-center justify-center bg-stone-50 text-stone-500">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <p>Wähle eine Konversation aus</p>
                  </div>
                </div>
              )}
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

        {/* Profile Edit Modal */}
        {showProfileEdit && (
          <ProfileEditModal
            user={user}
            onClose={() => setShowProfileEdit(false)}
            onUpdate={loadAccountData}
          />
        )}

        {/* New Message Modal */}
        {showNewMessage && (
          <NewMessageModal
            currentUser={user}
            onClose={() => setShowNewMessage(false)}
            onMessageSent={() => setActiveTab('messages')}
          />
        )}

        {/* Global Search */}
        <AnimatePresence>
          {showGlobalSearch && (
            <GlobalSearch onClose={() => setShowGlobalSearch(false)} />
          )}
        </AnimatePresence>

        {/* Account Actions */}
        <div className="mt-6 mb-4 space-y-2">
          <div className="text-center">
            <button
              onClick={() => navigate('/Legal')}
              className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              Rechtliche Hinweise
            </button>
          </div>
          <div className="text-center">
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
    </div>
  );
}

export default function Account() {
  return (
    <LanguageProvider>
      <AccountContent />
    </LanguageProvider>
  );
}