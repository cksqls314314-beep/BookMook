// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from '@/components/cart/CartProvider';

export const metadata: Metadata = {
  title: "BookMook - 이웃의 서재",
  description: "헌책방의 새로운 경험, 북묵",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* ✅ [복구] 원래 스타일: 기본 배경, 기본 폰트 */}
      <body className="bg-white text-black antialiased">
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}