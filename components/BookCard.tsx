// components/BookCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/getRecentBooks";
import { formatKRW } from "@/lib/getRecentBooks";

type Props = {
  book: Book;
  href?: string;
};

export default function BookCard({ book, href = "#" }: Props) {
  const sell = book.priceSell || 0;
  const list = book.priceList || 0;

  return (
    <Link
      href={href}
      className="block rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {/* 썸네일: 잘리지 않고 전체가 보이도록 */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-2xl bg-neutral-100">
        <Image
          src={book.coverUrl}
          alt={book.title}
          fill
          sizes="(min-width:1024px) 320px, 50vw"
          className="object-contain"
        />
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight">
          {book.title}
        </h3>
        {book.author && (
          <p className="mt-1 text-sm text-neutral-500 line-clamp-1">{book.author}</p>
        )}

        {/* 판매가 + 정가(취소선) */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[15px] font-semibold">{formatKRW(sell)}</span>
          {list > 0 && list > sell && (
            <span className="text-sm text-neutral-400 line-through">
              {formatKRW(list)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
