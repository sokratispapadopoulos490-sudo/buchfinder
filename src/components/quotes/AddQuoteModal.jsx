import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Quote, BookOpen, Globe, Lock } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function AddQuoteModal({ quote, savedBooks, onClose, onSave }) {
  const [selectedBook, setSelectedBook] = useState(quote?.book_data || null);
  const [quoteText, setQuoteText] = useState(quote?.quote_text || '');
  const [pageNumber, setPageNumber] = useState(quote?.page_number || '');
  const [notes, setNotes] = useState(quote?.notes || '');
  const [isPublic, setIsPublic] = useState(quote?.is_public || false);
  const [tags, setTags] = useState(quote?.tags?.join(', ') || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedBook || !quoteText) return;

    setSubmitting(true);
    try {
      await onSave({
        book_data: selectedBook,
        quote_text: quoteText,
        page_number: pageNumber ? parseInt(pageNumber) : null,
        notes: notes || null,
        is_public: isPublic,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
      });
    } catch (error) {
      console.error('Error saving quote:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <Quote className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-light text-stone-800">
              {quote ? 'Zitat bearbeiten' : 'Neues Zitat'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Book Selection */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Buch *
            </label>
            {selectedBook ? (
              <div className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg">
                <div className={cn(
                  "w-12 h-16 rounded flex items-center justify-center flex-shrink-0",
                  selectedBook.coverColor || 'bg-stone-100'
                )}>
                  <span className="text-xl font-serif text-stone-400">
                    {selectedBook.title.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-stone-800 truncate">{selectedBook.title}</div>
                  <div className="text-sm text-stone-600 truncate">{selectedBook.author}</div>
                </div>
                <Button
                  onClick={() => setSelectedBook(null)}
                  size="sm"
                  variant="outline"
                >
                  Ändern
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto border border-stone-200 rounded-lg p-2">
                {savedBooks.length === 0 ? (
                  <p className="text-sm text-stone-500 text-center py-4">
                    Keine Bücher in deiner Bibliothek
                  </p>
                ) : (
                  savedBooks.map((saved) => (
                    <button
                      key={saved.id}
                      onClick={() => setSelectedBook(saved.book_data)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-stone-50 rounded-lg transition-colors text-left"
                    >
                      <div className={cn(
                        "w-10 h-14 rounded flex items-center justify-center flex-shrink-0",
                        saved.book_data.coverColor || 'bg-stone-100'
                      )}>
                        <span className="text-lg font-serif text-stone-400">
                          {saved.book_data.title.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-800 text-sm truncate">
                          {saved.book_data.title}
                        </div>
                        <div className="text-xs text-stone-600 truncate">
                          {saved.book_data.author}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quote Text */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Zitat *
            </label>
            <textarea
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              placeholder="Gib hier dein Lieblingszitat ein..."
              className="w-full px-4 py-3 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={4}
            />
          </div>

          {/* Page Number */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Seitenzahl (optional)
            </label>
            <input
              type="number"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              placeholder="z.B. 42"
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Notizen (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Warum ist dieses Zitat besonders?"
              className="w-full px-4 py-3 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="z.B. inspirierend, lustig, nachdenklich"
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-xs text-stone-500 mt-1">Tags mit Komma trennen</p>
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Sichtbarkeit
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPublic(false)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  !isPublic
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <Lock className={`w-6 h-6 mx-auto mb-2 ${!isPublic ? 'text-amber-600' : 'text-stone-400'}`} />
                <div className="text-sm font-medium text-stone-800">Privat</div>
                <div className="text-xs text-stone-500">Nur für dich</div>
              </button>
              <button
                onClick={() => setIsPublic(true)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  isPublic
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <Globe className={`w-6 h-6 mx-auto mb-2 ${isPublic ? 'text-amber-600' : 'text-stone-400'}`} />
                <div className="text-sm font-medium text-stone-800">Öffentlich</div>
                <div className="text-xs text-stone-500">In der Community sichtbar</div>
              </button>
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
            disabled={!selectedBook || !quoteText || submitting}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            {submitting ? 'Wird gespeichert...' : (quote ? 'Aktualisieren' : 'Speichern')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}