import Image from 'next/image'
export default function Hero() {
  return (
    <section className="mb-10">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">BookMook에 오신 것을 환영합니다.</h1>
      <p className="mt-1 text-black/60">쉽고 빠른 중고책 판매와 정보 안내</p>
      <div className="mt-6 card overflow-hidden">
        <div className="relative aspect-[16/9] w-full bg-mute">
          <Image src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop" alt="hero" fill className="object-cover" />
        </div>
      </div>
    </section>
  )
}
