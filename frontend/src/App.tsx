import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { SubjectList } from './components/SubjectList';
import { TestList } from './components/TestList';
import { ExamRunner } from './components/ExamRunner';
import { ResultView } from './components/ResultView';
import { AdminDashboard } from './components/AdminDashboard';
import { AiChatWidget } from './components/AiChatWidget';
import { type Subject, type TestSummary, type StudentTestDetail, type SubmissionResult, api } from './services/api';
import { Leaf, Sparkles, BookOpen, User, LogOut, Shield } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, setCurrentStudent } = useApp();

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('tp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeTestDetail, setActiveTestDetail] = useState<StudentTestDetail | null>(null);
  const [activeSubmissionId, setActiveSubmissionId] = useState<number | null>(null);
  const [examResult, setExamResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadInitialData();
      if (currentUser.role === 'Ustoz') {
        setActiveView('admin');
      }
    }
  }, [currentUser]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const subjData = await api.getSubjects();
      setSubjects(subjData);
      const testData = await api.getTests();
      setTests(testData);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('tp_user', JSON.stringify(user));
    setCurrentStudent({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      groupNumber: user.groupNumber || "FN-2026"
    });

    if (user.role === 'Ustoz') {
      setActiveView('admin');
    } else {
      setActiveView('student');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tp_user');
    setCurrentStudent(null);
  };

  const handleSelectSubject = async (subjectId: number | null) => {
    setSelectedSubjectId(subjectId);
    setLoading(true);
    try {
      const filteredTests = await api.getTests(subjectId || undefined);
      setTests(filteredTests);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId: number) => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const testDetail = await api.getStudentTest(testId);
      const submission = await api.startTest(currentUser.id, testId);

      setActiveTestDetail(testDetail);
      setActiveSubmissionId(submission.submissionId);
      setExamResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExamCompleted = (result: SubmissionResult) => {
    setActiveTestDetail(null);
    setActiveSubmissionId(null);
    setExamResult(result);
  };

  const handleBackToHome = () => {
    setActiveTestDetail(null);
    setActiveSubmissionId(null);
    setExamResult(null);
    loadInitialData();
  };

  // IF NOT LOGGED IN -> SHOW AUTH & WELCOME SCREEN (Kamolova Oydinoy)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] flex flex-col relative overflow-hidden transition-colors duration-300">
        <div className="fixed top-10 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-nature-float pointer-events-none -z-10" />
        <Navbar onOpenAuth={() => {}} />
        <main className="flex-1 max-w-7xl w-full mx-auto">
          <AuthScreen onLoginSuccess={handleLoginSuccess} />
        </main>
        <footer className="border-t border-[var(--border-color)] py-6 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-card)]">
          Platforma Muallifi: <strong className="text-emerald-600 font-bold">Kamolova Oydinoy</strong> — ASP.NET Core Monolith 10 & React Vite 3D Nature UI
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* 3D Nature Ambient Background Floating Spheres */}
      <div className="fixed top-10 left-10 w-96 h-96 bg-emerald-600/10 dark:bg-emerald-500/10 rounded-full blur-3xl animate-nature-float pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-[30rem] h-[30rem] bg-amber-600/10 dark:bg-amber-500/10 rounded-full blur-3xl animate-nature-float pointer-events-none -z-10 delay-1000" />

      {/* Top Navbar */}
      <Navbar onOpenAuth={() => {}} />

      {/* User Session Bar */}
      <div className="bg-[var(--bg-card-subtle)] border-b border-[var(--border-color)] py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">Kirilgan Profil:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              {currentUser.role === 'Ustoz' ? <Shield className="w-3.5 h-3.5 text-amber-500" /> : <User className="w-3.5 h-3.5 text-emerald-500" />}
              {currentUser.fullName} ({currentUser.role})
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 font-bold hover:underline"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Chiqish</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: UST OZ (TEACHER) DASHBOARD (Enforce Role Access) */}
        {activeView === 'admin' && currentUser?.role === 'Ustoz' ? (
          <AdminDashboard
            subjects={subjects}
            tests={tests}
            onRefreshData={loadInitialData}
          />
        ) : activeView === 'admin' && currentUser?.role !== 'Ustoz' ? (
          <div className="glass-panel p-8 text-center max-w-lg mx-auto border border-red-500/30">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Ruxsat Cheklangan ⛔</h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">
              Siz o'quvchi profilida kirdingiz. Ustoz paneliga faqat <strong>Ustoz</strong> rolidagi foydalanuvchilar kirishi mumkin.
            </p>
            <button
              onClick={() => setActiveView('student')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Talaba Portaliga Qaytish
            </button>
          </div>
        ) : examResult ? (
          /* VIEW 2: TEST RESULT VIEW WITH 3D CERTIFICATE */
          <ResultView
            result={examResult}
            onBackToHome={handleBackToHome}
          />
        ) : activeTestDetail && activeSubmissionId ? (
          /* VIEW 3: LIVE EXAM RUNNER WITH TIMER */
          <ExamRunner
            testDetail={activeTestDetail}
            submissionId={activeSubmissionId}
            onCompleted={handleExamCompleted}
          />
        ) : (
          /* VIEW 4: STUDENT PORTAL (SUBJECTS & TESTS) */
          <div>
            {/* Hero Banner */}
            <div className="nature-card-3d glass-panel p-8 sm:p-10 mb-10 border border-[var(--border-color)] relative overflow-hidden bg-gradient-to-br from-emerald-800/20 via-teal-700/10 to-transparent">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-4 border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Examora AI Platform • 3D Certificate & Smart Proctoring Enabled</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-main)] mb-3 leading-tight tracking-tight">
                  Bilimingizni Sinang va Rasmiy Examora 3D Sertifikat Oling 🍃
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                  Online imtihon topshirib, o'z aniqlik foizingiz, sarflangan vaqtingiz va bilim darajangizni aniqlang hamda rasmiy sertifikatni qo'lga kiriting.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs font-semibold flex items-center gap-1.5 text-[var(--text-main)]">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <span>{subjects.length} ta fan yo'nalishi</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs font-semibold flex items-center gap-1.5 text-[var(--text-main)]">
                    <Leaf className="w-4 h-4 text-amber-500" />
                    <span>Examora AI Assistant</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Subject Selector */}
            <SubjectList
              subjects={subjects}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={handleSelectSubject}
            />

            {/* Available Tests */}
            {loading ? (
              <div className="py-12 text-center">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-[var(--text-muted)]">Examora AI Testlar yuklanmoqda...</p>
              </div>
            ) : (
              <TestList
                tests={tests}
                onStartTest={handleStartTest}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-6 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-card)] mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-[var(--text-main)]">Examora AI</span>
            <span>— Platforma Muallifi: <strong>Kamolova Oydinoy</strong> (.NET 10 & React 19)</span>
          </div>
        </div>
      </footer>

      {/* Floating 3D Cyber-Nature AI Tutor Widget */}
      <AiChatWidget />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
