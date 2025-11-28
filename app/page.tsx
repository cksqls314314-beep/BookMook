'use client';

import { useState } from 'react';
import HeroBackground from '@/components/HeroBackground';
import ChapterRail from '@/components/ChapterRail';
import SearchBar from '@/components/SearchBar';

type HomeTab = 'sentence' | 'about';

export default function HomePage() {
  const [tab, setTab] = useState<HomeTab>('sentence');
  const statsUrl = '/api/demo-stats';

  const railA = [
    {
      slug: 'featured-new',
      title: '도착한 도서',
      subtitle: '목적한 곳에 다다름.',
      image:
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop',
      href: '/featured/new',
      statsUrl,
    },
    {
      slug: 'editors-pick',
      title: '에디터 추천',
      subtitle: '읽을 만한 것만',
      image:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2000&auto=format&fit=crop',
      href: '/featured/editors',
      statsUrl,
    },
    {
      slug: 'deal',
      title: '오늘의 특가',
      subtitle: '지금만 이 가격',
      image:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2000&auto=format&fit=crop',
      href: '/deals/today',
      statsUrl,
    },
  ];

  const railB = [
    {
      slug: 'fiction',
      title: '문학·소설',
      subtitle: '이야기에 잠기는 밤',
      image:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop',
      href: '/categories/fiction',
      statsUrl,
    },
    {
      slug: 'essay',
      title: '에세이',
      subtitle: '삶의 결을 닮은 문장',
      image:
        'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=2000&auto=format&fit=crop',
      href: '/categories/essay',
      statsUrl,
    },
    {
      slug: 'philosophy',
      title: '철학·사회',
      subtitle: '생각의 근육 단단하게',
      image:
        'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2000&auto=format&fit=crop',
      href: '/categories/philosophy',
      statsUrl,
    },
    {
      slug: 'art',
      title: '아트·사진',
      subtitle: '이미지로 읽는 세계',
      image:
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2000&auto=format&fit=crop',
      href: '/categories/art',
      statsUrl,
    },
    {
      slug: 'garden',
      title: '자연·정원',
      subtitle: '식물과 함께 머무는 법',
      image:
        'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2000&auto=format&fit=crop',
      href: '/categories/garden',
      statsUrl,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 md:px-8">
      {/* 상단 중앙 탭: 한 문장 / 소식  (돋보기는 기존 헤더 것 사용) */}
      <div className="pt-6 md:pt-8 flex justify-center">
        <nav className="flex items-center gap-6 text-sm font-medium">
          {/* 한 문장 탭 */}
          <button
            type="button"
            onClick={() => setTab('sentence')}
            className={[
              'relative pb-1 transition-colors',
              tab === 'sentence'
                ? 'text-black'
                : 'text-neutral-400 hover:text-neutral-700',
            ].join(' ')}
          >
            한 문장
            {tab === 'sentence' && (
              <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-black" />
            )}
          </button>

          {/* 소식 탭 */}
          <button
            type="button"
            onClick={() => setTab('about')}
            className={[
              'relative pb-1 transition-colors',
              tab === 'about'
                ? 'text-black'
                : 'text-neutral-400 hover:text-neutral-700',
            ].join(' ')}
          >
            소식
            {tab === 'about' && (
              <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-black" />
            )}
          </button>
        </nav>
      </div>

      {/* 랜딩 히어로 영역: 탭에 따라 교체 */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[60vh] overflow-hidden bg-white mt-4">
        {tab === 'sentence' ? <HeroBackground /> : <AboutHero />}
      </div>

      {/* 검색 섹션 */}
      <section id="search" className="relative z-10 pt-14 md:pt-24 lg:pt-28">
        <SearchBar />
      </section>

      {/* 오늘의 추천 / 장르로 보기 레일 */}
      <section className="mt-8 md:mt-12">
        <ChapterRail heading="오늘의 추천" chapters={railA as any} />
      </section>

      <section className="mt-6 md:mt-10 mb-12 md:mb-16">
        <ChapterRail heading="장르로 보기" chapters={railB as any} />
      </section>
    </main>
  );
}

/* 소개(소식) 탭 내용 */
function AboutHero() {
  return (
    <section className="bg-neutral-50 h-full">
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-6 py-12 md:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
          {/* 소개 텍스트 */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              북묵, 한 권에서 시작되는 작은 공통장
            </h1>
            <p className="mt-6 text-sm sm:text-base leading-relaxed text-neutral-700">
              북묵은 한 사람이 오래 읽고, 오래 들고 다녔던 책이 또 다른
              사람에게로 건너가는 순간을 사랑합니다. 모서리의 닳음, 밑줄과
              메모, 손에 익은 책등까지 — 한 권의 책에 쌓인 시간이 새 주인을
              찾아 도착하는 장면을 기록하고 싶습니다.
            </p>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-700">
              우리는 중고책을 단순한 물건이 아니라, 삶의 궤적이 묻은 매개체로
              바라봅니다. 북묵의 선반에 꽂힌 책들은 모두, 한 번 이상 누군가의
              손에서 충분히 사랑받은 책들입니다. 이제 그 책들이 당신의 책상,
              가방, 침대 머리맡으로 옮겨가는 일을 돕습니다.
            </p>
          </div>

          {/* 우측 이미지 블록 (나중에 실제 사진으로 교체 가능) */}
          <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden rounded-3xl bg-neutral-200">
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-neutral-700 to-neutral-400 opacity-80" />
            <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-200">
                His Garden &amp; Commons Club · BookMook
              </p>
              <p className="mt-3 text-lg font-semibold leading-snug">
                신기한 일이지 않습니까? 전혀 모르는 사람의 책이
                <br />
                어느 날 내 책장에 도착해 있는 일 말입니다.
              </p>
              <p className="mt-2 text-xs text-neutral-200">
                한 사람이 남긴 흔적을, 또 다른 사람이 이어 읽는 작은 공통장을
                상상합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
