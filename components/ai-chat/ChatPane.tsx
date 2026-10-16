'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { ArrowRight, LoaderCircle, Send, X } from 'lucide-react';
import { casinos, dailyBonusData } from '@/lib/casino-data';

type ChatPaneProps = {
  onClose: () => void;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const complianceTerms = 'min deposit €20 · wagering 30x · T&Cs apply';

export default function ChatPane({ onClose }: ChatPaneProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const idCounter = useRef(0);
  const activeBonuses = useMemo(() => dailyBonusData[(new Date()).getDay()] ?? [], []);
  const ctaBonuses = activeBonuses.slice(0, 2).map((bonus) => ({
    bonus,
    casino: casinos.find((casino) => casino.name === bonus.casinoName),
  })).filter(({ casino }) => casino);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessage = { id: `m-${idCounter.current++}`, role: 'user', content: message };
    const priorMessages = [...messages, userMessage];
    setMessages(priorMessages);
    setInput('');
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: priorMessages.map(({ role, content }) => ({ role, content })) }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = await response.json();
      const text = typeof data?.text === 'string' ? data.text : '';

      if (!text) {
        throw new Error('Empty response');
      }

      setMessages((prev) => [...prev, { id: `m-${idCounter.current++}`, role: 'assistant', content: text }]);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="absolute bottom-20 right-4 flex h-[min(650px,calc(100dvh-112px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#171315]/95 text-white shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl" aria-label="Casino assistant chat">
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-bold">Casino assistant</p>
          <p className="text-[10px] text-white/55">Latvian · Russian · English</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close casino assistant" className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="rounded-xl bg-white/8 px-3 py-2.5 text-sm leading-5 text-white/80">
            Ask me about casino bonuses, wagering terms, or choosing a game. I will reply in your language.
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'ml-8' : 'mr-4'}>
            <div className={`rounded-xl px-3 py-2.5 text-sm leading-5 ${message.role === 'user' ? 'bg-[#e22044] text-white' : 'bg-white/10 text-white/90'}`}>
              {message.content}
            </div>
            {message.role === 'assistant' && (
              <div className="mt-2 space-y-2">
                {ctaBonuses.map(({ bonus, casino }) => casino && (
                  <a key={`${message.id}-${casino.name}`} href={casino.affiliateUrl} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/8 p-2 transition-colors hover:bg-white/15">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg p-1.5" style={{ backgroundColor: casino.background }}>
                      <img src={casino.logo} alt={`${casino.name} logo`} className="h-full w-full object-contain" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[9px] font-bold uppercase tracking-wide text-[#ff8195]">{bonus.promoTag}</span>
                      <span className="block truncate text-xs font-bold text-white">{bonus.reward}</span>
                      <span className="block truncate text-[9px] text-white/55">{complianceTerms}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/70" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="mr-4 flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-3" role="status" aria-label="Assistant is typing">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80" />
          </div>
        )}
        {hasError && <p className="text-xs text-[#ff9bad]" role="alert">The assistant could not respond. Please try again.</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 border-t border-white/10 p-3">
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question..." aria-label="Chat message" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#e22044]" />
        <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e22044] text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40">
          {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
        </button>
      </form>
    </section>
  );
}
