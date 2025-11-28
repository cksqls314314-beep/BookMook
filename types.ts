export type Book = {
  isbn: string
  title: string
  author: string
  grade: string
  pubDate: string
  listPrice: number
  buyPrice: number
  price: number
  stock: number
  note?: string
  coverUrl: string
}

export type CartItem = {
  isbn: string
  title: string
  price: number
  coverUrl: string
  qty: number
}
