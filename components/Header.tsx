// components/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Search, User, LogOut, Package, Settings, Menu, X, PenLine, Ticket } from 'lucide-react';

const CartCount = dynamic(() => import("@/components/CartCount"), { ssr: false });

const menuItems = [
  { label: 'Home', href: '/' },
  { label: '검색', href: '/search' }, // 링크 수정 (/search 페이지로 바로 이동 가능)
  { label: '소식', href: '/news' },
];

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ 
    email: string; 
    name: string | null; 
    nickname: string | null; 
    exchangeTickets: number; 
  } | null>(null);
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' });
      setUser(null);
      setIsUserMenuOpen(false);
      setOpen(false);
      window.location.href = '/'; 
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery(''); // 검색 후 초기화
    // 포커스 해제 (모바일 키보드 닫기 등)
    if (searchInputRef.current) searchInputRef.current.blur();
  };

  return (
    <>
      <style jsx global>{`
        @keyframes aurora-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gemini-icon {
          background: linear-gradient(270deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
          background-size: 300% 300%;
          animation: aurora-move 6s ease infinite;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4 md:px-6 h-16">
          
          <div className="flex w-24 items-center justify-start">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu className="h-6 w-6 text-black" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <Link href="/" className="select-none text-xl font-bold tracking-[0.35em] text-black">
              BOOKMOOK
            </Link>
          </div>

          <div className="flex items-center justify-end gap-1">
            
            {/* ✅ [수정됨] 확장형 검색바 (Hover/Focus 시 확장) */}
            <form 
              onSubmit={handleSearch}
              className="group relative flex items-center justify-end mr-1"
            >
              <div className="flex items-center rounded-full border border-transparent bg-transparent transition-all duration-300 ease-in-out group-hover:bg-white group-hover:border-neutral-200 group-hover:shadow-sm group-focus-within:bg-white group-focus-within:border-neutral-200 group-focus-within:shadow-sm group-focus-within:w-64 group-hover:w-64 w-10 h-10 overflow-hidden">
                
                {/* 검색 아이콘 (버튼 역할) */}
                <button 
                  type="submit"
                  className="flex-shrink-0 h-10 w-10 flex items-center justify-center text-black transition-colors hover:bg-black/5 rounded-full z-10"
                  aria-label="검색"
                >
                  <Search size={20} strokeWidth={1.8} />
                </button>
                
                {/* 입력창 (평소엔 숨김) */}
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색어 입력"
                  className="h-full w-full bg-transparent text-sm outline-none px-2 text-neutral-800 placeholder:text-neutral-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"
                />
              </div>
            </form>

            {/* 유저 아이콘 & 드롭다운 */}
            <div 
              className="relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <div className="py-1">
                {user ? (
                  <button className="gemini-icon flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md hover:scale-105 transition-transform">
                    <User size={18} strokeWidth={2.5} />
                  </button>
                ) : (
                  <Link href="/login" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors text-black">
                    <User size={20} strokeWidth={1.8} />
                  </Link>
                )}
              </div>

              {/* 드롭다운 메뉴 */}
              {user && isUserMenuOpen && (
                <div className="absolute right-0 top-full pt-2 w-64 z-50">
                  <div className="rounded-2xl border border-neutral-100 bg-white shadow-xl shadow-black/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    <div className="px-5 py-4 border-b border-neutral-50 bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-black truncate">
                          {user.nickname || user.name || '이름 없음'} 님
                        </p>
                        {!user.nickname && (
                          <Link 
                            href="/my/profile" 
                            className="text-[10px] flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors whitespace-nowrap"
                          >
                            <PenLine size={10} /> 별명 짓기
                          </Link>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 truncate">{user.email}</p>

                      <Link href="/guide#pass">
                        <div className="mt-3 rounded-xl bg-neutral-50 border border-neutral-100 p-3 flex items-center justify-between group hover:border-blue-200 hover:bg-blue-50/50 transition-all select-none cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm border border-neutral-100 text-blue-600 group-hover:scale-110 transition-transform">
                               <Ticket size={16} strokeWidth={2.5} />
                            </div>
                            <span className="text-xs font-semibold text-neutral-500 group-hover:text-blue-600 transition-colors">
                              북묵 패스
                            </span>
                          </div>
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-lg font-bold text-black tabular-nums group-hover:text-blue-600 transition-colors">
                              {user.exchangeTickets || 0}
                            </span>
                            <span className="text-xs text-neutral-400 font-medium group-hover:text-blue-400">장</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                    
                    <div className="py-1.5">
                      <Link href="/my/orders" className="flex items-center gap-3 px-5 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-black transition-colors">
                        <Package size={16} strokeWidth={1.8} />
                        <span>주문 내역</span>
                      </Link>
                      <Link href="/my/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-black transition-colors">
                        <Settings size={16} strokeWidth={1.8} />
                        <span>정보 수정</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-neutral-50 pt-1.5 pb-1.5">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={16} strokeWidth={1.8} />
                        <span>로그아웃</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors text-black">
              <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8} fill="none" strokeLinecap="round">
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6 4 3H2" />
                <circle cx="9.5" cy="19" r="1.25" />
                <circle cx="17.5" cy="19" r="1.25" />
              </svg>
              <span className="absolute top-1 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white ring-2 ring-white">
                <CartCount />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {open && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md animate-in fade-in duration-200">
           <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
            <span className="text-sm uppercase tracking-[0.2em] text-neutral-500">Menu</span>
            <button type="button" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors">
              <X className="h-6 w-6 text-black" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="mx-auto mt-8 max-w-6xl px-6 flex flex-col gap-6">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-3xl font-semibold text-black hover:text-neutral-500 transition-colors">
                {item.label}
              </Link>
            ))}
            <div className="h-px w-full bg-neutral-200 my-2" />
            {!user ? (
              <div className="flex flex-col gap-4">
                <Link href="/login" onClick={() => setOpen(false)} className="text-xl text-neutral-500 hover:text-black">로그인</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="text-xl text-neutral-500 hover:text-black">회원가입</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                 <p className="text-sm text-neutral-400">환영합니다, {user.nickname || user.name}님</p>
                 <Link href="/guide#pass" onClick={() => setOpen(false)} className="flex items-center gap-2 text-lg font-bold text-black hover:text-blue-600 transition-colors">
                    <Ticket size={20} className="text-blue-600" /> 패스: {user.exchangeTickets}장
                 </Link>
                 <button onClick={handleLogout} className="text-lg text-stone-400 hover:text-red-600 mt-2 font-serif">로그아웃</button>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}