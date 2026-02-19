import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
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
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const dropdown = (
    <div ref={ref} style={{ position: 'fixed', top: '10px', right: '12px', zIndex: 2147483647 }}>
      {/* Flag button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'white',
          border: '1px solid #d6d3d1',
          borderRadius: '8px',
          padding: '6px 8px',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          lineHeight: 1,
        }}
      >
        <span>{currentLang.flag}</span>
        <span style={{ fontSize: '10px', color: '#78716c', marginTop: '2px' }}>▾</span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: 'absolute',
          top: '42px',
          right: 0,
          background: 'white',
          border: '1px solid #e7e5e4',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          minWidth: '160px',
          overflow: 'hidden',
          zIndex: 2147483647,
        }}>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { changeLanguage(lang.code); setOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '9px 14px',
                background: lang.code === language ? '#fef3c7' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#1c1917',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '18px' }}>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return ReactDOM.createPortal(dropdown, document.body);
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