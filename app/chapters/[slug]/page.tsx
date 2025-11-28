// app/chapters/[slug]/page.tsx
import type { Metadata } from 'next'
import { getBooksForChapter } from '@/lib/fakeBooks'
import BookCard from '@/components/BookCard'

type Params = { slug: string }

export function generateMetadata({ params }: { params: Params }): Metadata {
  const titleMap: Record<string, string> = {
    fiction: '문학·소설',
    essay: '에세이',
    philosophy: '철학·사회',
    art: '아트·사진',
    garden: '자연·정원',
    'featured-new': '신간 큐레이션',
    'editors-pick': '에디터 추천',
    deal: '오늘의 특가',
  }
  const h = titleMap[params.slug] ?? '추천'
  return {
    title: `${h} | BookMook`,
    description: `${h} 챕터의 큐레이션 도서 목록`,
  }
}

export default function ChapterDetailPage({ params }: { params: Params }) {
  const books = getBooksForChapter(params.slug)

  const titleMap: Record<string, string> = {
    fiction: '문학·소설',
    essay: '에세이',
    philosophy: '철학·사회',
    art: '아트·사진',
    garden: '자연·정원',
    'featured-new': '신간 큐레이션',
    'editors-pick': '에디터 추천',
    deal: '오늘의 특가',
  }
  const heading = titleMap[params.slug] ?? '추천'

  return (
    <main className="mx-auto max-w-6xl px-6 md:px-8">
      <header className="py-10">
        <h1 className="text-2xl md:text-3xl font-semibold">{heading}</h1>
        <p className="mt-2 text-gray-600">북목 에디터가 고른 오늘의 {heading} 셀렉션입니다.</p>
      </header>

      <section className="pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((b) => (
            <BookCard key={b.isbn + b.title} book={b} />
          ))}
        </div>
      </section>
    </main>
  )
}
