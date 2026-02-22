import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Book, Users, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import BookCover from './BookCover';
import { useLanguage } from '@/components/language/LanguageContext';
import { base44 } from '@/api/base44Client';

export default function BookDetailModal({ book, readCount, onClose }) {
  const { language } = useLanguage();
  const [translatedDescription, setTranslatedDescription] = useState(book?.description || '');
  const [translating, setTranslating] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!book?.description) return;
    if (language === 'en') {
      setTranslatedDescription(book.description);
      return;
    }
    const translate = async () => {
      setTranslating(true);
      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Translate the following book description to the language with code "${language}". Return ONLY the translated text, nothing else.\n\n${book.description}`,
        });
        setTranslatedDescription(result);
      } catch {
        setTranslatedDescription(book.description);
      } finally {
        setTranslating(false);
      }
    };
    translate();
  }, [book?.description, language]);

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
          style={{
            backgroundColor: isDark ? '#1a1a1a' : 'white',
            color: isDark ? '#f5f5f5' : '#1c1917',
          }}
          className="rounded-2xl max-w-4xl w-full shadow-2xl my-8 mb-24"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6" style={{ borderBottom: `1px solid ${isDark ? '#333' : '#e7e5e4'}` }}>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-light text-stone-800 mb-2">
                {book.title}
              </h2>
              <p className="text-stone-600">{book.author}</p>
            </div>
            <button
              onClick={onClose}
              style={{ position: 'relative', zIndex: 2147483648 }}
              className="text-stone-400 hover:text-stone-600 transition-colors ml-4 flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh] md:max-h-none">
            {/* Mobile: Cover + title row, Desktop: grid */}
            <div className="flex gap-4 mb-5 md:hidden">
              <div className="w-20 flex-shrink-0">
                <BookCover bookData={book} width="w-full" height="h-auto aspect-[2/3]" textSize="text-3xl" className="shadow-md w-full" placeholderClassName="shadow-md w-full" />
              </div>
              <div className="flex-1 space-y-1 pt-1">
                {book.publishYear && <p className="text-xs text-stone-500">{book.publishYear}</p>}
                {book.pageCount && <p className="text-xs text-stone-500">{book.pageCount} Seiten</p>}
                {book.publisher && <p className="text-xs text-stone-500">{book.publisher}</p>}
                {readCount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <Users className="w-3 h-3" />
                    <span>{readCount}× gelesen</span>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:grid md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-1">
                <BookCover bookData={book} width="w-full" height="h-auto aspect-[2/3]" textSize="text-6xl" className="shadow-lg w-full" placeholderClassName="shadow-lg w-full" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-stone-500 mb-1">Autor</h3>
                    <p className="text-stone-700">{book.author}</p>
                  </div>
                  {book.publishYear && <div><h3 className="text-sm font-medium text-stone-500 mb-1">Erscheinungsjahr</h3><p className="text-stone-700">{book.publishYear}</p></div>}
                  {book.pageCount && <div><h3 className="text-sm font-medium text-stone-500 mb-1">Seitenzahl</h3><p className="text-stone-700">{book.pageCount} Seiten</p></div>}
                  {book.publisher && <div><h3 className="text-sm font-medium text-stone-500 mb-1">Verlag</h3><p className="text-stone-700">{book.publisher}</p></div>}
                  {book.isbn && <div><h3 className="text-sm font-medium text-stone-500 mb-1">ISBN</h3><p className="text-stone-700 text-sm">{book.isbn}</p></div>}
                  {readCount > 0 && <div><h3 className="text-sm font-medium text-stone-500 mb-1">Popularität</h3><div className="flex items-center gap-2 text-stone-700"><Users className="w-4 h-4" /><span>{readCount}× gelesen</span></div></div>}
                </div>
              </div>
            </div>

            {/* Description - visible on all sizes */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-sm font-medium text-stone-500 mb-2">Beschreibung</h3>
              {translating ? (
                <div className="flex items-center gap-2 text-stone-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Wird übersetzt…</span>
                </div>
              ) : (
                <p className="text-stone-700 leading-relaxed text-sm md:text-base">{translatedDescription}</p>
              )}
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