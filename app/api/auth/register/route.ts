// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

// 클라이언트에서 보내는 회원가입 데이터 스키마 (phone 제거)
const RegisterSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해 주세요.'),
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    // phone 필드 제거
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
    confirmPassword: z.string().min(6, '비밀번호를 한 번 더 입력해 주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = RegisterSchema.safeParse(json);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? '잘못된 요청입니다.' },
        { status: 400 }
      );
    }

    // phone 변수 제거
    const { name, email, password } = parsed.data;

    // 이미 가입된 이메일 여부 확인
    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail && existingByEmail.isVerified) {
      return NextResponse.json(
        { error: '이미 가입된 이메일입니다. 로그인해 주세요.' },
        { status: 409 }
      );
    }

    // phone 중복 확인 로직 삭제

    const passwordHash = await bcrypt.hash(password, 10);

    // 이메일 인증 토큰 생성
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // +24h

    // 이미 존재하지만 미인증인 경우 => 정보 업데이트 + 토큰 재발급
    // phone 필드 저장 로직 삭제
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name,
        // phone: null, // DB 기본값이 null이므로 생략 가능
        passwordHash,
        isVerified: false,
        verifyToken,
        verifyExpires,
      },
      update: {
        name,
        // phone update 제거
        passwordHash,
        isVerified: false,
        verifyToken,
        verifyExpires,
      },
    });

    // 실제 인증 메일 발송
    try {
      await sendVerificationEmail({
        email: user.email,
        name: user.name,
        token: verifyToken,
      });
    } catch (err) {
      console.error('[register] 이메일 발송 실패:', err);
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          '회원가입 신청이 완료되었습니다. 이메일로 전송된 인증 링크를 확인해 주세요.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[register] 내부 오류:', error);
    return NextResponse.json(
      { error: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}