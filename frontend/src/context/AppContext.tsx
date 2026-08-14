import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Language, translations, type Translation } from '../i18n/translations';

export interface StudentInfo {
  id: number;
  fullName: string;
  email: string;
  groupNumber: string;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation;
  currentStudent: StudentInfo | null;
  setCurrentStudent: (student: StudentInfo | null) => void;
  activeView: 'student' | 'admin';
  setActiveView: (view: 'student' | 'admin') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('tp_theme') as 'light' | 'dark') || 'dark';
  });

  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('tp_lang') as Language) || 'uz';
  });

  const [currentStudent, setCurrentStudentState] = useState<StudentInfo | null>(() => {
    const saved = localStorage.getItem('tp_student');
    return saved ? JSON.parse(saved) : { id: 1, fullName: 'Ali Valiyev', email: 'ali.valiyev@student.edu.uz', groupNumber: 'FN-2026' };
  });

  const [activeView, setActiveView] = useState<'student' | 'admin'>('student');

  useEffect(() => {
    localStorage.setItem('tp_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('tp_lang', newLang);
  };

  const setCurrentStudent = (student: StudentInfo | null) => {
    setCurrentStudentState(student);
    if (student) {
      localStorage.setItem('tp_student', JSON.stringify(student));
    } else {
      localStorage.removeItem('tp_student');
    }
  };

  const t = translations[lang] || translations.uz;

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      lang,
      setLang,
      t,
      currentStudent,
      setCurrentStudent,
      activeView,
      setActiveView
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
