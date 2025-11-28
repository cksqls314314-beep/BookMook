// components/Nav.tsx
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Search, ShoppingCart } from "lucide-react";

// ✅ 장바구니 카운트를 클라이언트에서만 렌더
const CartCount = dynamic(() => import("@/components/CartCount"), { ssr: false });

/**
 * 메인 내비게이션
 *
 * - 왼편: 브랜드 로고
 * - 중앙: 추천 카테고리 + 검색 아이콘
 * - 오른편: 장바구니 아이콘 + 개수
 *
 * 검색 아이콘을 누르면 랜딩 페이지의 검색 섹션(#search)으로 스크롤합니다.
 */
export default function Nav() {
  // 추천 카테고리 목록. 필요에 따라 추가/수정 가능.
  const categories = [
    { label: "문학·소설", href: "/chapters/fiction" },
    { label: "에세이", href: "/chapters/essay" },
    { label: "철학·사회", href: "/chapters/philosophy" },
    { label: "아트·사진", href: "/chapters/art" },
    { label: "자연·정원", href: "/chapters/garden" },
  ];

  return (
    <nav className="flex items-center justify-between py-4 px-4 md:px-6">
      {/* 브랜드 명: 다른 카테고리와 구분되도록 볼드 처리 */}
      <Link href="/" className="font-bold text-lg md:text-xl whitespace-nowrap">
        BookMook
      </Link>

      {/* 중앙 영역: 카테고리 + 검색 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-5">
          {categories.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm md:text-base hover:text-black whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
          {/* 검색 아이콘: 랜딩 페이지의 검색 영역(#search)으로 이동 */}
          <Link
            href="/#search"
            className="p-1 hover:text-black"
            aria-label="검색"
          >
            <Search size={20} strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* 오른편: 회원가입·로그인 버튼 + 장바구니 */}
      <div className="flex items-center gap-4">
        {/* 로그인 / 회원가입 */}
        <Link
          href="/login"
          className="text-sm md:text-base whitespace-nowrap px-3 py-1 border border-neutral-300 rounded-md hover:bg-neutral-100"
        >
          로그인
        </Link>
        <Link
          href="/register"
          className="text-sm md:text-base whitespace-nowrap px-3 py-1 border border-neutral-300 rounded-md hover:bg-neutral-100"
        >
          회원가입
        </Link>
        {/* 장바구니 */}
        <Link
          href="/cart"
          className="relative flex items-center hover:text-black whitespace-nowrap"
          aria-label="장바구니"
        >
          <ShoppingCart size={22} strokeWidth={2} />
          {/* 카운트를 아이콘 오른쪽에 표시 */}
          <span className="ml-1 text-sm">
            <CartCount />
          </span>
        </Link>
      </div>
    </nav>
  );
}