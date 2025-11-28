// lib/getRecentBooks.ts
import { fetchSheetRows } from "./sheets";
import { normalizeCoverUrl } from "./imageUrl";

export type Book = {
  isbn: string;
  title: string;
  author: string;
  coverUrl: string;
  priceSell: number; // 일반 판매가
  priceList: number; // 정가
  passPrice?: number; // ✅ 추가: 북묵 패스 회원가
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

export async function getRecentBooksFromSheet(limit = 12): Promise<Book[]> {
  const csv = process.env.NEXT_PUBLIC_INVENTORY_CSV_URL;
  if (!csv) return [];

  const rows = await fetchSheetRows(csv);

  return rows.slice(0, limit).map((r) => {
    const title = (pick(r, ["제목", "title"]) || "(제목 없음)").trim();
    const rawAuthor = pick(r, ["저자", "지은이", "author", "authors"]).trim();
    const author = rawAuthor.replace(/^(저자|지은이)\s*[:：]\s*/i, "").trim();
    const cover = pick(r, ["표지URL", "표지", "cover", "image"]).trim();
    const isbn = pick(r, ["ISBN", "isbn", "isbn13"]).trim();

    const priceSell = toNumber(pick(r, ["판매가", "priceSell", "sell"]));
    const priceList = toNumber(pick(r, ["정가", "listprice", "price"]));
    // ✅ 매입가(G열) 가져오기
    const buyPrice = toNumber(pick(r, ["매입가", "buyPrice", "buy"]));

    // ✅ 패스 가격 계산: 매입가가 있으면 (매입가 * 1.2), 없으면 판매가와 동일
    // (10원 단위 반올림 처리)
    const passPrice = buyPrice > 0 ? Math.round((buyPrice * 1.2) / 10) * 10 : undefined;

    return {
      isbn,
      title,
      author,
      coverUrl: normalizeCoverUrl(cover),
      priceSell,
      priceList,
      passPrice, // 추가됨
    };
  });
}