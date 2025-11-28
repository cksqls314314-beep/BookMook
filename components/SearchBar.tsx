// components/SearchBar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onSlash = (e: KeyboardEvent) => {
      if (e.key === '/' && (document.activeElement as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onSlash);
    return () => window.removeEventListener('keydown', onSlash);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={onSubmit} className="relative mx-auto max-w-4xl" aria-label="도서 검색">
      {/* ✔︎ 약한 음영/glow */}
      <div className="absolute inset-0 rounded-full bg-black/3 blur-sm opacity-30" />
      {/* ✔︎ 하얀 알약형, 보더 없음 */}
      <div className="relative flex items-center rounded-full bg-white px-5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_26px_rgba(0,0,0,0.08)] transition">
        <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-500">
          <path d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="제목, 저자, ISBN으로 검색 ( / 로 포커스 )"
          className="ml-3 w-full bg-transparent outline-none text-base placeholder:text-gray-400"
          aria-label="검색어 입력"
        />
        <button
          type="submit"
          className="ml-3 rounded-full bg-black text-white text-sm px-5 py-2 hover:bg-gray-800 whitespace-nowrap [writing-mode:horizontal-tb] leading-none"
        >
          검색
        </button>
      </div>
    </form>
  );
}
