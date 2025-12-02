// components/BookDetail.tsx
'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { addToCart } from '@/lib/cart';
import type { OneBook, Variant } from '@/lib/oneBook';
import PassPriceTag from "./PassPriceTag";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

type Props = { data: OneBook };

const gradeOrder: Variant['grade'][] = ['A', 'B', 'C'];

const gradeLabelMap: Record<Variant['grade'], string> = {
  A: '거의 새것이에요!',
  B: '대체로 깨끗한 편이에요',
  C: '열심히 독서한 흔적이 있어요',
};

const gradeColorMap: Record<Variant['grade'], string> = {
  A: 'bg-blue-600',
  B: 'bg-emerald-500',
  C: 'bg-amber-500',
};

export default function BookDetail({ data }: Props) {
  const firstGrade = useMemo<Variant['grade'] | null>(() => {
    for (const g of gradeOrder) {
      const v = data.variants.find((v) => v.grade === g && v.count > 0);
      if (v) return v.grade;
    }
    return null;
  }, [data]);

  const [grade, setGrade] = useState<Variant['grade'] | null>(firstGrade);

  const activeVariant = useMemo(
    () => (grade ? data.variants.find((v) => v.grade === grade) ?? null : null),
    [data, grade],
  );

  const displayPrice = useMemo(() => {
    if (activeVariant && activeVariant.priceSell) return activeVariant.priceSell;
    return data.priceSell || 0;
  }, [data, activeVariant]);

  const listPrice = data.listPrice || 0;

  const allSoldOut =
    data.variants.length > 0 &&
    data.variants.every((v) => !v.count || v.count <= 0);

  function handleAddToCart() {
    if (allSoldOut) {
      alert('현재 재고가 없습니다.');
      return;
    }
    addToCart({
      isbn: data.isbn,
      title: data.title,
      author: data.author,
      coverUrl: data.coverUrl,
      grade: grade ?? undefined,
      price: displayPrice || 0,
      qty: 1,
    });
    alert('장바구니에 담았습니다.');
  }

  function openCart() {
    window.location.href = '/cart';
  }

  const metaLine = [data.author, data.publisher, data.pubDate]
    .filter(Boolean)
    .join(' · ');

  const hasIntroOrToc = Boolean(data.intro || data.toc);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)]">
        {/* 왼쪽: 표지 이미지 */}
        <div className="self-start lg:sticky lg:top-24">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted shadow-sm">
            {data.coverUrl ? (
              <Image
                src={data.coverUrl}
                alt={data.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                커버 없음
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 정보 영역 */}
        <section className="flex flex-col gap-8">
          <header className="space-y-4">
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              {data.title}
            </h1>

            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-bold text-black">
                  {displayPrice.toLocaleString()}원
                </span>
                
                {listPrice > 0 && displayPrice < listPrice && (
                  <span className="text-lg font-normal text-muted-foreground line-through text-gray-400">
                    {listPrice.toLocaleString()}원
                  </span>
                )}

                {data.passPrice && data.passPrice < displayPrice && (
                   <PassPriceTag price={data.passPrice} className="text-lg" showTooltip={true} />
                )}
              </div>

              {/* 상태 배지 (남은 수량 삭제) */}
              {grade && (
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-4 py-1 text-xs font-medium text-white',
                      gradeColorMap[grade],
                    )}
                  >
                    {gradeLabelMap[grade]}
                  </span>
                  {allSoldOut && (
                    <span className="text-xs text-red-500">품절</span>
                  )}
                </div>
              )}
            </div>
          </header>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={allSoldOut}
              className={cn(
                'h-11 rounded-full px-6 text-sm font-medium transition',
                allSoldOut
                  ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                  : 'bg-black text-white hover:opacity-90',
              )}
            >
              {allSoldOut ? '품절되었습니다' : '장바구니 담기'}
            </button>
            <button
              type="button"
              onClick={openCart}
              className="h-11 rounded-full border px-6 text-sm font-medium hover:bg-gray-100 transition"
            >
              장바구니 보기
            </button>
          </div>

          {hasIntroOrToc && (
            <div className="space-y-8 border-t pt-6">
              {data.intro && (
                <section className="space-y-3 max-w-xl">
                  <h2 className="text-base font-semibold">소개</h2>
                  {metaLine && (
                    <p className="text-xs text-gray-500">
                      {metaLine}
                    </p>
                  )}
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                    {data.intro}
                  </p>
                </section>
              )}

              {data.toc && (
                <section className="space-y-3 max-w-xl">
                  <h2 className="text-base font-semibold">목차</h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                    {data.toc}
                  </p>
                </section>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}