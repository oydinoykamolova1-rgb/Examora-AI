import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { type Language } from '../i18n/translations';
import { Leaf, Sun, Moon, Globe, Shield, User } from 'lucide-react';

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
];

export const Navbar: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { theme, toggleTheme, lang, setLang, t, currentStudent, activeView, setActiveView } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const savedUser = localStorage.getItem('tp_user');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;
  const isTeacher = currentUser?.role === 'Ustoz';

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-opacity-85 border-b transition-colors duration-300 border-[var(--border-color)] bg-[var(--bg-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Nature 3D Badge */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('student')}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-900/20 transform hover:rotate-6 transition-transform">
            <Leaf className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
                Examora AI
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 animate-pulse">
                Smart Exam & 3D Certs
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] hidden sm:block font-medium">
              Sun'iy Intellekt va Anti-Cheat Monitoring Platformasi
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Admin vs Student Portal Toggle (Only visible for Ustoz role) */}
          <div className="p-1 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-center gap-1">
            <button
              onClick={() => setActiveView('student')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeView === 'student'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.studentPortal}</span>
            </button>

            {isTeacher && (
              <button
                onClick={() => setActiveView('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeView === 'admin'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-700/30'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t.adminPanel}</span>
              </button>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="p-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] hover:border-emerald-500/50 flex items-center gap-1.5 text-xs font-medium transition-all"
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="uppercase font-bold">{lang}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl glass-panel border border-[var(--border-color)] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-medium flex items-center gap-2.5 hover:bg-emerald-500/10 transition-colors ${
                      lang === l.code ? 'text-emerald-600 font-bold bg-emerald-500/15' : 'text-[var(--text-main)]'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button (Light/Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] hover:border-amber-500/50 text-[var(--text-main)] transition-all transform active:scale-95"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-700" />
            )}
          </button>

          {/* Student Profile Badge */}
          {currentStudent && (
            <button
              onClick={onOpenAuth}
              className="hidden lg:flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-600/20 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                {currentStudent.fullName.charAt(0)}
              </div>
              <span className="max-w-[100px] truncate">{currentStudent.fullName}</span>
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};
