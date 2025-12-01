// app/api/demo-stats/route.ts
import { NextResponse } from 'next/server';
import { getRecentBooksFromSheet } from '@/lib/getRecentBooks';
import { getBooksForChapter } from '@/lib/fakeBooks';

const demoFallback: Record<string, { count: number; thumb: string }> = {
  deal: { count: 19, thumb: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop' },
  'editors-pick': { count: 12, thumb: 'https://images.unsplash.com/photo-1515165562835-c3b8c1aba8e0?q=80&w=600&auto=format&fit=crop' },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get('slug') || '').toLowerCase();

  let count = 0;
  let thumb = '';

  try {
    if (slug === 'featured-new') {
      const books = await getRecentBooksFromSheet();
      count = books.length;
      thumb = books[0]?.coverUrl || '';

    } else if (slug === 'neighbors') {
      // ✅ [추가됨] 이웃의 서재: 추천사나 판매자가 있는 책만 카운트
      const books = await getRecentBooksFromSheet(100);
      const neighborBooks = books.filter(b => b.recommendation || b.sellerName);
      
      count = neighborBooks.length;
      thumb = neighborBooks[0]?.coverUrl || ''; // 가장 최신 추천 도서 표지

    } else if (['fiction', 'essay', 'philosophy', 'art', 'garden'].includes(slug)) {
      const books = getBooksForChapter(slug);
      count = books.length;
      thumb = (books[0] as any)?.coverUrl || '';

    } else if (demoFallback[slug]) {
      count = demoFallback[slug].count;
      thumb = demoFallback[slug].thumb;
    }
  } catch (e) {
    count = 0;
    thumb = '';
  }

  return NextResponse.json({ count, thumb }, { headers: { 'Cache-Control': 'no-store' } });
}