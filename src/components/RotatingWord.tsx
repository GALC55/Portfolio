'use client';
import { useEffect, useRef, useState } from 'react';
import { WORDS } from './HeroCanvas';

export default function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
      setKey((k) => k + 1);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      key={key}
      className="text-[var(--accent)] inline-block font-semibold whitespace-nowrap animate-wordIn"
    >
      {WORDS[index]}
    </span>
  );
}
