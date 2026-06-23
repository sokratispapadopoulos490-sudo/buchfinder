/**
 * BottomNav – Persistente Bottom-Navigation.
 *
 * Design:
 * - Immer im DOM (gemountet via createPortal in Layout)
 * - Sichtbarkeit über CSS display:none/flex – kein Unmount/Remount
 * - Safe-area-inset-bottom für iOS (Notch, Home-Indicator) in Portrait UND Landscape
 * - Dark Mode per MutationObserver auf document.documentElement.classList
 * - Kein eigener Auth-State – bekommt isAuthenticated als Prop
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Users, User, Search } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';

const PAGES_WITHOUT_NAV = ['onboarding', 'legal'];
const PAGES_WITHOUT_NAV_FIRST_RUN = ['booksearch'];

const NAV_PATHS = [
  { icon: Users,   key: 'nav.community', path: '/Community' },
  { icon: Compass, key: 'nav.compass',   path: '/Compass' },
  { icon: Search,  key: 'nav.discover',  path: '/BookDiscover' },
  { icon: User,    key: 'nav.account',   path: '/Account' },
];

export default function BottomNav({ isAuthenticated, currentPageName, isFirstRun }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const [isDark, setIsDark] = useState(() => {
    try {
      return document.documentElement.classList.contains('dark')
        || localStorage.getItem('darkMode') === 'true';
    } catch { return false; }
  });

  // Dark Mode per MutationObserver – nur re-rendern wenn sich der Wert tatsächlich ändert
  useEffect(() => {
    const check = () => {
      const next = document.documentElement.classList.contains('dark')
        || localStorage.getItem('darkMode') === 'true';
      setIsDark(prev => (prev === next ? prev : next));
    };
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const pageLower = (currentPageName || location.pathname.slice(1) || '').toLowerCase();
  const onExcludedPage = PAGES_WITHOUT_NAV.some(p => pageLower.includes(p));
  const onFirstRunExcludedPage = isFirstRun && PAGES_WITHOUT_NAV_FIRST_RUN.some(p => pageLower.includes(p));
  const visible = isAuthenticated && !onExcludedPage && !onFirstRunExcludedPage;

  const bg       = isDark ? '#1a1a1a' : '#ffffff';
  const border   = isDark ? '#333333' : '#e5e7eb';
  const active   = '#d97706';
  const inactive = isDark ? '#888888' : '#78716c';
  const activeBg = isDark ? '#2d1f00' : '#fef3c7';

  const isActive = (path) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  return (
    <div
      aria-hidden={!visible}
      style={{
        // Immer fixed, immer im DOM – nur display wechselt
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: visible ? 'flex' : 'none',
        flexDirection: 'row',
        alignItems: 'stretch',
        // Höhe: 64px Inhalt + iOS safe-area – funktioniert in Portrait UND Landscape
        height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backgroundColor: bg,
        borderTop: `1px solid ${border}`,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.15)',
        // Verhindert Layout-Shifts durch Viewport-Einheiten
        willChange: 'transform',
      }}
    >
      {NAV_PATHS.map(({ icon: Icon, key, path }) => {
        const label = t(key);
        const current = isActive(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            aria-label={label}
            aria-current={current ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              flex: 1,
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: current ? activeBg : bg,
              color: current ? active : inactive,
              padding: '6px 0',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              transition: 'background-color 0.15s, color 0.15s',
            }}
          >
            <Icon style={{ width: '22px', height: '22px', strokeWidth: current ? 2.5 : 2 }} />
            <span style={{ fontSize: '10px', fontWeight: current ? 600 : 500, lineHeight: 1.2 }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}