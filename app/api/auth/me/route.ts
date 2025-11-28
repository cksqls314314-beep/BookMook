// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return NextResponse.json({ user: null });

  const payload = await verifySessionToken(token);
  if (!payload) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: payload.id as string },
    select: { 
      email: true, 
      name: true,
      nickname: true,
      phone: true,
      isVerified: true,
      exchangeTickets: true, // ✅ 티켓 개수 추가!
    }, 
  });

  return NextResponse.json({ user });
}