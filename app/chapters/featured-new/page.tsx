// app/chapters/featured-new/page.tsx
import BookCard from "@/components/BookCard";
import { getRecentBooksFromSheet } from "@/lib/getRecentBooks";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FeaturedNewPage() {
  const books = await getRecentBooksFromSheet(12);

  return (
    <main className="bg-white min-h-screen">
      {/* 1. 헤더 섹션 (톤앤매너 수정: 감성↓ 직관↑) */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-32 md:pb-20">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold mb-6">
          <Sparkles size={16} /> New Arrivals
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-neutral-900 mb-6 break-keep">
          방금 입고된<br />
          도서를 확인하세요.
        </h1>

        <p className="text-lg md:text-xl text-neutral-500 leading-relaxed max-w-2xl break-keep">
          북묵의 꼼꼼한 검수 과정을 통과하고 막 진열된 책들입니다.<br className="hidden md:block" />
          상태가 좋은 도서를 가장 먼저 선점해보세요.
        </p>
      </section>

      {/* 2. 도서 리스트 섹션 */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        {books.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {books.map((b) => (
              <BookCard
                key={(b.isbn || "") + b.title}
                book={b}
                href={b.isbn ? `/book/${b.isbn}` : "#"}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-neutral-400 bg-neutral-50 rounded-3xl">
            아직 도착한 도서가 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}