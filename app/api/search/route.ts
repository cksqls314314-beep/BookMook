// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { searchInventory } from '@/lib/search';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  // Only search the inventory (Google Sheet) for matching books.
  const items = await searchInventory(q);
  return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store' } });
}
