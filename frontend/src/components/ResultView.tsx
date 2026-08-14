import React, { useEffect, useState } from 'react';
import { type SubmissionResult, api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Certificate3DModal } from './Certificate3DModal';
import confetti from 'canvas-confetti';
import { Award, XCircle, Clock, ArrowLeft, ShieldCheck, Check, X, Sparkles, Target, Brain } from 'lucide-react';

interface ResultViewProps {
  result: SubmissionResult;
  onBackToHome: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onBackToHome }) => {
  const { t, currentStudent } = useApp();
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // AI Explanation Modal State
  const [aiExplainModal, setAiExplainModal] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleFetchAiExplanation = async (item: any) => {
    setAiLoading(true);
    try {
      const res = await api.explainAnswer({
        questionText: item.questionText,
        selectedOptionText: item.selectedOptionText,
        correctOptionText: item.correctOptionText,
        isCorrect: item.isCorrect
      });
      setAiExplainModal({ ...res, questionText: item.questionText });
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (result.isPassed) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [result.isPassed]);

  const accuracy = result.accuracyPercentage ?? result.percentage;
  const knowledgeLevel = result.knowledgeLevel || (result.percentage >= 90 ? "Ekspert (Level C2)" : result.percentage >= 75 ? "Yuqori (Level C1)" : result.percentage >= 60 ? "O'rta (Level B2)" : "Boshlang'ich (Level A2)");
  const timeMinutes = result.timeTakenMinutes || Math.round(result.timeTakenSeconds / 60 * 10) / 10;

  return (
    <div className="max-w-4xl mx-auto py-6">
      
      {/* Top Banner Card: Pass / Fail */}
      <div className={`nature-card-3d glass-panel p-8 mb-8 border text-center relative overflow-hidden ${
        result.isPassed
          ? 'border-emerald-500/50 bg-emerald-600/10'
          : 'border-amber-500/50 bg-amber-600/10'
      }`}>
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl ${
          result.isPassed ? 'bg-emerald-600 text-white shadow-emerald-800/30' : 'bg-amber-600 text-white shadow-amber-800/30'
        }`}>
          {result.isPassed ? <Award className="w-10 h-10 animate-bounce" /> : <XCircle className="w-10 h-10" />}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] mb-2">
          {result.isPassed ? t.testPassed : t.testFailed}
        </h2>
        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mb-6">
          {result.testTitle} bo'yicha imtihon natijalaringiz ASP.NET Core backend tomonidan muvaffaqiyatli baholandi.
        </p>

        {/* Extended Stats Grid: Score, Accuracy %, Knowledge Level, Time Taken */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">{t.score}</div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {result.score} / {result.totalPossibleScore}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1 flex items-center justify-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              <span>Aniqlik Darajasi</span>
            </div>
            <div className="text-xl font-extrabold text-emerald-500">
              {accuracy}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1 flex items-center justify-center gap-1">
              <Brain className="w-3.5 h-3.5 text-teal-500" />
              <span>Bilim Darajasi</span>
            </div>
            <div className="text-xs font-extrabold text-teal-600 dark:text-teal-400 mt-1">
              {knowledgeLevel}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">{t.timeTaken}</div>
            <div className="text-xl font-extrabold text-blue-500 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{timeMinutes} minut</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Get 3D Certificate & Back to Home */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {result.isPassed && (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-amber-700/30 inline-flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-200 animate-spin-slow" />
              <span>Rasmiy 3D Sertifikatni Olish 🎓</span>
            </button>
          )}

          <button
            onClick={onBackToHome}
            className="px-6 py-3.5 rounded-2xl border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] font-bold text-sm inline-flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToSubjects}</span>
          </button>
        </div>

      </div>

      {/* Detailed Answers Review Breakdown */}
      {result.detailedAnswers && result.detailedAnswers.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[var(--text-main)]">Javoblar Tahlili va To'g'ri Kalitlar</h3>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Backend Tasdiqladi
            </span>
          </div>

          <div className="space-y-4">
            {result.detailedAnswers.map((item, idx) => (
              <div
                key={item.questionId}
                className={`glass-panel p-6 border transition-all ${
                  item.isCorrect
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-red-500/40 bg-red-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--bg-card-subtle)] text-[var(--text-muted)]">
                    {t.question} {idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-xl flex items-center gap-1 ${
                      item.isCorrect ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/15 text-red-500'
                    }`}>
                      {item.isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{item.isCorrect ? `+${item.points} ball` : '0 ball'}</span>
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-[var(--text-main)] mb-4">
                  {item.questionText}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                  <div className={`p-3 rounded-xl border ${
                    item.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="text-[10px] text-[var(--text-muted)] font-semibold mb-1">Sizning Javobingiz:</div>
                    <div className="font-bold text-[var(--text-main)]">{item.selectedOptionText}</div>
                  </div>

                  {!item.isCorrect && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mb-1">To'g'ri Javob (Kalit):</div>
                      <div className="font-bold text-[var(--text-main)]">{item.correctOptionText}</div>
                    </div>
                  )}
                </div>

                {/* AI Explanation Trigger Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleFetchAiExplanation(item)}
                    disabled={aiLoading}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-[11px] shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>🤖 AI Tushuntirishi</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Explanation Response Modal */}
      {aiExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel p-6 sm:p-8 max-w-lg w-full border border-emerald-500/40 shadow-2xl relative">
            <button
              onClick={() => setAiExplainModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[var(--text-main)] flex items-center gap-1.5">
                  <span>AI Pedagog Tahlili</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-medium">Sun'iy intellekt tomonidan tushuntirish</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] mb-4">
              "{aiExplainModal.questionText}"
            </div>

            <div className="space-y-3.5 text-xs leading-relaxed mb-6">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                <div className="font-extrabold mb-1">📌 Nega ushbu javob:</div>
                {aiExplainModal.explanation}
              </div>

              <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-800 dark:text-teal-300">
                <div className="font-extrabold mb-1">💡 Asosiy Tushuncha:</div>
                {aiExplainModal.concept}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300">
                <div className="font-extrabold mb-1">🎯 Kelgusi Maslahat:</div>
                {aiExplainModal.tip}
              </div>
            </div>

            <button
              onClick={() => setAiExplainModal(null)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg transition-all"
            >
              Tushundim, Rahmat!
            </button>
          </div>
        </div>
      )}

      {/* 3D Certificate Modal Component */}
      <Certificate3DModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        studentName={currentStudent?.fullName || result.studentName || "Ali Valiyev"}
        testTitle={result.testTitle}
        score={result.score}
        totalScore={result.totalPossibleScore}
        accuracyPercentage={accuracy}
        knowledgeLevel={knowledgeLevel}
        dateStr={new Date().toLocaleDateString('uz-UZ')}
      />

    </div>
  );
};
