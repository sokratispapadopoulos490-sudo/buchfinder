import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BookOpen, Search, CheckCircle, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [situation, setSituation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [reflection, setReflection] = useState('');
  const [bookResults, setBookResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSituationSelect = (selected) => {
    setSituation(selected);
    setStep(2);
  };

  const searchBooks = async (query) => {
    if (!query.trim() || query.length < 3) {
      setBookResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Suche nach Büchern mit diesem Titel oder Autor: "${query}". Gib maximal 5 Ergebnisse zurück.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            books: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  author: { type: "string" },
                  year: { type: "string" },
                  pageCount: { type: "integer" }
                }
              }
            }
          }
        }
      });

      if (response.books && response.books.length > 0) {
        setBookResults(response.books);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleComplete = async () => {
    setProcessing(true);
    try {
      if (situation === 'searching') {
        // Nutzer sucht ein Buch → Home für Empfehlung
        navigate('/');
      } else if (situation === 'reading' && selectedBook) {
        // Nutzer liest bereits → Buch speichern & zu Compass
        const coverColors = ['bg-amber-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-red-100'];
        const bookData = {
          ...selectedBook,
          coverColor: coverColors[Math.floor(Math.random() * coverColors.length)]
        };

        await base44.entities.SavedBook.create({
          book_id: Math.floor(Math.random() * 1000000),
          book_data: bookData,
          is_completed: false
        });

        navigate('/Compass');
      } else if (situation === 'finished' && reflection) {
        // Nutzer hat Buch beendet → Reflexion speichern & Home
        await base44.auth.updateMe({ last_reflection: reflection });
        navigate('/');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-light text-stone-800 mb-2">
                  Willkommen bei Book Compass
                </h1>
                <p className="text-stone-600">
                  Wir helfen dir, bewusster zu lesen und aus jedem Buch etwas mitzunehmen.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-medium text-stone-700 mb-3">Wo stehst du gerade?</h2>
                
                <button
                  onClick={() => handleSituationSelect('searching')}
                  className="w-full p-4 border-2 border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="font-medium text-stone-800">Ich suche mein nächstes Buch</div>
                      <div className="text-xs text-stone-500">Lass uns das perfekte Buch finden</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSituationSelect('reading')}
                  className="w-full p-4 border-2 border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="font-medium text-stone-800">Ich lese bereits etwas</div>
                      <div className="text-xs text-stone-500">Begleite deine Lektüre</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSituationSelect('finished')}
                  className="w-full p-4 border-2 border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="font-medium text-stone-800">Ich habe gerade ein Buch beendet</div>
                      <div className="text-xs text-stone-500">Halte deine Erkenntnisse fest</div>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && situation === 'searching' && (
            <motion.div
              key="step2-searching"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm"
            >
              <h2 className="text-xl font-light text-stone-800 mb-2">
                Was beschäftigt dich aktuell?
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                Beispiel: "Wie finde ich mehr Ruhe im Alltag?"
              </p>

              <textarea
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Deine Gedanken..."
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none mb-4"
                rows={4}
              />

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Zurück
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!searchQuery.trim() || processing}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {processing ? 'Einen Moment...' : 'Weiter'}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && situation === 'reading' && (
            <motion.div
              key="step2-reading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm"
            >
              <h2 className="text-xl font-light text-stone-800 mb-6">
                Welches Buch liest du gerade?
              </h2>

              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchBooks(e.target.value);
                  }}
                  placeholder="Buchtitel oder Autor eingeben..."
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {searching && (
                  <div className="absolute right-3 top-3 text-stone-400">Suche...</div>
                )}
              </div>

              {bookResults.length > 0 && (
                <div className="mb-4 max-h-60 overflow-y-auto space-y-2">
                  {bookResults.map((book, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedBook(book);
                        setBookResults([]);
                      }}
                      className="w-full p-3 border border-stone-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
                    >
                      <div className="font-medium text-stone-800">{book.title}</div>
                      <div className="text-sm text-stone-600">{book.author}</div>
                    </button>
                  ))}
                </div>
              )}

              {selectedBook && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-800 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Ausgewählt</span>
                  </div>
                  <div className="font-medium text-stone-800">{selectedBook.title}</div>
                  <div className="text-sm text-stone-600">{selectedBook.author}</div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Zurück
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!selectedBook || processing}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {processing ? 'Speichere...' : 'Los geht\'s'}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && situation === 'finished' && (
            <motion.div
              key="step2-finished"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm"
            >
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="w-6 h-6" />
                <h2 className="text-xl font-light text-stone-800">Super!</h2>
              </div>
              
              <p className="text-stone-600 mb-6">
                Was nimmst du aus dem Buch mit?
              </p>

              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Deine wichtigste Erkenntnis..."
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none mb-4"
                rows={5}
              />

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Zurück
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!reflection.trim() || processing}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white gap-2"
                >
                  {processing ? 'Speichere...' : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Nächstes Buch finden
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}