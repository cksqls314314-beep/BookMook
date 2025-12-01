// app/chapters/neighbors/page.tsx
import BookCard from "@/components/BookCard";
import { getRecentBooksFromSheet } from "@/lib/getRecentBooks";
import { Quote } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NeighborsBookshelfPage() {
  // 1. 전체 책 가져오기 (넉넉하게 100권)
  const allBooks = await getRecentBooksFromSheet(100);

  // 2. ✅ 필터링: 추천사(Q열)가 있는 책만 남김
  const neighborBooks = allBooks.filter(
    (b) => b.recommendation && b.recommendation.trim().length > 0
  );

  return (
    <main className="bg-white min-h-screen">
      {/* 헤더 섹션 (UI 개선됨) */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-32 md:pb-20">
        
        {/* 뱃지 */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-sm font-bold mb-6">
          <Quote size={16} fill="currentColor" /> 이웃의 서재
        </div>

        {/* 타이틀 */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-neutral-900 mb-6 break-keep">
          북묵러의 추천
        </h1>

        {/* ✅ 설명글 (가독성 개선: max-width 적용, 컬러 조정, 행간 조절) */}
        <div className="max-w-2xl text-lg md:text-xl text-neutral-500 leading-relaxed break-keep space-y-1">
          <p>
            책을 판매하신 분들이 &quot;이 책만큼은 꼭 다시 읽혔으면 좋겠다&quot;며
            직접 골라주신 목록입니다.
          </p>
          <p className="pt-2">
            단순히 소유를 넘기는 것이 아닌, 좋은 책을 권하고자 하는 마음이
            당신에게 이어지길 바랍니다.
          </p>
        </div>
      </section>

      {/* 도서 리스트 섹션 */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        {neighborBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {neighborBooks.map((b) => (
              <BookCard
                key={(b.isbn || "") + b.title}
                book={b}
                href={b.isbn ? `/book/${b.isbn}` : "#"}
              />
            ))}
          </div>
        ) : (
          // 추천사가 있는 책이 없을 때 표시할 안내 문구
          <div className="py-32 text-center bg-neutral-50 rounded-3xl border border-neutral-100">
            <p className="text-neutral-400 mb-2 text-lg font-medium">아직 도착한 추천 도서가 없습니다.</p>
            <p className="text-sm text-neutral-300">
              매입 시 추천사를 남겨주시면 이곳에 소개됩니다.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}