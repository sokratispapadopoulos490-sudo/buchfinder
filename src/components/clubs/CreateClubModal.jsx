import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, BookOpen, Lock, Globe } from 'lucide-react';

const COVER_COLORS = [
  'bg-gradient-to-br from-amber-400 to-amber-600',
  'bg-gradient-to-br from-blue-400 to-blue-600',
  'bg-gradient-to-br from-green-400 to-green-600',
  'bg-gradient-to-br from-purple-400 to-purple-600',
  'bg-gradient-to-br from-red-400 to-red-600',
  'bg-gradient-to-br from-pink-400 to-pink-600'
];

export default function CreateClubModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [coverColor, setCoverColor] = useState(COVER_COLORS[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name) return;

    setSubmitting(true);
    try {
      await onCreate({
        name,
        description,
        is_private: isPrivate,
        cover_color: coverColor
      });
    } catch (error) {
      console.error('Error creating club:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-lg w-full"
      >
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-light text-stone-800">Club erstellen</h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Club-Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Fantasy-Fans Deutschland"
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Beschreibung
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Worum geht es in diesem Club?"
              className="w-full px-4 py-3 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Sichtbarkeit
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPrivate(false)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  !isPrivate
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <Globe className={`w-6 h-6 mx-auto mb-2 ${!isPrivate ? 'text-amber-600' : 'text-stone-400'}`} />
                <div className="text-sm font-medium text-stone-800">Öffentlich</div>
                <div className="text-xs text-stone-500">Jeder kann beitreten</div>
              </button>
              <button
                onClick={() => setIsPrivate(true)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  isPrivate
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <Lock className={`w-6 h-6 mx-auto mb-2 ${isPrivate ? 'text-amber-600' : 'text-stone-400'}`} />
                <div className="text-sm font-medium text-stone-800">Privat</div>
                <div className="text-xs text-stone-500">Nur auf Einladung</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Cover-Farbe
            </label>
            <div className="grid grid-cols-6 gap-2">
              {COVER_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setCoverColor(color)}
                  className={`w-full aspect-square rounded-lg ${color} ${
                    coverColor === color ? 'ring-2 ring-stone-800 ring-offset-2' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-stone-200 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name || submitting}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            {submitting ? 'Wird erstellt...' : 'Erstellen'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}