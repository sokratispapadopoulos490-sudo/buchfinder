import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Book, Users } from 'lucide-react';
import BookCover from './BookCover';
import { useLanguage } from '@/components/language/LanguageContext';

export default function BookDetailModal({ book, readCount, onClose }) {
  const { t } = useLanguage();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

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
              <h2 className="text-2xl md:text-3xl font-light mb-2" style={{ color: isDark ? '#f5f5f5' : '#1c1917' }}>
                  {book.title}
                </h2>
                <p style={{ color: isDark ? '#aaa' : '#57534e' }}>{book.author}</p>
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
                {book.publishYear && <p className="text-xs" style={{ color: isDark ? '#aaa' : '#78716c' }}>{book.publishYear}</p>}
                {book.pageCount && <p className="text-xs" style={{ color: isDark ? '#aaa' : '#78716c' }}>{book.pageCount} {t('book.pages')}</p>}
                {book.publisher && <p className="text-xs" style={{ color: isDark ? '#aaa' : '#78716c' }}>{book.publisher}</p>}
                {readCount > 0 && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: isDark ? '#aaa' : '#78716c' }}>
                    <Users className="w-3 h-3" />
                    <span>{readCount}{t('book.timesRead')}</span>
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
                    <h3 className="text-sm font-medium mb-1" style={{ color: isDark ? '#aaa' : '#78716c' }}>{t('book.author')}</h3>
                    <p style={{ color: isDark ? '#e5e5e5' : '#44403c' }}>{book.author}</p>
                  </div>
                  {book.publishYear && <div><h3 className="text-sm font-medium mb-1" style={{ color: isDark ? '#aaa' : '#78716c' }}>{t('book.year')}</h3><p style={{ color: isDark ? '#e5e5e5' : '#44403c' }}>{book.publishYear}</p></div>}
                  {book.pageCount && <div><h3 className="text-sm font-medium mb-1" style={{ color: isDark ? '#aaa' : '#78716c' }}>{t('book.pageCount')}</h3><p style={{ color: isDark ? '#e5e5e5' : '#44403c' }}>{book.pageCount} {t('book.pages')}</p></div>}
                  {book.publisher && <div><h3 className="text-sm font-medium mb-1" style={{ color: isDark ? '#aaa' : '#78716c' }}>{t('book.publisher')}</h3><p style={{ color: isDark ? '#e5e5e5' : '#44403c' }}>{book.publisher}</p></div>}
                  {book.isbn && <div><h3 className="text-sm font-medium mb-1" style={{ color: isDark ? '#aaa' : '#78716c' }}>ISBN</h3><p className="text-sm" style={{ color: isDark ? '#e5e5e5' : '#44403c' }}>{book.isbn}</p></div>}
                  {readCount > 0 && <div><h3 className="text-sm font-medium mb-1" style={{ color: isDark ? '#aaa' : '#78716c' }}>{t('book.popularity')}</h3><div className="flex items-center gap-2" style={{ color: isDark ? '#e5e5e5' : '#44403c' }}><Users className="w-4 h-4" /><span>{readCount}{t('book.timesRead')}</span></div></div>}
                </div>
              </div>
            </div>

            {/* Description - visible on all sizes */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-sm font-medium mb-2" style={{ color: isDark ? '#aaa' : '#78716c' }}>{t('book.description')}</h3>
              <p className="leading-relaxed text-sm md:text-base" style={{ color: isDark ? '#e5e5e5' : '#44403c' }}>{book?.description || ''}</p>
            </div>

            {/* Leseproben Links */}
            <div className="pt-6" style={{ borderTop: `1px solid ${isDark ? '#333' : '#e7e5e4'}` }}>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: isDark ? '#f5f5f5' : '#1c1917' }}>
                <Book className="w-5 h-5" />
                {t('book.previewMore')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href={getGoogleBooksPreviewUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg transition-all group"
                  style={{ border: `1px solid ${isDark ? '#444' : '#e7e5e4'}`, backgroundColor: 'transparent' }}
                >
                  <div>
                    <div className="font-medium" style={{ color: isDark ? '#e5e5e5' : '#1c1917' }}>Google Books</div>
                    <div className="text-xs" style={{ color: isDark ? '#aaa' : '#78716c' }}>{t('book.previewGoogle')}</div>
                  </div>
                  <ExternalLink className="w-4 h-4" style={{ color: isDark ? '#888' : '#a8a29e' }} />
                </a>
                
                <a
                  href={getAmazonPreviewUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-lg transition-all group"
                  style={{ border: `1px solid ${isDark ? '#444' : '#e7e5e4'}`, backgroundColor: 'transparent' }}
                >
                  <div>
                    <div className="font-medium" style={{ color: isDark ? '#e5e5e5' : '#1c1917' }}>Amazon</div>
                    <div className="text-xs" style={{ color: isDark ? '#aaa' : '#78716c' }}>{t('book.previewAmazon')}</div>
                  </div>
                  <ExternalLink className="w-4 h-4" style={{ color: isDark ? '#888' : '#a8a29e' }} />
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 flex justify-end" style={{ borderTop: `1px solid ${isDark ? '#333' : '#e7e5e4'}` }}>
            <Button onClick={onClose} style={{ backgroundColor: isDark ? '#d97706' : '#1c1917', color: isDark ? '#000' : '#fff' }}>
              {t('book.close')}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}