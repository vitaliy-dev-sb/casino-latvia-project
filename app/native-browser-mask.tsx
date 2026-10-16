'use client';

import { useEffect } from 'react';

export default function NativeBrowserMask() {
  useEffect(() => {
    const mask = document.getElementById('native-browser-mask');
    if (!mask) return;

    mask.style.transition = 'opacity 0.4s ease-in-out';
    mask.style.opacity = '0';
    const hideTimer = window.setTimeout(() => {
      mask.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 400);

    return () => window.clearTimeout(hideTimer);
  }, []);

  return <div id="native-browser-mask" aria-hidden="true" />;
}
