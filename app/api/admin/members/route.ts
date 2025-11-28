// app/api/admin/members/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🔐 보안 키: .env 파일에 ADMIN_SECRET=내비밀번호 설정 필수!
// 설정 안 하면 기본값 'bookmook_admin_secret' 사용
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'bookmook_admin_secret';

// 1. 회원 조회 (POST)
export async function POST(req: Request) {
  try {
    const { secret, query } = await req.json();

    // 보안 체크: 비밀번호가 틀리면 거부
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!query) return NextResponse.json({ user: null });

    // 이메일 또는 전화번호(하이픈 제거)로 검색
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: query },
          { phone: query.replace(/-/g, '') }, // 010-1234... -> 0101234...
          { nickname: query } // 닉네임으로도 검색 가능하게 추가
        ]
      },
      select: { id: true, name: true, nickname: true, email: true, exchangeTickets: true }
    });

    return NextResponse.json({ user });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// 2. 티켓 지급 (PUT)
export async function PUT(req: Request) {
  try {
    const { secret, userId, amount } = await req.json();

    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 해당 유저에게 티켓 추가 (increment)
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        exchangeTickets: { increment: Number(amount) }
      }
    });

    return NextResponse.json({ ok: true, currentTickets: user.exchangeTickets });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Update Failed' }, { status: 500 });
  }
}