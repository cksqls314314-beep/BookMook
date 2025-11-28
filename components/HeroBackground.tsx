// components/HeroBackground.tsx
//
// A full-screen overlay of vertically stacked text that slowly scrolls upward,
// creating an ambient “moving type” effect similar to the Emele Collab project
// list. The component accepts an optional list of lines; if none are provided,
// a default set of Korean and English phrases inspired by poetry and books is
// used. It also listens for window scroll events and adjusts the translation
// offset to subtly sync the motion with page scroll.

'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/**
 * HeroBackground
 *
 * This component renders an animated list of large text lines that move
 * upward continuously. It duplicates the list twice so that the animation
 * loops seamlessly. A scroll handler adjusts a CSS variable used in the
 * transform so that as the user scrolls the page, the text appears to
 * drift at a slightly different speed. The text is set in a bold sans-serif
 * font; you should load Pretendard or Noto Sans KR in your global styles
 * to ensure correct glyphs. The container has pointer-events disabled so
 * it doesn’t block interactions with elements beneath it.
 */
export default function HeroBackground({
  lines,
}: {
  // Lines may be provided as strings or objects with text and isbn.
  lines?: (string | { text: string; isbn?: string })[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Local state to hold fetched lines from the server if no lines are passed in.
  const [fetchedLines, setFetchedLines] = useState<{ text: string; isbn?: string }[]>([])

  // Track which line (copy-index-index key) is currently hovered. When a line
  // is hovered, we blur all other lines for a spotlight effect. When null,
  // no blur is applied.
  const [hoverKey, setHoverKey] = useState<string | null>(null)

  // 처음 문장이 준비됐을 때 한 번만 페이드/블러 인
  const [isReady, setIsReady] = useState(false)

  // Default lines (개발용, 지금은 쓰지 않음)
  const defaultLines: string[] = [
    '자유로운 마음과 흩어진 별',
    '한 줄기 바람을 따라 걷는다',
    '책과 삶을 잇는 순간',
    '우리가 함께 만들어가는 이야기',
    '그녀의 마음 속 파도',
    '밤하늘을 헤엄치는 기억',
    '달빛 아래 한 페이지',
    '세상은 책 속의 작은 우주',
    '김수영의 자유를 향한 외침',
    '새벽에 깨어난 문장',
    '책으로 떠나는 느린 여행',
    '버지니아 울프의 속삭임',
    '창문을 두드리는 소리의 시',
    '정원의 꽃과 글의 향기',
    '우리가 사랑한 오래된 책들',
    '조용한 아침의 독서',
    'THE SOUND OF WAVES AND WORDS',
    'A GARDEN OF STORIES BLOOMING',
    'THE QUIET CITY OF BOOKS',
    'LONG WALKS WITH OLD POEMS',
    'AN OCEAN OF MEMORIES',
    'MOMENTS BETWEEN LINES',
    'EVERY BOOK A NEW BEGINNING',
    'SILENT CONVERSATIONS WITH NIGHT',
  ]

  // Kick off fetch of dynamic lines on mount if no lines were provided.
  useEffect(() => {
    if (!lines || lines.length === 0) {
      // Fetch up to 40 lines from our API endpoint
      fetch('/api/book-lines?limit=40')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.items)) {
            setFetchedLines(data.items)
          }
        })
        .catch(() => {
          // ignore errors
        })
    }
  }, [lines])

  // Normalize lines into objects with text and optional isbn
  const processedLines: { text: string; isbn?: string }[] = ((): {
    text: string
    isbn?: string
  }[] => {
    if (lines && lines.length > 0) {
      return lines.map((l) =>
        typeof l === 'string' ? { text: l } : { text: l.text, isbn: l.isbn },
      )
    }
    if (fetchedLines && fetchedLines.length > 0) {
      return fetchedLines
    }
    // When no lines are provided and nothing is fetched from the sheet,
    // do not fall back to defaultLines in production.
    return []
  })()

  // 문장이 실제로 준비된 순간에만 페이드/블러 인 시작
  useEffect(() => {
    if (processedLines.length > 0) {
      setIsReady(true)
    }
  }, [processedLines.length])

  // Compute dynamic scroll duration based on the number of lines.
  const scrollDuration = processedLines.length * 2.5

  // When the user scrolls, update a CSS custom property to offset the marquee
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      const scrollY = window.scrollY || 0
      const offset = scrollY * 0.05 // 5% of scroll speed
      container.style.setProperty('--scroll-offset', `${offset}px`)
    }
    window.addEventListener('scroll', handleScroll)
    // Initialize offset on mount
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden z-10"
    >
      <div
        className={[
          'marquee flex flex-col',
          // 여기서 초반에 opacity 0 + blur-lg → opacity 100 + blur-none 로 전환
          'transition-all duration-1000 ease-out',
          isReady ? 'opacity-100 blur-0' : 'opacity-0 blur-lg',
        ].join(' ')}
        style={{
          transform: 'translateY(var(--scroll-offset, 0px))',
          // 라인 수가 0일 때 0s가 되지 않도록 60s 기본값 사용
          '--scroll-duration': `${scrollDuration || 60}s`,
        } as any}
      >
        {(() => {
          const copyCount = 4
          return [...Array(copyCount)].map((_, copyIndex) => (
            <div key={copyIndex} className="flex flex-col">
              {processedLines.map((line, index) => {
                const key = `${copyIndex}-${index}`
                const isHovered = hoverKey === key

                // 줄별 블러 (hover spotlight 용)
                const blurStyle: React.CSSProperties = {}
                if (hoverKey) {
                  blurStyle.filter = isHovered ? 'none' : 'blur(4px)'
                }
                blurStyle.transition = 'filter 0.3s ease'

                const baseSpan = (
                  <span
                    className="font-black select-none whitespace-nowrap leading-[0.9]"
                    style={{
                      fontSize: '6vw',
                      letterSpacing: '-0.015em',
                      ...blurStyle,
                    }}
                  >
                    {line.text}
                  </span>
                )

                if (line.isbn) {
                  return (
                    <Link
                      key={key}
                      href={`/book/${encodeURIComponent(line.isbn)}`}
                      className="block pointer-events-auto cursor-pointer"
                      onMouseEnter={() => setHoverKey(key)}
                      onMouseLeave={() => setHoverKey(null)}
                    >
                      {baseSpan}
                    </Link>
                  )
                }

                return (
                  <span
                    key={key}
                    className="block pointer-events-auto cursor-default"
                    onMouseEnter={() => setHoverKey(key)}
                    onMouseLeave={() => setHoverKey(null)}
                    style={{
                      fontSize: '6vw',
                      letterSpacing: '-0.015em',
                      lineHeight: '0.9',
                      ...blurStyle,
                    }}
                  >
                    {line.text}
                  </span>
                )
              })}
            </div>
          ))
        })()}
      </div>
      <style jsx>{`
        @keyframes verticalScroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-25%);
          }
        }
        .marquee {
          animation: verticalScroll var(--scroll-duration, 60s) linear infinite;
        }
      `}</style>
    </div>
  )
}
