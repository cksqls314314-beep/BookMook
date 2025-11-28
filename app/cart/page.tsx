// app/cart/page.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import type { CartLine } from '@/lib/cart';
import {
  getCart,
  updateQty,
  removeFromCart,
  clearCart,
  getSubtotal,
} from '@/lib/cart';

export default function CartPage() {
  const router = useRouter();

  const [items, setItems] = useState<CartLine[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  const formatKRW = useCallback(
    (n: number) => new Intl.NumberFormat('ko-KR').format(n),
    []
  );

  const refresh = useCallback(() => {
    const list = getCart();
    setItems(list);
    setSubtotal(getSubtotal(list));
  }, []);

  useEffect(() => {
    refresh();

    // cart.ts -> write()에서 발행하는 커스텀 이벤트
    const onChanged = () => refresh();
    window.addEventListener('cart:changed', onChanged as any);

    // 다른 탭/창에서 localStorage 변경 시 동기화
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'hgcc_cart_v1') refresh();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('cart:changed', onChanged as any);
      window.removeEventListener('storage', onStorage);
    };
  }, [refresh]);

  const onMinus  = (it: CartLine) => updateQty(it.isbn, it.grade, Math.max(1, (it.qty || 1) - 1));
  const onPlus   = (it: CartLine) => updateQty(it.isbn, it.grade, (it.qty || 1) + 1);
  const onRemove = (it: CartLine) => removeFromCart(it.isbn, it.grade);

  // 비었을 때 "계속 둘러보기" → 이전 페이지로 (히스토리가 없으면 홈으로)
  const goBackOrHome = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold mb-6">장바구니</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 p-10 text-center">
          <p className="text-gray-600 mb-4">장바구니가 비었습니다.</p>
          <button
            onClick={goBackOrHome}
            className="inline-block px-5 h-11 rounded-xl border border-gray-300 hover:border-gray-400 transition grid place-items-center"
          >
            계속 둘러보기
          </button>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
            {items.map((it) => (
              <div
                key={it.isbn + (it.grade ?? '')}
                className="flex items-center gap-4 p-4"
              >
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
                  {it.coverUrl ? (
                    <Image
                      src={it.coverUrl}
                      alt={it.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-gray-400 text-xs">
                      No Cover
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{it.title}</div>
                  <div className="text-sm text-gray-500">
                    {formatKRW(it.price)}원
                    {it.grade ? ` · 등급 ${it.grade}` : ''}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="h-8 w-8 rounded border border-gray-300 grid place-items-center"
                    onClick={() => onMinus(it)}
                    aria-label="minus"
                  >
                    −
                  </button>
                  <div className="w-8 text-center tabular-nums">{it.qty}</div>
                  <button
                    className="h-8 w-8 rounded border border-gray-300 grid place-items-center"
                    onClick={() => onPlus(it)}
                    aria-label="plus"
                  >
                    ＋
                  </button>
                </div>

                <button
                  className="ml-2 text-sm text-gray-500 hover:text-red-600"
                  onClick={() => onRemove(it)}
                >
                  제거
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => clearCart()}
            >
              전체 비우기
            </button>
            <div className="text-lg">
              합계&nbsp;
              <strong className="tabular-nums">
                {formatKRW(subtotal)}원
              </strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
