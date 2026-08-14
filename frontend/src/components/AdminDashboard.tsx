import React, { useState, useEffect } from 'react';
import { type Subject, type TestSummary, type SubmissionResult, api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Shield, Plus, Trash2, CheckSquare, Layers, FileText, BarChart3, Clock, Check, X, Sparkles, UserCheck, Save, Download } from 'lucide-react';

interface AdminDashboardProps {
  subjects: Subject[];
  tests: TestSummary[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ subjects, tests, onRefreshData }) => {
  const { t } = useApp();

  const [activeTab, setActiveTab] = useState<'createTest' | 'createSubject' | 'submissions' | 'userManagement'>('userManagement');
  const [submissions, setSubmissions] = useState<SubmissionResult[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Subject Form State
  const [subjName, setSubjName] = useState('');
  const [subjDesc, setSubjDesc] = useState('');
  const [subjIcon, setSubjIcon] = useState('Code');

  // Test Builder Form State
  const [testSubjectId, setTestSubjectId] = useState<number>(subjects[0]?.id || 1);
  const [testTitle, setTestTitle] = useState('');
  const [testDesc, setTestDesc] = useState('');
  const [testDuration, setTestDuration] = useState(20);
  const [testPassScore, setTestPassScore] = useState(60);
  const [testTotalScore, setTestTotalScore] = useState(100);

  // Questions Builder State
  const [questions, setQuestions] = useState<Array<{
    text: string;
    points: number;
    options: Array<{ text: string; isCorrect: boolean }>;
  }>>([
    {
      text: "C# 'var' kalit so'zi haqidagi qaysi tasdiq to'g'ri?",
      points: 25,
      options: [
        { text: "O'zgaruvchi turini kompilyatsiya bosqichida avtomatik aniqlaydi", isCorrect: true },
        { text: "O'zgaruvchi turini dinamik ravishda har doim o'zgartirish mumkin", isCorrect: false },
        { text: "Bunday kalit so'zi C# tilida mavjud emas", isCorrect: false }
      ]
    }
  ]);

  const [saving, setSaving] = useState(false);

  // AI Test Generator State
  const [aiTopicModal, setAiTopicModal] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const handleGenerateAiTest = async () => {
    if (!aiTopicInput.trim()) return;
    setAiGenerating(true);
    try {
      const generatedQuestions = await api.generateAiTest(aiTopicInput);
      setTestTitle(`${aiTopicInput} - Imtihon Testi`);
      setTestDesc(`AI tomonidan avtomatik yaratilgan ${aiTopicInput} bo'yicha test`);
      setQuestions(generatedQuestions);
      setAiTopicModal(false);
      setAiTopicInput('');
      alert("✨ AI orqali savollar va kalitlar muvaffaqiyatli yaratildi!");
    } finally {
      setAiGenerating(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
    loadUsers();
  }, []);

  const loadSubmissions = async () => {
    const data = await api.getAllSubmissions();
    setSubmissions(data);
  };

  const loadUsers = async () => {
    const data = await api.getAllUsers();
    setUsers(data);
  };

  const handleToggleAttendance = async (user: any) => {
    const newStatus = !user.isPresent;
    await api.updateUserStatus({
      userId: user.id,
      isPresent: newStatus,
      teacherGradeNote: user.teacherGradeNote || "Faol"
    });
    loadUsers();
  };

  const handleSaveGradeNote = async (user: any, note: string) => {
    await api.updateUserStatus({
      userId: user.id,
      isPresent: user.isPresent,
      teacherGradeNote: note
    });
    alert(`${user.fullName} uchun baho/izoh saqlandi!`);
    loadUsers();
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      alert("Yuklab olish uchun natijalar yo'q!");
      return;
    }

    const headers = ["ID", "Talaba", "Test Nomi", "Ball", "Maks Ball", "Aniqlik %", "Holati", "Vaqt (Daqiqa)"];
    const rows = submissions.map(s => [
      s.submissionId,
      `"${s.studentName}"`,
      `"${s.testTitle}"`,
      s.score,
      s.totalPossibleScore,
      `${s.accuracyPercentage || s.percentage}%`,
      s.isPassed ? "O'tdi" : "Yiqildi",
      s.timeTakenMinutes || Math.round(s.timeTakenSeconds / 60)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Test_Natijalari_2026_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjName) return;

    setSaving(true);
    try {
      await api.createSubject({ name: subjName, description: subjDesc, icon: subjIcon });
      setSubjName('');
      setSubjDesc('');
      onRefreshData();
      alert("Fan muvaffaqiyatli saqlandi!");
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        text: "",
        points: 25,
        options: [
          { text: "Option 1", isCorrect: true },
          { text: "Option 2", isCorrect: false }
        ]
      }
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddOption = (qIdx: number) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIdx].options.push({ text: "", isCorrect: false });
      return updated;
    });
  };

  const handleSetOptionCorrect = (qIdx: number, oIdx: number) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIdx].options = updated[qIdx].options.map((opt, i) => ({
        ...opt,
        isCorrect: i === oIdx
      }));
      return updated;
    });
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle) return;

    setSaving(true);
    try {
      await api.createTest({
        subjectId: testSubjectId,
        title: testTitle,
        description: testDesc,
        durationMinutes: testDuration,
        passScore: testPassScore,
        totalScore: testTotalScore,
        questions
      });

      setTestTitle('');
      setTestDesc('');
      onRefreshData();
      alert("Yangi test va savollar kaliti muvaffaqiyatli saqlandi!");
    } finally {
      setSaving(false);
    }
  };

  const passedCount = submissions.filter(s => s.isPassed).length;
  const avgScore = submissions.length > 0 
    ? Math.round(submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length)
    : 0;

  return (
    <div className="max-w-6xl mx-auto py-4">
      
      {/* Top Header & Overview Cards */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-[var(--text-main)] flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-500" />
              <span>Examora AI — Ustoz Boshqaruv Paneli</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
              Examora AI Admin
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">AI Test Yaratish, O'quvchilarni baholash, davomat (Bor/Yo'q) belgilash va natijalar analitikasi</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-5 border border-[var(--border-color)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)]">Jami Testlar</div>
            <div className="text-2xl font-extrabold text-[var(--text-main)]">{tests.length} ta</div>
          </div>
        </div>

        <div className="glass-panel p-5 border border-[var(--border-color)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-500 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)]">O'rtacha Ball</div>
            <div className="text-2xl font-extrabold text-[var(--text-main)]">{avgScore} / 100</div>
          </div>
        </div>

        <div className="glass-panel p-5 border border-[var(--border-color)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)]">O'tgan Talabalar</div>
            <div className="text-2xl font-extrabold text-amber-500">{passedCount} / {submissions.length}</div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-6 border-b border-[var(--border-color)] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('userManagement')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'userManagement'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-800/30'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card-subtle)]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>O'quvchilar Bahosi & Davomati (Bor/Yo'q)</span>
        </button>

        <button
          onClick={() => setActiveTab('createTest')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'createTest'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-800/30'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card-subtle)]'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{t.createTest}</span>
        </button>

        <button
          onClick={() => setActiveTab('createSubject')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'createSubject'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-800/30'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card-subtle)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.createSubject}</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'submissions'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-800/30'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card-subtle)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.submissionsList}</span>
        </button>
      </div>

      {/* TAB 1: User Management (Attendance & Teacher Grading) */}
      {activeTab === 'userManagement' && (
        <div className="glass-panel p-6 border border-[var(--border-color)] overflow-x-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--text-main)]">Ustoz Tomonidan Baholash va Davomat Belgilash</h3>
            <span className="text-xs text-[var(--text-muted)] font-semibold">Jami foydalanuvchilar: {users.length} ta</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">F.I.O.</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Roli</th>
                <th className="py-3 px-4">Guruh</th>
                <th className="py-3 px-4">Davomat (Bor / Yo'q)</th>
                <th className="py-3 px-4">Ustoz Izohi / Bahosi</th>
                <th className="py-3 px-4">Amal</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id} className="border-b border-[var(--border-color)]/50 hover:bg-emerald-500/5">
                  <td className="py-3 px-4 font-bold">{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-[var(--text-main)]">{u.fullName}</td>
                  <td className="py-3 px-4 text-[var(--text-muted)]">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'Ustoz' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{u.groupNumber || '—'}</td>
                  
                  {/* Attendance Toggle Button */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleAttendance(u)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all ${
                        u.isPresent 
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20' 
                          : 'bg-red-600 text-white shadow-md shadow-red-700/20'
                      }`}
                    >
                      {u.isPresent ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{u.isPresent ? "Darsda Bor" : "Yo'q"}</span>
                    </button>
                  </td>

                  {/* Editable Grade Note */}
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      defaultValue={u.teacherGradeNote || "Yaxshi"}
                      onBlur={e => u._tempNote = e.target.value}
                      className="px-3 py-1 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-main)] w-36"
                    />
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        const noteInput = (e.currentTarget.parentElement?.previousElementSibling?.firstChild as HTMLInputElement)?.value;
                        handleSaveGradeNote(u, noteInput || u.teacherGradeNote);
                      }}
                      className="p-1.5 rounded-lg bg-emerald-600/15 text-emerald-600 hover:bg-emerald-600/25 transition-colors"
                      title="Bahoni Saqlash"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: Create Test & Question Builder */}
      {activeTab === 'createTest' && (
        <form onSubmit={handleCreateTest} className="glass-panel p-6 sm:p-8 border border-[var(--border-color)] space-y-6">
          
          {/* AI Generator Action Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-teal-900/20 to-amber-900/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[var(--text-main)]">AI Bilan Test Yaratish (Smart Auto-Fill)</h4>
                <p className="text-xs text-[var(--text-muted)]">Mavzu nomini kiriting va sun'iy intellekt avtomatik ravishda savol va kalitlarni tayyorlab beradi.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAiTopicModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-extrabold text-xs shadow-lg hover:opacity-90 transition-all shrink-0 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>✨ AI Bilan Yaratish</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Tegishli Fan</label>
              <select
                value={testSubjectId}
                onChange={e => setTestSubjectId(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">{t.testTitle}</label>
              <input
                type="text"
                required
                value={testTitle}
                onChange={e => setTestTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Masalan: ASP.NET Core & EF Core Asoslari"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">{t.description}</label>
            <input
              type="text"
              value={testDesc}
              onChange={e => setTestDesc(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Test haqida qisqacha tavsif"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Vaqt (Daqiqa)</label>
              <input
                type="number"
                value={testDuration}
                onChange={e => setTestDuration(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">O'tish Balli</label>
              <input
                type="number"
                value={testPassScore}
                onChange={e => setTestPassScore(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Jami Ball</label>
              <input
                type="number"
                value={testTotalScore}
                onChange={e => setTestTotalScore(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-sm"
              />
            </div>
          </div>

          {/* Interactive Questions Builder */}
          <div className="pt-4 border-t border-[var(--border-color)] space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-[var(--text-main)]">Savollar va Variantlar (Admin Kaliti)</h4>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Savol Qo'shish</span>
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="p-5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-500">
                    Savol {qIdx + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="p-1 rounded-lg text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Savol matnini kiriting"
                    value={q.text}
                    onChange={e => {
                      const updated = [...questions];
                      updated[qIdx].text = e.target.value;
                      setQuestions(updated);
                    }}
                    className="col-span-3 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
                  />
                  <input
                    type="number"
                    value={q.points}
                    onChange={e => {
                      const updated = [...questions];
                      updated[qIdx].points = Number(e.target.value);
                      setQuestions(updated);
                    }}
                    className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
                  />
                </div>

                {/* Options list for question */}
                <div className="space-y-2 pl-4 border-l-2 border-amber-500/40">
                  <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">Variantlar (Radio tugmasi orqali to'g'ri kalitni belgilang):</div>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct_q_${qIdx}`}
                        checked={opt.isCorrect}
                        onChange={() => handleSetOptionCorrect(qIdx, oIdx)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={e => {
                          const updated = [...questions];
                          updated[qIdx].options[oIdx].text = e.target.value;
                          setQuestions(updated);
                        }}
                        className={`flex-1 px-3 py-1.5 rounded-lg border text-xs text-[var(--text-main)] ${
                          opt.isCorrect ? 'bg-emerald-500/10 border-emerald-500 font-semibold' : 'bg-[var(--bg-card)] border-[var(--border-color)]'
                        }`}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOption(qIdx)}
                    className="text-[11px] font-bold text-amber-500 hover:underline pt-1"
                  >
                    + Variant qo'shish
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-lg shadow-amber-800/30 transition-all"
          >
            {saving ? "Saqlanmoqda..." : "Test va Kalitlarni Saqlash"}
          </button>
        </form>
      )}

      {/* TAB 3: Create Subject */}
      {activeTab === 'createSubject' && (
        <form onSubmit={handleCreateSubject} className="glass-panel p-6 sm:p-8 border border-[var(--border-color)] space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">{t.subjectName}</label>
            <input
              type="text"
              required
              value={subjName}
              onChange={e => setSubjName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Masalan: Python & Django Architecture"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">{t.description}</label>
            <input
              type="text"
              value={subjDesc}
              onChange={e => setSubjDesc(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Fan haqida qisqacha ma'lumot"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Belgi (Icon)</label>
            <select
              value={subjIcon}
              onChange={e => setSubjIcon(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-sm"
            >
              <option value="Code">Code (Dasturlash)</option>
              <option value="Database">Database (Baza)</option>
              <option value="Cpu">Cpu (Algoritm)</option>
              <option value="BookOpen">BookOpen (Umumiy)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-800/30 transition-all"
          >
            {saving ? "Saqlanmoqda..." : t.createSubject}
          </button>
        </form>
      )}

      {/* TAB 4: Submissions List */}
      {activeTab === 'submissions' && (
        <div className="glass-panel p-6 border border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[var(--text-main)]">Imtihon Natijalari (Submissions)</h3>
              <p className="text-xs text-[var(--text-muted)]">O'quvchilar tomonidan topshirilgan barcha test yechimlari</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-800/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Excel (CSV) Yuklab Olish</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">{t.student}</th>
                <th className="py-3 px-4">Test</th>
                <th className="py-3 px-4">{t.score}</th>
                <th className="py-3 px-4">Aniqlik %</th>
                <th className="py-3 px-4">{t.status}</th>
                <th className="py-3 px-4">Vaqt</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr key={sub.submissionId} className="border-b border-[var(--border-color)]/50 hover:bg-emerald-500/5">
                  <td className="py-3 px-4 font-bold">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-[var(--text-main)]">{sub.studentName}</td>
                  <td className="py-3 px-4 text-[var(--text-muted)]">{sub.testTitle}</td>
                  <td className="py-3 px-4 font-bold">{sub.score} / {sub.totalPossibleScore}</td>
                  <td className="py-3 px-4 font-bold">{sub.accuracyPercentage || sub.percentage}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1 ${
                      sub.isPassed ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/15 text-red-500'
                    }`}>
                      {sub.isPassed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{sub.isPassed ? t.passed : t.failed}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-muted)]">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-amber-500" />
                      {sub.timeTakenMinutes || Math.round(sub.timeTakenSeconds / 60)}m
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* AI Test Generator Input Modal */}
      {aiTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel p-6 sm:p-8 max-w-md w-full border border-emerald-500/40 shadow-2xl relative">
            <button
              onClick={() => setAiTopicModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-amber-600/30">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold text-[var(--text-main)] mb-1">AI Test Yaratuvchi ✨</h3>
            <p className="text-xs text-[var(--text-muted)] mb-6">Mavzu nomini kiriting (masalan: <i>ASP.NET Core Web API</i>, <i>React Hooks</i>, <i>SQL Joins</i>) va AI avtomatik savollarni tayyorlaydi.</p>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">Mavzu yoki Texnologiya Nomi</label>
              <input
                type="text"
                required
                value={aiTopicInput}
                onChange={e => setAiTopicInput(e.target.value)}
                placeholder="Masalan: ASP.NET Core & EF Core"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAiTopicModal(false)}
                className="py-3 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)]"
              >
                Bekor Qilish
              </button>

              <button
                type="button"
                onClick={handleGenerateAiTest}
                disabled={aiGenerating || !aiTopicInput.trim()}
                className="py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-lg disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                {aiGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Yaratilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Yaratish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
