// lib/sheets.ts
// CSV/TSV 안전 파서(따옴표·줄바꿈 포함) + 기존 함수 시그니처 유지
export type SheetRow = Record<string, string>;

/** 헤더 정규화: 공백/BOM/괄호 제거 */
function normalizeHeader(h: string): string {
  return (h || '')
    .replace(/\uFEFF/g, '')   // BOM
    .replace(/\s+/g, '')      // 모든 공백 제거
    .replace(/[()]/g, '')     // 괄호 제거
    .trim();
}

/** 첫 줄/URL을 보고 구분자 감지 (기본 CSV, 탭 존재/tsv 쿼리면 TSV) */
function detectDelimiter(url: string, firstLine: string): ',' | '\t' {
  const urlLooksTSV = /(?:[?&](?:format|tqx)=tsv)/i.test(url);
  if (urlLooksTSV) return '\t';
  if (firstLine.includes('\t')) return '\t';
  return ',';
}

/**
 * RFC4180 스타일의 안전한 delimited 파서
 * - delimiter: ',' | '\t'
 * - 따옴표로 감싼 필드 안의 구분자/줄바꿈 허용
 * - 이스케이프된 따옴표("") 처리
 */
function parseDelimited(text: string, delimiter: ',' | '\t'): string[][] {
  const rows: string[][] = [];
  let cur = '';
  let inQuotes = false;
  let row: string[] = [];

  const pushCell = () => {
    row.push(cur);
    cur = '';
  };
  const pushRow = () => {
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        // "" -> "
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === delimiter) {
      pushCell();
      continue;
    }

    // 줄바꿈 처리 (\r\n | \n | \r)
    if (ch === '\n' || ch === '\r') {
      // \r\n 묶음 처리
      if (ch === '\r' && text[i + 1] === '\n') i++;
      pushCell();
      pushRow();
      continue;
    }

    cur += ch;
  }

  // 마지막 셀/행 푸시
  pushCell();
  pushRow();

  // trailing 빈 행 제거
  while (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === '') {
    rows.pop();
  }

  return rows;
}

/** 2차원 배열 -> 헤더/로우 매핑 */
function toObjects(table: string[][]): SheetRow[] {
  if (!table.length) return [];
  const rawHeader = table[0].map((h) => h.replace(/\uFEFF/g, ''));
  const header = rawHeader.map(normalizeHeader);

  const out: SheetRow[] = [];
  for (let r = 1; r < table.length; r++) {
    const cols = table[r];
    if (!cols || cols.every((c) => (c ?? '').trim() === '')) continue;

    const row: SheetRow = {};
    header.forEach((h, idx) => {
      row[h] = String(cols[idx] ?? '').trim();
    });
    out.push(row);
  }
  return out;
}

/** URL/텍스트를 받아 CSV/TSV 파싱하여 객체 배열로 반환 */
export async function fetchSheetRows(csvUrl: string, init?: RequestInit): Promise<SheetRow[]> {
  if (!csvUrl) return [];
  const res = await fetch(csvUrl, { cache: 'no-store', ...(init || {}) });
  if (!res.ok) throw new Error('Failed to fetch sheet CSV: ' + res.status);

  const text = await res.text();
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const delimiter = detectDelimiter(csvUrl, firstLine);

  const table = parseDelimited(text, delimiter);
  return toObjects(table);
}

/* =========================
 * 호환용: 기존 함수 이름 유지
 * (다른 파일에서 import { parseCsvLine, parseCsv } 등을 쓸 수 있으므로)
 * ========================= */

/** (호환) 한 줄 파싱 – 내부적으로 delimiter 자동 감지해서 한 줄만 파싱 */
export function parseCsvLine(line: string): string[] {
  const d = line.includes('\t') ? '\t' : ',';
  return parseDelimited(line + '\n', d)[0]?.map((s) => s.trim()) ?? [];
}

/** (호환) 전체 텍스트 파싱 – delimiter 자동 감지 */
export function parseCsv(text: string): SheetRow[] {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const delimiter = detectDelimiter('', firstLine);
  const table = parseDelimited(text, delimiter);
  return toObjects(table);
}
