import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { BookOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/language/LanguageContext';

/**
 * Onboarding – Kurzes, NICHT blockierendes Willkommens-Setup nach dem Login.
 * Einziger Schritt: optionaler Benutzername. "Weiter" und "Überspringen"
 * führen beide direkt in den Account-Bereich, nie in einen Zwangs-Flow.
 */
export default function Onboarding() {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleContinue = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      navigate('/Account');
      return;
    }
    if (trimmed.length < 2 || !/^[a-z0-9_]+$/.test(trimmed.toLowerCase())) {
      setUsernameError(t('profile.usernameInvalid'));
      return;
    }
    setProcessing(true);
    try {
      await base44.auth.updateMe({ username: trimmed.toLowerCase(), onboarding_completed: true });
    } catch (error) {
      console.error('Error saving username:', error);
    } finally {
      setProcessing(false);
      navigate('/Account');
    }
  };

  const handleSkip = () => {
    navigate('/Account');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              <label className="text-sm font-medium text-stone-700 mb-1 block">
                {t('onboarding.usernameLabel')} <span className="text-stone-400 font-normal">({t('onboarding.optional')})</span>
              </label>
              <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                <span className="pl-4 text-stone-400 text-sm">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setUsernameError(''); }}
                  placeholder={t('profile.usernamePlaceholder')}
                  className="flex-1 px-2 py-3 focus:outline-none text-stone-800 text-sm bg-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                />
              </div>
              {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
              <p className="text-xs text-stone-400 mt-1">{t('profile.usernameHint')}</p>
            </div>

            <Button
              onClick={handleContinue}
              disabled={processing}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {processing ? t('status.loading') : t('q.continueBtn')}
            </Button>
            <button
              onClick={handleSkip}
              disabled={processing}
              className="w-full text-sm text-stone-400 hover:text-stone-600 transition-colors py-1"
            >
              {t('readBooks.skip')}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}