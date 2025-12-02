// app/api/demo-stats/route.ts
import { NextResponse } from 'next/server';
import { getRecentBooksFromSheet } from '@/lib/getRecentBooks';
import { getBooksForChapter } from '@/lib/fakeBooks';

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
      const books = await getRecentBooksFromSheet(100);
      const neighborBooks = books.filter(b => b.recommendation || b.sellerName);
      count = neighborBooks.length;
      thumb = neighborBooks[0]?.coverUrl || '';

    } else if (slug === 'deal') {
      // ✅ [수정됨] 할인율 25% 이상인 책 카운트
      const books = await getRecentBooksFromSheet(100);
      const dealBooks = books.filter(b => {
         if(!b.priceList || !b.priceSell) return false;
         return (b.priceList - b.priceSell) / b.priceList >= 0.25;
      });
      count = dealBooks.length;
      thumb = dealBooks[0]?.coverUrl || '';

    } else if (['fiction', 'essay', 'philosophy', 'art', 'garden'].includes(slug)) {
      const books = getBooksForChapter(slug);
      count = books.length;
      thumb = (books[0] as any)?.coverUrl || '';
    } 
  } catch (e) {
    count = 0;
    thumb = '';
  }

  return NextResponse.json({ count, thumb }, { headers: { 'Cache-Control': 'no-store' } });
}