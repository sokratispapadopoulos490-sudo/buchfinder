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
      label: 'Suchen',
      path: '/Home',
      activePaths: ['/Home', '/']
    },
    {
      icon: Compass,
      label: 'Kompass',
      path: '/Compass',
      activePaths: ['/Compass']
    },
    {
      icon: User,
      label: 'Account',
      path: '/Account',
      activePaths: ['/Account']
    }
  ];

  const isActive = (paths) => {
    return paths.some(path => location.pathname === path || location.pathname.startsWith(path + '?'));
  };

  console.log('BottomNav rendered!', { location: location.pathname });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-stone-300 shadow-2xl" style={{ zIndex: 9999 }}>
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.activePaths);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(createPageUrl(item.path.replace('/', '')))}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                  active
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}