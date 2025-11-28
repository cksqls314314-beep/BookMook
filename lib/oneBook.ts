// lib/oneBook.ts
import { fetchSheetRows, SheetRow } from "@/lib/sheets";
import { normalizeCoverUrl } from "@/lib/imageUrl";

const CSV = process.env.NEXT_PUBLIC_INVENTORY_CSV_URL!;

export type Variant = {
  grade: "A" | "B" | "C";
  count: number;
  priceSell: number;
};

export type OneBook = {
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  pubDate?: string;
  coverUrl?: string;
  priceSell: number;
  listPrice?: number;
  passPrice?: number;
  variants: Variant[];
  toc?: string;
  intro?: string;
};

function pick(r: SheetRow, keys: string[]): string {
  for (const k of keys) {
    const v = String((r as any)[k] ?? "").trim();
    if (v) return v;
  }
  return "";
}

function toNumber(v: string): number {
  const n = Number(v.replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export async function getBookByIsbn(isbn: string): Promise<OneBook | null> {
  if (!CSV) throw new Error("Missing NEXT_PUBLIC_INVENTORY_CSV_URL");
  const rows = await fetchSheetRows(CSV);

  const same = rows.filter(
    (r) => String((r["ISBN"] ?? (r as any)["isbn"] ?? (r as any)["isbn13"]) ?? "").trim() === isbn
  );
  if (same.length === 0) return null;

  const r0 = same[0];
  const title = pick(r0, ["제목", "title"]);
  const author = pick(r0, ["저자", "지은이", "authors", "author"]);
  const publisher = pick(r0, ["출판사", "publisher"]);
  const pubDate = pick(r0, ["출간일", "pubDate"]);
  const listPrice = toNumber(pick(r0, ["정가", "listprice", "price"]));
  const buyPrice = toNumber(pick(r0, ["매입가", "buyPrice", "buy"]));
  const passPrice = buyPrice > 0 ? Math.round((buyPrice * 1.2) / 10) * 10 : undefined;
  const coverUrl = normalizeCoverUrl(pick(r0, ["표지URL", "표지", "cover", "image"]));
  const toc = pick(r0, ["목차", "L", "toc"]);
  const intro = pick(r0, ["소개", "M", "intro"]);

  const buckets: Record<string, { price: number; count: number }> = {};
  for (const r of same) {
    const grade = (pick(r, ["등급", "grade"]) || "B").toUpperCase();
    const sell = toNumber(pick(r, ["판매가", "sell", "priceSell"]));
    if (!buckets[grade]) buckets[grade] = { price: sell || listPrice || 0, count: 0 };
    buckets[grade].count += 1;
    if (sell && sell < buckets[grade].price) buckets[grade].price = sell;
  }

  const order: Array<"A"|"B"|"C"> = ["A","B","C"];
  const variants = order.map((g) => ({
    grade: g,
    count: buckets[g]?.count ?? 0,
    priceSell: buckets[g]?.price ?? 0,
  }));

  const first = variants.find((v) => v.count > 0) ?? { priceSell: listPrice || 0 };
  const priceSell = first.priceSell || listPrice || 0;

  return {
    isbn,
    title: title || "(제목 미상)",
    author,
    publisher,
    pubDate,
    coverUrl,
    priceSell,
    listPrice: listPrice || undefined,
    passPrice,
    variants,
    toc,
    intro,
  };
}
