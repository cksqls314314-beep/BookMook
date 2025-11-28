// app/api/demo-stats/route.ts
import { NextResponse } from 'next/server';

// 실제 도서 정보를 기반으로 배너의 통계(총 권수와 가장 최근 표지)를 계산합니다.
// - `featured-new`: 구글 시트에서 최신 도서 목록을 가져와 갯수와 첫 번째 책의 표지를 사용합니다.
// - 일반 카테고리(fiction/essay/philosophy/art/garden): fakeBooks에 정의된 챕터 도서 목록을 가져와 갯수와 첫 번째 책의 이미지를 사용합니다.
// - 기타 슬러그는 기존 데모 값으로 fallback 합니다.

import { getRecentBooksFromSheet } from '@/lib/getRecentBooks';
import { getBooksForChapter } from '@/lib/fakeBooks';

const demoFallback: Record<string, { count: number; thumb: string }> = {
  // fallback values for slugs without dynamic computation
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
      // 최신 입고 도서: 구글 시트에서 N권을 가져와 가장 첫 책의 표지를 사용
      const books = await getRecentBooksFromSheet();
      count = books.length;
      thumb = books[0]?.coverUrl || '';
    } else if (['fiction', 'essay', 'philosophy', 'art', 'garden'].includes(slug)) {
      // 챕터별 도서: fakeBooks에서 길이와 첫 번째 이미지를 사용
      const books = getBooksForChapter(slug);
      count = books.length;
      // `BookCard` expects image field; here it's `image`
      // but if undefined, leave blank
      thumb = (books[0] as any)?.image || '';
    } else if (demoFallback[slug]) {
      count = demoFallback[slug].count;
      thumb = demoFallback[slug].thumb;
    }
  } catch (e) {
    // fallback to zero values on error
    count = 0;
    thumb = '';
  }

  return NextResponse.json({ count, thumb }, { headers: { 'Cache-Control': 'no-store' } });
}
