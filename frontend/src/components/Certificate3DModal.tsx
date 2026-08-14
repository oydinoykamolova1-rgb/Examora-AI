import React from 'react';
import { Award, Sparkles, X, Printer, CheckCircle2 } from 'lucide-react';

interface Certificate3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  testTitle: string;
  score: number;
  totalScore: number;
  accuracyPercentage: number;
  knowledgeLevel: string;
  dateStr: string;
}

export const Certificate3DModal: React.FC<Certificate3DModalProps> = ({
  isOpen,
  onClose,
  studentName,
  testTitle,
  score,
  totalScore,
  accuracyPercentage,
  knowledgeLevel,
  dateStr
}) => {
  if (!isOpen) return null;

  const certificateId = `EXAMORA-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 3D Certificate Frame Container */}
        <div className="relative p-2 sm:p-4 rounded-3xl bg-gradient-to-br from-amber-400 via-emerald-600 to-teal-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-amber-300/60 transform hover:scale-[1.01] transition-transform duration-500">
          
          {/* Inner Paper Body */}
          <div className="relative bg-[#faf7ef] dark:bg-[#0f1f18] text-[#1c2a23] dark:text-[#f0f7f3] p-8 sm:p-12 rounded-2xl border-2 border-amber-500/40 shadow-inner overflow-hidden">
            
            {/* Watermark 3D Seal in background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Certificate Header */}
            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-600/30">
                <Award className="w-9 h-9" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold text-xs tracking-widest uppercase mb-2 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Examora AI Official Certificate
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-serif tracking-wide bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-700 dark:from-emerald-400 dark:to-amber-400 bg-clip-text text-transparent">
                MUVAFFAQIYAT SERTIFIKATI
              </h2>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 font-mono mt-1">EXAMORA ID: {certificateId}</p>
            </div>

            {/* Body Text */}
            <div className="text-center space-y-4 mb-10 relative z-10">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Ushbu sertifikat tantanali ravishda topshiriladi:
              </p>
              
              <h3 className="text-2xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-300 underline decoration-amber-500/50 decoration-2 underline-offset-8">
                {studentName}
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed pt-2">
                Ushbu talaba online platformamizda <span className="font-bold text-[var(--text-main)]">"{testTitle}"</span> bo'yicha imtihon topshirib, yuqori bilim darajasini amalda isbotladi.
              </p>
            </div>

            {/* 3D Metrics Badge Ribbon */}
            <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mb-10 relative z-10">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">To'plangan Ball</div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400">{score} / {totalScore}</div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Aniqlik Darajasi</div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{accuracyPercentage}%</div>
              </div>

              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Bilim Darajasi</div>
                <div className="text-sm font-extrabold text-teal-600 dark:text-teal-400 mt-1">{knowledgeLevel}</div>
              </div>
            </div>

            {/* Footer Signature & Author Stamp */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-dashed border-amber-500/30 relative z-10">
              
              {/* Date & QR Code Simulation */}
              <div className="flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 border border-emerald-500/30 p-1 flex items-center justify-center font-mono text-[9px] text-center leading-tight">
                  [QR VERIFIED]
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] font-bold">Berilgan Sana:</div>
                  <div className="text-xs font-bold text-[var(--text-main)]">{dateStr}</div>
                </div>
              </div>

              {/* Author Attribution Signature */}
              <div className="text-center sm:text-right">
                <div className="text-xs font-bold text-[var(--text-muted)] mb-1">Platforma Muallifi va Tashkilotchisi:</div>
                <div className="font-serif italic text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  Kamolova Oydinoy
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Tasdiqlangan Muhr & Imzo</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Sertifikatni Chop Etish</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-all"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
