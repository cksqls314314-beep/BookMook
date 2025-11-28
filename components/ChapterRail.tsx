// components/ChapterRail.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type Chapter = {
  slug: string;
  title: string;
  subtitle?: string;
  href?: string;
  image: string;
  count?: number;
  thumb?: string;
  statsUrl?: string;
};

type Props = {
  heading?: string;
  chapters: Chapter[];
};

export default function ChapterRail({ heading = 'Explore', chapters }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState<Chapter[]>(chapters);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const enriched = await Promise.all(
        chapters.map(async (c) => {
          if (!c.statsUrl) return c;
          try {
            const r = await fetch(`${c.statsUrl}?slug=${encodeURIComponent(c.slug)}`, { cache: 'no-store' });
            const j = await r.json();
            return { ...c, count: j.count ?? c.count, thumb: j.thumb ?? c.thumb };
          } catch {
            return c;
          }
        })
      );
      if (mounted) setItems(enriched);
    })();
    return () => { mounted = false; };
  }, [chapters]);

  const scrollBy = (dir: 'prev' | 'next') => {
    const el = ref.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section className="mt-10 md:mt-14">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">{heading}</h2>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scrollBy('prev')} className="rounded-full border border-black/10 bg-white/70 backdrop-blur p-2 shadow hover:shadow-md" aria-label="이전">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scrollBy('next')} className="rounded-full border border-black/10 bg-white/70 backdrop-blur p-2 shadow hover:shadow-md" aria-label="다음">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div ref={ref} className="relative flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Chapter rail">
        {items.map((c) => (
          <Card key={c.slug} {...c} />
        ))}
      </div>
    </section>
  );
}

function Card({ title, subtitle, image, href, count, thumb }: Chapter) {
  const body = (
    <article className="relative w-[80vw] sm:w-[60vw] md:w-[520px] lg:w-[560px] aspect-[7/8] rounded-3xl overflow-hidden border border-black/5 shadow-sm snap-start shrink-0">
      <Image src={image} alt="" fill sizes="(min-width: 1024px) 560px, 80vw" className="object-cover" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,.55)_0%,rgba(0,0,0,.25)_35%,transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20" />
      </div>

      {(count || thumb) && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {thumb && (
            <div className="relative w-10 h-14 rounded-md overflow-hidden ring-1 ring-white/60 shadow">
              <Image src={thumb} alt="" fill className="object-cover" />
            </div>
          )}
          {typeof count === 'number' && (
            <span className="px-2 py-1 rounded-full bg-white/90 text-gray-900 text-xs font-medium shadow">
              {count.toLocaleString()}권
            </span>
          )}
        </div>
      )}

      <div className="absolute inset-0 flex items-end p-6 md:p-8">
        <div className="text-white drop-shadow">
          <h3 className="text-2xl md:text-3xl font-semibold">{title}</h3>
          {subtitle && <p className="mt-1 text-white/85">{subtitle}</p>}
        </div>
      </div>
    </article>
  );

  return href ? (
    <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 rounded-3xl">
      {body}
    </Link>
  ) : body;
}
