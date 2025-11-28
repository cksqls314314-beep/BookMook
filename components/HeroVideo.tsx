// components/HeroVideo.tsx
//
// A hero component that uses a video as the background instead of an image.
// The video will autoplay, loop, and be muted. An overlay is added to
// improve text legibility, similar to the HeroPro component. Clients can
// specify a title, subtitle, and primary/secondary call-to-action buttons.

'use client'

import Link from 'next/link'

type CTA = { label: string; href: string }

export default function HeroVideo({
  video,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: {
  video: string
  title: string
  subtitle?: string
  ctaPrimary?: CTA
  ctaSecondary?: CTA
}) {
  return (
    <section
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden"
      aria-label="Hero"
    >
      <div className="relative h-[56vh] md:h-[72vh]">
        {/* Video background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={video} type="video/mp4" />
            {/* Fallback text for browsers that do not support the video tag */}
            Your browser does not support the video tag.
          </video>
        </div>
        {/* Overlays for better contrast */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.25)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/25 to-transparent" />
        </div>
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="w-full max-w-6xl mx-auto px-6 md:px-8 pb-10 md:pb-0">
            <h1 className="text-white text-3xl md:text-5xl font-semibold leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,.35)]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-white/85 text-base md:text-lg max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
            <div className="mt-6 flex gap-3">
              {ctaPrimary && (
                <Link
                  href={ctaPrimary.href}
                  className="rounded-2xl bg-white text-gray-900 px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-medium shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/25 transition"
                >
                  {ctaPrimary.label}
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="rounded-2xl border border-white/35 text-white px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base backdrop-blur-[2px] bg-white/10 hover:bg-white/15 transition"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Decorative separators similar to HeroPro */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70" />
      <div className="h-3 w-full bg-gradient-to-b from-black/10 to-transparent" />
    </section>
  )
}