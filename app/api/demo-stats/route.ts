// app/api/demo-stats/route.ts
import { NextResponse } from 'next/server';
import { getRecentBooksFromSheet } from '@/lib/getRecentBooks';
import { getBooksForChapter } from '@/lib/fakeBooks';

const demoFallback: Record<string, { count: number; thumb: string }> = {
  'editors-pick': { count: 12, thumb: 'https://images.unsplash.com/photo-1515165562835-c3b8c1aba8e0?q=80&w=600&auto=format&fit=crop' },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get('slug') || '').toLowerCase();

  let count = 0;
  let thumb = '';

  try {
    if (slug === 'featured-new') {
      // 최신 입고 도서
      const books = await getRecentBooksFromSheet();
      count = books.length;
      thumb = books[0]?.coverUrl || '';

    } else if (slug === 'neighbors') {
      // 이웃의 서재 (추천사나 판매자가 있는 책)
      const books = await getRecentBooksFromSheet(100);
      const neighborBooks = books.filter(b => b.recommendation || b.sellerName);
      count = neighborBooks.length;
      thumb = neighborBooks[0]?.coverUrl || '';

    } else if (slug === 'deal') {
      // ✅ [수정됨] 로직 동기화: 악성 재고(staleRate > 0)인 책만 카운트
      // 페이지와 동일한 기준으로 필터링합니다.
      const books = await getRecentBooksFromSheet(100);
      const dealBooks = books.filter(b => (b.staleRate || 0) > 0);
      
      count = dealBooks.length;
      thumb = dealBooks[0]?.coverUrl || '';

    } else if (['fiction', 'essay', 'philosophy', 'art', 'garden'].includes(slug)) {
      // 챕터별 도서 (가짜 데이터)
      const books = getBooksForChapter(slug);
      count = books.length;
      thumb = (books[0] as any)?.coverUrl || '';

    } else if (demoFallback[slug]) {
      // 그 외 (에디터 추천 등)
      count = demoFallback[slug].count;
      thumb = demoFallback[slug].thumb;
    }
  } catch (e) {
    count = 0;
    thumb = '';
  }

  return NextResponse.json({ count, thumb }, { headers: { 'Cache-Control': 'no-store' } });
}