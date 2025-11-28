// components/HeroPro.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CTA = { label: string; href: string };
type Props = {
  image: string;
  title: string;
  subtitle?: string;
  ctaPrimary?: CTA;
  ctaSecondary?: CTA;
  parallaxStrength?: number;
};

export default function HeroPro({
  image, title, subtitle, ctaPrimary, ctaSecondary, parallaxStrength = 0.15,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top;
      const y = Math.min(0, top);
      raf = window.requestAnimationFrame(() => setOffset(y * parallaxStrength));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, [parallaxStrength]);

  return (
    <section ref={ref} className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden" aria-label="Hero">
      <div className="relative h-[56vh] md:h-[72vh]">
        <div className="absolute inset-0 will-change-transform" style={{ transform: `translateY(${offset}px)` }}>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.25)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/25 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="w-full max-w-6xl mx-auto px-6 md:px-8 pb-10 md:pb-0">
            <h1 className="text-white text-3xl md:text-5xl font-semibold leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,.35)]">{title}</h1>
            {subtitle && <p className="mt-3 text-white/85 text-base md:text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
            <div className="mt-6 flex gap-3">
              {ctaPrimary && <Link href={ctaPrimary.href} className="rounded-2xl bg-white text-gray-900 px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-medium shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25 transition">{ctaPrimary.label}</Link>}
              {ctaSecondary && <Link href={ctaSecondary.href} className="rounded-2xl border border-white/35 text-white px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base backdrop-blur-[2px] bg-white/10 hover:bg-white/15 transition">{ctaSecondary.label}</Link>}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70" />
      <div className="h-3 w-full bg-gradient-to-b from-black/10 to-transparent" />
    </section>
  );
}
