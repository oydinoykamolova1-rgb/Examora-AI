import React from 'react';
import { type TestSummary } from '../services/api';
import { useApp } from '../context/AppContext';
import { Clock, Award, HelpCircle, Play, ShieldAlert } from 'lucide-react';

interface TestListProps {
  tests: TestSummary[];
  onStartTest: (testId: number) => void;
}

export const TestList: React.FC<TestListProps> = ({ tests, onStartTest }) => {
  const { t } = useApp();

  if (tests.length === 0) {
    return (
      <div className="glass-panel p-8 text-center my-6">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <p className="text-sm font-semibold text-[var(--text-muted)]">Hozircha ushbu yo'nalishda testlar mavjud emas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
        <span>{t.availableTests}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
          {tests.length} ta test
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map(test => (
          <div
            key={test.id}
            className="nature-card-3d glass-panel p-6 border border-[var(--border-color)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  {test.subjectName}
                </span>
                <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-muted)]">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{test.durationMinutes} {t.duration}</span>
                </div>
              </div>

              <h4 className="text-lg font-extrabold text-[var(--text-main)] mb-2">
                {test.title}
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
                {test.description}
              </p>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-[10px] text-[var(--text-muted)]">{t.passScore}</div>
                    <div className="font-bold text-[var(--text-main)]">{test.passScore} / {test.totalScore} ball</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="text-[10px] text-[var(--text-muted)]">{t.questions}</div>
                    <div className="font-bold text-[var(--text-main)]">{test.questionCount} ta savol</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onStartTest(test.id)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-800/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t.startTest}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
