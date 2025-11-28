// app/search/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Book } from "@/lib/search";
import SearchResultCard from "@/components/SearchResultCard";
import SearchBar from "@/components/SearchBar";

/**
 * 검색 결과 페이지
 *
 * 쿼리 파라미터 `q`를 읽어서 API `/api/search`에 요청 후 결과를 표시합니다.
 * - 페이지 상단에 검색바를 한 번 더 배치해서 바로 재검색 가능
 * - 검색 결과가 없을 경우 안내 메시지를 보여주고,
 *   여러 결과를 그리드 형태로 나열합니다.
 * - 로딩 / 오류 상태도 처리합니다.
 */
export default function SearchPage() {
  const params = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [items, setItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // 검색어가 비어 있으면 결과 초기화
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
    <main className="mx-auto max-w-6xl px-6 md:px-8 pb-16">
      {/* 🔍 검색 결과 페이지 상단에도 검색바 배치 */}
      <section className="pt-10 pb-6">
        <SearchBar />
      </section>

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

      {/* 검색어가 없을 때 안내 */}
      {!q && (
        <p className="mt-8 text-neutral-500">검색어를 입력해 주세요.</p>
      )}

      {loading && <p className="mt-8 text-neutral-500">검색 중...</p>}

      {error && <p className="mt-8 text-red-500">{error}</p>}

      {/* 검색 결과 없음 */}
      {q && !loading && !error && items.length === 0 && (
        <p className="mt-8 text-neutral-500">
          검색 결과가 없습니다. 다른 검색어를 입력해 주세요.
        </p>
      )}

      {/* 검색 결과 목록 */}
      {!loading && !error && items.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((b) => (
            <SearchResultCard key={(b.isbn || "") + b.title} book={b} />
          ))}
        </section>
      )}
    </main>
  );
}
