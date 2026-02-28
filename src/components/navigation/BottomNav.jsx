import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Users, User } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => {
      const hasDarkClass = document.documentElement.classList.contains('dark');
      const darkFromStorage = localStorage.getItem('darkMode') === 'true';
      setIsDark(hasDarkClass || darkFromStorage);
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const navItems = [
    {
      icon: Users,
      label: 'Community',
      path: 'Community'
    },
    {
      icon: Compass,
      label: 'Compass',
      path: 'Compass'
    },
    {
      icon: User,
      label: 'Account',
      path: 'Account'
    }
  ];

  const isActive = (path) => {
    return location.pathname === `/${path}` || (path === 'Home' && location.pathname === '/');
  };

  const navStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2147483647,
    backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
    borderTop: `2px solid ${isDark ? '#444444' : '#d6d3d1'}`,
    borderRadius: '16px 16px 0 0',
    boxShadow: isDark ? '0 -4px 20px rgba(0,0,0,0.8)' : '0 -4px 6px -1px rgba(0,0,0,0.1)',
    paddingTop: '8px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    minHeight: '56px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    visibility: 'visible',
    opacity: 1,
    pointerEvents: 'auto',
    WebkitTransform: 'translateZ(0)',
    transform: 'translateZ(0)',
  };

  return (
    <nav style={navStyle}>
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
              padding: '6px 4px',
              borderRadius: '10px',
              cursor: 'pointer',
              color: active ? '#d97706' : (isDark ? '#aaaaaa' : '#78716c'),
              backgroundColor: active ? (isDark ? '#3a2a00' : '#fef3c7') : 'transparent',
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
    </nav>
  );
}