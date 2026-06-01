/**
 * LanguageContext – Sprachverwaltung ohne LLM-Kosten.
 *
 * Sync-Strategie:
 * - Initialsprache aus localStorage (AuthContext schreibt sie nach me())
 * - Sprach-Updates vom selben Tab: CustomEvent 'bc:language' (von AuthContext)
 * - Sprach-Updates aus anderen Tabs: window 'storage' event
 * - translate()/translateObject() sind reine Passthrough-Funktionen (kein LLM)
 * - changeLanguage() speichert in localStorage + User-Profil (still)
 * - Multi-User: clearAllAuthStorage() in AuthContext löscht auch appLanguage
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: 'de', name: 'Deutsch',    flag: '🇩🇪' },
  { code: 'en', name: 'English',    flag: '🇬🇧' },
  { code: 'el', name: 'Ελληνικά',  flag: '🇬🇷' },
  { code: 'tr', name: 'Türkçe',    flag: '🇹🇷' },
  { code: 'fr', name: 'Français',  flag: '🇫🇷' },
  { code: 'es', name: 'Español',   flag: '🇪🇸' },
  { code: 'it', name: 'Italiano',  flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'nl', name: 'Nederlands',flag: '🇳🇱' },
  { code: 'pl', name: 'Polski',    flag: '🇵🇱' },
  { code: 'ru', name: 'Русский',   flag: '🇷🇺' },
  { code: 'ar', name: 'العربية',   flag: '🇸🇦' },
  { code: 'zh', name: '中文',       flag: '🇨🇳' },
  { code: 'ja', name: '日本語',     flag: '🇯🇵' },
  { code: 'ko', name: '한국어',     flag: '🇰🇷' },
];

function readLanguage() {
  try { return localStorage.getItem('appLanguage') || 'de'; } catch { return 'de'; }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(readLanguage);

  // Sync: CustomEvent vom selben Tab (AuthContext nach me()-Call)
  useEffect(() => {
    const onBcLanguage = (e) => {
      const lang = e.detail?.language;
      if (lang && lang !== language) setLanguage(lang);
    };
    window.addEventListener('bc:language', onBcLanguage);
    return () => window.removeEventListener('bc:language', onBcLanguage);
  }, [language]);

  // Sync: storage-Event aus anderen Tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'appLanguage' && e.newValue && e.newValue !== language) {
        setLanguage(e.newValue);
      }
      // Logout in anderem Tab → zurück zu Deutsch
      if (e.key === 'bc_auth_v2' && e.newValue === null) {
        setLanguage('de');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [language]);

  const changeLanguage = useCallback(async (newLanguage) => {
    setLanguage(newLanguage);
    try { localStorage.setItem('appLanguage', newLanguage); } catch {}
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) base44.auth.updateMe({ language: newLanguage }).catch(() => {});
    } catch {}
  }, []);

  // Reine Passthrough-Funktionen – kein InvokeLLM
  const translate = useCallback(async (text) => text, []);
  const translateObject = useCallback(async (obj) => obj, []);
  const getLanguageName = useCallback(
    (code) => SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code,
    []
  );

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      translate,
      translateObject,
      supportedLanguages: SUPPORTED_LANGUAGES,
      isLoading: false,
      isRTL: language === 'ar',
      getLanguageName,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};