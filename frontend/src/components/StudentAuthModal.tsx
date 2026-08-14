import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { UserCheck, X } from 'lucide-react';

export const StudentAuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentStudent, setCurrentStudent, t } = useApp();

  const [fullName, setFullName] = useState(currentStudent?.fullName || '');
  const [email, setEmail] = useState(currentStudent?.email || '');
  const [groupNumber, setGroupNumber] = useState(currentStudent?.groupNumber || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setLoading(true);
    try {
      const student = await api.registerStudent({ fullName, email, groupNumber });
      setCurrentStudent(student);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 shadow-2xl border border-[var(--border-color)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:bg-emerald-500/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">{t.registerStudent}</h3>
            <p className="text-xs text-[var(--text-muted)]">Test topshirish uchun profilni tasdiqlang</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">{t.fullName}</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="Ali Valiyev"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">{t.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="ali.valiyev@student.edu.uz"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">{t.groupNumber}</label>
            <input
              type="text"
              value={groupNumber}
              onChange={e => setGroupNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="FN-2026"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-800/30 transition-all transform active:scale-98"
          >
            {loading ? "Saqlanmoqda..." : t.saveAndContinue}
          </button>
        </form>
      </div>
    </div>
  );
};
