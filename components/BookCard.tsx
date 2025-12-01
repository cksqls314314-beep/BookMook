// components/BookCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircleHeart, User } from "lucide-react"; // 아이콘 추가
import type { Book } from "@/lib/getRecentBooks";
import { formatKRW } from "@/lib/getRecentBooks";
import PassPriceTag from "./PassPriceTag";

type Props = {
  book: Book;
  href?: string;
};

export default function BookCard({ book, href = "#" }: Props) {
  const sell = book.priceSell || 0;
  const list = book.priceList || 0;
  const passPrice = book.passPrice; 

  return (
    <Link
      href={href}
      className="block group relative rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-all"
    >
      {/* ✅ 판매자 뱃지 (판매자 정보가 있을 때만 표시) */}
      {book.sellerName && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-neutral-700 shadow-sm border border-black/5">
          <User size={12} className="text-emerald-600" />
          {book.sellerName}
        </div>
      )}

      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-2xl bg-neutral-100">
        <Image
          src={book.coverUrl}
          alt={book.title}
          fill
          sizes="(min-width:1024px) 320px, 50vw"
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* ✅ 추천사 말풍선 오버레이 (추천사가 있을 때만 Hover시 등장) */}
        {book.recommendation && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
            <div className="text-white text-center">
              <MessageCircleHeart className="mx-auto mb-3 text-emerald-400" size={28} />
              <p className="text-sm font-medium leading-relaxed break-keep text-shadow-sm">
                &quot;{book.recommendation}&quot;
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-neutral-900">
          {book.title}
        </h3>
        {book.author && (
          <p className="mt-1 text-sm text-neutral-500 line-clamp-1">{book.author}</p>
        )}

        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold text-black">{formatKRW(sell)}</span>
            {list > 0 && list > sell && (
              <span className="text-xs text-neutral-400 line-through">
                {formatKRW(list)}
              </span>
            )}
          </div>

          {passPrice && passPrice < sell && (
            <PassPriceTag price={passPrice} showTooltip={false} />
          )}
        </div>
      </div>
    </Link>
  );
}