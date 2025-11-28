import Image from 'next/image'
import Link from 'next/link'
import { Book } from '@/types'

export default function ProductCard({ book }: { book: Book }) {
  return (
    <Link href={`/book/${book.isbn}`} className="card p-4 hover:shadow">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-mute">
        {book.coverUrl && (
          <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
        )}
      </div>
      <div className="mt-3 text-sm text-black/60">{book.author}</div>
      <div className="mt-1 font-medium leading-tight">{book.title}</div>
      <div className="mt-2 text-sm">{Number(book.price).toLocaleString()}원</div>
    </Link>
  )
}
