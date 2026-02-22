import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Loader2, BookPlus, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function BookScannerModal({ onClose, onBookAdded }) {
  const [phase, setPhase] = useState('upload'); // upload, scanning, result, saving
  const [scannedBook, setScannedBook] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhase('scanning');
    setError('');

    try {
      // Bild hochladen
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // KI analysiert das Buchcover
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this book cover image and extract the book information. Return ONLY a JSON object with these fields:
- title: string (book title)
- author: string (author name)
- isbn: string or null (if visible)
- description: string (1-2 sentence description of what the book is about, based on your knowledge)
- pageCount: number or null (approximate if known)
- genre: string (main genre)

If you cannot identify a book from this image, return {"error": "not_a_book"}.`,
        file_urls: [file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            isbn: { type: 'string' },
            description: { type: 'string' },
            pageCount: { type: 'number' },
            genre: { type: 'string' },
            error: { type: 'string' }
          }
        }
      });

      if (result.error === 'not_a_book') {
        setError('Kein Buch erkannt. Bitte lade ein klares Foto des Buchcovers hoch.');
        setPhase('upload');
        return;
      }

      setScannedBook({ ...result, coverColor: 'bg-amber-100' });
      setPhase('result');
    } catch (err) {
      setError('Fehler beim Scannen. Bitte versuche es erneut.');
      setPhase('upload');
    }
  };

  const saveBook = async (completed = false) => {
    if (!scannedBook) return;
    setPhase('saving');

    try {
      await base44.entities.SavedBook.create({
        book_id: Math.floor(Date.now() / 1000), // numeric ID
        book_data: {
          title: scannedBook.title,
          author: scannedBook.author,
          isbn: scannedBook.isbn || null,
          description: scannedBook.description,
          pageCount: scannedBook.pageCount || null,
          genre: scannedBook.genre,
          coverColor: 'bg-amber-100',
        },
        is_completed: completed,
        completed_date: completed ? new Date().toISOString().split('T')[0] : null,
      });
      setSaved(true);
      setTimeout(() => {
        onBookAdded?.();
        onClose();
      }, 1000);
    } catch (err) {
      setError('Fehler beim Speichern. Bitte versuche es erneut.');
      setPhase('result');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center sm:items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        className="bg-white dark:bg-[#1a1a1a] rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 pb-28 max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-medium text-stone-800 dark:text-stone-200">Buch scannen</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Upload Phase */}
          {phase === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 text-center">
                Fotografiere das Cover eines Buches — die KI erkennt Titel und Autor automatisch.
              </p>
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl p-10 flex flex-col items-center gap-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors cursor-pointer"
              >
                <Camera className="w-10 h-10 text-amber-500" />
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Foto aufnehmen oder hochladen</span>
                <span className="text-xs text-stone-400">JPG, PNG – direkt aus der Kamera möglich</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
            </motion.div>
          )}

          {/* Scanning Phase */}
          {phase === 'scanning' && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center py-10 gap-4">
              <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
              <p className="text-sm text-stone-600 dark:text-stone-400">Buch wird erkannt…</p>
            </motion.div>
          )}

          {/* Result Phase */}
          {phase === 'result' && scannedBook && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-22 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 text-2xl font-serif text-amber-700">
                  {scannedBook.title?.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-stone-800 dark:text-stone-200">{scannedBook.title}</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{scannedBook.author}</p>
                  {scannedBook.genre && (
                    <span className="inline-block mt-1 text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      {scannedBook.genre}
                    </span>
                  )}
                  {scannedBook.pageCount && (
                    <p className="text-xs text-stone-400 mt-1">~{scannedBook.pageCount} Seiten</p>
                  )}
                </div>
              </div>
              {scannedBook.description && (
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
                  {scannedBook.description}
                </p>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg text-sm text-red-700">{error}</div>
              )}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button onClick={() => saveBook(false)} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white gap-2">
                    <BookPlus className="w-4 h-4" />
                    Möchte ich lesen
                  </Button>
                  <Button onClick={() => saveBook(true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2">
                    <Check className="w-4 h-4" />
                    Bereits gelesen
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setPhase('upload')} className="w-full">
                  Erneut scannen
                </Button>
              </div>
            </motion.div>
          )}

          {/* Saving Phase */}
          {phase === 'saving' && (
            <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center py-10 gap-4">
              {saved ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400">Buch gespeichert!</p>
                </>
              ) : (
                <>
                  <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
                  <p className="text-sm text-stone-600 dark:text-stone-400">Wird gespeichert…</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}