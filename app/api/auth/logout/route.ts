// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // 쿠키 삭제: 값을 비우고 만료일을 과거로 설정하여 즉시 만료시킴
  cookies().set('session_token', '', { 
    expires: new Date(0), 
    path: '/' // 모든 경로에서 삭제되도록 설정
  });
  
  return NextResponse.json({ ok: true });
}