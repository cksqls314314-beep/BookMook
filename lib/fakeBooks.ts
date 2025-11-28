// lib/fakeBooks.ts
// ✅ 수정됨: Book 타입을 올바른 경로에서 가져옴
import type { Book } from '@/lib/getRecentBooks'; 

export function getBooksForChapter(slug: string): Book[] {
  const seed = (s: string) => Math.abs([...s].reduce((a, c) => a + c.charCodeAt(0), 0))
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
  
  // ✅ 수정됨: Book 타입(priceSell, priceList, coverUrl)에 맞춰 필드명 변경
  const arr: Book[] = Array.from({ length: 9 }).map((_, i) => ({
    isbn: `9780000${S}${i}`.slice(0, 13),
    title: `${baseTitle} · 추천 타이틀 ${i + 1}`,
    author: ['지은이 A', '지은이 B', '지은이 C'][i % 3],
    priceSell: 11500 + (i % 5) * 500, // price -> priceSell
    priceList: 13000 + (i % 5) * 500, // 정가 추가
    coverUrl: r(S + i * 7),           // image -> coverUrl
  }))

  return arr
}