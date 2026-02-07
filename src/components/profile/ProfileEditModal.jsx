import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GENRES = [
  "Fantasy", "Science-Fiction", "Thriller", "Krimi", "Romance",
  "Historisch", "Biografie", "Sachbuch", "Philosophie", "Psychologie",
  "Selbstentwicklung", "Business", "Humor", "Horror", "Mystery"
];

export default function ProfileEditModal({ user, onClose, onUpdate }) {
  const [bio, setBio] = useState(user?.bio || '');
  const [favoriteGenres, setFavoriteGenres] = useState(user?.favorite_genres || []);
  const [readingGoal, setReadingGoal] = useState(user?.reading_goal_pages || 0);
  const [saving, setSaving] = useState(false);

  const toggleGenre = (genre) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter(g => g !== genre));
    } else {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        bio,
        favorite_genres: favoriteGenres,
        reading_goal_pages: readingGoal
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
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
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-light text-stone-800">Profil bearbeiten</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Über mich
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Erzähl etwas über dich und deine Lesevorlieben..."
              className="w-full px-4 py-3 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-stone-500 mt-1">{bio.length}/500 Zeichen</p>
          </div>

          {/* Favorite Genres */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Lieblingsgenres (wähle bis zu 5)
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  disabled={!favoriteGenres.includes(genre) && favoriteGenres.length >= 5}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    favoriteGenres.includes(genre)
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Goal */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Wöchentliches Leseziel (Seiten)
            </label>
            <input
              type="number"
              value={readingGoal}
              onChange={(e) => setReadingGoal(parseInt(e.target.value) || 0)}
              min="0"
              max="1000"
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-xs text-stone-500 mt-1">Setze dir ein realistisches wöchentliches Ziel</p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-stone-200 p-6 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            {saving ? 'Wird gespeichert...' : 'Speichern'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}