import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MainNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: 'Buchsuche',
      path: '/BookSearch',
      icon: Search,
      label: 'Suche'
    },
    {
      name: 'Kompass',
      path: '/Compass',
      icon: Compass,
      label: 'Kompass'
    },
    {
      name: 'Account',
      path: '/Account',
      icon: User,
      label: 'Account'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-30 safe-area-bottom">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all",
                  active
                    ? "text-amber-600"
                    : "text-stone-500 hover:text-stone-700"
                )}
              >
                <Icon className={cn("w-6 h-6", active && "scale-110")} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}