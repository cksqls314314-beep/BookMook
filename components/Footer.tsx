export default function Footer() {
  return (
    <footer className="container-page border-t border-line py-12 text-sm text-black/60">
      <div className="flex items-center justify-between">
        <span>© {new Date().getFullYear()} BookMook</span>
        <div className="space-x-6">
          <a className="hover:text-black" href="#">소개</a>
          <a className="hover:text-black" href="#">공지사항</a>
          <a className="hover:text-black" href="#">이용안내</a>
        </div>
      </div>
    </footer>
  )
}
