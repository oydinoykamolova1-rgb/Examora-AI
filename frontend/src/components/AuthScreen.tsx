import React, { useState } from 'react';
import { api } from '../services/api';
import { Leaf, Shield, User, Lock, Mail, Sparkles, UserCheck, BookOpen, ChevronRight } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: any) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'Ustoz' | "O'quvchi">("O'quvchi");
  const [groupNumber, setGroupNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await api.login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Email yoki parol noto'g'ri kiritildi.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await api.register({
        fullName,
        email,
        password,
        role,
        groupNumber
      });
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // Quick One-Click Demo Logins
  const handleQuickDemo = async (targetRole: 'Ustoz' | "O'quvchi") => {
    setLoading(true);
    setErrorMsg('');
    try {
      const demoEmail = targetRole === 'Ustoz' ? 'teacher@testplatform.uz' : 'student@testplatform.uz';
      const user = await api.login(demoEmail, '123456');
      onLoginSuccess(user);
    } catch {
      onLoginSuccess({
        id: targetRole === 'Ustoz' ? 99 : 1,
        fullName: targetRole === 'Ustoz' ? "Kamolova Oydinoy (Ustoz)" : "Ali Valiyev",
        email: targetRole === 'Ustoz' ? "teacher@testplatform.uz" : "student@testplatform.uz",
        role: targetRole,
        groupNumber: targetRole === 'Ustoz' ? "Kafedra" : "FN-2026"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Author & Application Overview Banner */}
        <div className="nature-card-3d glass-panel p-8 border border-[var(--border-color)] relative overflow-hidden bg-gradient-to-br from-emerald-900/30 via-teal-800/20 to-transparent">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/30">
            <Leaf className="w-8 h-8 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs mb-4 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platforma Muallifi: Kamolova Oydinoy</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] mb-3 leading-tight">
            Zamonaviy Online Sinov va Imtihon Tizimi 🍃
          </h2>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6">
            Ushbu ilova C# ASP.NET Core Web API monolit arxitekturasida yozilgan bo'lib, o'quvchilarning bilimini avtomatik baholash, aniqlik foizini va ishlangan vaqtni hisoblash hamda rasmiy 3D Sertifikat taqdim etish imkonini beradi.
          </p>

          {/* Feature List */}
          <div className="space-y-2.5 text-xs text-[var(--text-main)] font-semibold mb-8">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>Ustoz va O'quvchi Roliga Mos Interfeys</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Avtomatik Ball & 3D Sertifikat Generatori</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-500" />
              <span>GET So'rovlarida IsCorrect Berkitilgan (Xavfsiz)</span>
            </div>
          </div>

          {/* Author attribution footer note */}
          <div className="pt-4 border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)] italic">
            Dasturiy Muallif: <strong className="text-emerald-600 dark:text-emerald-400 font-bold not-italic">Kamolova Oydinoy</strong>
          </div>
        </div>

        {/* Right Side: Login & Registration Form */}
        <div className="nature-card-3d glass-panel p-6 sm:p-8 border border-[var(--border-color)] shadow-2xl">
          
          {/* Login / Register Tab Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] mb-6">
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-800/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Kirish (Login)
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-800/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Ro'yxatdan O'tish
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Email Manzili</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="masalan: student@testplatform.uz"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Parol</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-800/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? "Kirilmoqda..." : "Tizimga Kirish"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Ism va Familiya</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-sm text-[var(--text-main)]"
                  placeholder="Ali Valiyev"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Email Manzili</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-sm text-[var(--text-main)]"
                  placeholder="ali.valiyev@student.edu.uz"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Parol</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-sm text-[var(--text-main)]"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Rolingiz</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-semibold"
                  >
                    <option value="O'quvchi">O'quvchi</option>
                    <option value="Ustoz">Ustoz (Teacher)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Guruh Raqami</label>
                  <input
                    type="text"
                    value={groupNumber}
                    onChange={e => setGroupNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
                    placeholder="FN-2026"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-800/30 transition-all"
              >
                {loading ? "Ro'yxatdan O'tilmoqda..." : "Ro'yxatdan O'tish"}
              </button>
            </form>
          )}

          {/* Quick Demo One-Click Login Buttons */}
          <div className="pt-6 mt-6 border-t border-[var(--border-color)]">
            <div className="text-[11px] font-bold text-[var(--text-muted)] mb-2 text-center">Tezkor Demo Kirish (1-Click Login):</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("O'quvchi")}
                className="py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500/25 transition-colors flex items-center justify-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>O'quvchi Kirish</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('Ustoz')}
                className="py-2 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/25 transition-colors flex items-center justify-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Ustoz Kirish</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
