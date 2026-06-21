import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Compass, Clock, Search, Trash2, Globe, Edit, Download, ChevronDown, ChevronRight, Camera, Bell, Lock, LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '@/components/language/LanguageContext';
import { SHOPPING_REGIONS } from '@/lib/providerRegistry';
import ProfileEditModal from '@/components/profile/ProfileEditModal';
import NotificationBell from '@/components/notifications/NotificationBell';
import GlobalSearch from '@/components/search/GlobalSearch';
import DarkModeToggle from '@/components/settings/DarkModeToggle';

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
  const { language, changeLanguage, shoppingRegion, changeShoppingRegion, t } = useLanguage();

  // Only languages that have full i18n translations
  const UI_LANGUAGES = [
    { code: 'de', name: 'Deutsch',    flag: '🇩🇪' },
    { code: 'en', name: 'English',    flag: '🇬🇧' },
    { code: 'el', name: 'Ελληνικά',  flag: '🇬🇷' },
    { code: 'tr', name: 'Türkçe',    flag: '🇹🇷' },
    { code: 'fr', name: 'Français',  flag: '🇫🇷' },
    { code: 'es', name: 'Español',   flag: '🇪🇸' },
    { code: 'it', name: 'Italiano',  flag: '🇮🇹' },
  ];

  useEffect(() => { loadAccountData(); }, []);

  const loadAccountData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      const [recs, books, logs] = await Promise.all([
        base44.entities.Recommendation.list('-created_date'),
        base44.entities.SavedBook.filter({ created_by: currentUser.email }, '-created_date'),
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
    if (confirm(t('account.deleteConfirm'))) {
      await base44.entities.Recommendation.delete(recId);
      setRecommendations(recommendations.filter(r => r.id !== recId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#0a0a0a]">
        <div className="text-stone-500">{t('account.loading', 'Lädt...')}</div>
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
                {user.username ? (
                  <p className="text-stone-500 dark:text-stone-400 text-sm truncate">@{user.username}</p>
                ) : (
                  <p className="text-amber-600 dark:text-amber-400 text-xs mt-0.5">
                    ⚠️ {t('account.noUsername')}
                  </p>
                )}
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
                <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-2.5 py-0.5 rounded-full text-xs font-medium mt-2">
                  {t('account.betaBadge')}
                </span>
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
                  <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{t('account.editProfile')}</div>
                  <div className="text-xs text-stone-500">{t('account.editProfileSub')}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Premium-Upgrade wird in der Beta nicht angezeigt */}
          </div>
        </div>

        {/* Premium Teaser – in Beta deaktiviert */}

        {/* Collapsible: Empfehlungsverlauf */}
        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen} className="mb-3">
          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-amber-300 transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-stone-800 dark:text-stone-200">{t('account.history')}</span>
              <span className="text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">{recommendations.length}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${historyOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-white dark:bg-[#1a1a1a] border border-t-0 border-stone-200 dark:border-stone-700 rounded-b-2xl p-4 space-y-3">
              {recommendations.length === 0 ? (
                <div className="text-center py-6">
                  <Compass className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 text-sm">{t('account.noRecommendations')}</p>
                  <Button onClick={() => navigate('/Compass')} size="sm" className="mt-3 bg-stone-800 hover:bg-stone-700 text-white">
                    {t('account.firstRecommendation')}
                  </Button>
                </div>
              ) : (
                <>
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="border border-stone-200 dark:border-stone-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(rec.created_date), { addSuffix: true })}
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
                          <span className="bg-stone-100 dark:bg-stone-700 px-3 py-1 rounded-full text-xs text-stone-500">+{rec.books.length - 3} {t('account.moreResults')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* Alle Empfehlungen in Beta sichtbar */}
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
              <span className="font-medium text-stone-800 dark:text-stone-200">{t('account.settings')}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-white dark:bg-[#1a1a1a] border border-t-0 border-stone-200 dark:border-stone-700 rounded-b-2xl p-4 space-y-3">

              {/* App-UI Sprache (ändert NICHT die Buchsprache) */}
              <div className="p-3 border border-stone-200 dark:border-stone-700 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="w-4 h-4 text-stone-500" />
                  <div>
                    <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{t('account.appLanguage')}</div>
                    <div className="text-xs text-stone-500">{t('account.appLanguageSub')}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {UI_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all text-left ${
                        language === lang.code
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300'
                          : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kaufregion */}
              <div className="p-3 border border-stone-200 dark:border-stone-700 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="w-4 h-4 text-stone-500" />
                  <div>
                    <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{t('account.shoppingRegion')}</div>
                    <div className="text-xs text-stone-500">{t('account.shoppingRegionSub')}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SHOPPING_REGIONS.map((r) => (
                    <button
                      key={r.code}
                      onClick={() => changeShoppingRegion(r.code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all text-left ${
                        shoppingRegion === r.code
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300'
                          : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600'
                      }`}
                    >
                      <span>{r.flag}</span>
                      <span>{t(r.labelKey)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Mode */}
              <DarkModeToggle />

              {/* Profil öffentlich */}
              <div className="flex items-center justify-between p-3 border border-stone-200 dark:border-stone-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-stone-500" />
                  <div>
                    <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{t('account.publicProfile')}</div>
                    <div className="text-xs text-stone-500">{t('account.publicProfileSub')}</div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const newVal = user.profile_is_public !== true;
                    await base44.auth.updateMe({ profile_is_public: newVal });
                    setUser(prev => ({ ...prev, profile_is_public: newVal }));
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative ${user.profile_is_public === true ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-600'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${user.profile_is_public === true ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Benachrichtigungen */}
              <div className="p-3 border border-stone-200 dark:border-stone-700 rounded-xl space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-4 h-4 text-stone-500" />
                  <span className="text-sm font-medium text-stone-800 dark:text-stone-200">{t('account.notifications')}</span>
                </div>
                {[
                  { key: 'notification_comments', labelKey: 'account.notif.comments' },
                  { key: 'notification_likes',    labelKey: 'account.notif.likes' },
                  { key: 'notification_messages', labelKey: 'account.notif.messages' },
                ].map(({ key, labelKey }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-stone-600 dark:text-stone-400">{t(labelKey)}</span>
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
                  if (confirm(t('account.exportConfirm'))) {
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
                  <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{t('account.exportData')}</div>
                  <div className="text-xs text-stone-500">{t('account.exportDataSub')}</div>
                </div>
              </button>

              {/* Abmelden */}
              <button
                onClick={() => base44.auth.logout()}
                className="w-full flex items-center gap-3 p-3 border border-red-200 dark:border-red-900 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <div className="text-sm font-medium text-red-500">{t('account.logout')}</div>
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Bottom actions */}
        <div className="space-y-3">
          <Button onClick={() => navigate('/Home')} className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2">
            <Compass className="w-4 h-4" /> {t('account.goHome')}
          </Button>
          <div className="text-center">
            <button onClick={() => navigate('/Legal')} className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
              {t('account.legal')}
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
  return <AccountContent />;
}