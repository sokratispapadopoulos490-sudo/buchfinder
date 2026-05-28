/**
 * LiveBookCard – Kompakte Buchkarte für Live-Suchergebnisse.
 * Schnell, mobile-first, mit Speichern & Kaufen-Funktion.
 */

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, ShoppingCart, Star, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';
import { getAffiliateLinks } from '@/lib/bookService';
import BookCover from './BookCover';

export default function LiveBookCard({ book, user }) {
  const [isSaved, setIsSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const affiliateLinks = getAffiliateLinks(book, 'DE');
  const displayAuthor = book.author || (book.authors || []).join(', ') || 'Unbekannter Autor';
  const description = book.description || '';
  const shortDesc = description.length > 160 ? description.slice(0, 160) + '…' : description;
  const hasLongDesc = description.length > 160;

  useEffect(() => {
    if (!user) return;
    const key = book.isbn13 || book.isbn10 || String(book.id);
    base44.entities.SavedBook.filter({ book_id: book.id })
      .then(saved => {
        // Try also by isbn via book_data check
        if (saved.length > 0) { setIsSaved(true); setSavedId(saved[0].id); }
      })
      .catch(() => {});
  }, [book.id, user]);

  const handleSave = async () => {
    if (!user) { base44.auth.redirectToLogin(); return; }
    setSaving(true);
    try {
      if (isSaved && savedId) {
        await base44.entities.SavedBook.delete(savedId);
        setIsSaved(false); setSavedId(null);
      } else {
        const created = await base44.entities.SavedBook.create({
          book_id: book.id || parseInt((book.isbn13 || '0').slice(-8)) || Date.now(),
          book_data: {
            title: book.title,
            author: displayAuthor,
            authors: book.authors,
            isbn: book.isbn13 || book.isbn10 || book.isbn,
            isbn13: book.isbn13,
            description: book.description,
            pageCount: book.page_count || book.pageCount,
            coverUrl: book.cover_front_url || book.coverUrl,
            coverColor: book.cover_color || book.coverColor || 'bg-amber-100',
            publisher: book.publisher,
            publishYear: book.published_date ? parseInt(book.published_date) : null,
            language: book.language,
            source: book.source || 'google_books',
          },
        });
        setIsSaved(true); setSavedId(created.id);
      }
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
      <div className="p-4">
        <div className="flex gap-4">
          {/* Cover */}
          <div className="flex-shrink-0">
            <BookCover
              bookData={{ ...book, coverUrl: book.cover_front_url || book.coverUrl }}
              width="w-16"
              height="h-24"
              textSize="text-xl"
              className="shadow-sm"
              placeholderClassName="shadow-sm"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-tight mb-0.5 line-clamp-2">
              {book.title}
              {book.subtitle && <span className="font-normal text-stone-500"> – {book.subtitle}</span>}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-1 truncate">{displayAuthor}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-stone-400 dark:text-stone-500 mb-2">
              {book.published_date && <span>{book.published_date.slice(0, 4)}</span>}
              {book.page_count && <span>· {book.page_count} S.</span>}
              {book.language && <span>· {book.language.toUpperCase()}</span>}
              {book.rating && (
                <span className="flex items-center gap-0.5 text-amber-500">
                  · <Star className="w-3 h-3 fill-current" />{book.rating.toFixed(1)}
                  {book.ratings_count && <span className="text-stone-400">({book.ratings_count.toLocaleString()})</span>}
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {expanded ? description : shortDesc}
                </p>
                {hasLongDesc && (
                  <button
                    onClick={() => setExpanded(v => !v)}
                    className="text-xs text-amber-600 dark:text-amber-500 mt-1 flex items-center gap-0.5"
                  >
                    {expanded ? <><ChevronUp className="w-3 h-3" />Weniger</> : <><ChevronDown className="w-3 h-3" />Mehr</>}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium transition-colors",
              isSaved
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            )}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {isSaved ? 'Gespeichert' : 'Speichern'}
          </button>
          <button
            onClick={() => setShowBuy(v => !v)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium bg-stone-900 dark:bg-amber-600 text-white hover:bg-stone-800 dark:hover:bg-amber-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Kaufen
          </button>
          {book.preview_link && (
            <a
              href={book.preview_link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-500 hover:border-amber-400 hover:text-amber-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Buy options */}
        {showBuy && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {Object.entries(affiliateLinks).map(([provider, url]) => (
              <a
                key={provider}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                <span className="text-sm font-medium text-stone-800 dark:text-stone-200 capitalize">{provider}</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}