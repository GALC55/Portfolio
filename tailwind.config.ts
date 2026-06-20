import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        wordIn: {
          from: { opacity: '0', transform: 'translateY(16px) rotateX(-40deg)', filter: 'blur(6px)' },
          to:   { opacity: '1', transform: 'none', filter: 'blur(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        floatGlow: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%':     { transform: 'translate(40px,-30px) scale(1.12)' },
        },
        floatGlow2: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%':     { transform: 'translate(-50px,40px) scale(1.18)' },
        },
        bobDown: {
          '0%,100%': { transform: 'translateY(0)', opacity: '0.6' },
          '50%':     { transform: 'translateY(9px)', opacity: '1' },
        },
      },
      animation: {
        fadeUp:    'fadeUp .8s cubic-bezier(.16,1,.3,1) both',
        wordIn:    'wordIn .6s cubic-bezier(.16,1,.3,1) both',
        marquee:   'marquee 34s linear infinite',
        floatGlow: 'floatGlow 14s ease-in-out infinite',
        floatGlow2:'floatGlow2 18s ease-in-out infinite',
        bobDown:   'bobDown 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
