import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadDarkMode();
  }, []);

  const loadDarkMode = async () => {
    try {
      const user = await base44.auth.me();
      if (user?.dark_mode) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
    } catch (error) {
      console.error('Error loading dark mode:', error);
    }
  };

  const toggleDarkMode = async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      await base44.auth.updateMe({ dark_mode: newValue });
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors w-full"
    >
      <div className={`w-12 h-7 rounded-full transition-colors ${isDark ? 'bg-amber-600' : 'bg-stone-300'} relative`}>
        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium text-stone-800">Dark Mode</div>
        <div className="text-sm text-stone-500">Dunkles Design aktivieren</div>
      </div>
      {isDark ? <Moon className="w-5 h-5 text-stone-600" /> : <Sun className="w-5 h-5 text-stone-600" />}
    </button>
  );
}