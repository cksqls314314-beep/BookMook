import { NextResponse } from 'next/server'
import { getBookLines } from '@/lib/bookLines'

// API route to fetch book lines from the sheet. It accepts an
// optional `limit` query parameter to control the number of lines
// returned. Each line contains text and an optional ISBN. If an
// ISBN is present, the client can build a link to the book detail
// page using `/book/[isbn]`.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Math.max(1, parseInt(limitParam, 10) || 0) : 24
  try {
    const lines = await getBookLines(limit)
    return NextResponse.json({ items: lines })
  } catch (err) {
    console.error('Error generating book lines:', err)
    return NextResponse.json({ items: [] }, { status: 500 })
  }
}