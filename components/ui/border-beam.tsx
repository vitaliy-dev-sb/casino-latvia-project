'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type PulseEntry = {
  element: HTMLElement;
  duration: number;
};

const activeEntries = new Set<PulseEntry>();
let frameHandle: number | null = null;
let lastTick = 0;
const minimumTickGap = 1000 / 30 - 2;

function tick(timestamp: number) {
  frameHandle = requestAnimationFrame(tick);
  if (timestamp - lastTick < minimumTickGap) return;
  lastTick = timestamp;

  activeEntries.forEach(({ element, duration }) => {
    const angle = ((timestamp / 1000) % duration) / duration * 360;
    element.style.setProperty('--beam-angle', `${angle.toFixed(2)}deg`);
  });
}

function attachPulse(element: HTMLElement, duration: number): () => void {
  const entry = { element, duration };
  activeEntries.add(entry);
  if (frameHandle === null) {
    lastTick = 0;
    frameHandle = requestAnimationFrame(tick);
  }

  return () => {
    activeEntries.delete(entry);
    if (activeEntries.size === 0 && frameHandle !== null) {
      cancelAnimationFrame(frameHandle);
      frameHandle = null;
    }
  };
}

type BorderBeamProps = {
  children: ReactNode;
  duration?: number;
  strength?: number;
  beamWidth?: number;
  backgroundColor?: string;
  active?: boolean;
  className?: string;
};

export function BorderBeam({
  children,
  duration = 3.3,
  strength = 2,
  beamWidth = 2,
  backgroundColor = '#212121',
  active = true,
  className = '',
}: BorderBeamProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !active) return;
    return attachPulse(element, duration);
  }, [active, duration]);

  const style = {
    '--beam-angle': '0deg',
    '--beam-width': `${beamWidth}px`,
    '--beam-strength': strength,
    background: 'conic-gradient(from var(--beam-angle), transparent 0deg, transparent 235deg, rgba(88, 101, 242, 0.18) 254deg, rgba(114, 72, 255, 0.95) 274deg, rgba(196, 91, 255, 0.9) 292deg, rgba(88, 101, 242, 0.18) 314deg, transparent 338deg, transparent 360deg)',
    boxShadow: '0 0 20px rgba(114, 72, 255, 0.24), 0 0 42px rgba(88, 101, 242, 0.12)',
  } as CSSProperties;

  return (
    <div ref={elementRef} className={`relative isolate rounded-[10px] p-[var(--beam-width)] ${className}`} style={style}>
      <div className="relative z-10 rounded-[10px]" style={{ backgroundColor }}>
        {children}
      </div>
    </div>
  );
}

export default BorderBeam;
