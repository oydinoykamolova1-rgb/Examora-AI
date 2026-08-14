import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, Lightbulb } from 'lucide-react';
import { api } from '../services/api';

export const AiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; suggestion?: string }>>([
    {
      sender: 'ai',
      text: "Salom! Men **Examora AI** 🤖 - Sizning intellektual o'quv va imtihon assistentingizman. Dasturlash, C#, React, PostgreSQL, AI generator yoki sertifikatlar bo'yicha har qanday savolingizni bering!",
      suggestion: "Masalan: 'Examora AI sertifikati haqida aytib ber' deb so'rang."
    }
  ]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim() || loading) return;

    const userText = inputMsg.trim();
    setInputMsg('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.askAiAssistant(userText);
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: res.answer, suggestion: res.suggestion }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputMsg(promptText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.5)] border-2 border-amber-300/50 hover:scale-105 transition-all duration-300 flex items-center gap-3"
        >
          <div className="relative">
            <Bot className="w-7 h-7 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span className="hidden sm:inline font-extrabold text-xs tracking-wide">
            Examora AI Assistant ✨
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="nature-card-3d glass-panel w-80 sm:w-96 rounded-3xl border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col h-[500px] animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white flex items-center justify-between border-b border-emerald-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
                <Bot className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>Examora AI Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-[10px] text-emerald-200 font-medium">Onlayn AI O'quv Murabbiyingiz</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[var(--bg-primary)]/80 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none font-medium'
                      : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>

                {m.suggestion && (
                  <div className="mt-1.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-1.5 max-w-[85%]">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                    <span>{m.suggestion}</span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] p-2">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span>Oydin AI o'ylamoqda...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-[var(--bg-card-subtle)] border-t border-[var(--border-color)] flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleQuickPrompt("C# maslahati va imtihon tushuntirishi")}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap hover:bg-emerald-500/20"
            >
              💡 C# Maslahat
            </button>
            <button
              onClick={() => handleQuickPrompt("Imtihonda qanday yuqori ball olish mumkin?")}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap hover:bg-amber-500/20"
            >
              🎯 Sertifikat Taktikasi
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-[var(--bg-card)] border-t border-[var(--border-color)] flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              placeholder="AI Dan nimadir so'rang..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
