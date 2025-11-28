// components/SearchResultCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/search";

/**
 * 검색 결과 카드.
 *
 * 검색 API에서 가져온 책 정보를 표시합니다.
 * - 썸네일, 제목, 저자, 발행사/출판일, 가격
 * - 카드 전체를 클릭하면 /book/[isbn] 상세 페이지로 이동
 */
export default function SearchResultCard({ book }: { book: Book }) {
  const { isbn, title, author, publisher, pubdate, price, image } = book;

  // 이미지 URL의 스킴을 https로 강제 (Next.js config에 도메인이 등록된 경우).
  const safeImage = image ? image.replace(/^http:\/\//, "https://") : undefined;

  // ISBN이 없는 경우에는 링크를 막기 위해 "#" 로 처리
  const href = isbn ? `/book/${encodeURIComponent(isbn)}` : "#";
  const isLinkDisabled = !isbn;

  return (
    <Link
      href={href}
      aria-disabled={isLinkDisabled}
      className="block rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition"
    >
      {/* 썸네일: 비율 유지하며 전체 보이도록 */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-2xl bg-neutral-100">
        {safeImage ? (
          <Image
            src={safeImage}
            alt={title || "book cover"}
            fill
            sizes="(min-width:1024px) 320px, 50vw"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            이미지 없음
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight">
          {title || "(제목 없음)"}
        </h3>

        {author && (
          <p className="mt-1 text-sm text-neutral-500 line-clamp-1">
            {author}
          </p>
        )}

        {(publisher || pubdate) && (
          <p className="mt-1 text-xs text-neutral-400">
            {publisher || ""}
            {publisher && pubdate ? " · " : ""}
            {pubdate || ""}
          </p>
        )}

        {typeof price === "number" && price > 0 && (
          <p className="mt-2 text-sm font-semibold">
            {price.toLocaleString()}원
          </p>
        )}
      </div>
    </Link>
  );
}
