'use client';
import { useReveal } from '@/hooks/useReveal';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Page() {
  useReveal();
  return (
    <div id="top" className="relative bg-[#09090b] text-[#f4f4f3] font-sans text-[18px] leading-[1.5] overflow-x-hidden antialiased">
      <Nav />
      <Hero />
      <Marquee />
      <Skills />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}
