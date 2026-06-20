'use client';
import { useEffect, useRef } from 'react';

const WORDS = ['React Native','Node.js','PostgreSQL','TypeScript','Machine Learning','Next.js'];

interface Particle { x:number; y:number; vx:number; vy:number; r:number; }

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let parts: Particle[] = [];
    let raf: number;
    let W = 0, H = 0;
    let alive = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const target = Math.min(86, Math.floor(W * H / 13000));
      parts = Array.from({ length: target }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .32, vy: (Math.random() - .5) * .32,
        r: Math.random() * 1.8 + .6,
      }));
    };
    window.addEventListener('resize', resize);
    resize();

    const onMove = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    const draw = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 140 && d > 0) { const f = (140 - d) / 140 * 1.4; p.x += dx / d * f; p.y += dy / d * f; }
      }
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const a = parts[i], b = parts[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 124) {
            const al = (1 - dist / 124) * .5;
            ctx.strokeStyle = `rgba(255,92,56,${al.toFixed(3)})`;
            ctx.lineWidth = .7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of parts) {
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dm < 140 ? 'rgba(255,92,56,.9)' : 'rgba(244,244,243,.45)';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />;
}

export { WORDS };
