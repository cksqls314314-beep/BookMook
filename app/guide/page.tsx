// app/guide/page.tsx
'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Ticket, ArrowRight, Check, Info, RefreshCw } from "lucide-react";

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'policy' | 'pass'>('policy');

  return (
    <main className="bg-white min-h-screen pb-24">
      {/* 1. 상단 히어로 섹션 */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-12 md:pt-32 md:pb-16 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-neutral-900 mb-6 break-keep">
          책을 사랑하는 <br />
          가장 현명한 방법.
        </h1>
        <p className="text-lg md:text-xl text-neutral-500 leading-relaxed break-keep">
          북묵에서는 지속가능한 연결을 목표합니다.<br />
          읽지 않는 책을 팔고, 읽고 싶은 책은 더 가볍게 만나보세요.
        </p>
      </section>

      {/* 2. 탭 네비게이션 */}
      <section className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="mx-auto max-w-3xl px-6 flex gap-8">
          <button
            onClick={() => setActiveTab('policy')}
            className={`py-4 text-lg font-bold transition-colors relative ${
              activeTab === 'policy' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            가격 정책
            {activeTab === 'policy' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-neutral-900 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('pass')}
            className={`py-4 text-lg font-bold transition-colors relative ${
              activeTab === 'pass' ? 'text-emerald-600' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            북묵 패스
            {activeTab === 'pass' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-emerald-500 rounded-t-full" />
            )}
          </button>
        </div>
      </section>

      {/* 3. 탭 컨텐츠 영역 */}
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        {activeTab === 'policy' ? <PricingPolicyContent /> : <BookMookPassContent />}
      </div>

      {/* 4. 하단 공통 링크 */}
      <section className="mt-8 pt-10 border-t border-neutral-100 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-neutral-900 hover:text-emerald-600 transition-colors">
          북묵 둘러보기 <ArrowRight size={20} />
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
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 섹션 A: 판매가 정책 */}
      <div>
        <h2 className="text-3xl font-bold mb-6">투명한 가격 정책</h2>
        <p className="text-neutral-500 text-lg mb-10 leading-relaxed break-keep">
          북묵은 책의 상태와 출간일을 기준으로<br/>
          기계적이고 공정한 가격을 책정합니다.
        </p>

        <div className="grid gap-4">
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
          {/* ✅ 수정됨: '낡음' -> '실속급' */}
          <GradeCard 
            grade="C" 
            title="실속급 (흔적 있음)" 
            desc="밑줄이나 메모가 있지만 읽는 데 지장 없는 도서" 
            sellRate="40%" 
            buyRate="15%" 
          />
        </div>
      </div>

      {/* 섹션 B: 출간일 보정 */}
      <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm text-emerald-600">
            <Info size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">출간일 보정 안내</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              최신 도서일수록 더 높은 가치를 인정받습니다.<br/>
              기본 가격에 아래 가중치가 추가로 적용됩니다.
            </p>
            <ul className="space-y-2 text-sm font-medium text-neutral-700">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-500" /> 2년 이내 출간: <span className="text-emerald-600">+20% 더 받음</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-500" /> 5년 이내 출간: <span className="text-neutral-400">변동 없음 (100%)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-neutral-400" /> 5년 이상 경과: <span className="text-red-400">-30% 감가</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

// 등급 카드 컴포넌트
function GradeCard({ grade, title, desc, sellRate, buyRate }: { grade: string, title: string, desc: string, sellRate: string, buyRate: string }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl border border-neutral-200 bg-white hover:border-emerald-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${grade === 'A' ? 'bg-emerald-100 text-emerald-700' : grade === 'B' ? 'bg-stone-100 text-stone-600' : 'bg-orange-50 text-orange-600'}`}>
          {grade}
        </div>
        <div>
          <h4 className="font-bold text-lg">{title}</h4>
          <p className="text-neutral-400 text-sm">{desc}</p>
        </div>
      </div>
      <div className="flex gap-8 w-full md:w-auto pl-16 md:pl-0">
        <div className="text-left md:text-right">
          <div className="text-xs text-neutral-400 mb-0.5">구매 시</div>
          <div className="font-bold text-lg text-neutral-900">정가의 {sellRate}</div>
        </div>
        <div className="text-left md:text-right">
          <div className="text-xs text-neutral-400 mb-0.5">판매 시 (매입)</div>
          <div className="font-bold text-lg text-emerald-600">정가의 {buyRate}</div>
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
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 헤드라인 */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-4">
          <Ticket size={16} /> 북묵 패스
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-snug break-keep">
          내 책을 팔면,<br />
          {/* ✅ 수정됨: 도매가 -> 가장 합리적인 가격 */}
          <span className="text-emerald-600">가장 합리적인 가격</span>으로 환승합니다.
        </h2>
        <p className="text-neutral-500 text-lg leading-relaxed">
          북묵에 책을 판매하면 '북묵 패스'를 드립니다.<br/>
          {/* ✅ 수정됨: 수수료 -> 패스료 */}
          패스가 있다면 마진을 뺀 <b>[매입가 + 패스료 20%]</b> 가격으로 구매할 수 있습니다.
        </p>
      </div>

      {/* ⭐ 실제 책 예시 카드 (다크 모드) */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#1a1c1a] text-white shadow-2xl">
        {/* 배경 데코 */}
        <div className="absolute top-0 right-0 h-80 w-80 translate-x-1/4 -translate-y-1/4 rounded-full bg-emerald-600/20 blur-[80px]" />
        
        <div className="relative z-10 p-8 md:p-10">
          <div className="text-sm font-medium text-white/50 mb-6">실제 적용 예시</div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* 책 썸네일 */}
            <div className="relative w-32 md:w-40 aspect-[1/1.5] rounded-lg overflow-hidden shadow-lg flex-none bg-neutral-800">
               <Image 
                 src="https://image.aladin.co.kr/product/34672/22/cover500/k302933346_2.jpg" 
                 alt="시대예보 표지"
                 fill
                 className="object-cover"
               />
            </div>

            {/* 가격 정보 */}
            <div className="flex-1 w-full space-y-5">
              <div>
                <h3 className="text-xl font-bold leading-tight">시대예보: 경량문명의 탄생</h3>
                <p className="text-white/60 text-sm mt-1">송길영 저 · A등급 (최상)</p>
              </div>

              <div className="space-y-3 bg-white/5 rounded-2xl p-5 border border-white/5">
                <div className="flex justify-between text-white/40 text-sm">
                  <span>정가</span>
                  <span className="line-through">22,000원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">일반 회원 구매가</span>
                  <span className="text-lg font-medium">14,300원</span>
                </div>
                
                <div className="h-px bg-white/10 my-2" />

                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2 text-emerald-400 mb-1">
                    <Ticket size={20} strokeWidth={2.5} />
                    <span className="font-bold">패스 회원가</span>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold tracking-tight text-white">7,900</span>
                    <span className="text-xl font-medium text-white/40 ml-1">원</span>
                  </div>
                </div>
                {/* ✅ 수정됨: 수수료 -> 패스료 */}
                <p className="text-right text-xs text-emerald-400/60">
                  (매입가 6,600원 + 패스료 2,000원)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 설명 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-6 bg-stone-50 rounded-2xl">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm text-neutral-700">
                <RefreshCw size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">어떻게 얻나요?</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              가지고 계신 책을 북묵에 판매하세요.<br/>
              판매가 확정된 <strong>책 1권당 패스 1장</strong>이<br/>
              자동으로 적립됩니다.
            </p>
         </div>
         <div className="p-6 bg-stone-50 rounded-2xl">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm text-emerald-600">
                <Ticket size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">어떻게 쓰나요?</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              결제 시 별도의 적용 없이,<br/>
              패스를 보유하고 있다면 <strong>자동으로 할인가가 적용</strong>되어<br/>
              가장 현명하게 구매할 수 있습니다.
            </p>
         </div>
      </div>

    </div>
  );
}