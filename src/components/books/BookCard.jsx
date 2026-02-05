import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles, ShoppingCart, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from "@/lib/utils";
import { base44 } from '@/api/base44Client';

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
  const buyLinks = generateBuyLinks(book);

  useEffect(() => {
    checkIfSaved();
  }, [book.id]);

  const checkIfSaved = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const saved = await base44.entities.SavedBook.filter({ book_id: book.id });
        setIsSaved(saved.length > 0);
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
        const saved = await base44.entities.SavedBook.filter({ book_id: book.id });
        if (saved.length > 0) {
          await base44.entities.SavedBook.delete(saved[0].id);
          setIsSaved(false);
        }
      } else {
        await base44.entities.SavedBook.create({
          book_id: book.id,
          book_data: book,
          recommendation_reason: reasons
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={cn(
        "bg-white rounded-2xl border overflow-hidden",
        isContrast ? "border-amber-200" : "border-stone-200"
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
          {/* Book cover placeholder */}
          <div className={cn(
            "w-20 h-28 md:w-24 md:h-32 rounded-lg flex-shrink-0 flex items-center justify-center",
            book.coverColor || "bg-stone-100"
          )}>
            <span className="text-2xl md:text-3xl font-serif text-stone-400">
              {book.title.charAt(0)}
            </span>
          </div>

          {/* Book info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl md:text-2xl font-light text-stone-800 mb-1 leading-tight">
              {book.title}
            </h3>
            <p className="text-stone-500 text-sm mb-3">{book.author}</p>
            <p className="text-stone-600 text-sm leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>

        {/* Why this book */}
        <div className="mt-6 pt-6 border-t border-stone-100">
          <p className="text-stone-800 font-medium mb-4">
            {reasons.mainReason}
          </p>
          
          <ul className="space-y-2 mb-6">
            {reasons.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
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
                className="flex-1 gap-2 bg-stone-800 hover:bg-stone-700"
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
                    className="block p-3 border border-stone-200 rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-stone-800 text-sm">{link.name}</span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </div>
                    <p className="text-xs text-stone-500">{link.description}</p>
                  </a>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}