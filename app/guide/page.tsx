// app/guide/page.tsx
import Link from "next/link";
import { Ticket, ArrowRight, RefreshCw } from "lucide-react";

export default function GuidePage() {
  return (
    <main className="bg-white min-h-screen pb-24">
      {/* 상단 히어로 섹션 */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-12 md:pt-32 md:pb-20">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-neutral-900 mb-6">
          책을 사랑하는 <br />
          가장 현명한 방법.
        </h1>
        <p className="text-lg md:text-xl text-neutral-500 leading-relaxed">
          북묵에서는 지속가능한 연결을 목표합니다.<br />
          읽지 않는 책을 팔고, 읽고 싶은 책은 더 가볍게 만나보세요.
        </p>
      </section>

      {/* 북묵 패스 섹션 (ID: pass) */}
      <section id="pass" className="bg-stone-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          {/* 뱃지 색상 변경: Blue -> Green */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-6">
            <Ticket size={16} /> 북묵 패스
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-12 leading-snug">
            내 책을 팔면,<br />
            {/* 강조 텍스트 색상 변경: Blue -> Green */}
            <span className="text-emerald-600">보다 싼 가격</span>으로 도서 환승.
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* 카드 1: 적립 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="h-12 w-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-6 text-neutral-700">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">1권 팔 때마다 1장 적립</h3>
              <p className="text-neutral-500 leading-relaxed">
                소장하고 있던 책을 북묵에게 판매하세요.<br />
                매입이 확정되면 판매한 권수만큼<br />
                '북묵 패스(환승권)'가 자동으로 지갑에 쌓입니다.
              </p>
            </div>

            {/* 카드 2: 사용 (색상 변경) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 relative overflow-hidden">
              <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                <Ticket size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">매입가 + 20% 구매</h3>
              <p className="text-neutral-500 leading-relaxed">
                도서 구매 시 자동으로 패스권 사용!<br />
                <strong className="text-black">모든 도서를 매입가 + 20%</strong> 가격으로<br />
                구매할 수 있습니다. 
              </p>
            </div>
          </div>

          {/* 가격 비교 예시 (다크 모드 유지 + 포인트 컬러 Green 변경) */}
          <div className="mt-8 bg-[#1a1c1a] text-white p-8 rounded-3xl shadow-xl">
            <div className="text-sm text-white/60 mb-6 font-medium">가격 비교 예시</div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center opacity-50">
                <span>일반 회원 구매가</span>
                <span className="text-lg font-medium line-through">15,000원</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center">
                {/* 아이콘 및 텍스트 색상 변경: Blue -> Emerald */}
                <span className="flex items-center gap-2 font-bold text-emerald-400">
                  <Ticket size={18} /> 패스권 구매가
                </span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-white">12,000원</span>
                  <p className="text-xs text-emerald-100/50 mt-1 font-normal">
                    (매입가 10,000원 + 패스비 2,000원)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 이용 방법 섹션 */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-2xl font-bold mb-10">이렇게 이용하세요</h2>
        
        <div className="space-y-12">
          <div className="flex gap-6">
            <div className="flex-none text-4xl font-black text-stone-200">01</div>
            <div>
              <h3 className="text-lg font-bold mb-2">안 보는 책 매입 신청하기</h3>
              <p className="text-neutral-500">
                바코드 스캔 한 번이면 매입가를 바로 확인할 수 있어요.<br />
                택배 수거 신청까지 한 번에 끝내세요.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex-none text-4xl font-black text-stone-200">02</div>
            <div>
              <h3 className="text-lg font-bold mb-2">검수 후 패스 지급</h3>
              <p className="text-neutral-500">
                책이 북묵에 도착하면 꼼꼼히 검수합니다.<br />
                검수가 완료되면 정산금과 함께 패스가 지급됩니다.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-none text-4xl font-black text-stone-200">03</div>
            <div>
              <h3 className="text-lg font-bold mb-2">새로운 책으로 환승</h3>
              <p className="text-neutral-500">
                이제 사고 싶었던 책을 골라보세요.<br />
                결제할 때 패스를 사용하면 마법 같은 할인이 적용됩니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-stone-100 text-center">
          {/* 하단 링크 호버 색상 변경 */}
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-neutral-900 hover:text-emerald-600 transition-colors">
            북묵 둘러보기 <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}