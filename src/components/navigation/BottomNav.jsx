import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Search, User } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Search,
      label: 'Neue Entdeckungsreise',
      path: 'Home'
    },
    {
      icon: Compass,
      label: 'Lesekompass',
      path: 'Compass'
    },
    {
      icon: User,
      label: 'Mein Account',
      path: 'Account'
    }
  ];

  const isActive = (path) => {
    return location.pathname === `/${path}` || (path === 'Home' && location.pathname === '/');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '2px solid #d6d3d1',
      zIndex: 99999,
      boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 8px 12px 8px',
        maxWidth: '600px',
        margin: '0 auto'
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
                maxWidth: '120px'
              }}
            >
              <Icon style={{ width: '24px', height: '24px', strokeWidth: active ? 2.5 : 2 }} />
              <span style={{ 
                fontSize: '11px', 
                fontWeight: active ? 600 : 500,
                textAlign: 'center',
                lineHeight: '1.2'
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}