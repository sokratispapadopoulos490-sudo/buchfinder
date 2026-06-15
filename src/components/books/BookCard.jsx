import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingCart, Bookmark, BookmarkCheck, MessageSquare, Info } from 'lucide-react';
import { cn } from "@/lib/utils";
import { base44 } from '@/api/base44Client';
import StarRating from './StarRating';
import BookDetailModal from './BookDetailModal';
import BookCover, { getCoverUrl } from './BookCover';
import ProviderLinks from './ProviderLinks';
import { useLanguage } from '@/components/language/LanguageContext';

export default function BookCard({ book, reasons, index, isContrast, isAuthenticated: isAuthProp }) {
  const { shoppingRegion } = useLanguage();
  const [showBuyOptions, setShowBuyOptions] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  // Use prop if provided (avoids N concurrent isAuthenticated() calls on results page)
  const [isAuthenticated, setIsAuthenticated] = useState(isAuthProp ?? false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [savedBookId, setSavedBookId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editingReview, setEditingReview] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, [book.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkIfSaved = async () => {
    try {
      // Only call isAuthenticated() if prop not provided
      const isAuth = isAuthProp !== undefined ? isAuthProp : await base44.auth.isAuthenticated();
      if (isAuthProp === undefined) setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const saved = await base44.entities.SavedBook.filter({ book_id: book.id });
        if (saved.length > 0) {
          setIsSaved(true);
          setSavedBookId(saved[0].id);
          setNotes(saved[0].notes || '');
          setRating(saved[0].rating || 0);
          setComment(saved[0].comment || '');
        }
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveBook = async () => {
    if (!isAuthenticated) {
      base44.auth.redirectToLogin();
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        if (savedBookId) {
          await base44.entities.SavedBook.delete(savedBookId);
          setIsSaved(false);
          setSavedBookId(null);
          setNotes('');
        }
      } else {
        // Strip providerLinks from book_data — they are region-specific and must be generated fresh
        // from shoppingRegion at display time. Storing them would permanently bake the wrong region.
        const { providerLinks: _strip, ...bookDataClean } = book;
        const created = await base44.entities.SavedBook.create({
          book_id: book.id,
          book_data: bookDataClean,
          recommendation_reason: reasons,
          notes: notes,
          rating: rating,
          comment: comment
        });
        setIsSaved(true);
        setSavedBookId(created.id);
      }
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!savedBookId) return;
    
    try {
      await base44.entities.SavedBook.update(savedBookId, { notes });
      setEditingNotes(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const handleSaveReview = async () => {
    if (!savedBookId) return;
    
    try {
      await base44.entities.SavedBook.update(savedBookId, { rating, comment });
      setEditingReview(false);
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={cn(
        "bg-white dark:bg-[#1a1a1a] rounded-2xl border overflow-hidden",
        isContrast ? "border-amber-200 dark:border-amber-800" : "border-stone-200 dark:border-stone-700"
      )}
    >
      {isContrast && (
        <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-3 border-b border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Horizont-Erweiterung</span>
          </div>
        </div>
      )}
      
      <div className="p-6 md:p-8">
        <div className="flex gap-6">
          {/* Book cover - clickable */}
          <button
            onClick={() => setShowDetailModal(true)}
            className="group relative flex-shrink-0"
          >
            <BookCover
              bookData={book}
              width="w-24 md:w-28"
              height="h-36"
              textSize="text-3xl md:text-4xl"
              className="shadow-md transition-transform group-hover:scale-105 group-hover:shadow-xl"
              placeholderClassName="shadow-md transition-transform group-hover:scale-105 group-hover:shadow-xl"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
              <Info className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>

          {/* Book info */}
          <div className="flex-1 min-w-0">
            <button
              onClick={() => setShowDetailModal(true)}
              className="text-left w-full group"
            >
              <h3 className="text-xl md:text-2xl font-light text-stone-800 dark:text-stone-100 mb-1 leading-tight group-hover:text-amber-700 transition-colors">
                {book.title}
              </h3>
            </button>
            <p className="text-stone-600 dark:text-stone-300 text-sm mb-2">
              {book.author || (book.authors || []).join(', ') || 'Unbekannter Autor'}
            </p>
            
            {/* Buchdetails */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500 dark:text-stone-400 mb-3">
              {(book.publishYear || book.published_date) && <span>{book.publishYear || String(book.published_date).slice(0, 4)}</span>}
              {(book.pageCount || book.page_count) && <span>• {book.pageCount || book.page_count} Seiten</span>}
              {book.publisher && <span>• {book.publisher}</span>}
              {book.language && book.language !== 'de' && <span>• {book.language.toUpperCase()}</span>}
            </div>

            {book.description && (
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed line-clamp-3">
                {book.description}
              </p>
            )}
          </div>
        </div>

        {/* Why this book */}
        <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-700">
          {(() => {
            const desc = (book.description || '').trim().slice(0, 80).toLowerCase();
            const main = (reasons.mainReason || '').trim().slice(0, 80).toLowerCase();
            const showMainReason = main && main !== desc && !desc.includes(main.slice(0, 40));
            return showMainReason ? (
              <p className="text-stone-700 dark:text-stone-200 text-sm font-medium mb-3 leading-snug">
                {reasons.mainReason}
              </p>
            ) : null;
          })()}

          <ul className="flex flex-wrap gap-2 mb-5">
            {reasons.bullets.filter(Boolean).slice(0, 2).map((bullet, i) => (
              <li key={i} className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800 px-2.5 py-1.5 rounded-full border border-stone-100 dark:border-stone-700">
                <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            {isSaved && (
              <>
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Meine Bewertung</label>
                    {!editingReview ? (
                      <button
                        onClick={() => setEditingReview(true)}
                        className="text-xs text-amber-600 hover:text-amber-700"
                      >
                        Bearbeiten
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveReview}
                        className="text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        Speichern
                      </button>
                    )}
                  </div>

                  <div>
                    <StarRating 
                      rating={rating} 
                      onRatingChange={setRating}
                      editable={editingReview}
                      size="md"
                    />
                  </div>

                  {editingReview ? (
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Was hat dir gefallen oder nicht gefallen?"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                      rows={3}
                    />
                  ) : comment ? (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-stone-600">{comment}</p>
                    </div>
                  ) : null}
                </div>

                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Meine Notizen</label>
                    {!editingNotes ? (
                      <button
                        onClick={() => setEditingNotes(true)}
                        className="text-xs text-amber-600 hover:text-amber-700"
                      >
                        Bearbeiten
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveNotes}
                        className="text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        Speichern
                      </button>
                    )}
                  </div>
                  {editingNotes ? (
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Z.B. Seite 42 ist interessant..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-stone-600">
                      {notes || 'Noch keine Notizen hinzugefügt'}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSaveBook}
                disabled={saving}
                variant={isSaved ? "default" : "outline"}
                className={cn(
                  "flex-1 gap-2",
                  isSaved && "bg-amber-600 hover:bg-amber-700 text-white"
                )}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    Gespeichert
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    Speichern
                  </>
                )}
              </Button>

              <Button 
                onClick={() => setShowBuyOptions(!showBuyOptions)}
                className="flex-1 gap-2 bg-stone-800 hover:bg-stone-700 dark:bg-amber-600 dark:hover:bg-amber-700 dark:text-white"
              >
                <ShoppingCart className="w-4 h-4" />
                Kaufen
              </Button>
            </div>

            {showBuyOptions && (
              <ProviderLinks book={book} shoppingRegion={shoppingRegion} className="mt-1" />
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <BookDetailModal
          book={book}

          onClose={() => setShowDetailModal(false)}
        />
      )}
    </motion.div>
  );
}