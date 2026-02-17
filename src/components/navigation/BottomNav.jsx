import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Bookmark, Users, User } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Users,
      label: 'Community',
      path: 'Community'
    },
    {
      icon: Compass,
      label: 'Kompass',
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
    <nav style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      zIndex: 9999999,
      backgroundColor: 'white',
      borderTop: '2px solid #d6d3d1',
      borderRadius: '16px 16px 0 0',
      boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '10px 8px 45px 8px'
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
            <button
              key={item.path}
              onClick={() => navigate(createPageUrl(item.path))}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                border: 'none',
                background: active ? '#fef3c7' : 'transparent',
                borderRadius: '12px',
                cursor: 'pointer',
                color: active ? '#d97706' : '#78716c',
                flex: 1,
                minHeight: '56px',
                touchAction: 'manipulation'
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
            </button>
          );
        })}
      </div>
    </nav>
  );
}