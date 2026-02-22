import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Book, Users } from 'lucide-react';
import { cn } from "@/lib/utils";
import BookCover from './BookCover';

export default function BookDetailModal({ book, readCount, onClose }) {
  if (!book) return null;

  const getGoogleBooksPreviewUrl = () => {
    return `https://books.google.de/books?isbn=${book.isbn}&hl=de`;
  };

  const getAmazonPreviewUrl = () => {
    return `https://www.amazon.de/dp/${book.isbn}`;
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl my-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-stone-200">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-light text-stone-800 mb-2">
                {book.title}
              </h2>
              <p className="text-stone-600">{book.author}</p>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors ml-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Cover */}
              <div className="md:col-span-1">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={`Cover von ${book.title}`}
                    className="w-full rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={cn(
                    "w-full aspect-[2/3] rounded-lg flex items-center justify-center shadow-lg",
                    book.coverColor || "bg-stone-100",
                    book.coverUrl && "hidden"
                  )}
                >
                  <span className="text-6xl font-serif text-stone-400">
                    {book.title.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-stone-500 mb-2">Beschreibung</h3>
                  <p className="text-stone-700 leading-relaxed">{book.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-stone-500 mb-1">Autor</h3>
                    <p className="text-stone-700">{book.author}</p>
                  </div>
                  {book.publishYear && (
                    <div>
                      <h3 className="text-sm font-medium text-stone-500 mb-1">Erscheinungsjahr</h3>
                      <p className="text-stone-700">{book.publishYear}</p>
                    </div>
                  )}
                  {book.pageCount && (
                    <div>
                      <h3 className="text-sm font-medium text-stone-500 mb-1">Seitenzahl</h3>
                      <p className="text-stone-700">{book.pageCount} Seiten</p>
                    </div>
                  )}
                  {book.publisher && (
                    <div>
                      <h3 className="text-sm font-medium text-stone-500 mb-1">Verlag</h3>
                      <p className="text-stone-700">{book.publisher}</p>
                    </div>
                  )}
                  {book.isbn && (
                    <div>
                      <h3 className="text-sm font-medium text-stone-500 mb-1">ISBN</h3>
                      <p className="text-stone-700 text-sm">{book.isbn}</p>
                    </div>
                  )}
                  {readCount > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-stone-500 mb-1">Popularität</h3>
                      <div className="flex items-center gap-2 text-stone-700">
                        <Users className="w-4 h-4" />
                        <span>{readCount}× gelesen</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Leseproben Links */}
            <div className="border-t border-stone-200 pt-6">
              <h3 className="text-lg font-medium text-stone-800 mb-4 flex items-center gap-2">
                <Book className="w-5 h-5" />
                Leseproben & Mehr
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href={getGoogleBooksPreviewUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-stone-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all group"
                >
                  <div>
                    <div className="font-medium text-stone-800 group-hover:text-amber-700">Google Books</div>
                    <div className="text-xs text-stone-500">Leseprobe & Details anzeigen</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
                </a>
                
                <a
                  href={getAmazonPreviewUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-stone-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all group"
                >
                  <div>
                    <div className="font-medium text-stone-800 group-hover:text-amber-700">Amazon</div>
                    <div className="text-xs text-stone-500">"Blick ins Buch" Funktion</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-stone-200 flex justify-end">
            <Button onClick={onClose} className="bg-stone-800 hover:bg-stone-700">
              Schließen
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}