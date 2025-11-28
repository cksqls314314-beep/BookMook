'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Book, CartItem } from '@/types'

interface Ctx {
  items: CartItem[]
  count: number
  add: (book: Book, qty?: number) => void
  remove: (isbn: string) => void
  setQty: (isbn: string, qty: number) => void
  clear: () => void
}

const CartCtx = createContext<Ctx | null>(null)
const LS_KEY = 'bookmook.cart.v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items))
  }, [items])

  const add = (book: Book, qty = 1) => {
    setItems(prev => {
      const i = prev.findIndex(x => x.isbn === book.isbn)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], qty: Math.min(99, next[i].qty + qty) }
        return next
      }
      return [...prev, { isbn: book.isbn, title: book.title, price: Number(book.price), coverUrl: book.coverUrl, qty }]
    })
  }

  const remove = (isbn: string) => setItems(prev => prev.filter(x => x.isbn !== isbn))
  const setQty = (isbn: string, qty: number) => setItems(prev => prev.map(x => x.isbn === isbn ? { ...x, qty } : x))
  const clear = () => setItems([])
  const count = useMemo(() => items.reduce((s, x) => s + x.qty, 0), [items])

  return (
    <CartCtx.Provider value={{ items, count, add, remove, setQty, clear }}>{children}</CartCtx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
