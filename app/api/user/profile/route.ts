// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const { nickname, phone } = await req.json();
    
    const cookieStore = cookies();
    const token = cookieStore.get('session_token')?.value;
    const payload = token ? await verifySessionToken(token) : null;

    if (!payload) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // 정보 조회
    const currentUser = await prisma.user.findUnique({ where: { id: payload.id as string } });
    if (!currentUser) return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });

    // 업데이트할 데이터 객체 생성
    const updateData: any = {};

    // 1. 별명 유효성 검사 및 추가
    if (nickname !== undefined) {
      if (nickname.trim().length < 2) {
        return NextResponse.json({ error: '별명은 2글자 이상이어야 합니다.' }, { status: 400 });
      }
      updateData.nickname = nickname.trim();
    }

    // 2. 전화번호 유효성 검사 및 추가
    if (phone !== undefined) {
      // 이메일 인증 여부 확인 (보안)
      if (!currentUser.isVerified) {
        return NextResponse.json({ error: '전화번호를 등록하려면 먼저 이메일 인증을 완료해야 합니다.' }, { status: 403 });
      }
      
      // 간단한 숫자 체크
      const cleanPhone = phone.replace(/-/g, '').trim();
      if (cleanPhone && !/^[0-9]{10,11}$/.test(cleanPhone)) {
        return NextResponse.json({ error: '올바른 전화번호 형식이 아닙니다.' }, { status: 400 });
      }
      
      updateData.phone = cleanPhone;
    }

    // 3. DB 업데이트
    try {
      const updatedUser = await prisma.user.update({
        where: { id: payload.id as string },
        data: updateData,
      });
      
      return NextResponse.json({ ok: true, user: updatedUser });

    } catch (e: any) {
      if (e.code === 'P2002') {
        const field = e.meta?.target?.[0];
        if (field === 'nickname') {
          return NextResponse.json({ error: '이미 사용 중인 별명입니다.' }, { status: 409 });
        }
        if (field === 'phone') {
          return NextResponse.json({ error: '이미 등록된 전화번호입니다.' }, { status: 409 });
        }
      }
      throw e;
    }

  } catch (error) {
    console.error('[profile-update] error', error);
    return NextResponse.json({ error: '정보 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}