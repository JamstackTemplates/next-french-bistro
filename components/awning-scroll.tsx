'use client';

import { useEffect } from 'react';

/**
 * Compresses the awning to a slimmer edge once the page scrolls, by setting `data-scrolled` on <html>
 * (styled in tailwind.input.css). Renders nothing; without JavaScript the full awning simply stays.
 */
export function AwningScroll() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.scrollY > 24) root.dataset.scrolled = '';
      else delete root.dataset.scrolled;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return null;
}
