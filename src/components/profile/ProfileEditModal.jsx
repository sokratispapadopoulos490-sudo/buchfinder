/**
 * ProfileEditModal – Profil bearbeiten.
 * Felder: username, bio, favorite_genres, reading_goal_pages
 * Vollständig i18n.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/language/LanguageContext';

const GENRES = [
  "Fantasy", "Science-Fiction", "Thriller", "Krimi", "Romance",
  "Historisch", "Biografie", "Sachbuch", "Philosophie", "Psychologie",
  "Selbstentwicklung", "Business", "Humor", "Horror", "Mystery"
];

export default function ProfileEditModal({ user, onClose, onUpdate }) {
  const { t } = useLanguage();
  const [username, setUsername]           = useState(user?.username || '');
  const [bio, setBio]                     = useState(user?.bio || '');
  const [favoriteGenres, setFavoriteGenres] = useState(user?.favorite_genres || []);
  const [readingGoal, setReadingGoal]     = useState(user?.weekly_reading_goal || user?.reading_goal_pages || 0);
  const [saving, setSaving]               = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const toggleGenre = (genre) => {
    setFavoriteGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const validateUsername = (val) => {
    if (val && !/^[a-zA-Z0-9_]{2,30}$/.test(val)) {
      setUsernameError(t('profile.usernameError'));
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateUsername(username)) return;
    setSaving(true);
    try {
      await base44.auth.updateMe({
        username: username.trim() || null,
        bio,
        favorite_genres: favoriteGenres,
        weekly_reading_goal: readingGoal
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#1a1a1a] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-700"
      >
        <div className="sticky top-0 bg-white dark:bg-[#1a1a1a] border-b border-stone-200 dark:border-stone-700 p-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">{t('account.editProfile')}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              {t('profile.username')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); validateUsername(e.target.value); }}
                placeholder={t('profile.usernamePlaceholder')}
                className="w-full pl-7 pr-4 py-2.5 border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#111] text-stone-800 dark:text-stone-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                maxLength={30}
              />
            </div>
            {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
            <p className="text-xs text-stone-400 mt-1">{t('profile.usernameHint')}</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              {t('profile.bio')}
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('profile.bioPlaceholder')}
              className="w-full px-3 py-2.5 border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#111] text-stone-800 dark:text-stone-100 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={3}
              maxLength={300}
            />
            <p className="text-xs text-stone-400 mt-0.5">{bio.length}/300</p>
          </div>

          {/* Favorite Genres */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              {t('profile.favoriteGenres')} <span className="text-stone-400 font-normal">({t('profile.maxGenres')})</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    if (!favoriteGenres.includes(genre) && favoriteGenres.length >= 5) return;
                    toggleGenre(genre);
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                    favoriteGenres.includes(genre)
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:border-amber-400'
                  } ${!favoriteGenres.includes(genre) && favoriteGenres.length >= 5 ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Goal */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              {t('profile.readingGoal')}
            </label>
            <input
              type="number"
              value={readingGoal}
              onChange={(e) => setReadingGoal(parseInt(e.target.value) || 0)}
              min="0" max="1000"
              className="w-full px-3 py-2.5 border border-stone-200 dark:border-stone-600 bg-white dark:bg-[#111] text-stone-800 dark:text-stone-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-xs text-stone-400 mt-0.5">{t('profile.readingGoalHint')}</p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-[#1a1a1a] border-t border-stone-200 dark:border-stone-700 p-5 flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1 dark:border-stone-600 dark:text-stone-300">
            {t('createPost.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            {saving ? t('profile.saving') : t('btn.save')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}