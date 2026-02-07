import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Sparkles } from 'lucide-react';

export default function CreatePostModal({ onClose, onCreate, savedBooks }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('allgemein');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    const selectedBook = savedBooks.find(b => b.book_id === parseInt(selectedBookId));
    
    await onCreate({
      title: title.trim(),
      content: content.trim(),
      category,
      book_id: selectedBookId ? parseInt(selectedBookId) : undefined,
      book_title: selectedBook?.book_data?.title || undefined
    });
    
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-medium text-stone-800">Neuer Post</h2>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Kategorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="allgemein">Allgemein</option>
                <option value="buchempfehlung">Buchempfehlung</option>
                <option value="diskussion">Diskussion</option>
                <option value="frage">Frage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Titel
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Worum geht es?"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Inhalt
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Teile deine Gedanken..."
                rows={6}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                required
              />
            </div>

            {savedBooks?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Buch verknüpfen (optional)
                </label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Kein Buch</option>
                  {savedBooks.map((book) => (
                    <option key={book.book_id} value={book.book_id}>
                      {book.book_data.title} - {book.book_data.author}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {loading ? 'Wird veröffentlicht...' : 'Veröffentlichen'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}