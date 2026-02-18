import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles, ShoppingCart, Bookmark, BookmarkCheck, MessageSquare, Users, Info } from 'lucide-react';
import { cn } from "@/lib/utils";
import { base44 } from '@/api/base44Client';
import StarRating from './StarRating';
import BookDetailModal from './BookDetailModal';

const generateBuyLinks = (book) => {
  const encodedTitle = encodeURIComponent(`${book.title} ${book.author}`);
  const encodedISBN = encodeURIComponent(book.isbn);
  
  return [
    {
      name: "Idealo",
      url: `https://www.idealo.de/preisvergleich/ProductCategory/18492.html?q=${encodedTitle}`,
      description: "Preisvergleich (neu & gebraucht)"
    },
    {
      name: "Amazon",
      url: `https://www.amazon.de/s?k=${encodedISBN}`,
      description: "Neu & gebraucht"
    },
    {
      name: "Thalia",
      url: `https://www.thalia.de/suche?sq=${encodedTitle}`,
      description: "Online & in Filialen"
    },
    {
      name: "medimops",
      url: `https://www.medimops.de/produkte-C0/?fcIsSearch=1&searchparam=${encodedTitle}`,
      description: "Gebrauchte Bücher"
    }
  ];
};

export default function BookCard({ book, reasons, index, isContrast }) {
  const [showBuyOptions, setShowBuyOptions] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [savedBookId, setSavedBookId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editingReview, setEditingReview] = useState(false);
  const [readCount, setReadCount] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const buyLinks = generateBuyLinks(book);

  useEffect(() => {
    checkIfSaved();
    loadReadCount();
  }, [book.id]);

  const loadReadCount = async () => {
    try {
      const allSaved = await base44.entities.SavedBook.filter({ book_id: book.id });
      setReadCount(allSaved.length);
    } catch (error) {
      console.error('Error loading read count:', error);
    }
  };

  const checkIfSaved = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      setIsAuthenticated(isAuth);
      
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
        const created = await base44.entities.SavedBook.create({
          book_id: book.id,
          book_data: book,
          recommendation_reason: reasons,
          notes: notes,
          rating: rating,
          comment: comment
        });
        setIsSaved(true);
        setSavedBookId(created.id);
        await loadReadCount();
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
        <div className="bg-amber-50 px-6 py-3 border-b border-amber-200">
          <div className="flex items-center gap-2 text-amber-700 text-sm">
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
            className="group relative"
          >
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={`Cover von ${book.title}`}
                className="w-24 h-36 md:w-28 md:h-42 rounded-lg shadow-md object-cover flex-shrink-0 transition-transform group-hover:scale-105 group-hover:shadow-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={cn(
                "w-24 h-36 md:w-28 md:h-42 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md transition-transform group-hover:scale-105",
                book.coverColor || "bg-stone-100",
                book.coverUrl && "hidden"
              )}
            >
              <span className="text-3xl md:text-4xl font-serif text-stone-400">
                {book.title.charAt(0)}
              </span>
            </div>
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
            <p className="text-stone-600 dark:text-stone-300 text-sm mb-2">{book.author}</p>
            
            {/* Buchdetails */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500 dark:text-stone-400 mb-3">
              {book.publishYear && <span>{book.publishYear}</span>}
              {book.pageCount && <span>• {book.pageCount} Seiten</span>}
              {book.publisher && <span>• {book.publisher}</span>}
            </div>

            {readCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                <Users className="w-3 h-3" />
                <span>Schon {readCount}× gelesen</span>
              </div>
            )}
            
            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>

        {/* Why this book */}
        <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-700">
          <p className="text-stone-800 dark:text-stone-100 font-medium mb-4">
            {reasons.mainReason}
          </p>
          
          <ul className="space-y-2 mb-6">
            {reasons.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            {isSaved && (
              <>
                <div className="bg-stone-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-stone-700">Meine Bewertung</label>
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

                <div className="bg-stone-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-stone-700">Meine Notizen</label>
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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {buyLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border border-stone-200 dark:border-stone-700 rounded-lg hover:border-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-stone-800 dark:text-stone-200 text-sm">{link.name}</span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{link.description}</p>
                  </a>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <BookDetailModal
          book={book}
          readCount={readCount}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </motion.div>
  );
}