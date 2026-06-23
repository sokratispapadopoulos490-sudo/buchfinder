/**
 * LibraryCapture – Physische Bibliothek erfassen.
 *
 * Features:
 * - Titelsuche via Google Books (useGoogleBooks, debounced)
 * - Manuelle ISBN-Eingabe mit ISBN-Lookup
 * - Barcode-Scan via BarcodeDetector (progressive enhancement – kein Crash wenn nicht unterstützt)
 * - Deduplizierung: isbn13 > source_id > Titel-Vergleich
 * - Speichert in SavedBook mit optionalen physischen Feldern
 * - Abwärtskompatibel: alte SavedBooks ohne physische Felder werden nicht berührt
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Search, ScanLine, BookMarked, Check, Loader2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/language/LanguageContext';
import { useGoogleBooks } from '@/hooks/useGoogleBooks';
import { libraryDict } from '@/lib/i18n-library';
import { t as _t } from '@/lib/i18n';
import { invalidateOwnedCache } from '@/lib/ownedLibrary';

// i18n: sucht zuerst in libraryDict, dann Hauptdict
function tLib(key, lang, fb) {
  const entry = libraryDict[key];
  if (entry) return entry[lang] || entry['de'] || fb || key;
  return _t(key, lang, fb);
}

const CONDITIONS = ['new', 'good', 'used', 'damaged', 'unknown'];
const CONDITION_LABELS = { new: '🆕 Neu', good: '👍 Gut', used: '📖 Gebraucht', damaged: '⚠️ Beschädigt', unknown: '❓ Unbekannt' };

// Stable key für Dedupe: isbn13 preferred, dann source_id, dann normalisierter Titel
function stableKey(book) {
  if (book.isbn13) return `isbn13:${book.isbn13}`;
  if (book.source_id) return `sid:${book.source_id}`;
  return `title:${(book.title || '').toLowerCase().replace(/\s+/g, ' ').trim()}`;
}

export default function LibraryCapture({ onDone, onSkip }) {
  const { language } = useLanguage();
  const t = (key, fb) => tLib(key, language, fb);

  const [tab, setTab] = useState('search'); // 'search' | 'isbn'
  const [searchInput, setSearchInput] = useState('');
  const [isbnInput, setIsbnInput] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [physical, setPhysical] = useState(true);
  const [condition, setCondition] = useState('good');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedKeys, setSavedKeys] = useState(new Set()); // track what we already saved in this session
  const [existingKeys, setExistingKeys] = useState(new Set()); // keys already in DB
  const [scanning, setScanning] = useState(false);
  const [scanSupported, setScanSupported] = useState(null); // null=unknown, true/false
  const [scanError, setScanError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const scanLoopRef = useRef(null);

  const { results, loading: searching, search, searchByISBN, reset } = useGoogleBooks();

  // Check BarcodeDetector support once on mount
  useEffect(() => {
    setScanSupported(typeof window !== 'undefined' && 'BarcodeDetector' in window);
  }, []);

  // Load existing saved book keys for dedupe
  useEffect(() => {
    base44.entities.SavedBook.list('-created_date', 500).then(books => {
      const keys = new Set(books.map(b => stableKey(b.book_data || {})));
      setExistingKeys(keys);
    }).catch(() => {});
  }, []);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopScan();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stopScan = useCallback(() => {
    cancelAnimationFrame(scanLoopRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  const startScan = useCallback(async () => {
    setScanError('');
    if (!scanSupported) {
      setScanError(t('lib.capture.scanUnsupported'));
      return;
    }
    try {
      if (!detectorRef.current) {
        detectorRef.current = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setScanning(true);

      // wait for video element to be ready
      await new Promise(r => setTimeout(r, 300));
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const scan = async () => {
        if (!videoRef.current || !streamRef.current) return;
        try {
          const codes = await detectorRef.current.detect(videoRef.current);
          if (codes.length > 0) {
            const isbn = codes[0].rawValue;
            stopScan();
            setTab('isbn');
            setIsbnInput(isbn);
            searchByISBN(isbn);
            return;
          }
        } catch {}
        scanLoopRef.current = requestAnimationFrame(scan);
      };
      scanLoopRef.current = requestAnimationFrame(scan);
    } catch (err) {
      setScanError(t('lib.capture.scanUnsupported'));
      stopScan();
    }
  }, [scanSupported, stopScan, searchByISBN, t]);

  const handleSave = useCallback(async (book) => {
    const key = stableKey(book);
    if (savedKeys.has(key) || existingKeys.has(key)) return;
    setSaving(true);
    try {
      const bookData = { ...book };
      await base44.entities.SavedBook.create({
        book_id: book.id || 0,
        book_data: bookData,
        physical_copy: physical,
        condition: physical ? condition : undefined,
        location: physical && location.trim() ? location.trim() : undefined,
        acquisition_source: 'manual',
        ownership_status: 'owned',
      });
      setSavedKeys(prev => new Set([...prev, key]));
      setExistingKeys(prev => new Set([...prev, key]));
      invalidateOwnedCache();
      setSelectedBook(null);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }, [savedKeys, existingKeys, physical, condition, location]);

  const isAlreadySaved = (book) => {
    const key = stableKey(book);
    return savedKeys.has(key) || existingKeys.has(key);
  };

  const displayResults = results.slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-[#1a1a1a] w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[92dvh] flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">{t('lib.capture.title')}</h2>
            <p className="text-xs text-stone-500 mt-0.5">{t('lib.capture.subtitle')}</p>
          </div>
          <button onClick={onSkip || onDone} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 dark:border-stone-700 flex-shrink-0">
          <button
            onClick={() => { setTab('search'); reset(); setSearchInput(''); setScanError(''); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === 'search' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500'}`}
          >
            <Search className="w-4 h-4 inline mr-1.5" />
            {language === 'de' ? 'Titelsuche' : 'Title search'}
          </button>
          <button
            onClick={() => { setTab('isbn'); reset(); setScanError(''); stopScan(); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === 'isbn' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-500'}`}
          >
            <BookMarked className="w-4 h-4 inline mr-1.5" />
            ISBN
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {/* Search tab */}
          {tab === 'search' && (
            <>
              <input
                type="text"
                value={searchInput}
                placeholder={t('lib.capture.searchPlaceholder')}
                className="w-full border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchInput(val);
                  if (val.trim().length >= 2) search(val.trim());
                  else reset();
                }}
                autoFocus
              />
              {/* Barcode scan button – only if supported */}
              {scanSupported !== false && (
                <button
                  onClick={scanning ? stopScan : startScan}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                    scanning
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-amber-400'
                  }`}
                >
                  {scanning ? <Camera className="w-4 h-4 animate-pulse" /> : <ScanLine className="w-4 h-4" />}
                  {scanning ? t('lib.capture.scanning') : t('lib.capture.scanBarcode')}
                </button>
              )}
              {scanError && <p className="text-xs text-amber-600 dark:text-amber-400">{scanError}</p>}

              {/* Camera preview */}
              {scanning && (
                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                  <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                </div>
              )}
            </>
          )}

          {/* ISBN tab */}
          {tab === 'isbn' && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('lib.capture.isbnPlaceholder')}
                value={isbnInput}
                onChange={(e) => setIsbnInput(e.target.value)}
                className="flex-1 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                autoFocus
              />
              <Button
                onClick={() => searchByISBN(isbnInput)}
                disabled={!isbnInput.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Results */}
          {searching && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
            </div>
          )}

          {!searching && results.length === 0 && (
            (tab === 'isbn' && isbnInput.trim()) ||
            (tab === 'search' && searchInput.trim().length >= 2)
          ) && (
            <p className="text-center text-stone-400 text-sm py-4">{t('lib.capture.noResults')}</p>
          )}

          {displayResults.map((book, idx) => {
            const saved = isAlreadySaved(book);
            const selected = selectedBook?.isbn13 === book.isbn13 && selectedBook?.title === book.title;
            return (
              <div key={book.isbn13 || book.source_id || idx}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selected
                      ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/10'
                      : 'border-stone-200 dark:border-stone-700 hover:border-amber-300'
                  }`}
                  onClick={() => !saved && setSelectedBook(selected ? null : book)}
                >
                  {/* Cover */}
                  <div className="w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-stone-100 dark:bg-stone-800">
                    {book.cover_front_url
                      ? <img src={book.cover_front_url} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-stone-400 text-lg">{book.title?.[0]}</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{book.title}</p>
                    <p className="text-xs text-stone-500 truncate">{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</p>
                    {book.isbn13 && <p className="text-xs text-stone-400 mt-0.5">{book.isbn13}</p>}
                  </div>
                  {saved ? (
                    <span className="text-xs text-green-600 dark:text-green-400 whitespace-nowrap flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {t('lib.capture.saved')}
                    </span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSave(book); }}
                      disabled={saving}
                      className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg whitespace-nowrap disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : t('lib.capture.save')}
                    </button>
                  )}
                </div>

                {/* Expanded physical details when selected */}
                {selected && !saved && (
                  <div className="mt-1 ml-3 mr-1 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3">
                    {/* Physical toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-700 dark:text-stone-300">{t('lib.capture.physical')}</span>
                      <button
                        onClick={() => setPhysical(p => !p)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${physical ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-600'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${physical ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    {physical && (
                      <>
                        {/* Condition */}
                        <div>
                          <p className="text-xs text-stone-500 mb-1.5">{t('lib.capture.condition')}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {CONDITIONS.map(c => (
                              <button
                                key={c}
                                onClick={() => setCondition(c)}
                                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                                  condition === c
                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                                    : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-400'
                                }`}
                              >
                                {CONDITION_LABELS[c]}
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* Location */}
                        <input
                          type="text"
                          placeholder={t('lib.capture.location')}
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-2 text-xs bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                      </>
                    )}

                    <Button
                      onClick={() => handleSave(book)}
                      disabled={saving}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('lib.capture.save')}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-700 flex gap-3 flex-shrink-0">
          {onSkip && (
            <button
              onClick={onSkip}
              className="flex-1 py-2.5 text-sm text-stone-500 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              {t('lib.capture.skip')}
            </button>
          )}
          <Button
            onClick={onDone}
            className="flex-1 bg-stone-800 dark:bg-stone-700 hover:bg-stone-700 text-white text-sm"
          >
            {t('lib.capture.done')}
          </Button>
        </div>
      </div>
    </div>
  );
}