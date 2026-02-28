import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Users, User } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
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

  return (
    <>
    {/* DEBUG BADGE – temporär */}
    <div style={{
      position: 'fixed',
      bottom: 64,
      right: 8,
      zIndex: 2147483647,
      background: 'red',
      color: 'white',
      fontSize: '10px',
      fontWeight: 'bold',
      padding: '4px 8px',
      borderRadius: 6,
      pointerEvents: 'none',
    }}>NAV RENDERED</div>
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 2147483647,
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      borderTop: `2px solid ${isDark ? '#333333' : '#d6d3d1'}`,
      borderRadius: '16px 16px 0 0',
      boxShadow: isDark ? '0 -4px 6px -1px rgba(0,0,0,0.4)' : '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
      paddingTop: '10px',
      paddingLeft: '8px',
      paddingRight: '8px',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
      display: 'flex',
      alignItems: 'flex-start',
      visibility: 'visible',
      opacity: 1,
      pointerEvents: 'auto',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        maxWidth: '600px',
        margin: '0 auto',
        gap: '4px'
      }}>
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
                gap: '4px',
                padding: '8px 12px',
                border: 'none',
                backgroundColor: active ? (isDark ? '#3a2a00' : '#fef3c7') : 'transparent',
                borderRadius: '12px',
                cursor: 'pointer',
                color: active ? '#d97706' : (isDark ? '#aaaaaa' : '#78716c'),
                flex: 1,
                minHeight: '48px',
                touchAction: 'manipulation',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Icon style={{ width: '24px', height: '24px', strokeWidth: active ? 2.5 : 2, pointerEvents: 'none' }} />
              <span style={{ 
                fontSize: '11px', 
                fontWeight: active ? 600 : 500,
                textAlign: 'center',
                lineHeight: '1.2',
                pointerEvents: 'none'
              }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}