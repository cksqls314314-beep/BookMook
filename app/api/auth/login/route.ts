// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSessionToken } from '@/lib/auth';
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

    // ❌ 유저가 없을 때
    if (!user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 },
      );
    }

    // 2. 이메일 인증 여부 확인
    if (!user.isVerified) {
      return NextResponse.json(
        {
          error: '이메일 인증을 완료한 뒤에 로그인할 수 있습니다.',
          code: 'EMAIL_NOT_VERIFIED',
        },
        { status: 403 },
      );
    }

    // 3. 비밀번호 검증
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    
    // ❌ 비밀번호가 틀렸을 때
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 },
      );
    }

    // 4. 로그인 성공: 세션 토큰 생성
    const token = await createSessionToken({ 
      id: user.id, 
      email: user.email, 
      name: user.name 
    });

    cookies().set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
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
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 },
    );
  }
}