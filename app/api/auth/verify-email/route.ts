// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 서버 사이드 캐싱 방지 (항상 최신 상태 확인)
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  // 리다이렉트할 기본 주소 (현재 요청온 도메인 기준)
  const baseUrl = req.nextUrl.origin;

  // 1. 토큰이 없을 때
  if (!token) {
    return NextResponse.redirect(
      `${baseUrl}/verify-result?success=false&message=토큰이 없습니다.`
    );
  }

  // 2. 토큰으로 유저 찾기
  const user = await prisma.user.findFirst({
    where: {
      verifyToken: token,
      verifyExpires: { gt: new Date() }, // 만료 시간 체크
    },
  });

  // 3. 유효하지 않거나 만료된 토큰
  if (!user) {
    return NextResponse.redirect(
      `${baseUrl}/verify-result?success=false&message=유효하지 않거나 만료된 링크입니다.`
    );
  }

  // 4. 인증 성공 처리
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verifyToken: null,   // 토큰 파기 (재사용 방지)
      verifyExpires: null,
    },
  });

  // 5. 성공 페이지로 이동
  return NextResponse.redirect(
    `${baseUrl}/verify-result?success=true`
  );
}