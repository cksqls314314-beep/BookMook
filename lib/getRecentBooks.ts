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
 * - 표지: imageUrl 정규화 + 플레이스홀더 처리
 * - 가격: H(판매가), F(정가)
 * * - 최상단 행부터 slice
 */
export async function getRecentBooksFromSheet(limit = 12): Promise<Book[]> {
  const csv = process.env.NEXT_PUBLIC_INVENTORY_CSV_URL;
  if (!csv) return []; // CSV URL이 없으면 빈 배열 반환 (에러 방지)

  const rows = await fetchSheetRows(csv);

  return rows.slice(0, limit).map((r) => {
    const title = (pick(r, ["제목", "title"]) || "(제목 없음)").trim();

    const rawAuthor = pick(r, ["저자", "지은이", "author", "authors"]).trim();
    const author = rawAuthor.replace(/^(저자|지은이)\s*[:：]\s*/i, "").trim();

    const cover = pick(r, ["표지URL", "표지", "cover", "image"]).trim();
    const isbn = pick(r, ["ISBN", "isbn", "isbn13"]).trim();

    const priceSell = toNumber(pick(r, ["판매가", "priceSell", "sell"]));
    const priceList = toNumber(pick(r, ["정가", "listprice", "price"]));

    return {
      isbn,
      title,
      author,
      // 🛠️ 수정됨: 인자를 1개(cover)만 넘기도록 변경
      coverUrl: normalizeCoverUrl(cover), 
      priceSell,
      priceList,
    };
  });
}