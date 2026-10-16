"use client";
import React, { useState, useRef, useEffect } from "react";
import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  offers?: Array<{ id: string; logo: string; tag: string; title: string; terms: string; }>;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", text: "Čau! Esmu tavs AI palīgs. Jautā man jebko par kazino bonusiem, spēlēm vai šodienas piedāvājumiem!" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<any>(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  useEffect(() => {
    if (isOpen) {
      if (shaderMount.current?.destroy) { shaderMount.current.destroy(); shaderMount.current = null; }
      return;
    }
    const loadShader = async () => {
      try {
        if (shaderRef.current) {
          if (shaderMount.current?.destroy) shaderMount.current.destroy();
          shaderMount.current = new ShaderMount(
            shaderRef.current, liquidMetalFragmentShader,
            { u_repetition: 4, u_softness: 0.5, u_shiftRed: 0.3, u_shiftBlue: 0.3, u_distortion: 0, u_contour: 0, u_angle: 45, u_scale: 8, u_shape: 1, u_offsetX: 0.1, u_offsetY: -0.1 },
            undefined, 0.6
          );
        }
      } catch (e) { console.error(e); }
    };
    loadShader();
    return () => { if (shaderMount.current?.destroy) { shaderMount.current.destroy(); shaderMount.current = null; } };
  }, [isOpen]);

  const handleScrollToCalendar = () => {
    const s = document.getElementById('daily-bonuses') || document.querySelector('[id*="bonus"]');
    if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleClose = () => { setIsOpen(false); setPhase("idle"); setValue(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const userText = value.trim();
    setMessages((prev) => [...prev, { id: Math.random().toString(), role: "user", text: userText }]);
    setValue("");
    setPhase("think");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();

      setMessages((prev) => [...prev, {
        id: Math.random().toString(),
        role: "assistant",
        text: data.text,
        offers: [
          { id: "oxibet", logo: "/assets/oxibet.svg", tag: "WEEKEND PROMOTION", title: "500% up to €4,500", terms: "min deposit €20 · wagering 30x" },
          { id: "crusino", logo: "/assets/crusino.svg", tag: "DAILY RELOAD", title: "150 Free Spins", terms: "min deposit €20 · wagering 30x" }
        ]
      }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        id: Math.random().toString(),
        role: "assistant",
        text: "AI CONNECTION ERROR: Please try again.",
      }]);
    } finally {
      setPhase("idle");
    }
  };

  if (!isOpen) {
    return (
      <div style={{ bottom: 'calc(84px + env(safe-area-inset-bottom))' }} className="fixed right-4 md:right-[calc(50%-225px+16px)] w-[46px] h-[46px] z-50 select-none">
        <div style={{ perspective: "1000px", position: "relative", width: "46px", height: "46px" }}>
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none transform translate-z-[20px]"><img src="/ai_chat_logo.svg" className="w-5 h-5 opacity-50 object-contain" alt="AI" /></div>
          <div className="absolute inset-0 z-20 transform translate-z-[10px]"><div className="w-[42px] h-[42px] m-[2px] rounded-full bg-gradient-to-b from-[#202020] to-[#000000]" /></div>
          <div className="absolute inset-0 z-10 transform translate-z-[0px]"><div className="w-[46px] h-[46px] rounded-full shadow-2xl overflow-hidden relative"><div ref={shaderRef} className="absolute inset-0 w-full h-full [&_canvas]:w-full [&_canvas]:h-full [&_canvas]:block [&_canvas]:absolute [&_canvas]:rounded-full" /></div></div>
          <button onClick={() => setIsOpen(true)} className="absolute inset-0 w-full h-full bg-transparent border-none cursor-pointer outline-none z-40 rounded-full transform translate-z-[25px]" aria-label="Open AI Chat" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      <div className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[450px] bg-[#1C1C1E] border-t border-white/10 rounded-t-2xl shadow-2xl z-50 flex flex-col h-[440px] overflow-hidden">
        <div className="flex items-center justify-between p-4 pb-2 shrink-0 border-b border-white/5 bg-[#1C1C1E]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E22044] tracking-wider uppercase"><i className="w-1.5 h-1.5 bg-[#E22044] rounded-full inline-block" /><span>• AI ASSISTANT</span></div>
          <button type="button" onClick={handleClose} className="w-7 h-7 rounded-xl flex items-center justify-center text-gray-300 bg-[#2C2C2E] border border-white/5 text-xs font-bold cursor-pointer hover:bg-[#3A3A3C]">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-2 pr-2.5 bg-[#1A1A1C] custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} space-y-1.5`}>
              <div className={`max-w-[90%] p-3 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === "user" ? "bg-[#E22044] text-white rounded-br-sm" : "bg-[#2C2C2E] text-gray-100 rounded-bl-sm border border-white/5"}`}>
                {msg.role === "assistant" && msg.id !== "welcome" && <div className="text-[10px] font-bold text-[#E22044] uppercase mb-1">• ANSWER</div>}
                <p>{msg.text}</p>
              </div>
              {msg.offers && msg.offers.length > 0 && (
                <div className="w-full space-y-2 mt-1">
                  {msg.offers.map((o) => (
                    <div key={o.id} onClick={handleScrollToCalendar} className="bg-[#2C2C2E] p-3 rounded-xl flex items-center justify-between border border-white/10 cursor-pointer hover:bg-[#3A3A3C]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1A1A1C] p-1.5 rounded-lg shrink-0 flex items-center justify-center border border-white/5"><img src={o.logo} className="max-h-full object-contain" alt="casino" onError={(e)=>{e.currentTarget.src='/icon/icon_bonus.svg'}} /></div>
                        <div>
                          <div className="text-[10px] font-extrabold text-[#E22044] uppercase">{o.tag}</div>
                          <div className="text-sm font-bold text-white leading-tight">{o.title}</div>
                          <div className="text-[9px] text-gray-300 mt-0.5">{o.terms}</div>
                        </div>
                      </div>
                      <button className="w-6 h-6 rounded-full bg-white/10 text-white text-xs">➔</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {phase === "think" && (
            <div className="flex items-start space-y-1.5 animate-pulse">
              <div className="bg-[#2C2C2E] border border-white/5 p-3 rounded-2xl rounded-bl-sm flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-white/20 border-t-white animate-spin" /><span className="text-gray-400 text-xs font-medium">Thinking...</span></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }} className="px-4 pt-2 shrink-0 bg-[#1C1C1E] border-t border-white/5">
          <form onSubmit={handleSubmit} className="w-full h-11 flex items-center bg-[#2C2C2E] border border-white/5 rounded-full px-4">
            <input className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-gray-500" type="text" value={value} placeholder="Ask anything…" onChange={(e) => setValue(e.target.value)} disabled={phase === "think"} />
            <button type="submit" className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${value.trim() && phase !== "think" ? 'bg-[#E22044] text-white' : 'text-gray-400 bg-white/5'}`} disabled={!value.trim() || phase === "think"}>↑</button>
          </form>
        </div>
      </div>
    </>
  );
}
