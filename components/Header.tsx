import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, UserIcon, SettingsIcon, LogoutIcon } from './icons';

type View = 'dashboard' | 'editor' | 'profile' | 'settings';

interface HeaderProps {
    activeView: View;
    onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getTitle = () => {
    switch (activeView) {
      case 'dashboard':
      case 'editor':
        return 'Courses';
      case 'profile':
        return 'Profile';
      case 'settings':
        return 'Settings';
      default:
        return 'Courses';
    }
  };

  return (
    <header className="bg-neutral-50 dark:bg-[#111111] h-16 flex items-center justify-between px-6 flex-shrink-0 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center">
        {activeView === 'editor' && (
            <>
                <button onClick={() => onNavigate('dashboard')} className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors" aria-label="Go back to dashboard">
                    <ChevronLeftIcon />
                </button>
                <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-700 mx-4"></div>
            </>
        )}
        <h1 className="text-xl font-semibold text-black dark:text-white">{getTitle()}</h1>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button 
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="p-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors" 
            aria-label="User Profile"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
        >
            <UserIcon/>
        </button>
        {isDropdownOpen && (
             <div 
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1F1F1F] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg py-1 z-10 origin-top-right transition-all duration-200 ease-out"
                style={{ transform: 'scale(0.95)', opacity: 0, animation: 'dropdown-enter 0.2s ease-out forwards' }}
            >
                 <button onClick={() => { onNavigate('profile'); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">
                     <UserIcon />
                     <span className="ml-3">Profile</span>
                 </button>
                 <button onClick={() => { onNavigate('settings'); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">
                     <SettingsIcon />
                     <span className="ml-3">Settings</span>
                 </button>
                 <div className="border-t border-neutral-200 dark:border-neutral-700 my-1"></div>
                 <a href="#" className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">
                     <LogoutIcon />
                     <span className="ml-3">Log out</span>
                 </a>
             </div>
        )}
      </div>
       <style>{`
        @keyframes dropdown-enter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;