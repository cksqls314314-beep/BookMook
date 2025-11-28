import { fetchSheetRows } from './sheets'

/**
 * A line to display in the hero overlay. It contains the
 * line of text and an optional ISBN to link to. If the
 * ISBN is undefined, the line will still be displayed but
 * will not be clickable.
 */
export interface BookLine {
  text: string
  isbn?: string
}

/**
 * Normalize whitespace in a string by collapsing multiple
 * spaces and trimming leading/trailing whitespace. Also
 * remove HTML tags if present.
 */
function cleanText(raw: string): string {
  if (!raw) return ''
  // Strip HTML tags from API results
  const withoutTags = raw.replace(/<[^>]*>/g, '')
  // Collapse whitespace
  return withoutTags.replace(/\s+/g, ' ').trim()
}

/**
 * Extract the first sentence from a given description. A
 * sentence is determined by the first occurrence of a
 * period, question mark, or exclamation mark. If none
 * exist, the entire description is returned.
 */
function getFirstSentence(desc: string): string {
  const cleaned = cleanText(desc)
  const match = cleaned.match(/[.?!]/)
  if (match) {
    const index = match.index ?? cleaned.length
    return cleaned.slice(0, index + 1).trim()
  }
  return cleaned
}

/**
 * Attempt to find a single meaningful line for a book.
 * It first looks for a column in the sheet that might
 * already contain a quote or sentence. If none exists,
 * it uses the searchBooks function to fetch the book
 * description from an external API (Naver or Google Books)
 * and extracts the first sentence. As a last resort it
 * falls back to the book's title.
 */
async function deriveLine(
  title: string,
  author: string,
  isbn: string,
  row: Record<string, string>
): Promise<string> {
  // 1) Check for predefined quote columns in the sheet
  // Prioritise the '첫문장' column (First sentence) if present, followed by
  // other possible quote fields. The order here matters.
  const quoteKeys = [
    '첫문장',
    '문구',
    '명언',
    '한줄평',
    'quote',
    'firstSentence',
  ]
  for (const key of quoteKeys) {
    const direct = row[key]
    if (direct && direct.trim()) {
      return cleanText(direct)
    }
  }

  // 2) Attempt to fetch a description via external API
  try {
    const queryTerms = []
    if (isbn) queryTerms.push(`isbn:${isbn}`)
    // Combine title and author as fallback search
    if (title) queryTerms.push(`${title} ${author}`)
    // Use searchBooks to fetch a description from Naver/Google
    for (const q of queryTerms) {
      const results = await searchBooks(q, 1)
      if (results && results.length > 0) {
        const desc = results[0].description || ''
        const sentence = getFirstSentence(desc)
        if (sentence) return sentence
      }
    }
  } catch {
    // Ignore errors from external API
  }

  // 3) Fallback to the title if no description is available
  return cleanText(title)
}

/**
 * Fetch lines from the Google Sheet inventory. For each book,
 * it derives a single line using deriveLine(). The number of
 * lines returned can be limited via the limit parameter. Books
 * without a title are skipped. Results are ordered as they
 * appear in the sheet.
 */
export async function getBookLines(limit = 24): Promise<BookLine[]> {
  const csv = process.env.NEXT_PUBLIC_INVENTORY_CSV_URL
  if (!csv) return []
  const rows = await fetchSheetRows(csv)
  const lines: BookLine[] = []
    for (const row of rows) {
    if (lines.length >= limit) break
    // Normalize ISBN and select only rows with a non-empty '첫문장' or similar quote field.
    const rawIsbn = (row['ISBN'] || row['isbn'] || row['isbn13'] || '').trim()
    const isbn = rawIsbn.replace(/[^0-9Xx]/g, '')
    // Attempt to find a quote; prioritise the '첫문장' column.
    const quoteKeys = ['첫문장', '문구', '명언', '한줄평', 'quote', 'firstSentence']
    let quote: string | undefined
    for (const key of quoteKeys) {
      const val = row[key]
      if (val && val.trim()) {
        // Do not call cleanText here; we need to preserve line breaks.
        quote = String(val)
        break
      }
    }
    // Skip this entry if there is no quote text in the sheet.
    if (!quote) continue
    // Split the quote into multiple lines by newline characters. A P column
    // cell may contain multiple sentences separated by line breaks. Each
    // non-empty trimmed part becomes its own BookLine. We stop adding
    // lines once we reach the limit.
    const parts = quote.split(/\r?\n/)
    for (const partRaw of parts) {
      if (lines.length >= limit) break
      const part = cleanText(partRaw)
      if (!part) continue
      lines.push({ text: part, isbn: isbn || undefined })
    }
  }
  return lines
}