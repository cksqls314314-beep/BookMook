// app/chapters/deal/page.tsx
import BookCard from "@/components/BookCard";
import { getRecentBooksFromSheet } from "@/lib/getRecentBooks";
import { Percent } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DealPage() {
  const allBooks = await getRecentBooksFromSheet(100);
  
  // 정가 대비 25% 이상 저렴한 책만 필터링
  const dealBooks = allBooks.filter(book => {
    if (!book.priceList || !book.priceSell) return false;
    const discountRate = (book.priceList - book.priceSell) / book.priceList;
    return discountRate >= 0.25;
  });

  return (
    <main className="bg-white min-h-screen">
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-32 md:pb-20">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold mb-6">
          <Percent size={16} /> Value Collection
        </div>

        {/* ✅ [수정됨] 카피 적용 */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-neutral-900 mb-6 break-keep">
          가벼워진 가격으로<br />
          변치 않는 가치를.
        </h1>

        <div className="max-w-2xl text-lg md:text-xl text-neutral-500 leading-relaxed break-keep space-y-2">
          <p>
            북묵에서는 출간일이 지날수록 가격이 내려가요.
          </p>
          <p>
            5년 이상 사랑받은 스테디셀러와 고전들을<br className="hidden md:block" />
            정가 대비 <strong>최대 40% 이상</strong> 저렴한 가격으로 만나보세요.
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
            <p className="text-neutral-400 mb-2 text-lg font-medium">현재 특가 도서가 모두 소진되었습니다.</p>
            <p className="text-sm text-neutral-300">
              조금만 기다려주세요. 새로운 도서들이 곧 도착합니다.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}