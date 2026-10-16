'use client';

import dynamic from 'next/dynamic';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

const ChatPane = dynamic(() => import('./ChatPane'), { ssr: false, loading: () => null });

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-[60]">
      {isOpen && <ChatPane onClose={() => setIsOpen(false)} />}
      <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? 'Close casino assistant' : 'Open casino assistant'} aria-expanded={isOpen} className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e22044] text-white shadow-[0_8px_25px_rgba(226,32,68,0.35)] transition-transform hover:scale-105 active:scale-95">
        {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageCircle className="h-5 w-5" aria-hidden="true" />}
      </button>
    </div>
  );
}
