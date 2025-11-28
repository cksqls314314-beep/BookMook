// lib/search.ts
import { fetchSheetRows } from "./sheets";
import { normalizeCoverUrl } from "./imageUrl";

export type Book = {
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  pubdate?: string; // yyyy-MM-dd or similar
  price?: number;
  image?: string;
  description?: string;
};

// ─────────────────────────────────────────────
// (1) 네이버 / 구글북스용 타입 & 함수 (지금은 사용 안 해도 보존)
// ─────────────────────────────────────────────

const NAVER_ID = process.env.NAVER_CLIENT_ID || "";
const NAVER_SECRET = process.env.NAVER_CLIENT_SECRET || "";

function mapNaverItem(it: any): Book {
  // Naver image is 170x, replace for bigger if needed (keep host)
  const image =
    typeof it.image === "string"
      ? it.image.replace("type=m1", "type=w800")
      : it.image;
  const isbn = String(it.isbn || "").split(" ").pop() || ""; // sometimes "10 13"
  const price = Number(it.price || it.discount || 0) || undefined;
  return {
    isbn,
    title: (it.title || "").replace(/<[^>]+>/g, ""),
    author: (it.author || "").replace(/<[^>]+>/g, ""),
    publisher: it.publisher,
    pubdate: it.pubdate,
    price,
    image,
    description: (it.description || "").replace(/<[^>]+>/g, ""),
  };
}

/**
 * 외부(네이버/구글북스) 검색 – 지금은 쓰지 않고 보존용.
 */
export async function searchBooks(q: string, limit = 24): Promise<Book[]> {
  q = (q || "").trim();
  if (!q) return [];

  // 1) 네이버 키가 있으면 네이버 사용
  if (NAVER_ID && NAVER_SECRET) {
    const url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(
      q
    )}&display=${Math.min(limit, 50)}`;
    const r = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": NAVER_ID,
        "X-Naver-Client-Secret": NAVER_SECRET,
      },
      cache: "no-store",
    });
    if (!r.ok) return [];
    const j = await r.json();
    const items = Array.isArray(j.items) ? j.items : [];
    return items.map(mapNaverItem);
  }

  // 2) 네이버 키가 없으면 구글북스를 fallback (현재는 인벤토리 전용 검색을 쓰므로 거의 안 씀)
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      q
    )}&maxResults=${Math.min(limit, 40)}`;
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return [];
    const j = await r.json();
    const items = Array.isArray(j.items) ? j.items : [];
    return items.map((it: any) => {
      const info = it.volumeInfo || {};
      const sale = it.saleInfo || {};
      const authors: string[] = Array.isArray(info.authors) ? info.authors : [];
      const pub = info.publisher || "";
      const pubdate = info.publishedDate || "";

      // 가격
      let price: number | undefined;
      if (sale.listPrice && typeof sale.listPrice.amount === "number") {
        price = sale.listPrice.amount;
      } else if (sale.retailPrice && typeof sale.retailPrice.amount === "number") {
        price = sale.retailPrice.amount;
      }

      // 이미지
      let image: string | undefined;
      const img = info.imageLinks || {};
      image =
        img.medium ||
        img.large ||
        img.small ||
        img.thumbnail ||
        img.smallThumbnail;
      if (image && image.startsWith("http://")) {
        image = image.replace(/^http:\/\//, "https://");
      }

      // ISBN
      let isbn = "";
      const ids: any[] = Array.isArray(info.industryIdentifiers)
        ? info.industryIdentifiers
        : [];
      for (const ident of ids) {
        const type = ident?.type || "";
        const identifier = String(ident?.identifier || "");
        if (!isbn) {
          if (type === "ISBN_13") isbn = identifier;
          else if (type === "ISBN_10") isbn = identifier;
        }
      }

      return {
        isbn,
        title: info.title || "",
        author: authors.join(", "),
        publisher: pub,
        pubdate,
        price,
        image,
        description: info.description || "",
      } as Book;
    });
  } catch {
    return [];
  }
}

/**
 * 외부 API로 ISBN 단건 조회 (현재는 사용 안 하지만 보존).
 */
export async function getBookByIsbn(isbn: string): Promise<Book | null> {
  const key = (isbn || "").replace(/[^0-9Xx]/g, "");
  if (!key) return null;
  if (NAVER_ID && NAVER_SECRET) {
    const url = `https://openapi.naver.com/v1/search/book_adv.json?d_isbn=${encodeURIComponent(
      key
    )}`;
    const r = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": NAVER_ID,
        "X-Naver-Client-Secret": NAVER_SECRET,
      },
      cache: "no-store",
    });
    if (!r.ok) return null;
    const j = await r.json();
    const items = Array.isArray(j.items) ? j.items : [];
    return items.length ? mapNaverItem(items[0]) : null;
  }
  return null;
}

// ─────────────────────────────────────────────
// (2) 구글 시트 인벤토리 전용 검색
// ─────────────────────────────────────────────

const pick = (row: Record<string, string>, keys: string[]) => {
  for (const k of keys) {
    const direct = row[k];
    const noSpace = row[k.replace(/\s+/g, "")];
    const v = direct ?? noSpace;
    if (v != null && String(v).trim() !== "") return String(v);
  }
  return "";
};

const toNumber = (v: string) =>
  Number(String(v || "").replace(/[^\d.-]/g, "")) || 0;

const stripAuthorPrefix = (s: string) =>
  (s || "").replace(/^(저자|지은이)\s*[:：]\s*/i, "").trim();

/** 공백·대소문자 무시용 정규화 */
const normText = (s: string) =>
  (s || "").toLowerCase().replace(/\s+/g, "");

/** ISBN 비교용: 숫자(X 포함)만 남김 */
const normIsbn = (s: string) =>
  (s || "").replace(/[^0-9xX]/g, "");

/**
 * 구글 시트 인벤토리에서만 검색
 *
 * - 대상: `NEXT_PUBLIC_INVENTORY_CSV_URL`로 지정된 도서목록 시트
 * - 조건: 제목 / 저자 / 출판사 / ISBN 안에 검색어가 포함되면 매칭
 *   - 검색어/필드 모두 공백 제거 후 비교 → 띄어쓰기 달라도 검색 가능
 *   - ISBN은 하이픈 등 기호를 제거한 숫자 기준으로 비교
 */
export async function searchInventory(
  q: string,
  limit = 48
): Promise<Book[]> {
  const raw = (q || "").trim();
  if (!raw) return [];

  const qNorm = normText(raw);      // "트렌드코리아 2026" → "트렌드코리아2026"
  const qIsbn = normIsbn(raw);      // "978-89-..." → "97889..."
  if (!qNorm && !qIsbn) return [];

  const csv = process.env.NEXT_PUBLIC_INVENTORY_CSV_URL;
  if (!csv) return [];

  const rows = await fetchSheetRows(csv);

  // 시트 → Book 타입으로 변환
  const allBooks: Book[] = rows.map((r) => {
    const title = (pick(r, ["제목", "title"]) || "(제목 없음)").trim();

    const rawAuthor = pick(r, ["저자", "지은이", "author", "authors"]).trim();
    const author = stripAuthorPrefix(rawAuthor);

    const publisher = pick(r, ["출판사", "publisher", "pub"]);
    const pubdate = pick(r, ["출간일", "발행일", "pubDate", "published"]);

    const listPrice = toNumber(pick(r, ["정가", "listPrice", "price"]));
    const sellPrice = toNumber(pick(r, ["판매가", "priceSell", "sell"]));
    const price = sellPrice || listPrice || undefined;

    const isbnRaw = pick(r, ["ISBN", "isbn", "isbn13"]);
    const isbn = normIsbn(isbnRaw); // 내부 저장용도 숫자만

    const coverRaw = pick(r, ["표지URL", "표지", "cover", "image"]);
    const image = normalizeCoverUrl(coverRaw);

    return {
      isbn,
      title,
      author,
      publisher,
      pubdate,
      price,
      image,
    };
  });

  // 검색어와 매칭 (공백/대소문자 무시)
  const filtered = allBooks.filter((b) => {
    const normTitle = normText(b.title);
    const normAuthor = normText(b.author);
    const normPublisher = normText(b.publisher || "");
    const normBookIsbn = normIsbn(b.isbn);

    const textBundle = [normTitle, normAuthor, normPublisher].join("|");

    const matchesText = qNorm && textBundle.includes(qNorm);
    const matchesIsbn =
      qIsbn &&
      (normBookIsbn.includes(qIsbn) ||
        textBundle.includes(qIsbn)); // 혹시 텍스트에 ISBN이 섞여 있는 경우

    return matchesText || matchesIsbn;
  });

  return filtered.slice(0, limit);
}
