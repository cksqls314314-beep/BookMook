// app/book/[isbn]/page.tsx
import { getBookByIsbn } from "@/lib/oneBook";
import BookDetail from "@/components/BookDetail";

type Props = { params: { isbn: string } };

export const dynamic = "force-dynamic";

export default async function BookPage({ params }: Props) {
  const data = await getBookByIsbn(params.isbn);
  if (!data) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-24">
        <h1 className="text-2xl font-semibold">책을 찾을 수 없습니다.</h1>
        <p className="text-muted-foreground mt-2">ISBN: {params.isbn}</p>
      </main>
    );
  }
  return <BookDetail data={data} />;
}
