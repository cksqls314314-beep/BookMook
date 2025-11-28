// app/chapters/featured-new/page.tsx
import BookCard from "@/components/BookCard";
import { getRecentBooksFromSheet } from "@/lib/getRecentBooks";

export const dynamic = "force-dynamic";

export default async function FeaturedNewPage() {
  // 구글 시트 최상단부터 최신 N권
  const books = await getRecentBooksFromSheet(12);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16">
      <header className="pt-10 pb-6">
        <h1 className="text-2xl font-bold">도착</h1>
        <p className="mt-1 text-neutral-500">신기한 일이지 않습니까? 전혀 모르던 사람이 꽤 오랜 시간 즐겁게 보냈던 하나의 물건이 이제는 나에게로 이어졌다는 사실 말입니다. 마치 내 발에 부서진 파도가 다른 사람의 발을 친 것처럼.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((b) => (
          <BookCard
            key={(b.isbn || "") + b.title}
            book={b}
            href={b.isbn ? `/book/${b.isbn}` : "#"}
          />
        ))}
      </section>
    </main>
  );
}
