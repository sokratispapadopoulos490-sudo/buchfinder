import React, { useState, useEffect } from 'react';
import ConsentModal from '@/components/legal/ConsentModal';
import BottomNav from '@/components/navigation/BottomNav';
import { base44 } from '@/api/base44Client';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/components/language/LanguageContext';

const SUPPORTED_LANGUAGES = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
];

function LanguageDropdown() {
  const { language, changeLanguage } = useLanguage();
  return (
    <div style={{ position: 'fixed', top: '12px', right: '12px', zIndex: 99999 }}>
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          background: 'white',
          border: '1px solid #d6d3d1',
          borderRadius: '8px',
          padding: '6px 28px 6px 10px',
          fontSize: '14px',
          color: '#1c1917',
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const [showConsent, setShowConsent] = useState(false);
  const [checkingConsent, setCheckingConsent] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Dark Mode initialisieren SOFORT
  useEffect(() => {
    const initDarkMode = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const user = await base44.auth.me();
          if (user?.dark_mode) {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#141414';
          } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '';
          }
        }
      } catch (error) {
        console.error('Dark mode init error:', error);
      }
    };
    initDarkMode();
  }, []);

  useEffect(() => {
    checkConsentAndRedirect();
  }, []);

  const checkConsentAndRedirect = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const user = await base44.auth.me();
        
        if (!user.terms_accepted || !user.privacy_accepted) {
          setShowConsent(true);
        }

        if (location.pathname === '/') {
          // Neuer Hauptnutzerpfad: Immer zu Compass nach Login
          navigate('/Compass');
        }
      } else if (location.pathname === '/') {
        navigate('/Onboarding');
      }
    } catch (error) {
      console.error('Error checking consent:', error);
      setIsAuthenticated(false);
    } finally {
      setCheckingConsent(false);
    }
  };

  if (checkingConsent) {
    return null;
  }

  // Navigation immer anzeigen wenn authentifiziert (außer auf bestimmten Seiten)
  const pagesWithoutNav = ['Onboarding', 'Legal'];
  const showNavigation = isAuthenticated && !pagesWithoutNav.includes(currentPageName);

  return (
    <LanguageProvider>
      <LanguageDropdown />
      <div style={{ paddingBottom: showNavigation ? '90px' : '0' }}>
        {children}
        {showConsent && (
          <ConsentModal onAccept={() => setShowConsent(false)} />
        )}
      </div>
      {showNavigation && <BottomNav />}
    </LanguageProvider>
  );
}