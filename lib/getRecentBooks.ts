// lib/getRecentBooks.ts
import { fetchSheetRows } from "./sheets";
import { normalizeCoverUrl } from "./imageUrl";

export type Book = {
  isbn: string;
  title: string;
  author: string;
  coverUrl: string;
  priceSell: number; // H열(판매가)
  priceList: number; // F열(정가)
  passPrice?: number; // 패스 회원가
  
  // ✅ 추가된 필드
  recommendation?: string; // Q열 (추천사)
  sellerName?: string;     // R열 (판매자)
};

const pick = (row: Record<string, string>, keys: string[]) => {
  for (const k of keys) {
    // 공백 유무 모두 대응
    const v = row[k] ?? row[k.replace(/\s+/g, "")];
    if (v != null && String(v).trim() !== "") return String(v);
  }
  return "";
};

const toNumber = (v: string) => Number(String(v).replace(/[^\d.-]/g, "")) || 0;

export const formatKRW = (n: number) =>
  n > 0 ? n.toLocaleString("ko-KR") + "원" : "";

/**
 * 구글시트 CSV에서 최신 N권을 가져온다.
 */
export async function getRecentBooksFromSheet(limit = 100): Promise<Book[]> {
  const csv = process.env.NEXT_PUBLIC_INVENTORY_CSV_URL;
  if (!csv) return []; 

  const rows = await fetchSheetRows(csv);

  return rows.map((r) => {
    const title = (pick(r, ["제목", "title"]) || "(제목 없음)").trim();

    const rawAuthor = pick(r, ["저자", "지은이", "author", "authors"]).trim();
    const author = rawAuthor.replace(/^(저자|지은이)\s*[:：]\s*/i, "").trim();

    const cover = pick(r, ["표지URL", "표지", "cover", "image"]).trim();
    const isbn = pick(r, ["ISBN", "isbn", "isbn13"]).trim();

    const priceSell = toNumber(pick(r, ["판매가", "priceSell", "sell"]));
    const priceList = toNumber(pick(r, ["정가", "listprice", "price"]));
    const buyPrice = toNumber(pick(r, ["매입가", "buyPrice", "buy"]));

    // ✅ Q열(추천사), R열(판매자) 가져오기
    const recommendation = pick(r, ["추천사", "recommendation", "Q"]);
    const sellerName = pick(r, ["판매자", "seller", "R"]);

    // 패스 가격 계산
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