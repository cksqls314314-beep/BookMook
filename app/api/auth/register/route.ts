// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

// 클라이언트에서 보내는 회원가입 데이터 스키마
const RegisterSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해 주세요.'),
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

    // ⬇️ 여기에서 parsed.error.errors[0] 때문에 터졌던 부분 수정
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? '잘못된 요청입니다.' },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = parsed.data;

    // 이미 가입된 이메일/휴대폰 여부 확인
    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });

    // 이미 인증까지 끝난 이메일이면 막기
    if (existingByEmail && existingByEmail.isVerified) {
      return NextResponse.json(
        { error: '이미 가입된 이메일입니다. 로그인해 주세요.' },
        { status: 409 }
      );
    }

    const existingByPhone = await prisma.user.findUnique({
      where: { phone },
    });

    // 이미 인증된 다른 계정이 이 휴대폰 번호를 쓰고 있으면 막기
    if (existingByPhone && existingByPhone.isVerified) {
      return NextResponse.json(
        { error: '이미 다른 계정에 사용 중인 휴대폰 번호입니다.' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // 이메일 인증 토큰 생성 (24시간 유효)
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // +24h

    // 이미 존재하지만 미인증인 경우 => 정보 업데이트 + 토큰 재발급
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name,
        phone,
        passwordHash,
        isVerified: false,
        verifyToken,
        verifyExpires,
      },
      update: {
        name,
        phone,
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
      // 여기서는 회원 생성은 이미 됐으니, 프론트에서 "메일 발송에 문제가 있으면 문의" 정도로 안내해도 됨
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
