// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { CartProvider } from '@/components/cart/CartProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'BookMook – 중고서점',
  description: '쉽고 빠른 중고책 판매와 정보 안내',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <CartProvider>
          {/* 상단 헤더 (로고 중앙 + 메뉴버튼 + 이모티콘 아이콘들) */}
          <Header />
          <main className="container-page py-8">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
