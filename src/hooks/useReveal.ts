'use client';
import { useEffect } from 'react';

function animateCount(el: HTMLElement) {
  if (el.dataset.done === '1') return;
  el.dataset.done = '1';
  const target = parseInt(el.dataset.count ?? '0', 10);
  const dur = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toString();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => {
        el.classList.add('in');
        el.querySelectorAll<HTMLElement>('[data-bar]').forEach((b) => {
          b.style.width = (b.dataset.bar ?? '0') + '%';
        });
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const target = en.target as HTMLElement;
          target.classList.add('in');
          target.querySelectorAll<HTMLElement>('[data-count]').forEach(animateCount);
          target.querySelectorAll<HTMLElement>('[data-bar]').forEach((b) => {
            b.style.width = (b.dataset.bar ?? '0') + '%';
          });
          io.unobserve(target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );

    els.forEach((el) => io.observe(el));

    // Animate count elements not inside a data-reveal (e.g. hero stats)
    const t = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[data-count]').forEach(animateCount);
    }, 450);

    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
}
