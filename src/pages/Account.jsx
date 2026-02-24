import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Compass, Crown, Clock, Search, Trash2, Globe, Edit, Download, ChevronDown, ChevronRight, Camera, Bell, Lock, LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { useLanguage, LanguageProvider } from '@/components/language/LanguageContext';
import ProfileEditModal from '@/components/profile/ProfileEditModal';
import NotificationBell from '@/components/notifications/NotificationBell';
import GlobalSearch from '@/components/search/GlobalSearch';
import DarkModeToggle from '@/components/settings/DarkModeToggle';
import ReadingJourneyTeaser from '@/components/premium/ReadingJourneyTeaser';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

function AccountContent() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [readingLogs, setReadingLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const navigate = useNavigate();
  const { language, changeLanguage, supportedLanguages } = useLanguage();

  useEffect(() => { loadAccountData(); }, []);

  const loadAccountData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      const [recs, books, logs] = await Promise.all([
        base44.entities.Recommendation.list('-created_date'),
        base44.entities.SavedBook.list('-created_date'),
        base44.entities.ReadingLog.list('-reading_date'),
      ]);
      setRecommendations(recs);
      setSavedBooks(books);
      setReadingLogs(logs);
    } catch {
      base44.auth.redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.auth.updateMe({ profile_picture_url: file_url });
    setUser(prev => ({ ...prev, profile_picture_url: file_url }));
    setUploadingPhoto(false);
  };

  const handleDeleteRecommendation = async (recId) => {
    if (confirm('Möchtest du diese Empfehlung wirklich löschen?')) {
      await base44.entities.Recommendation.delete(recId);
      setRecommendations(recommendations.filter(r => r.id !== recId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <div className="text-stone-500">Lädt...</div>
      </div>
    );
  }

  const isPremium = user?.is_premium || user?.role === 'admin';
  const freeLimit = 3;
  const completedBooks = savedBooks.filter(b => b.is_completed);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] px-4 py-6 md:px-6 md:py-10">
      <div className="max-w-2xl mx-auto">

        {/* Top bar */}
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowGlobalSearch(true)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            </button>
            <NotificationBell />
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden mb-4 shadow-sm">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="relative flex-shrink-0">
                <label className="cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-2xl font-light shadow-lg overflow-hidden">
                    {user.profile_picture_url ? (
                      <img src={user.profile_picture_url} alt="Profilbild" className="w-full h-full object-cover" />
                    ) : (
                      user.full_name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploadingPhoto ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                </label>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold text-stone-800 dark:text-stone-100 truncate">{user.full_name}</h1>
                <p className="text-stone-500 dark:text-stone-400 text-sm truncate">
                  @{user.username || user.email?.split('@')[0]}
                </p>
                {user.bio && (
                  <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 line-clamp-2">{user.bio}</p>
                )}
                {user.favorite_genres?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.favorite_genres.slice(0, 3).map((g, i) => (
                      <span key={i} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{g}</span>
                    ))}
                    {user.favorite_genres.length > 3 && (
                      <span className="text-xs text-stone-500">+{user.favorite_genres.length - 3}</span>
                    )}
                  </div>
                )}
                {isPremium && (
                  <span className="inline-flex items-center gap-1 bg-amber-600 text-white px-2.5 py-0.5 rounded-full text-xs font-medium mt-2">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
            </div>

            {/* Profil bearbeiten */}
            <button
              onClick={() => setShowProfileEdit(true)}
              className="w-full flex items-center justify-between p-3.5 border border-stone-200 dark:border-stone-600 rounded-xl hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Edit className="w-4 h-4 text-amber-600" />
                <div className="text-left">
                  <div className="text-sm font-medium text-stone-800 dark:text-stone-200">Profil bearbeiten</div>
                  <div className="text-xs text-stone-500">Name, Bio, Genres anpassen</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {!isPremium && (
              <Button
                onClick={() => navigate('/Premium')}
                className="w-full mt-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white gap-2"
              >
                <Crown className="w-4 h-4" /> Auf Premium upgraden
              </Button>
            )}
          </div>
        </div>

        {/* Premium Teaser */}
        {!isPremium && completedBooks.length >= 2 && (
          <div className="mb-4">
            <ReadingJourneyTeaser completedBooksCount={completedBooks.length} recentBooks={completedBooks.slice(0, 3)} />
          </div>
        )}

        {/* Collapsible: Empfehlungsverlauf */}
        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen} className="mb-3">
          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-amber-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-stone-800 dark:text-stone-200">Empfehlungsverlauf</span>
              <span className="text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">{recommendations.length}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${historyOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-white dark:bg-[#1a1a1a] border border-t-0 border-stone-200 dark:border-stone-700 rounded-b-2xl p-4 space-y-3">
              {recommendations.length === 0 ? (
                <div className="text-center py-6">
                  <Compass className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 text-sm">Noch keine Empfehlungen erhalten</p>
                  <Button onClick={() => navigate('/Compass')} size="sm" className="mt-3 bg-stone-800 hover:bg-stone-700 text-white">
                    Erste Empfehlung erhalten
                  </Button>
                </div>
              ) : (
                <>
                  {recommendations.slice(0, isPremium ? undefined : freeLimit).map((rec) => (
                    <div key={rec.id} className="border border-stone-200 dark:border-stone-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(rec.created_date), { addSuffix: true, locale: de })}
                        </span>
                        <button onClick={() => handleDeleteRecommendation(rec.id)} className="text-red-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rec.books?.slice(0, 3).map((book, i) => (
                          <span key={i} className="bg-stone-50 dark:bg-stone-800 px-3 py-1 rounded-full text-xs text-stone-700 dark:text-stone-300">{book.title}</span>
                        ))}
                        {rec.books?.length > 3 && (
                          <span className="bg-stone-100 dark:bg-stone-700 px-3 py-1 rounded-full text-xs text-stone-500">+{rec.books.length - 3} weitere</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {!isPremium && recommendations.length > freeLimit && (
                    <div className="border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-xl p-4 text-center">
                      <p className="text-stone-500 text-sm mb-2">{recommendations.length - freeLimit} weitere verfügbar</p>
                      <Button onClick={() => navigate('/Premium')} size="sm" variant="outline" className="gap-1">
                        <Crown className="w-3 h-3" /> Mit Premium anzeigen
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Collapsible: Einstellungen */}
        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen} className="mb-6">
          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-amber-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-stone-800 dark:text-stone-200">Einstellungen</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-white dark:bg-[#1a1a1a] border border-t-0 border-stone-200 dark:border-stone-700 rounded-b-2xl p-4 space-y-3">

              {/* Sprache */}
              <div className="flex items-center justify-between p-3 border border-stone-200 dark:border-stone-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-stone-500" />
                  <div>
                    <div className="text-sm font-medium text-stone-800 dark:text-stone-200">Sprache</div>
                    <div className="text-xs text-stone-500">App-Sprache ändern</div>
                  </div>
                </div>
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="appearance-none bg-stone-50 dark:bg-[#262626] border border-stone-300 dark:border-stone-600 rounded-lg px-3 py-2 text-sm text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                  ))}
                </select>
              </div>

              {/* Dark Mode */}
              <DarkModeToggle />

              {/* Profil öffentlich */}
              <div className="flex items-center justify-between p-3 border border-stone-200 dark:border-stone-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-stone-500" />
                  <div>
                    <div className="text-sm font-medium text-stone-800 dark:text-stone-200">Profil öffentlich</div>
                    <div className="text-xs text-stone-500">Andere Nutzer können dein Profil sehen</div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const newVal = !user.profile_is_public;
                    await base44.auth.updateMe({ profile_is_public: newVal });
                    setUser(prev => ({ ...prev, profile_is_public: newVal }));
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${user.profile_is_public !== false ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-600'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${user.profile_is_public !== false ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Benachrichtigungen */}
              <div className="p-3 border border-stone-200 dark:border-stone-700 rounded-xl space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-4 h-4 text-stone-500" />
                  <span className="text-sm font-medium text-stone-800 dark:text-stone-200">Benachrichtigungen</span>
                </div>
                {[
                  { key: 'notification_comments', label: 'Kommentare' },
                  { key: 'notification_likes', label: 'Likes' },
                  { key: 'notification_messages', label: 'Nachrichten' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-stone-600 dark:text-stone-400">{label}</span>
                    <button
                      onClick={async () => {
                        const newVal = !(user[key] !== false);
                        await base44.auth.updateMe({ [key]: newVal });
                        setUser(prev => ({ ...prev, [key]: newVal }));
                      }}
                      className={`w-10 h-5 rounded-full transition-colors relative ${user[key] !== false ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-600'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${user[key] !== false ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Daten exportieren */}
              <button
                onClick={async () => {
                  if (confirm('Möchtest du alle deine Daten exportieren?')) {
                    const data = { user, savedBooks, readingLogs, recommendations };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `book-compass-export-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }
                }}
                className="w-full flex items-center gap-3 p-3 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-left"
              >
                <Download className="w-4 h-4 text-stone-500" />
                <div>
                  <div className="text-sm font-medium text-stone-800 dark:text-stone-200">Daten exportieren</div>
                  <div className="text-xs text-stone-500">Alle deine Daten herunterladen</div>
                </div>
              </button>

              {/* Abmelden */}
              <button
                onClick={() => base44.auth.logout()}
                className="w-full flex items-center gap-3 p-3 border border-red-200 dark:border-red-900 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <div className="text-sm font-medium text-red-500">Abmelden</div>
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Bottom actions */}
        <div className="space-y-3">
          <Button onClick={() => navigate('/Home')} className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2">
            <Compass className="w-4 h-4" /> Zur Startseite
          </Button>
          <div className="text-center">
            <button onClick={() => navigate('/Legal')} className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
              Rechtliche Hinweise
            </button>
          </div>
        </div>
      </div>

      {showProfileEdit && (
        <ProfileEditModal user={user} onClose={() => setShowProfileEdit(false)} onUpdate={loadAccountData} />
      )}

      <AnimatePresence>
        {showGlobalSearch && <GlobalSearch onClose={() => setShowGlobalSearch(false)} />}
      </AnimatePresence>
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