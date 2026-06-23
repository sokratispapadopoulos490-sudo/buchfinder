import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Sparkles, ScanLine, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/language/LanguageContext';
import LibraryCapture from '@/components/books/LibraryCapture';
import { libraryDict } from '@/lib/i18n-library';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [readingIdentity, setReadingIdentity] = useState('');
  const [whatDrawsYou, setWhatDrawsYou] = useState([]);
  const [currentBook, setCurrentBook] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const tLib = (key, fb) => {
    const entry = libraryDict[key];
    if (entry) return entry[language] || entry['de'] || fb || key;
    return fb || key;
  };

  const [showLibraryCapture, setShowLibraryCapture] = useState(false);
  const [captureConfig, setCaptureConfig] = useState({ tab: 'search', scan: false });

  const handleUsernameSubmit = async () => {
    // Leeres Feld = Skip
    if (!username.trim()) {
      setStep(1);
      return;
    }
    if (username.trim().length < 2) {
      setUsernameError(t('profile.usernameInvalid'));
      return;
    }
    if (!/^[a-z0-9_]+$/.test(username.trim().toLowerCase())) {
      setUsernameError(t('profile.usernameInvalid'));
      return;
    }
    await base44.auth.updateMe({ username: username.trim().toLowerCase() });
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
        current_reading_book: currentBook.trim() || null,
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
                <h1 className="text-2xl font-light text-stone-800 mb-1">{t('onboarding.welcome')}</h1>
                <p className="text-stone-600 text-sm">{t('onboarding.usernameSubtitle')}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1 block">{t('onboarding.usernameLabel')} <span className="text-stone-400 font-normal">({t('onboarding.optional')})</span></label>
                  <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                    <span className="pl-4 text-stone-400 text-sm">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setUsernameError(''); }}
                      placeholder={t('profile.usernamePlaceholder')}
                      className="flex-1 px-2 py-3 focus:outline-none text-stone-800 text-sm bg-transparent"
                      onKeyDown={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                    />
                  </div>
                  {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
                  <p className="text-xs text-stone-400 mt-1">{t('profile.usernameHint')}</p>
                </div>

                <Button
                  onClick={handleUsernameSubmit}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {t('q.continueBtn')}
                </Button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-stone-400 hover:text-stone-600 transition-colors py-1"
                >
                  {t('readBooks.skip')}
                </button>
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
                <h2 className="text-sm font-medium text-stone-700 mb-3">{t('onboarding.identityQuestion')}</h2>
                
                {[
                  { key: 'entspannen', label: t('onboarding.identity.entspannen') },
                  { key: 'lernen',     label: t('onboarding.identity.lernen') },
                  { key: 'traeumen',   label: t('onboarding.identity.traeumen') },
                  { key: 'verstehen',  label: t('onboarding.identity.verstehen') },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleIdentitySelect(key)}
                    className="w-full p-4 border-2 border-stone-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
                  >
                    <div className="font-medium text-stone-800">{label}</div>
                  </button>
                ))}
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
                {t('onboarding.drawsQuestion')}
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                {t('onboarding.selectMultiple')}
              </p>

              <div className="space-y-2 mb-6">
                {[
                  t('onboarding.draws.characters'),
                  t('onboarding.draws.atmosphere'),
                  t('onboarding.draws.ideas'),
                  t('onboarding.draws.emotions'),
                  t('onboarding.draws.plot'),
                ].map((item) => (
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
                  {t('btn.back')}
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={whatDrawsYou.length === 0}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {t('q.continueBtn')}
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
                {t('onboarding.currentBookQuestion')}
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                {t('onboarding.optional')} – {t('onboarding.canSkip')}
              </p>

              <input
                type="text"
                value={currentBook}
                onChange={(e) => setCurrentBook(e.target.value)}
                placeholder={t('onboarding.currentBookPlaceholder')}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 mb-6"
              />

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1"
                >
                  {t('btn.back')}
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white gap-2"
                >
                  {t('q.continueBtn')}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm text-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-amber-600" />
              </div>
              
              <h2 className="text-xl font-medium text-stone-800 mb-2">
                {tLib('lib.onboarding.title', 'Physische Bibliothek erfassen')}
              </h2>
              <p className="text-sm text-stone-600 mb-8">
                {tLib('lib.onboarding.subtitle', 'Möchtest du Bücher, die du bereits besitzt, deiner Bibliothek hinzufügen?')}
              </p>

              <div className="space-y-3 mb-8">
                <Button
                  onClick={() => {
                    setCaptureConfig({ tab: 'search', scan: true });
                    setShowLibraryCapture(true);
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2 py-6 text-base"
                >
                  <ScanLine className="w-5 h-5" />
                  {tLib('lib.onboarding.scanNow', 'Jetzt scannen')}
                </Button>
                <Button
                  onClick={() => {
                    setCaptureConfig({ tab: 'search', scan: false });
                    setShowLibraryCapture(true);
                  }}
                  variant="outline"
                  className="w-full gap-2 py-6 text-base border-stone-200"
                >
                  <Search className="w-5 h-5" />
                  {tLib('lib.onboarding.enterManual', 'Titel eingeben')}
                </Button>
              </div>

              <button
                onClick={handleComplete}
                disabled={processing}
                className="text-stone-400 hover:text-stone-600 text-sm font-medium transition-colors"
              >
                {processing ? t('status.loading') : tLib('lib.onboarding.doLater', 'Später machen')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLibraryCapture && (
        <LibraryCapture
          initialTab={captureConfig.tab}
          autoStartScan={captureConfig.scan}
          onDone={handleComplete}
          onSkip={handleComplete}
        />
      )}
    </div>
  );
}