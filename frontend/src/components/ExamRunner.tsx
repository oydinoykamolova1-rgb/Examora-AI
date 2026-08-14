import React, { useState, useEffect } from 'react';
import { type StudentTestDetail, type SubmissionResult, api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Clock, ShieldCheck, ChevronLeft, ChevronRight, AlertTriangle, Send } from 'lucide-react';

interface ExamRunnerProps {
  testDetail: StudentTestDetail;
  submissionId: number;
  onCompleted: (result: SubmissionResult) => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({ testDetail, submissionId, onCompleted }) => {
  const { t } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(testDetail.durationMinutes * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Anti-Cheat State
  const [cheatWarnings, setCheatWarnings] = useState(0);
  const [showCheatToast, setShowCheatToast] = useState(false);

  // Anti-Cheat Tab Switching Detector
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !submitting) {
        setCheatWarnings(prev => {
          const nextCount = prev + 1;
          setShowCheatToast(true);
          setTimeout(() => setShowCheatToast(false), 5000);
          if (nextCount >= 3) {
            handleFinalSubmit();
          }
          return nextCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [submitting, selectedAnswers]);

  // Timer Countdown Effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const currentQuestion = testDetail.questions[currentIndex];
  const totalQuestions = testDetail.questions.length;

  const handleSelectOption = (optionId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const answersPayload = Object.entries(selectedAnswers).map(([qId, optId]) => ({
        questionId: Number(qId),
        selectedOptionId: optId
      }));

      const result = await api.submitTest(submissionId, answersPayload);
      onCompleted(result);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isTimeCritical = timeLeft < 180; // less than 3 mins

  return (
    <div className="max-w-4xl mx-auto py-4">
      
      {/* Top Header Card: Title, Progress Bar, Countdown Timer */}
      <div className="glass-panel p-6 mb-8 border border-[var(--border-color)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              <span>{testDetail.subjectName}</span>
              <span>•</span>
              <span>{testDetail.questions.length} ta savol</span>
            </div>
            <h2 className="text-xl font-extrabold text-[var(--text-main)]">{testDetail.title}</h2>
          </div>

          {/* Countdown Clock Widget */}
          <div className={`px-4 py-2 rounded-2xl flex items-center gap-2.5 font-mono text-lg font-bold border transition-colors shadow-inner ${
            isTimeCritical 
              ? 'bg-red-500/15 border-red-500 text-red-500 animate-pulse' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
          }`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[var(--bg-card-subtle)] h-2.5 rounded-full overflow-hidden border border-[var(--border-color)]">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Security Info Pill & Anti-Cheat Badge */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-[var(--text-muted)] gap-2">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t.explanationNote}
          </span>
          <span className={`font-bold px-2.5 py-0.5 rounded-full border transition-all ${
            cheatWarnings > 0 
              ? 'bg-amber-500/20 text-amber-600 border-amber-500/40 animate-pulse' 
              : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
          }`}>
            Anti-Cheat: {cheatWarnings}/3 Ogohlantirish
          </span>
          <span>Topshirildi: {answeredCount} / {totalQuestions}</span>
        </div>
      </div>

      {/* Anti-Cheat Toast Warning Popup */}
      {showCheatToast && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-amber-700 dark:text-amber-300 flex items-center justify-between animate-bounce shadow-xl">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <div className="font-extrabold text-sm">⚠️ Diqqat! Oyna/Tab o'zgarishi aniqlandi!</div>
              <div className="text-xs">Imtihondan tashqariga o'tmang. Ogohlantirishlar soni 3 taga yetsa, test avtomatik topshiriladi ({cheatWarnings}/3).</div>
            </div>
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="nature-card-3d glass-panel p-6 sm:p-8 mb-8 border border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {t.question} {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="text-xs font-bold text-amber-500">
            +{currentQuestion.points} ball
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[var(--text-main)] mb-8 leading-snug">
          {currentQuestion.text}
        </h3>

        {/* Options Grid */}
        <div className="space-y-3.5 mb-8">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestion.id] === option.id;
            const letter = String.fromCharCode(65 + idx); // A, B, C, D

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600/15 border-emerald-500 text-[var(--text-main)] shadow-md shadow-emerald-700/20 translate-y-[-2px]'
                    : 'bg-[var(--bg-card-subtle)] border-[var(--border-color)] text-[var(--text-main)] hover:border-emerald-500/40'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isSelected ? 'bg-emerald-600 text-white' : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]'
                }`}>
                  {letter}
                </div>
                <span className="text-sm font-medium pt-1 leading-relaxed">{option.text}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.previous}</span>
          </button>

          {/* Question Pills Navigator */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-[240px] px-2 py-1">
            {testDetail.questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = currentIndex === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/50'
                      : isAnswered
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-800/30 hover:bg-emerald-700 transition-all"
            >
              <span>{t.next}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-800/30 hover:opacity-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{t.submit}</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel p-6 sm:p-8 max-w-md w-full border border-[var(--border-color)] text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">{t.confirmSubmitTitle}</h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">{t.confirmSubmitDesc}</p>

            <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] mb-6 text-xs text-left border border-[var(--border-color)]">
              <div className="flex justify-between mb-1">
                <span>Javob berilgan savollar:</span>
                <span className="font-bold text-emerald-500">{answeredCount} / {totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>Qolgan vaqt:</span>
                <span className="font-bold text-amber-500">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="py-3 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)]"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-800/30 hover:bg-emerald-700"
              >
                {submitting ? "Hisoblanmoqda..." : t.submit}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
