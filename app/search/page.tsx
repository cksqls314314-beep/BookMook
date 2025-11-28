// app/search/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react"; // Suspense 추가
import type { Book } from "@/lib/search";
import SearchResultCard from "@/components/SearchResultCard";
import SearchBar from "@/components/SearchBar";

// ✅ 실제 검색 로직을 담은 내부 컴포넌트
function SearchContent() {
  const params = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [items, setItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!q) {
      setItems([]);
      setError("");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");

    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => {
        if (!r.ok) throw new Error("검색 실패");
        return r.json();
      })
      .then((data) => {
        const list = Array.isArray(data.items) ? data.items : [];
        setItems(list);
      })
      .catch(() => {
        setError("검색 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [q]);

  return (
    <>
      <header className="pb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">검색 결과</h1>
        {q && (
          <p className="mt-1 text-neutral-600 text-sm">
            <span className="font-medium">{q}</span>
            {items.length > 0 && (
              <span className="ml-2">
                총 {items.length.toLocaleString()}건
              </span>
            )}
          </p>
        )}
      </header>

      {!q && (
        <p className="mt-8 text-neutral-500">검색어를 입력해 주세요.</p>
      )}

      {loading && <p className="mt-8 text-neutral-500">검색 중...</p>}
      {error && <p className="mt-8 text-red-500">{error}</p>}

      {q && !loading && !error && items.length === 0 && (
        <p className="mt-8 text-neutral-500">
          검색 결과가 없습니다. 다른 검색어를 입력해 주세요.
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((b) => (
            <SearchResultCard key={(b.isbn || "") + b.title} book={b} />
          ))}
        </section>
      )}
    </>
  );
}

// ✅ 메인 페이지 컴포넌트 (Suspense 적용)
export default function SearchPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 md:px-8 pb-16">
      <section className="pt-10 pb-6">
        <Suspense fallback={<div className="h-12 w-full bg-gray-100 rounded-full animate-pulse" />}>
          <SearchBar />
        </Suspense>
      </section>

      <Suspense fallback={<p className="text-neutral-500">검색 정보를 불러오는 중...</p>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}