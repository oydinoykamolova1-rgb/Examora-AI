import React from 'react';
import { type Subject } from '../services/api';
import { useApp } from '../context/AppContext';
import { Code, Database, Cpu, BookOpen, ChevronRight, Layers } from 'lucide-react';

interface SubjectListProps {
  subjects: Subject[];
  selectedSubjectId: number | null;
  onSelectSubject: (id: number | null) => void;
}

const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'Code': return <Code className="w-7 h-7 text-emerald-500" />;
    case 'Database': return <Database className="w-7 h-7 text-amber-500" />;
    case 'Cpu': return <Cpu className="w-7 h-7 text-teal-500" />;
    default: return <BookOpen className="w-7 h-7 text-emerald-500" />;
  }
};

export const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubject
}) => {
  const { t } = useApp();

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            {t.selectSubject}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">O'zingiz o'rganmoqchi va bilimingizni sinamoqchi bo'lgan yo'nalishni tanlang</p>
        </div>

        {selectedSubjectId !== null && (
          <button
            onClick={() => onSelectSubject(null)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all"
          >
            Barchasini ko'rsatish
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map(subject => {
          const isSelected = selectedSubjectId === subject.id;
          return (
            <div
              key={subject.id}
              onClick={() => onSelectSubject(isSelected ? null : subject.id)}
              className={`nature-card-3d p-6 cursor-pointer border transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? 'bg-emerald-600/15 border-emerald-500 shadow-xl shadow-emerald-700/20 scale-[1.02]'
                  : 'glass-panel hover:border-emerald-500/50'
              }`}
            >
              {/* Subtle 3D background nature glow circle */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-center justify-center shadow-inner">
                  {renderIcon(subject.icon)}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {subject.testCount} {t.questions}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[var(--text-main)] mb-2 group-hover:text-emerald-500 transition-colors">
                {subject.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">
                {subject.description}
              </p>

              <div className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1 mt-auto">
                <span>{isSelected ? "Tanlandi" : "Testlarni ko'rish"}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
