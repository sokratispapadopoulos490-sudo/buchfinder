import React, { useState, useEffect, useRef } from 'react';
import ConsentModal from '@/components/legal/ConsentModal';
import BottomNav from '@/components/navigation/BottomNav';
import { base44 } from '@/api/base44Client';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/components/language/LanguageContext';

function AppLogo() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '12px',
        left: '12px',
        zIndex: 2147483647,
        pointerEvents: 'auto',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 8px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: '300',
            color: 'white',
          }}>📖</span>
        </div>
        <span style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#292524',
          letterSpacing: '0.3px',
        }}>Book Compass</span>
      </div>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const [showConsent, setShowConsent] = useState(false);
  const [checkingConsent, setCheckingConsent] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Dark Mode sofort aus localStorage anwenden (kein Flackern)
  useEffect(() => {
    const cached = localStorage.getItem('darkMode');
    if (cached === 'true') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#0a0a0a';
      document.body.style.backgroundColor = '#0a0a0a';
    }
  }, []);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      // Einen einzigen me()-Call machen – schneller als isAuthenticated() + me()
      const user = await base44.auth.me();
      setIsAuthenticated(true);

      // Dark Mode aus Nutzerprofil setzen
      if (user?.dark_mode) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.backgroundColor = '#0a0a0a';
        document.body.style.backgroundColor = '#0a0a0a';
        localStorage.setItem('darkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.backgroundColor = '';
        document.body.style.backgroundColor = '';
        localStorage.setItem('darkMode', 'false');
      }

      if (!user.terms_accepted || !user.privacy_accepted) {
        setShowConsent(true);
      }

      if (location.pathname === '/') {
        navigate('/Compass');
      }
    } catch (error) {
      // Nicht eingeloggt
      setIsAuthenticated(false);
      if (location.pathname === '/') {
        navigate('/Onboarding');
      }
    } finally {
      setCheckingConsent(false);
    }
  };

  if (checkingConsent) {
    return (
      <LanguageProvider>
        <div style={{ minHeight: '100dvh', backgroundColor: localStorage.getItem('darkMode') === 'true' ? '#0a0a0a' : '#fff' }}>
          {children}
        </div>
      </LanguageProvider>
    );
  }

  // Navigation immer anzeigen wenn authentifiziert (außer auf bestimmten Seiten)
  const pagesWithoutNav = ['Onboarding', 'Legal'];
  const showNavigation = isAuthenticated && !pagesWithoutNav.includes(currentPageName);
  // Logo nur auf Onboarding anzeigen
  const showLogo = currentPageName === 'Onboarding';

  return (
    <LanguageProvider>
      {showLogo && <AppLogo />}
      <div style={{ paddingBottom: showNavigation ? 'calc(56px + env(safe-area-inset-bottom, 0px))' : '0', minHeight: '100dvh' }}>
        {children}
        {showConsent && (
          <ConsentModal onAccept={() => setShowConsent(false)} />
        )}
      </div>
      {showNavigation && <BottomNav />}
    </LanguageProvider>
  );
}