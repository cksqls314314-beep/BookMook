// lib/getRecentBooks.ts
import { fetchSheetRows } from "./sheets";
import { normalizeCoverUrl } from "./imageUrl";

export type Book = {
  isbn: string;
  title: string;
  author: string;
  coverUrl: string;
  priceSell: number;
  priceList: number;
  passPrice?: number;
  // ✅ 추가된 필드
  recommendation?: string; // 추천사
  sellerName?: string;     // 판매자 별명
};

const pick = (row: Record<string, string>, keys: string[]) => {
  for (const k of keys) {
    const v = row[k] ?? row[k.replace(/\s+/g, "")];
    if (v != null && String(v).trim() !== "") return String(v);
  }
  return "";
};

const toNumber = (v: string) => Number(String(v).replace(/[^\d.-]/g, "")) || 0;

export const formatKRW = (n: number) =>
  n > 0 ? n.toLocaleString("ko-KR") + "원" : "";

export async function getRecentBooksFromSheet(limit = 100): Promise<Book[]> {
  const csv = process.env.NEXT_PUBLIC_INVENTORY_CSV_URL;
  if (!csv) return [];

  const rows = await fetchSheetRows(csv);

  // limit은 넉넉하게 가져온 뒤 나중에 자릅니다.
  return rows.map((r) => {
    const title = (pick(r, ["제목", "title"]) || "(제목 없음)").trim();
    const rawAuthor = pick(r, ["저자", "지은이", "author", "authors"]).trim();
    const author = rawAuthor.replace(/^(저자|지은이)\s*[:：]\s*/i, "").trim();
    const cover = pick(r, ["표지URL", "표지", "cover", "image"]).trim();
    const isbn = pick(r, ["ISBN", "isbn", "isbn13"]).trim();

    const priceSell = toNumber(pick(r, ["판매가", "priceSell", "sell"]));
    const priceList = toNumber(pick(r, ["정가", "listprice", "price"]));
    const buyPrice = toNumber(pick(r, ["매입가", "buyPrice", "buy"]));

    // ✅ 추가 데이터 파싱
    const recommendation = pick(r, ["추천사", "recommendation", "comment", "한줄평"]);
    const sellerName = pick(r, ["판매자", "seller", "nickname", "sellerName"]);

    const passPrice = buyPrice > 0 ? Math.round((buyPrice * 1.2) / 10) * 10 : undefined;

    return {
      isbn,
      title,
      author,
      coverUrl: normalizeCoverUrl(cover),
      priceSell,
      priceList,
      passPrice,
      recommendation, // 추가됨
      sellerName,     // 추가됨
    };
  }).slice(0, limit);
}