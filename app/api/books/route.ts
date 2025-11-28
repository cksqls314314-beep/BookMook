// app/api/books/route.ts
import { NextResponse } from 'next/server';

type Book = {
  isbn: string;
  title: string;
  author?: string;
  grade?: string;       // D열
  pubDate?: string;     // E열
  listPrice?: number;   // F열
  buyPrice?: number;    // G열
  price?: number;       // H열
  stock?: number;       // I열
  note?: string;        // J열
  coverUrl?: string;    // K열
  tableOfContents?: string; // L열 (옵션)
  intro?: string;           // M열 (옵션)
  summary?: string;         // N열 (옵션)
};

const csvUrl = process.env.NEXT_PUBLIC_SHEETS_CSV_URL;

const toNum = (v: any): number | undefined => {
  if (v === null || v === undefined) return undefined;
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  const s = String(v).replace(/[, \u00A0]/g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

const normIsbn = (s: any) => String(s ?? '').replace(/[^0-9Xx]/g, '').toUpperCase();

// coverUrl 안전 처리(절대 URL만 허용)
const sanitizeCover = (src?: string) => {
  if (!src) return undefined;
  const s = String(src).trim();
  if (/^https?:\/\//i.test(s)) return s;      // http/https
  if (/^\/\//.test(s)) return 'https:' + s;    // //host → https: 붙이기
  if (/^\//.test(s)) return s;                 // public 자원
  // "표지URL" 같은 헤더 문자열/상대경로/공백 등은 버린다
  return undefined;
};

// ====== CSV ======
async function fetchCSV(): Promise<Book[]> {
  if (!csvUrl) return [];
  const res = await fetch(csvUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error('CSV fetch failed');
  const text = await res.text();
  const lines = text.split(/\r?\n/).filter(l => l.length > 0);

  // 간단 CSV 파서(따옴표 이스케이프 처리)
  const parseLine = (line: string) => {
    const out: string[] = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        out.push(cur); cur = '';
      } else cur += ch;
    }
    out.push(cur);
    return out;
  };

  let rows = lines.map(parseLine);
  // 첫 줄이 'ISBN'이면 헤더로 간주하고 버림
  if (rows.length && String(rows[0][0]).trim().toUpperCase() === 'ISBN') {
    rows = rows.slice(1);
  }

  return rows.map(cols => rowToBook(cols));
}

// ====== Google Sheets ======
async function fetchSheets(): Promise<Book[]> {
  const key = process.env.GOOGLE_SHEETS_API_KEY!;
  const id = process.env.GOOGLE_SHEET_ID!;
  const range = process.env.SHEETS_RANGE || '도서목록!A2:Z'; // ← 헤더 없이 A2부터!
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(range)}?key=${key}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Sheets fetch failed');
  const json = await res.json();
  const values: any[][] = json.values || [];
  return values.map(cols => rowToBook(cols));
}

// ====== 공통: 열 위치 고정 매핑 ======
function rowToBook(cols: any[]): Book {
  // 인덱스: 0기준 (A:0, B:1, ..., K:10, L:11, M:12, N:13)
  const isbn = String(cols[0] ?? '').trim();
  const title = String(cols[1] ?? '').trim();
  const author = String(cols[2] ?? '').trim();
  const grade = String(cols[3] ?? '').trim();
  const pubDate = String(cols[4] ?? '').trim();
  const listPrice = toNum(cols[5]);
  const buyPrice = toNum(cols[6]);
  const price = toNum(cols[7]);
  const stock = toNum(cols[8]);
  const note = String(cols[9] ?? '').trim();
  const coverUrl = sanitizeCover(String(cols[10] ?? '').trim());

  // 옵션(L/M/N)이 비어 있거나 범위를 벗어나면 자동 undefined
  const tableOfContents = cols.length > 11 ? String(cols[11] ?? '').trim() : undefined;
  const intro = cols.length > 12 ? String(cols[12] ?? '').trim() : undefined;
  const summary = cols.length > 13 ? String(cols[13] ?? '').trim() : undefined;

  return {
    isbn, title, author, grade, pubDate,
    listPrice, buyPrice, price, stock, note, coverUrl,
    tableOfContents: tableOfContents || undefined,
    intro: intro || undefined,
    summary: summary || undefined,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const qIsbn = searchParams.get('isbn');

  try {
    let books: Book[] = [];
    if (csvUrl) books = await fetchCSV();
    else if (process.env.GOOGLE_SHEETS_API_KEY && process.env.GOOGLE_SHEET_ID) books = await fetchSheets();
    else return NextResponse.json({ error: 'No data source configured.' }, { status: 400 });

    // 빈 행/헤더 잔재 제거
    books = books.filter(b => b.isbn || b.title);

    if (qIsbn) {
      const found = books.find(b => normIsbn(b.isbn) === normIsbn(qIsbn)) || null;
      return NextResponse.json(found);
    }
    return NextResponse.json(books);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
