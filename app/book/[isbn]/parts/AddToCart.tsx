'use client'
import { Book } from '@/types'
import { useCart } from '@/components/cart/CartProvider'

export default function AddToCart({ book }: { book: Book }) {
  const { add } = useCart()
  return (
    <button className="btn-primary btn" onClick={() => add(book, 1)}>장바구니 담기</button>
  )
}
