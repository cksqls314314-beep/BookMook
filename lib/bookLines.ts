// lib/bookLines.ts
import { fetchSheetRows } from './sheets'
// import { searchBooks } ... <- 이제 API 검색을 안 하므로 이 줄은 필요 없습니다!

/**
 * 화면에 보여줄 문장과 ISBN 정보
 */
export interface BookLine {
  text: string
  isbn?: string
}

/**
 * 텍스트 정리 (HTML 태그 제거 및 공백 정리)
 */
function cleanText(raw: string): string {
  if (!raw) return ''
  // HTML 태그 제거
  const withoutTags = raw.replace(/<[^>]*>/g, '')
  // 연속된 공백을 하나로 줄임
  return withoutTags.replace(/\s+/g, ' ').trim()
}

/**
 * 구글 시트에서 '첫문장'이 있는 책만 가져오기
 * - 외부 API 검색 기능 제거 (오작동/영어 문장 방지)
 * - 오직 시트의 P열(첫문장) 데이터만 신뢰함
 */
export async function getBookLines(limit = 24): Promise<BookLine[]> {
  const csv = process.env.NEXT_PUBLIC_INVENTORY_CSV_URL
  if (!csv) return []
  
  const rows = await fetchSheetRows(csv)
  const lines: BookLine[] = []

  for (const row of rows) {
    // 이미 충분한 개수를 모았으면 중단
    if (lines.length >= limit) break

    // 1. ISBN 정리 (숫자만 남김)
    const rawIsbn = (row['ISBN'] || row['isbn'] || row['isbn13'] || '').trim()
    const isbn = rawIsbn.replace(/[^0-9Xx]/g, '')

    // 2. '첫문장' 컬럼 확인 (한글 칼럼명 우선)
    // 시트의 헤더가 '첫문장' 혹은 'firstSentence' 등이어야 함
    const quoteRaw = row['첫문장'] || row['문구'] || row['명언'] || row['한줄평'] || '';
    
    // 3. 문장이 없으면 과감히 건너뜀 (API 검색 로직 삭제됨)
    if (!quoteRaw || !quoteRaw.trim()) {
      continue; 
    }

    // 4. 문장 다듬기 및 추가
    // 엔터(줄바꿈)가 있을 수 있으므로 줄별로 처리
    const parts = quoteRaw.split(/\r?\n/)
    
    for (const partRaw of parts) {
      if (lines.length >= limit) break
      
      const part = cleanText(partRaw)
      // 너무 짧거나(2글자 미만) 비어있으면 무시
      if (!part || part.length < 2) continue
      
      lines.push({ 
        text: part, 
        isbn: isbn || undefined 
      })
    }
  }
  
  return lines
}