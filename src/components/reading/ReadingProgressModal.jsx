import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, BookOpen, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ReadingProgressModal({ book, savedBookId, onClose, onUpdate }) {
  const [pagesRead, setPagesRead] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [markAsCompleted, setMarkAsCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pagesRead || pagesRead <= 0) return;

    setSaving(true);
    try {
      // Speichere Lesefortschritt
      await base44.entities.ReadingLog.create({
        book_id: book.id,
        saved_book_id: savedBookId,
        pages_read: parseInt(pagesRead),
        reading_date: new Date().toISOString().split('T')[0],
        notes: sessionNotes
      });

      // Wenn als abgeschlossen markiert
      if (markAsCompleted) {
        await base44.entities.SavedBook.update(savedBookId, {
          is_completed: true,
          completed_date: new Date().toISOString().split('T')[0]
        });
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error saving reading progress:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-light text-stone-800 mb-1">Lesefortschritt</h3>
              <p className="text-sm text-stone-500">{book.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Gelesene Seiten heute
              </label>
              <input
                type="number"
                min="1"
                value={pagesRead}
                onChange={(e) => setPagesRead(e.target.value)}
                placeholder="z.B. 25"
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Notizen (optional)
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Was hast du gelesen? Wie fandest du es?"
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <input
                type="checkbox"
                id="completed"
                checked={markAsCompleted}
                onChange={(e) => setMarkAsCompleted(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="completed" className="flex items-center gap-2 text-sm text-green-800 cursor-pointer">
                <CheckCircle className="w-4 h-4" />
                Buch als abgeschlossen markieren
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={saving || !pagesRead}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {saving ? 'Speichert...' : 'Speichern'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}