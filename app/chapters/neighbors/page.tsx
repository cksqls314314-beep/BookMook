// app/chapters/neighbors/page.tsx
import BookCard from "@/components/BookCard";
import { getRecentBooksFromSheet } from "@/lib/getRecentBooks";
import { Quote } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NeighborsBookshelfPage() {
  // 전체 책을 가져온 뒤, '추천사(recommendation)'가 있는 책만 필터링
  const allBooks = await getRecentBooksFromSheet(100);
  const recommendedBooks = allBooks.filter(b => b.recommendation && b.recommendation.length > 0);

  return (
    <main className="bg-white min-h-screen">
      {/* 1. 헤더 섹션: 감성적인 문구 적용 */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-32 md:pb-20">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-sm font-bold mb-6">
          <Quote size={16} fill="currentColor" /> 이웃의 서재
        </div>

        {/* 요청하신 Title */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-neutral-900 mb-6 break-keep">
          북묵러의 추천
        </h1>

        {/* 요청하신 Subtitle */}
        <div className="text-lg md:text-xl text-neutral-500 leading-relaxed max-w-2xl break-keep space-y-1">
          <p>책을 판매하신 분들이 &quot;이 책만큼은 꼭 다시 읽혔으면 좋겠다&quot;며 직접 골라주신 목록입니다.</p>
          <p>단순히 소유를 넘기는 것이 아닌, 좋은 책을 권하고자 하는 마음이 당신에게 이어지길 바랍니다.</p>
        </div>
      </section>

      {/* 2. 도서 리스트 섹션 */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        {recommendedBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {recommendedBooks.map((b) => (
              <BookCard
                key={(b.isbn || "") + b.title}
                book={b}
                href={b.isbn ? `/book/${b.isbn}` : "#"}
              />
            ))}
          </div>
        ) : (
          // 데이터가 없을 때 안내
          <div className="py-32 text-center bg-neutral-50 rounded-3xl">
            <p className="text-neutral-400 mb-2">아직 도착한 추천 도서가 없습니다.</p>
            <p className="text-sm text-neutral-300">곧 이웃들의 이야기가 채워질 예정입니다.</p>
          </div>
        )}
      </section>
    </main>
  );
}