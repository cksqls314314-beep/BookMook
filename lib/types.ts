export type Book = {
  isbn: string;
  title: string;
  author?: string;
  publisher?: string;
  pubDate?: string;
  listPrice?: number;
  buyPrice?: number;
  price?: number;
  stock?: number;
  note?: string;
  coverUrl?: string;

  // 상세 페이지용 추가 필드
  grade?: string;              // 등급 (상/중/하/미표기 등)
  tableOfContents?: string;    // 목차(멀티라인)
  intro?: string;              // 책 소개(멀티라인)
  summary?: string;            // 책 요약(멀티라인)
};
