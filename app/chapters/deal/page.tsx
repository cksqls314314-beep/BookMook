// app/chapters/deal/page.tsx
import BookCard from "@/components/BookCard";
import { getRecentBooksFromSheet } from "@/lib/getRecentBooks";
import { TimerReset } from "lucide-react"; // 아이콘 변경

export const dynamic = "force-dynamic";

export default async function DealPage() {
  // 전체 책 가져오기
  const allBooks = await getRecentBooksFromSheet(100);
  
  // ✅ 필터링: 악성 재고 할인(staleRate)이 적용된 책만 골라냄
  const dealBooks = allBooks.filter(book => (book.staleRate || 0) > 0);

  return (
    <main className="bg-white min-h-screen">
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-32 md:pb-20">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-sm font-bold mb-6">
          <TimerReset size={16} /> Clearance
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-neutral-900 mb-6 break-keep">
          가벼워진 가격으로<br />
          숨은 보석을 발견하세요.
        </h1>

        <div className="max-w-2xl text-lg md:text-xl text-neutral-500 leading-relaxed break-keep space-y-2">
          <p>
            북묵의 서가에 오래 머무른 책들을 더 가벼운 가격으로 보냅니다.
          </p>
          <p className="text-base text-neutral-400 pt-2">
            * 6개월 이상 보관된 도서는 <strong>10%</strong>, <br className="md:hidden"/>
            1년 이상 된 도서는 <strong>20%</strong> 추가 할인이 적용됩니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {dealBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {dealBooks.map((b) => (
              <BookCard
                key={(b.isbn || "") + b.title}
                book={b}
                href={b.isbn ? `/book/${b.isbn}` : "#"}
              />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-neutral-50 rounded-3xl border border-neutral-100">
            <p className="text-neutral-400 mb-2 text-lg font-medium">현재 할인 중인 도서가 없습니다.</p>
            <p className="text-sm text-neutral-300">
              모든 책들이 빠르게 새 주인을 찾아갔네요!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}