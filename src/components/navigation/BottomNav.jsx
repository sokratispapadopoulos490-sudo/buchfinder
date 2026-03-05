import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Users, User } from 'lucide-react';
import { createPageUrl } from '@/utils';

const PAGES_WITHOUT_NAV = ['onboarding', 'legal'];

export default function BottomNav() {
  const [isDark, setIsDark] = useState(
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark') || localStorage.getItem('darkMode') === 'true'
      : false
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const check = () => {
      setIsDark(
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('darkMode') === 'true'
      );
    };
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const pathLower = location.pathname.toLowerCase();
  const hide =
    location.pathname === '/' ||
    PAGES_WITHOUT_NAV.some((p) => pathLower.includes(p));


  const navItems = [
    { icon: Users, label: 'Community', path: 'Community' },
    { icon: Compass, label: 'Compass', path: 'Compass' },
    { icon: User, label: 'Account', path: 'Account' },
  ];

  const isActive = (path) =>
    location.pathname.toLowerCase() === `/${path.toLowerCase()}`;

  const bg = isDark ? '#1a1a1a' : '#ffffff';
  const border = isDark ? '#333333' : '#e5e7eb';
  const activeColor = '#d97706';
  const inactiveColor = isDark ? '#888888' : '#78716c';
  const activeBg = isDark ? '#2d1f00' : '#fef3c7';

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: hide ? 'none' : 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        height: `calc(64px + env(safe-area-inset-bottom, 0px))`,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backgroundColor: bg,
        borderTop: `1px solid ${border}`,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.25)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(createPageUrl(item.path))}
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
              backgroundColor: active ? activeBg : bg,
              color: active ? activeColor : inactiveColor,
              padding: '6px 0',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
            }}
          >
            <Icon style={{ width: '22px', height: '22px', strokeWidth: active ? 2.5 : 2 }} />
            <span style={{ fontSize: '10px', fontWeight: active ? 600 : 500 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}