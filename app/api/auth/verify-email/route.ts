// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: '토큰이 없습니다.' },
      { status: 400 },
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      verifyToken: token,
      verifyExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: '토큰이 유효하지 않거나 만료되었습니다.' },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verifyToken: null,
      verifyExpires: null,
    },
  });

  // 여기서는 일단 JSON으로만 응답하고,
  // 나중에 예쁜 완료 페이지(/verify-email 성공 페이지)를 따로 만들어도 된다.
  return NextResponse.json({ ok: true });
}
