// components/HeroStatic.tsx
import Image from 'next/image';
import Link from 'next/link';

type CTA = { label: string; href: string };

export default function HeroStatic({
  image,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: {
  image: string;
  title: string;
  subtitle?: string;
  ctaPrimary?: CTA;
  ctaSecondary?: CTA;
}) {
  return (
    <section className="relative w-full h-[48vh] md:h-[56vh] lg:h-[62vh] overflow-hidden rounded-none md:rounded-[24px]">
      <Image src={image} alt="" fill priority className="object-cover" />
      {/* 고정 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/25 to-black/5" />
      <div className="relative z-10 h-full flex flex-col items-start justify-end px-6 md:px-10 pb-10 text-white">
        <h1 className="text-3xl md:text-5xl font-semibold drop-shadow-sm">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-white/85 text-sm md:text-base drop-shadow-sm">
            {subtitle}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          {ctaPrimary && (
            <Link
              href={ctaPrimary.href}
              className="rounded-full bg-white text-gray-900 px-5 py-2 font-medium hover:bg-white/90 transition shadow"
            >
              {ctaPrimary.label}
            </Link>
          )}
          {ctaSecondary && (
            <Link
              href={ctaSecondary.href}
              className="rounded-full border border-white/70 text-white px-5 py-2 font-medium hover:bg-white/10 transition"
            >
              {ctaSecondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
