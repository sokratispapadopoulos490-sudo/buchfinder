import React, { useState, useEffect } from 'react';
import ConsentModal from '@/components/legal/ConsentModal';
import BottomNav from '@/components/navigation/BottomNav';
import { base44 } from '@/api/base44Client';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/components/language/LanguageContext';

// Dark Mode sofort anwenden – noch bevor React rendert
(function applyDarkModeFromCache() {
  try {
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#0a0a0a';
      document.body.style.backgroundColor = '#0a0a0a';
    }
  } catch (e) {}
})();

function AppLogo() {
  return (
    <div style={{ position: 'fixed', top: '12px', left: '12px', zIndex: 2147483647, pointerEvents: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <span style={{ fontSize: '20px', fontWeight: '300', color: 'white' }}>📖</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#292524', letterSpacing: '0.3px' }}>Book Compass</span>
      </div>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const [showConsent, setShowConsent] = useState(false);
  // Auth-Status sofort aus Cache – kein Flackern beim Drehen
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // sessionStorage überlebt Orientation-Changes, Tab-Close setzt es zurück
    const alreadyInit = sessionStorage.getItem('appInitDone') === 'true';
    if (alreadyInit) {
      // Beim Re-Mount durch Rotation: Auth-Status aus Cache übernehmen – kein API Call
      const cached = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(cached);
      return;
    }
    sessionStorage.setItem('appInitDone', 'true');
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const user = await base44.auth.me();
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');

      // Dark Mode aus Nutzerprofil setzen
      if (user?.dark_mode) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.backgroundColor = '#0a0a0a';
        document.body.style.backgroundColor = '#0a0a0a';
        localStorage.setItem('darkMode', 'true');
      } else if (localStorage.getItem('darkMode') !== 'true') {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.backgroundColor = '';
        document.body.style.backgroundColor = '';
        localStorage.setItem('darkMode', 'false');
      }

      // Sprache aus Nutzerprofil setzen
      if (user?.language && user.language !== localStorage.getItem('appLanguage')) {
        localStorage.setItem('appLanguage', user.language);
      }

      if (!user.terms_accepted || !user.privacy_accepted) {
        setShowConsent(true);
      }

      if (location.pathname === '/') {
        navigate('/Compass');
      }
    } catch (error) {
      // Nicht ausloggen bei vorübergehenden Fehlern (z.B. Netzwerk beim Drehen)
      // Auth nur löschen wenn der Nutzer noch nie angemeldet war
      const wasPreviouslyAuth = localStorage.getItem('isAuthenticated') === 'true';
      if (!wasPreviouslyAuth) {
        setIsAuthenticated(false);
        if (location.pathname === '/') {
          navigate('/Onboarding');
        }
      }
      // War vorher eingeloggt → cachedState behalten, kein Logout
    }
  };

  const pagesWithoutNav = ['Onboarding', 'Legal'];
  const showNavigation = isAuthenticated && !pagesWithoutNav.includes(currentPageName);
  const showLogo = currentPageName === 'Onboarding';

  return (
    <LanguageProvider>
      {showLogo && <AppLogo />}
      <div style={{
        paddingBottom: showNavigation ? 'calc(64px + env(safe-area-inset-bottom, 0px))' : '0',
        minHeight: '100dvh',
      }}>
        {children}
        {showConsent && (
          <ConsentModal onAccept={() => setShowConsent(false)} />
        )}
      </div>
      <BottomNav />
    </LanguageProvider>
  );
}