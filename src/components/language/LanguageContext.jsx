/**
 * LanguageContext – Sprachverwaltung ohne LLM-Kosten.
 *
 * Architektur:
 * - Sprache wird aus localStorage gelesen (AuthContext schreibt sie aus dem Profil)
 * - translate() / translateObject() rufen KEIN InvokeLLM mehr auf
 *   → alle LLM-Übersetzungskosten entfallen
 * - Stattdessen: passthrough – Text bleibt wie er ist
 *   (UI ist auf Deutsch, Buchinhalte kommen nativ von Google Books)
 * - changeLanguage() speichert in localStorage UND im User-Profil (still)
 * - Multi-User: bei Logout muss localStorage.appLanguage gecleared werden
 *   (geschieht in AuthContext.clearAllAuthStorage)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Wenn AuthContext die Sprache im localStorage aktualisiert (nach me()-Call),
  // soll LanguageContext das aufnehmen – ohne eigenes me()-Call
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'appLanguage' && e.newValue && e.newValue !== language) {
        setLanguage(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [language]);

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
    try { localStorage.setItem('appLanguage', newLanguage); } catch {}
    // Still im Hintergrund im Profil speichern
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) base44.auth.updateMe({ language: newLanguage }).catch(() => {});
    } catch {}
  };

  // translate / translateObject: KEIN LLM-Call mehr.
  // Text wird unverändert zurückgegeben.
  // Buchinhalt kommt nativ von Google Books in der jeweiligen Sprache.
  // UI-Texte sind statisch auf Deutsch.
  const translate = async (text) => text;

  const translateObject = async (obj) => obj;

  const getLanguageName = (code) =>
    SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code;

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