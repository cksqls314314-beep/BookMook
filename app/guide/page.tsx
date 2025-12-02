// app/guide/page.tsx
'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// ✅ Timer 아이콘 추가
import { Ticket, ArrowRight, Check, Info, RefreshCw, Timer } from "lucide-react";

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'policy' | 'pass'>('policy');

  return (
    // 배경색: 따뜻한 크림색 (Book and Sons 스타일)
    <main className="bg-[#FDFBF7] min-h-screen pb-24 font-serif">
      {/* 1. 상단 히어로 섹션 */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-16 md:pt-36 md:pb-20 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-medium leading-tight tracking-tight text-stone-900 mb-8 break-keep">
          책을 사랑하는 <br />
          가장 현명한 방법.
        </h1>
        <p className="text-lg md:text-[19px] text-stone-600 leading-loose break-keep max-w-2xl">
          북묵에서는 지속가능한 연결을 목표합니다.<br />
          읽지 않는 책을 팔고, 읽고 싶은 책은 더 가볍게 만나보세요.
        </p>
      </section>

      {/* 2. 탭 네비게이션 */}
      <section className="sticky top-[64px] z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200">
        <div className="mx-auto max-w-4xl px-6 flex gap-10">
          <button
            onClick={() => setActiveTab('policy')}
            className={`py-5 text-lg transition-colors relative ${
              activeTab === 'policy' ? 'text-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            가격 정책
            {activeTab === 'policy' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('pass')}
            className={`py-5 text-lg transition-colors relative ${
              activeTab === 'pass' ? 'text-emerald-800 font-semibold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            북묵 패스
            {activeTab === 'pass' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-700" />
            )}
          </button>
        </div>
      </section>

      {/* 3. 탭 컨텐츠 영역 */}
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        {activeTab === 'policy' ? <PricingPolicyContent /> : <BookMookPassContent />}
      </div>

      {/* 4. 하단 공통 링크 */}
      <section className="mt-12 pt-12 border-t border-stone-200 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-xl font-medium text-stone-800 hover:text-emerald-700 transition-colors">
          북묵 둘러보기 <ArrowRight size={20} strokeWidth={1.5} />
        </Link>
      </section>
    </main>
  );
}

// ------------------------------------------------------------------
// 탭 1: 가격 정책 콘텐츠
// ------------------------------------------------------------------
function PricingPolicyContent() {
  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 섹션 A: 판매가 정책 (등급) */}
      <div>
        <h2 className="text-3xl md:text-4xl font-medium mb-8 text-stone-900">가격 정책</h2>
        <p className="text-stone-600 text-lg mb-12 leading-relaxed break-keep">
          책의 상태와 출간일을 기준으로<br/>
          투명하고 공정한 가격을 책정합니다.
        </p>

        <div className="grid gap-5">
          <GradeCard 
            grade="A" 
            title="최상급 (새것 같음)" 
            desc="사용감이 거의 없고 깨끗한 도서" 
            sellRate="65%" 
            buyRate="30%" 
          />
          <GradeCard 
            grade="B" 
            title="상급 (사용감 있음)" 
            desc="약간의 흔적이 있지만 읽기에 좋은 도서" 
            sellRate="55%" 
            buyRate="22%" 
          />
          <GradeCard 
            grade="C" 
            title="실속급 (흔적 있음)" 
            desc="밑줄이나 메모가 있지만 읽는 데 지장 없는 도서" 
            sellRate="40%" 
            buyRate="15%" 
          />
        </div>
      </div>

      {/* 섹션 B: 추가 보정 및 할인 정책 (2열 그리드) */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* 1. 출간일 보정 */}
        <div className="bg-stone-50 rounded-sm border border-stone-200 p-8 hover:border-stone-300 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-white border border-stone-100 shadow-sm text-emerald-700">
              <Info size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3 text-stone-900">출간일 보정 안내</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-5">
                최신 도서일수록 더 높은 가치를 인정받습니다.<br/>
                기본 가격에 아래 가중치가 적용됩니다.
              </p>
              <ul className="space-y-3 text-[15px] text-stone-700">
                <li className="flex items-center gap-2.5">
                  <Check size={16} className="text-emerald-600" /> 
                  <span>2년 이내 출간: <strong className="text-emerald-700 font-medium">+20% 더 받음</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={16} className="text-emerald-600" /> 
                  <span>5년 이내 출간: <span className="text-stone-400">변동 없음 (100%)</span></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={16} className="text-stone-400" /> 
                  <span>5년 이상 경과: <span className="text-stone-500">-30% 감가</span></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. [NEW] 재고 기간 추가 할인 */}
        <div className="bg-stone-50 rounded-sm border border-stone-200 p-8 hover:border-rose-200 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-white border border-stone-100 shadow-sm text-rose-600">
              <Timer size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-3 text-stone-900">재고 기간 추가 할인</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-5">
                좋은 주인을 기다리며 서가에 오래 머무른<br/>
                책에는 추가적인 가격 혜택이 적용됩니다.
              </p>
              <ul className="space-y-3 text-[15px] text-stone-700">
                <li className="flex items-center gap-2.5">
                  <Check size={16} className="text-rose-500" /> 
                  <span>6개월 이상: <strong className="text-rose-600 font-medium">10% 추가 할인</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={16} className="text-rose-500" /> 
                  <span>1년 이상: <strong className="text-rose-600 font-medium">20% 추가 할인</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

// 등급 카드 컴포넌트 (스타일 수정: 각진 모서리, 명조체)
function GradeCard({ grade, title, desc, sellRate, buyRate }: { grade: string, title: string, desc: string, sellRate: string, buyRate: string }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 border border-stone-200 bg-white hover:border-emerald-500/30 transition-all">
      <div className="flex items-center gap-5 mb-4 md:mb-0">
        <div className={`w-12 h-12 flex items-center justify-center text-xl font-serif font-medium border ${
          grade === 'A' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 
          grade === 'B' ? 'bg-stone-50 border-stone-100 text-stone-600' : 
          'bg-orange-50 border-orange-100 text-orange-700'
        }`}>
          {grade}
        </div>
        <div>
          <h4 className="font-medium text-lg text-stone-900">{title}</h4>
          <p className="text-stone-400 text-sm mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="flex gap-10 w-full md:w-auto pl-[68px] md:pl-0">
        <div className="text-left md:text-right">
          <div className="text-xs text-stone-400 mb-1 uppercase tracking-wider">구매 시</div>
          <div className="text-lg text-stone-800">정가의 <strong>{sellRate}</strong></div>
        </div>
        <div className="text-left md:text-right">
          <div className="text-xs text-stone-400 mb-1 uppercase tracking-wider">판매 시 (매입)</div>
          <div className="text-lg text-emerald-700">정가의 <strong>{buyRate}</strong></div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 탭 2: 북묵 패스 콘텐츠
// ------------------------------------------------------------------
function BookMookPassContent() {
  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 헤드라인 */}
      <div>
        <div className="inline-block px-3 py-1 mb-6 border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-medium tracking-widest uppercase">
          BOOKMOOK PASS
        </div>
        <h2 className="text-3xl md:text-5xl font-medium mb-6 leading-tight break-keep text-stone-900">
          내 책을 팔면,<br />
          <span className="text-emerald-800">가장 합리적인 가격</span>으로 환승합니다.
        </h2>
        <p className="text-stone-600 text-lg md:text-xl leading-relaxed">
          북묵에 책을 판매하면 '북묵 패스'를 드립니다.<br/>
          패스가 있다면 마진을 뺀 <b>[매입가 + 패스료 20%]</b> 가격으로 구매할 수 있습니다.
        </p>
      </div>

      {/* 실제 책 예시 카드 (Book & Sons 스타일 다크 모드) */}
      <div className="relative overflow-hidden bg-[#1c1c1c] text-stone-200 shadow-2xl">
        {/* 배경 데코 */}
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-900/20 blur-[100px]" />
        
        <div className="relative z-10 p-8 md:p-12">
          <div className="text-xs font-medium text-stone-500 mb-8 tracking-widest uppercase">Example Case</div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            {/* 책 썸네일 */}
            <div className="relative w-40 md:w-48 aspect-[1/1.5] shadow-lg flex-none bg-stone-800">
               <Image 
                 src="https://shopping-phinf.pstatic.net/main_5650400/56504009578.20250830091352.jpg" 
                 alt="시대예보 표지"
                 fill
                 className="object-cover opacity-90"
               />
            </div>

            {/* 가격 정보 */}
            <div className="flex-1 w-full space-y-6">
              <div>
                <h3 className="text-2xl font-medium text-white leading-tight mb-2">시대예보: 경량문명의 탄생</h3>
                <p className="text-stone-500 text-sm">송길영 저 · A등급 (최상)</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-stone-500 text-sm">
                  <span>정가</span>
                  <span className="line-through decoration-stone-600">22,000원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">일반 회원 구매가</span>
                  <span className="text-xl text-stone-300">17,200원</span>
                </div>
                
                <div className="py-4">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                      <Ticket size={20} strokeWidth={1.5} />
                      <span className="font-medium text-lg">패스 회원가</span>
                    </div>
                    <div className="text-right">
                      <span className="text-5xl font-medium tracking-tight text-white">9,480</span>
                      <span className="text-xl text-stone-500 ml-1 font-light">원</span>
                    </div>
                  </div>
                  <p className="text-right text-xs text-emerald-500/60 mt-2 font-mono">
                    (매입가 7,900원 + 패스료 2,000원)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 설명 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-8 border border-stone-200 bg-white hover:border-stone-300 transition-colors">
            <div className="mb-6 text-stone-400">
                <RefreshCw size={28} strokeWidth={1.2} />
            </div>
            <h3 className="font-medium text-xl mb-3 text-stone-900">어떻게 얻나요?</h3>
            <p className="text-stone-500 text-base leading-relaxed">
              가지고 계신 책을 북묵에 판매하세요.<br/>
              판매가 확정된 <strong>책 1권당 패스 1장</strong>이<br/>
              자동으로 적립됩니다.
            </p>
         </div>
         <div className="p-8 border border-stone-200 bg-white hover:border-stone-300 transition-colors">
            <div className="mb-6 text-emerald-700">
                <Ticket size={28} strokeWidth={1.2} />
            </div>
            <h3 className="font-medium text-xl mb-3 text-stone-900">어떻게 쓰나요?</h3>
            <p className="text-stone-500 text-base leading-relaxed">
              결제 시 별도의 적용 없이,<br/>
              패스를 보유하고 있다면 <strong>자동으로 할인가가 적용</strong>되어<br/>
              가장 현명하게 구매할 수 있습니다.
            </p>
         </div>
      </div>

    </div>
  );
}