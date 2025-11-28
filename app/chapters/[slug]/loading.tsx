// app/chapters/[slug]/loading.tsx
export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-6 md:px-8">
      <div className="py-10">
        <div className="h-7 w-48 rounded bg-black/5" />
        <div className="mt-3 h-4 w-80 rounded bg-black/5" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pb-16">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-black/5 bg-[#f5f5f7] p-5">
            <div className="aspect-[16/10] w-full rounded-2xl bg-white" />
            <div className="mt-4 h-5 w-3/4 rounded bg-black/10" />
            <div className="mt-2 h-4 w-1/2 rounded bg-black/10" />
          </div>
        ))}
      </div>
    </main>
  )
}
