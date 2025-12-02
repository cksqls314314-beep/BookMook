// components/Header.tsx (전체 코드)
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Search, User, LogOut, Package, Settings, Menu, X, PenLine, Ticket } from 'lucide-react';

const CartCount = dynamic(() => import("@/components/CartCount"), { ssr: false });

const menuItems = [
  { label: 'Home', href: '/' },
  { label: '검색', href: '/#search' },
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

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, []);

  // ✅ [수정됨] 서버 API를 호출하여 확실하게 로그아웃 처리
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsUserMenuOpen(false);
      setOpen(false); // 모바일 메뉴 닫기
      window.location.href = '/'; // 새로고침하며 홈으로 이동
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-100 bg-[#FDFBF7]/95 backdrop-blur-md font-serif text-stone-900 transition-all">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6 h-16">
          
          <div className="flex w-24 items-center justify-start">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-200/50 transition-colors text-stone-600"
              aria-label="메뉴 열기"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <Link href="/" className="select-none text-2xl font-medium tracking-tight text-stone-900">
              BookMook
            </Link>
          </div>

          <div className="flex w-24 items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('search');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-200/50 transition-colors text-stone-600"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>

            <div 
              className="relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <div className="py-1">
                {user ? (
                  <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-200/50 text-stone-600 transition-colors">
                    <User size={22} strokeWidth={1.5} />
                  </button>
                ) : (
                  <Link href="/login" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-200/50 transition-colors text-stone-600">
                    <User size={22} strokeWidth={1.5} />
                  </Link>
                )}
              </div>

              {user && isUserMenuOpen && (
                <div className="absolute right-0 top-full pt-2 w-64 z-50">
                  <div className="rounded-sm border border-stone-200 bg-[#FDFBF7] shadow-xl shadow-stone-200/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/30">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-stone-900 truncate font-serif">
                          {user.nickname || user.name || '이름 없음'} 님
                        </p>
                        {!user.nickname && (
                          <Link 
                            href="/my/profile" 
                            className="text-[10px] flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-400 transition-colors whitespace-nowrap"
                          >
                            <PenLine size={10} /> 별명 짓기
                          </Link>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 truncate font-sans">{user.email}</p>

                      <Link href="/guide#pass" className="block group mt-3">
                        <div className="rounded border border-stone-200 bg-white p-3 flex items-center justify-between hover:border-emerald-400/50 hover:bg-emerald-50/10 transition-all cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Ticket size={14} strokeWidth={1.5} className="text-emerald-600" />
                            <span className="text-xs font-medium text-stone-500 group-hover:text-emerald-700 transition-colors">
                              북묵 패스
                            </span>
                          </div>
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-base font-semibold text-stone-900 tabular-nums group-hover:text-emerald-700">
                              {user.exchangeTickets || 0}
                            </span>
                            <span className="text-[10px] text-stone-400">장</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                    
                    <div className="py-2">
                      <Link href="/my/orders" className="flex items-center gap-3 px-5 py-2.5 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors font-serif">
                        <Package size={16} strokeWidth={1.5} />
                        <span>주문 내역</span>
                      </Link>
                      <Link href="/my/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors font-serif">
                        <Settings size={16} strokeWidth={1.5} />
                        <span>정보 수정</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-stone-100 pt-1.5 pb-1.5">
                      {/* ✅ [수정됨] 로그아웃 버튼 */}
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-stone-400 hover:text-red-600 hover:bg-red-50/30 transition-colors text-left font-serif"
                      >
                        <LogOut size={16} strokeWidth={1.5} />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-200/50 transition-colors text-stone-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round">
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6 4 3H2" />
                <circle cx="9.5" cy="19" r="1.25" />
                <circle cx="17.5" cy="19" r="1.25" />
              </svg>
              <span className="absolute top-1 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-stone-800 text-[9px] font-bold text-stone-50 ring-2 ring-[#FDFBF7]">
                <CartCount />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {open && (
        <div className="fixed inset-0 z-50 bg-[#FDFBF7]/98 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6 h-16">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-sans">Menu</span>
            <button type="button" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-200/50 transition-colors">
              <X className="h-6 w-6 text-stone-800" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="mx-auto mt-12 max-w-6xl px-6 flex flex-col gap-8 text-center">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-2xl font-medium text-stone-800 hover:text-stone-500 transition-colors font-serif">
                {item.label}
              </Link>
            ))}
            <div className="h-px w-20 bg-stone-200 mx-auto my-4" />
            {!user ? (
              <div className="flex flex-col gap-5">
                <Link href="/login" onClick={() => setOpen(false)} className="text-lg text-stone-500 hover:text-stone-900 font-serif">로그인</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="text-lg text-stone-500 hover:text-stone-900 font-serif">회원가입</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-5 items-center">
                 <p className="text-sm text-stone-400 font-serif">반갑습니다, {user.nickname || user.name}님</p>
                 <Link href="/guide#pass" onClick={() => setOpen(false)} className="flex items-center gap-2 text-lg font-medium text-stone-800 hover:text-emerald-700 transition-colors font-serif">
                    <Ticket size={18} className="text-emerald-600" /> 패스: {user.exchangeTickets}장
                 </Link>
                 {/* ✅ [수정됨] 모바일 로그아웃 버튼 */}
                 <button onClick={handleLogout} className="text-lg text-stone-400 hover:text-red-600 mt-2 font-serif">로그아웃</button>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}