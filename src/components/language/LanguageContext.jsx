import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const LanguageContext = createContext();

const SUPPORTED_LANGUAGES = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('appLanguage') || 'de'
  );
  const [translationCache, setTranslationCache] = useState({});
  // isLoading ist immer false – kein async beim Start
  const isLoading = false;

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        await base44.auth.updateMe({ language: newLanguage });
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const translate = async (text, targetLanguage = language) => {
    if (!text || targetLanguage === 'de') return text;

    const cacheKey = `${text}_${targetLanguage}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
      const langName = getLanguageName(targetLanguage);
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Translate this text to ${langName} (language code: ${targetLanguage}). Return ONLY the translated text, nothing else:\n\n${text}`,
      });

      const translated = typeof response === 'string' ? response.trim() : text;
      setTranslationCache(prev => ({ ...prev, [cacheKey]: translated }));
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const translateObject = async (obj, targetLanguage = language) => {
    if (!obj || targetLanguage === 'de') return obj;

    const translated = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        translated[key] = await translate(value, targetLanguage);
      } else if (Array.isArray(value)) {
        translated[key] = await Promise.all(
          value.map(item => 
            typeof item === 'string' ? translate(item, targetLanguage) : translateObject(item, targetLanguage)
          )
        );
      } else if (typeof value === 'object' && value !== null) {
        translated[key] = await translateObject(value, targetLanguage);
      } else {
        translated[key] = value;
      }
    }
    return translated;
  };

  const getLanguageName = (code) => {
    return SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      translate,
      translateObject,
      supportedLanguages: SUPPORTED_LANGUAGES,
      isLoading,
      isRTL: language === 'ar'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};