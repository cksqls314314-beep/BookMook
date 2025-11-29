// next.config.mjs
/**
 * HGCC / BookMook – Next.js config
 * - CSP 헤더 유지
 * - next/image 외부 도메인 허용 (Unsplash/Drive/Naver 등)
 * - ✅ 랜딩에서 쓰는 주소(/featured/*, /deals/*, /categories/*)를
 * 새 상세 경로(/chapters/*)로 리다이렉트
 */
const isDev = process.env.NODE_ENV !== 'production'

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://js.tosspayments.com https://*.tosspayments.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https://api.tosspayments.com https://*.tosspayments.com",
  "frame-src https://js.tosspayments.com https://*.tosspayments.com",
  "frame-ancestors 'self'",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      
      // ✅ 네이버 관련 도메인 (쇼핑, 책 썸네일, 검색 결과) 모두 추가
      { protocol: 'https', hostname: 'shopping-phinf.pstatic.net' },
      { protocol: 'https', hostname: 'bookthumb-phinf.pstatic.net' }, // 책 전용 썸네일
      { protocol: 'https', hostname: 'search.pstatic.net' },          // 통합 검색 이미지

      // ✅ 구글 북스 및 기타
      { protocol: 'https', hostname: 'books.google.com' },
      { protocol: 'https', hostname: 'nl.go.kr' }, 
      { protocol: 'https', hostname: 'dummyimage.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
    ]
  },
  /** 🔁 경로 정리: 랜딩에서 쓰던 링크를 /chapters/* 로 정규화 */
  async redirects() {
    return [
      // 1) Featured → Chapters
      { source: '/featured/editors', destination: '/chapters/editors-pick', permanent: false },
      { source: '/featured/new', destination: '/chapters/featured-new', permanent: false },

      // 2) Deals → Chapters
      { source: '/deals/today', destination: '/chapters/deal', permanent: false },

      // 3) Categories → Chapters (문학/에세이/철학/아트/정원 등)
      { source: '/categories/:slug', destination: '/chapters/:slug', permanent: false },
    ]
  },
}

export default nextConfig;