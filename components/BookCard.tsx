// components/BookCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/getRecentBooks";
import { formatKRW } from "@/lib/getRecentBooks";
import PassPriceTag from "./PassPriceTag"; // ✅ import

type Props = {
  book: Book;
  href?: string;
};

export default function BookCard({ book, href = "#" }: Props) {
  const sell = book.priceSell || 0;
  const list = book.priceList || 0;
  // 패스 가격 (없으면 안 보여줌)
  const passPrice = book.passPrice; 

  return (
    <Link
      href={href}
      className="block group rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-all"
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-2xl bg-neutral-100">
        <Image
          src={book.coverUrl}
          alt={book.title}
          fill
          sizes="(min-width:1024px) 320px, 50vw"
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-neutral-900">
          {book.title}
        </h3>
        {book.author && (
          <p className="mt-1 text-sm text-neutral-500 line-clamp-1">{book.author}</p>
        )}

        <div className="mt-3 flex flex-col gap-1">
          {/* 1. 일반 판매가 */}
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold text-black">{formatKRW(sell)}</span>
            {list > 0 && list > sell && (
              <span className="text-xs text-neutral-400 line-through">
                {formatKRW(list)}
              </span>
            )}
          </div>

          {/* 2. 북묵 패스 가격 (있을 때만 표시) */}
          {passPrice && passPrice < sell && (
            <PassPriceTag price={passPrice} />
          )}
        </div>
      </div>
    </Link>
  );
}