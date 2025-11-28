// lib/cart.ts

export type CartLine = {
  isbn: string;
  title: string;
  author?: string;
  coverUrl?: string;
  grade?: "A" | "B" | "C";
  price: number;
  qty: number;
};

const KEY = "hgcc_cart_v1";

const isBrowser = () => typeof window !== "undefined";

function read(): CartLine[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as CartLine[];
  } catch {
    return [];
  }
}

function write(lines: CartLine[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(lines));
  // 변경 이벤트 발생 → 헤더 카운터 등 갱신
  try {
    window.dispatchEvent(new CustomEvent("cart:changed"));
  } catch {
    /* ignore */
  }
}

function sameKey(a: CartLine, b: CartLine) {
  return a.isbn === b.isbn && (a.grade ?? "") === (b.grade ?? "");
}

export function getCart(): CartLine[] {
  return read();
}

export function clearCart() {
  write([]);
}

export function addToCart(line: CartLine) {
  const list = read();
  const idx = list.findIndex(l => sameKey(l, line));
  if (idx >= 0) {
    list[idx].qty += line.qty || 1;
  } else {
    list.push({ ...line, qty: line.qty || 1 });
  }
  write(list);
}

export function updateQty(isbn: string, grade: "A" | "B" | "C" | undefined, qty: number) {
  const list = read();
  const idx = list.findIndex(l => l.isbn === isbn && (l.grade ?? "") === (grade ?? ""));
  if (idx >= 0) {
    list[idx].qty = Math.max(1, Math.floor(qty || 1));
    write(list);
  }
}

export function removeFromCart(isbn: string, grade?: "A" | "B" | "C") {
  const list = read().filter(l => !(l.isbn === isbn && (l.grade ?? "") === (grade ?? "")));
  write(list);
}

export function getSubtotal(items?: CartLine[]): number {
  const src = items ?? read();
  return src.reduce((sum, l) => sum + (Number(l.price) || 0) * (Number(l.qty) || 0), 0);
}

export function getCount(items?: CartLine[]): number {
  const src = items ?? read();
  return src.reduce((n, l) => n + (Number(l.qty) || 0), 0);
}
