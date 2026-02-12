import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Bookmark, Users, User } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Compass,
      label: 'Kompass',
      path: 'Compass'
    },
    {
      icon: Sparkles,
      label: 'Entdecken',
      path: 'Home'
    },
    {
      icon: Bookmark,
      label: 'Bibliothek',
      path: 'Account?tab=library'
    },
    {
      icon: Users,
      label: 'Community',
      path: 'Community'
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
    <div style={{
      position: 'fixed',
      bottom: '120px',
      left: '8px',
      right: '8px',
      backgroundColor: 'white',
      borderTop: '2px solid #d6d3d1',
      borderRadius: '16px',
      zIndex: 99999,
      boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 8px',
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
                padding: '6px 12px',
                border: 'none',
                background: active ? '#fef3c7' : 'transparent',
                borderRadius: '12px',
                cursor: 'pointer',
                color: active ? '#d97706' : '#78716c',
                flex: 1,
                maxWidth: '120px',
                minHeight: '56px',
                touchAction: 'manipulation'
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