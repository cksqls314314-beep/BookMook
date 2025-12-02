// lib/getRecentBooks.ts
import { fetchSheetRows } from "./sheets";
import { normalizeCoverUrl } from "./imageUrl";

export type Book = {
  isbn: string;
  title: string;
  author: string;
  coverUrl: string;
  priceSell: number; // 최종 판매가 (할인 적용됨)
  priceList: number; // 정가
  passPrice?: number; 
  recommendation?: string;
  sellerName?: string;
  
  // ✅ 추가: 재고 할인율 (0, 0.1, 0.2)
  staleRate?: number; 
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

// 날짜 차이(개월 수) 계산 함수
function getMonthsDiff(dateStr: string): number {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  const now = new Date();
  return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
}

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

    // 가격 정보 가져오기
    const listPrice = toNumber(pick(r, ["정가", "listprice", "price"]));
    let baseSellPrice = toNumber(pick(r, ["판매가", "priceSell", "sell"])); // 원래 판매가
    const buyPrice = toNumber(pick(r, ["매입가", "buyPrice", "buy"]));

    const recommendation = pick(r, ["추천사", "recommendation", "Q"]);
    const sellerName = pick(r, ["판매자", "seller", "R"]);
    
    // ✅ [추가] 매입일 확인 및 악성 재고 할인 적용
    const inventoryDate = pick(r, ["매입일", "입고일", "date", "T"]); 
    const monthsOld = getMonthsDiff(inventoryDate);
    
    let staleRate = 0;
    if (monthsOld >= 12) staleRate = 0.2;      // 1년 이상: 20% 추가 할인
    else if (monthsOld >= 6) staleRate = 0.1;  // 6개월 이상: 10% 추가 할인

    // 판매가 재계산 (10원 단위 반올림)
    const finalSellPrice = baseSellPrice > 0 
      ? Math.round(baseSellPrice * (1 - staleRate) / 10) * 10
      : 0;

    // 패스 가격 계산 (매입가 기반은 변동 없음)
    const passPrice = buyPrice > 0 ? Math.round((buyPrice * 1.2) / 10) * 10 : undefined;

    return {
      isbn,
      title,
      author,
      coverUrl: normalizeCoverUrl(cover),
      priceSell: finalSellPrice, // 할인된 가격 적용
      priceList: listPrice,
      passPrice,
      recommendation,
      sellerName,
      staleRate, // 할인율 정보 포함
    };
  }).slice(0, limit);
}