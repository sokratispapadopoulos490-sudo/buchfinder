import React, { useState, useEffect } from 'react';
import ConsentModal from '@/components/legal/ConsentModal';
import BottomNav from '@/components/navigation/BottomNav';
import { base44 } from '@/api/base44Client';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children, currentPageName }) {
  const [showConsent, setShowConsent] = useState(false);
  const [checkingConsent, setCheckingConsent] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkConsentAndRedirect();
  }, []);

  const checkConsentAndRedirect = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const user = await base44.auth.me();
        
        // Consent prüfen
        if (!user.terms_accepted || !user.privacy_accepted) {
          setShowConsent(true);
        }

        // Redirect-Logik: Nur bei Root-Landing (/)
        if (location.pathname === '/') {
          // Prüfe ob Nutzer Bücher hat
          const savedBooks = await base44.entities.SavedBook.filter({ is_completed: false }, '-created_date', 1);
          
          if (savedBooks.length > 0) {
            // Hat Bücher → Compass
            navigate('/Compass');
          } else {
            // Keine Bücher → Home für Buchsuche
            navigate('/Home');
          }
        }
      } else {
        // Nicht eingeloggt → zum Onboarding (nur bei Root)
        if (location.pathname === '/') {
          navigate('/Onboarding');
        }
      }
    } catch (error) {
      console.error('Error checking consent:', error);
      setIsAuthenticated(false);
    } finally {
      setCheckingConsent(false);
    }
  };

  if (checkingConsent) {
    return <div>{children}</div>;
  }

  // Navigation immer anzeigen wenn authentifiziert (außer auf bestimmten Seiten)
  const pagesWithoutNav = ['Onboarding', 'Legal'];
  const showNavigation = isAuthenticated && !pagesWithoutNav.includes(currentPageName);

  console.log('Layout Debug:', { currentPageName, isAuthenticated, showNavigation });

  return (
    <div className={showNavigation ? 'pb-24' : ''}>
      {children}
      {showConsent && (
        <ConsentModal onAccept={() => setShowConsent(false)} />
      )}
      {showNavigation && <BottomNav />}
    </div>
  );
}