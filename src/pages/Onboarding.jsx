import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BookOpen, Search, CheckCircle, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [readingIdentity, setReadingIdentity] = useState('');
  const [whatDrawsYou, setWhatDrawsYou] = useState([]);
  const [currentBook, setCurrentBook] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleUsernameSubmit = async () => {
    if (!username.trim() || username.trim().length < 3) {
      setUsernameError('Mindestens 3 Zeichen erforderlich.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      setUsernameError('Nur Buchstaben, Zahlen und _ erlaubt.');
      return;
    }
    await base44.auth.updateMe({ username: username.trim() });
    setStep(1);
  };

  const handleIdentitySelect = (selected) => {
    setReadingIdentity(selected);
    setStep(2);
  };

  const handleDrawsToggle = (item) => {
    setWhatDrawsYou(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };



  const handleComplete = async () => {
    setProcessing(true);
    try {
      await base44.auth.updateMe({
        reading_identity: readingIdentity,
        what_draws_you: whatDrawsYou,
        onboarding_completed: true
      });

      // Direkt zu Compass (neuer Hauptpfad)
      navigate('/Compass');
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
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-light text-stone-800 mb-1">Willkommen bei Book Compass</h1>
                <p className="text-stone-600 text-sm">Wähle zuerst deinen Benutzernamen</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1 block">Benutzername</label>
                  <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                    <span className="pl-4 text-stone-400 text-sm">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setUsernameError(''); }}
                      placeholder="dein_name"
                      className="flex-1 px-2 py-3 focus:outline-none text-stone-800 text-sm bg-transparent"
                      onKeyDown={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                    />
                  </div>
                  {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
                  <p className="text-xs text-stone-400 mt-1">Nur Buchstaben, Zahlen und _ (min. 3 Zeichen)</p>
                </div>

                <Button
                  onClick={handleUsernameSubmit}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Weiter
                </Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-light text-stone-800 mb-1">
                  Book Compass
                </h1>
                <p className="text-amber-700 text-xs uppercase tracking-wider font-medium mb-2">Dein Wegweiser zum perfekten Buch</p>
                <p className="text-stone-600">
                  Wir helfen dir, bewusster zu lesen und aus jedem Buch etwas mitzunehmen.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-medium text-stone-700 mb-3">Wie würdest du dein Lesen beschreiben?</h2>
                
                <button
                  onClick={() => handleIdentitySelect('entspannen')}
                  className="w-full p-4 border-2 border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
                >
                  <div className="font-medium text-stone-800">Ich lese, um zu entspannen</div>
                </button>

                <button
                  onClick={() => handleIdentitySelect('lernen')}
                  className="w-full p-4 border-2 border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
                >
                  <div className="font-medium text-stone-800">Ich lese, um zu lernen</div>
                </button>

                <button
                  onClick={() => handleIdentitySelect('traeumen')}
                  className="w-full p-4 border-2 border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
                >
                  <div className="font-medium text-stone-800">Ich lese, um zu träumen</div>
                </button>

                <button
                  onClick={() => handleIdentitySelect('verstehen')}
                  className="w-full p-4 border-2 border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
                >
                  <div className="font-medium text-stone-800">Ich lese, um zu verstehen</div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm"
            >
              <h2 className="text-xl font-light text-stone-800 mb-2">
                Was zieht dich in Geschichten?
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                Wähle mehrere aus
              </p>

              <div className="space-y-2 mb-6">
                {['Charaktere', 'Atmosphäre', 'Ideen', 'Emotionen', 'Handlung'].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleDrawsToggle(item)}
                    className={`w-full p-3 border-2 rounded-xl transition-all text-left ${
                      whatDrawsYou.includes(item)
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-stone-800">{item}</span>
                      {whatDrawsYou.includes(item) && (
                        <CheckCircle className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Zurück
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={whatDrawsYou.length === 0}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Weiter
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm"
            >
              <h2 className="text-xl font-light text-stone-800 mb-2">
                Welches Buch liest du gerade?
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                Optional – du kannst auch überspringen
              </p>

              <input
                type="text"
                value={currentBook}
                onChange={(e) => setCurrentBook(e.target.value)}
                placeholder="z.B. Atomic Habits"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 mb-6"
              />

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1"
                >
                  Zurück
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={processing}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white gap-2"
                >
                  {processing ? 'Lädt...' : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Los geht's
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