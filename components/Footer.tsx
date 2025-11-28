// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="container-page border-t border-line py-12 text-sm text-black/60">
      <div className="flex items-center justify-between">
        <span>© {new Date().getFullYear()} BookMook</span>
        <div className="space-x-6">
          <Link className="hover:text-black transition-colors" href="/guide">소개</Link>
          <Link className="hover:text-black transition-colors" href="/news">공지사항</Link>
          {/* 👇 여기 수정됨 */}
          <Link className="hover:text-black transition-colors font-medium" href="/guide">이용안내</Link>
        </div>
      </div>
    </footer>
  )
}