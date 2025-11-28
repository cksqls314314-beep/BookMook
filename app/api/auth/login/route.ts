// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSessionToken } from '@/lib/auth'; // 수정된 auth.ts 사용
import { cookies } from 'next/headers';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('이메일 형식이 올바르지 않습니다.').min(1, '이메일을 입력해 주세요.'),
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = LoginSchema.parse(json);

    const email = parsed.email.trim().toLowerCase();
    const password = parsed.password;

    // 1. 해당 이메일 계정 조회
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 },
      );
    }

    // 2. 이메일 인증 여부 확인 (개발 중엔 불편하면 이 부분 주석 처리 가능)
    if (!user.isVerified) {
      return NextResponse.json(
        {
          error: '이메일 인증을 완료한 뒤에 로그인할 수 있습니다.',
          code: 'EMAIL_NOT_VERIFIED',
        },
        { status: 403 },
      );
    }

    // 3. 비밀번호 검증 (bcrypt 사용)
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 },
      );
    }

    // 4. 세션 토큰 생성 및 쿠키 설정
    const token = await createSessionToken({ 
      id: user.id, 
      email: user.email, 
      name: user.name 
    });

    // 쿠키에 저장 (HttpOnly로 보안 강화)
    cookies().set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    return NextResponse.json({ ok: true, user: { email: user.email, name: user.name } }, { status: 200 });

  } catch (err: any) {
    console.error('[login] error', err);

    if (err?.name === 'ZodError') {
      return NextResponse.json(
        { error: '입력값 형식이 올바르지 않습니다.' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}