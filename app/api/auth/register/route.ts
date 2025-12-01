// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

const RegisterSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해 주세요.'),
    nickname: z.string().min(2, '별명은 2글자 이상이어야 합니다.'), // ✅ 별명 필수
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    phone: z
      .string()
      .min(10, '휴대폰 번호를 입력해 주세요.')
      .max(20, '휴대폰 번호가 너무 깁니다.')
      .regex(/^[0-9]+$/, '숫자만 입력해 주세요.'),
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

    const { name, nickname, email, phone, password } = parsed.data;

    // 1. 이메일 중복 확인
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail && existingByEmail.isVerified) {
      return NextResponse.json({ error: '이미 가입된 이메일입니다.' }, { status: 409 });
    }

    // 2. 휴대폰 중복 확인
    const existingByPhone = await prisma.user.findUnique({ where: { phone } });
    if (existingByPhone && existingByPhone.isVerified) {
      return NextResponse.json({ error: '이미 사용 중인 휴대폰 번호입니다.' }, { status: 409 });
    }

    // 3. ✅ 별명 중복 확인 (추가됨)
    const existingByNickname = await prisma.user.findUnique({ where: { nickname } });
    if (existingByNickname) {
      return NextResponse.json({ error: '이미 사용 중인 별명입니다.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    // DB 저장 (Upsert)
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name,
        nickname, // ✅ 별명 저장
        phone,
        passwordHash,
        isVerified: false,
        verifyToken,
        verifyExpires,
      },
      update: {
        name,
        nickname, // ✅ 별명 업데이트
        phone,
        passwordHash,
        isVerified: false,
        verifyToken,
        verifyExpires,
      },
    });

    // 이메일 발송
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
      { ok: true, message: '회원가입 신청이 완료되었습니다. 이메일 인증을 진행해 주세요.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[register] 내부 오류:', error);
    return NextResponse.json({ error: '회원가입 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}