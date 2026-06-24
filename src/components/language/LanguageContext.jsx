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
import { t as _t } from '@/lib/i18n';
import {
  getBookLanguage, setBookLanguage,
  getShoppingRegion, setShoppingRegion,
  loadPreferencesFromProfile,
} from '@/lib/shoppingRegion';

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
  const [bookLanguage, setBookLanguageState] = useState(getBookLanguage);
  const [shoppingRegion, setShoppingRegionState] = useState(getShoppingRegion);

  // Sync: CustomEvent vom selben Tab (AuthContext nach me()-Call beim Start)
  // Wir lesen localStorage als Source of Truth – wenn der User gerade manuell
  // die Sprache gewechselt hat, steht der neue Wert schon im localStorage
  // und wir ignorieren veraltete Profil-Events.
  useEffect(() => {
    const onBcLanguage = (e) => {
      const lang = e.detail?.language;
      if (!lang) return;
      // localStorage ist Source of Truth für manuell gesetzte Sprache
      const lsLang = readLanguage();
      if (lang !== lsLang) return; // localStorage hat neueren Wert → ignorieren
      setLanguage(lang);
    };
    window.addEventListener('bc:language', onBcLanguage);
    return () => window.removeEventListener('bc:language', onBcLanguage);
  }, []);

  // Sync: User-Wechsel im selben Tab (AuthContext dispatcht 'bc:user_changed')
  useEffect(() => {
    const onUserChanged = () => {
      // Preferences zurücksetzen – neue Werte kommen via 'bc:book_lang' / 'bc:shop_region'
      setBookLanguageState('');
      setShoppingRegionState(getShoppingRegion());
    };
    window.addEventListener('bc:user_changed', onUserChanged);
    return () => window.removeEventListener('bc:user_changed', onUserChanged);
  }, []);

  // Sync: storage-Event aus anderen Tabs (echte storage-Events: appLanguage, bc_auth_v2)
  // WICHTIG: window 'storage' feuert NUR in anderen Tabs (nie im selben Tab) – daher sicher.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'appLanguage' && e.newValue) {
        setLanguage(e.newValue);
      }
      // Logout in anderem Tab → zurück zu Deutsch, Preferences leeren
      if (e.key === 'bc_auth_v2' && e.newValue === null) {
        setLanguage('de');
        setBookLanguageState('');
        setShoppingRegionState(getShoppingRegion());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Sync: CustomEvents aus demselben Tab (shoppingRegion.js dispatcht CustomEvents)
  useEffect(() => {
    const onBookLang = (e) => setBookLanguageState(e.detail?.newValue || '');
    const onShopRegion = (e) => { if (e.detail?.newValue) setShoppingRegionState(e.detail.newValue); };
    window.addEventListener('bc:book_lang', onBookLang);
    window.addEventListener('bc:shop_region', onShopRegion);
    return () => {
      window.removeEventListener('bc:book_lang', onBookLang);
      window.removeEventListener('bc:shop_region', onShopRegion);
    };
  }, []);

  const changeLanguage = useCallback((newLanguage) => {
    // 1. Sofort lokal setzen
    setLanguage(newLanguage);
    // 2. localStorage zuerst setzen – muss VOR updateMe sein, damit der bc:language-Handler
    //    (der localStorage liest) den neuen Wert sieht und nicht zurückspringt
    try { localStorage.setItem('appLanguage', newLanguage); } catch {}
    // 3. User-Profil still im Hintergrund speichern – kein await, kein Fehler-Propagation
    base44.auth.updateMe({ language: newLanguage }).catch(() => {});
  }, []);

  const changeBookLanguage = useCallback((lang) => {
    setBookLanguageState(lang);
    setBookLanguage(lang);
  }, []);

  const changeShoppingRegion = useCallback((region) => {
    setShoppingRegionState(region);
    setShoppingRegion(region); // explicit=true by default (Nutzerklick)
    try {
      base44.auth.isAuthenticated().then(isAuth => {
        if (isAuth) base44.auth.updateMe({ shopping_region: region, shopping_region_explicit: true }).catch(() => {});
      });
    } catch {}
  }, []);

  // t(key, fallback?) – synchron, kein async, kein LLM
  const t = useCallback((key, fallback) => _t(key, language, fallback), [language]);

  // Reine Passthrough-Funktionen – kein InvokeLLM
  const translate = useCallback(async (text) => text, []);
  const translateObject = useCallback(async (obj) => obj, []);
  const getLanguageName = useCallback(
    (code) => SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code,
    []
  );

  return (
    <LanguageContext.Provider value={{
      // UI-Sprache (App-Oberfläche)
      language,
      changeLanguage,
      t,
      translate,
      translateObject,
      supportedLanguages: SUPPORTED_LANGUAGES,
      isLoading: false,
      isRTL: language === 'ar',
      getLanguageName,
      // Buchsprache (welche Bücher gesucht werden – langRestrict)
      bookLanguage,
      changeBookLanguage,
      // Einkaufsregion (welche Provider/Shops angezeigt werden)
      shoppingRegion,
      changeShoppingRegion,
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