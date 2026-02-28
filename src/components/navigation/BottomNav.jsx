import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Users, User } from 'lucide-react';
import { createPageUrl } from '@/utils';

const PAGES_WITHOUT_NAV = ['Onboarding', 'Legal', 'onboarding', 'legal'];

export default function BottomNav() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMounted(true);

    const check = () => {
      setIsDark(
        document.documentElement.classList.contains('dark') ||
          localStorage.getItem('darkMode') === 'true'
      );
    };
    check();

    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Nicht zeigen auf Onboarding/Legal oder wenn Pfad '/' (Redirect läuft noch)
  const currentPage = location.pathname.replace('/', '');
  const hide =
    location.pathname === '/' ||
    PAGES_WITHOUT_NAV.some((p) => location.pathname.toLowerCase().includes(p.toLowerCase()));

  if (!mounted || hide) return null;

  const navItems = [
    { icon: Users, label: 'Community', path: 'Community' },
    { icon: Compass, label: 'Compass', path: 'Compass' },
    { icon: User, label: 'Account', path: 'Account' },
  ];

  const isActive = (path) => location.pathname === `/${path}`;

  const nav = (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '56px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
        borderTop: `2px solid ${isDark ? '#444444' : '#d6d3d1'}`,
        borderRadius: '16px 16px 0 0',
        boxShadow: isDark
          ? '0 -4px 20px rgba(0,0,0,0.8)'
          : '0 -4px 6px -1px rgba(0,0,0,0.1)',
        pointerEvents: 'auto',
        // Force GPU layer for Android
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <div
            key={item.path}
            onClick={() => navigate(createPageUrl(item.path))}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              flex: 1,
              height: '100%',
              cursor: 'pointer',
              color: active ? '#d97706' : isDark ? '#aaaaaa' : '#78716c',
              backgroundColor: active ? (isDark ? '#3a2a00' : '#fef3c7') : 'transparent',
              borderRadius: '10px',
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Icon style={{ width: '22px', height: '22px', strokeWidth: active ? 2.5 : 2 }} />
            <span style={{ fontSize: '10px', fontWeight: active ? 600 : 500, lineHeight: 1.2 }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  return createPortal(nav, document.body);
}