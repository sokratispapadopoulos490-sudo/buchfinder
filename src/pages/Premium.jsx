import React from 'react';
import { Button } from "@/components/ui/button";
import { Compass, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/language/LanguageContext';

// Premium ist in der Beta nicht verfügbar.
// Diese Seite zeigt einen freundlichen Hinweis statt Preisen/Stripe.
export default function Premium() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0a] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Compass className="w-9 h-9 text-white" />
        </div>
        <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-5">
          <Sparkles className="w-4 h-4" />
          {t('booksearch.betaLabel')}
        </div>
        <h1 className="text-2xl font-light text-stone-800 dark:text-stone-200 mb-3">
          {t('premium.betaTitle')}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
          {t('premium.betaDesc')}
        </p>
        <Button
          onClick={() => navigate(-1)}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {t('btn.back')}
        </Button>
      </div>
    </div>
  );
}