import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Globe, Check } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function LanguageSelector({ onComplete }) {
  const { supportedLanguages, changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('de');

  const handleConfirm = async () => {
    await changeLanguage(selectedLanguage);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-amber-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-stone-800 mb-3">
            Choose Your Language
          </h1>
          <p className="text-stone-600">
            Select your preferred language to personalize your experience
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`
                  flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                  ${selectedLanguage === lang.code
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                  }
                `}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-stone-800">{lang.name}</div>
                </div>
                {selectedLanguage === lang.code && (
                  <Check className="w-5 h-5 text-amber-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg"
        >
          Continue
        </Button>

        <p className="text-center text-xs text-stone-500 mt-4">
          You can change the language anytime in your account settings
        </p>
      </motion.div>
    </div>
  );
}