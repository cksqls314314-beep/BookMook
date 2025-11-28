// lib/fakeBooks.ts
import type { Book } from '@/lib/getRecentBooks';

export function getBooksForChapter(slug: string): Book[] {
  // ✅ 수정됨: [...s] 대신 s.split('') 사용 (에러 해결)
  const seed = (s: string) => Math.abs(s.split('').reduce((a, c) => a + c.charCodeAt(0), 0))
  
  const r = (n: number) => {
    const base = `https://images.unsplash.com/photo-15${(n % 99)
      .toString()
      .padStart(2, '0')}80790803-83ca734da794?q=80&w=1400&auto=format&fit=crop`
    return base
  }

  const baseTitle =
    slug === 'fiction'
      ? '소설'
      : slug === 'essay'
      ? '에세이'
      : slug === 'philosophy'
      ? '철학'
      : slug === 'art'
      ? '아트'
      : slug === 'garden'
      ? '정원'
      : '추천'

  const S = seed(slug)

  const arr: Book[] = Array.from({ length: 9 }).map((_, i) => ({
    isbn: `9780000${S}${i}`.slice(0, 13),
    title: `${baseTitle} · 추천 타이틀 ${i + 1}`,
    author: ['지은이 A', '지은이 B', '지은이 C'][i % 3],
    priceSell: 11500 + (i % 5) * 500,
    priceList: 13000 + (i % 5) * 500,
    coverUrl: r(S + i * 7),
  }))

  return arr
}