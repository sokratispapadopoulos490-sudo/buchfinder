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
import ReadingProgressModal from '@/components/reading/ReadingProgressModal';
import { useLanguage, LanguageProvider } from '@/components/language/LanguageContext';
import ProfileEditModal from '@/components/profile/ProfileEditModal';
import NotificationBell from '@/components/notifications/NotificationBell';
import ConversationList from '@/components/messages/ConversationList';
import ChatWindow from '@/components/messages/ChatWindow';
import NewMessageModal from '@/components/messages/NewMessageModal';
import GlobalSearch from '@/components/search/GlobalSearch';
import DarkModeToggle from '@/components/settings/DarkModeToggle';
import AddQuoteModal from '@/components/quotes/AddQuoteModal';
import ReadingJourneyTeaser from '@/components/premium/ReadingJourneyTeaser';
import LibraryView from '@/components/library/LibraryView';

function AccountContent() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [readingLogs, setReadingLogs] = useState([]);
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'overview';
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookForProgress, setSelectedBookForProgress] = useState(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [showAddQuote, setShowAddQuote] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
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

      const userQuotes = await base44.entities.BookQuote.list('-created_date');
      setQuotes(userQuotes);

      const myFollowing = await base44.entities.UserFollow.list('-created_date');
      const myFollowers = await base44.entities.UserFollow.filter({ following_email: currentUser.email });
      
      const allUsers = await base44.entities.User.list();
      const followingWithUsers = myFollowing.map(f => ({
        ...f,
        user: allUsers.find(u => u.email === f.following_email)
      }));
      const followersWithUsers = myFollowers.map(f => ({
        ...f,
        user: allUsers.find(u => u.email === f.created_by)
      }));
      
      setFollowing(followingWithUsers);
      setFollowers(followersWithUsers);
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
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] px-4 py-6 md:px-6 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-end mb-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGlobalSearch(true)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                title="Suchen"
              >
                <Search className="w-5 h-5 text-stone-600 dark:text-stone-400" />
              </button>
              <NotificationBell />
            </div>
          </div>

        {/* Header mit Premium Status */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden mb-8 shadow-sm">
          {/* Gradient Header */}
          <div className="bg-amber-50 dark:bg-[#1a1a1a] p-6 border-b border-stone-100 dark:border-stone-700">
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


        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-stone-200 dark:border-stone-700 p-1.5 mb-8 flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-stone-800 dark:bg-amber-600 text-white'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            Übersicht
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-stone-800 dark:bg-amber-600 text-white'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            Verlauf
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-stone-800 dark:bg-amber-600 text-white'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            Einstellungen
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'messages'
                ? 'bg-stone-800 dark:bg-amber-600 text-white'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            Nachrichten
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'following'
                ? 'bg-stone-800 dark:bg-amber-600 text-white'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            Following
          </button>
        </div>

        {/* Übersicht Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Premium Teaser */}
            {!isPremium && completedBooks.length >= 2 && (
              <ReadingJourneyTeaser 
                completedBooksCount={completedBooks.length}
                recentBooks={completedBooks.slice(0, 3)}
              />
            )}

            {/* Schnellzugriff */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-6">
              <h2 className="text-lg font-medium text-stone-800 dark:text-stone-200 mb-4">Schnellzugriff</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => navigate('/Community')}
                    className="flex flex-col items-center justify-center p-4 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
                  >
                    <Users className="w-6 h-6 text-amber-600 dark:text-amber-500 mb-2" />
                    <span className="text-xs font-medium text-stone-800 dark:text-stone-200 text-center">Community</span>
                  </button>

                  <button
                    onClick={() => navigate('/Clubs')}
                    className="flex flex-col items-center justify-center p-4 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
                  >
                    <Users className="w-6 h-6 text-amber-600 dark:text-amber-500 mb-2" />
                    <span className="text-xs font-medium text-stone-800 dark:text-stone-200 text-center">Clubs</span>
                  </button>


                </div>
            </div>
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
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 p-8">
            <h2 className="text-xl font-light text-stone-800 dark:text-stone-200 mb-6">Meine Einstellungen</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-stone-200 dark:border-stone-700 rounded-xl bg-white dark:bg-[#1a1a1a]">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-800 dark:text-stone-200">Sprache</div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">App-Sprache ändern</div>
                  </div>
                </div>
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="appearance-none bg-stone-50 dark:bg-[#262626] border border-stone-300 dark:border-stone-600 rounded-lg px-3 py-2 pr-8 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
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
                className="w-full flex items-center justify-between p-4 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-left bg-white dark:bg-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-800 dark:text-stone-200">Daten exportieren</div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">Alle deine Daten herunterladen</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-xl font-light text-stone-800 mb-4">Ich folge ({following.length})</h2>
              {following.length === 0 ? (
                <p className="text-stone-500 text-center py-8">Du folgst noch niemandem</p>
              ) : (
                <div className="space-y-3">
                  {following.map((f) => f.user && (
                    <div key={f.id} className="flex items-center justify-between p-3 border border-stone-200 rounded-lg hover:border-stone-300 transition-colors">
                      <button
                        onClick={() => navigate(`/PublicProfile?user=${f.user.email}`)}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-medium">
                          {f.user.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-stone-800">{f.user.full_name}</div>
                          <div className="text-sm text-stone-500">{f.user.email}</div>
                        </div>
                      </button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await base44.entities.UserFollow.delete(f.id);
                          await loadAccountData();
                        }}
                      >
                        Nicht mehr folgen
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-xl font-light text-stone-800 mb-4">Meine Follower ({followers.length})</h2>
              {followers.length === 0 ? (
                <p className="text-stone-500 text-center py-8">Noch keine Follower</p>
              ) : (
                <div className="space-y-3">
                  {followers.map((f) => f.user && (
                    <button
                      key={f.id}
                      onClick={() => navigate(`/PublicProfile?user=${f.user.email}`)}
                      className="w-full flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:border-stone-300 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-medium">
                        {f.user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-stone-800">{f.user.full_name}</div>
                        <div className="text-sm text-stone-500">{f.user.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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

        {/* Add Quote Modal */}
        {showAddQuote && (
          <AddQuoteModal
            quote={editingQuote}
            savedBooks={savedBooks}
            onClose={() => {
              setShowAddQuote(false);
              setEditingQuote(null);
            }}
            onSave={async (quoteData) => {
              if (editingQuote) {
                await base44.entities.BookQuote.update(editingQuote.id, quoteData);
              } else {
                await base44.entities.BookQuote.create(quoteData);
              }
              await loadAccountData();
              setShowAddQuote(false);
              setEditingQuote(null);
            }}
          />
        )}

        {/* Account Actions */}
        <div className="mt-6 mb-4 space-y-3">
          <Button
            onClick={() => navigate('/Home')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2"
          >
            <Compass className="w-4 h-4" />
            Zur Startseite
          </Button>
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