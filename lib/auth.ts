// lib/auth.ts
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

// 환경변수에 JWT_SECRET이 없으면 개발용 비밀키 사용 (배포시 꼭 .env에 설정하세요!)
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'bookmook-secret-key-1234');

/**
 * 비밀번호 해싱 (회원가입 시 사용)
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  // salt rounds: 10
  return await bcrypt.hash(plainPassword, 10);
}

/**
 * 비밀번호 검증 (로그인 시 사용)
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * 세션 토큰(JWT) 생성
 */
export async function createSessionToken(payload: { id: string; email: string; name?: string | null }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7일간 로그인 유지
    .sign(SECRET_KEY);
}

/**
 * 세션 토큰 검증 (로그인 여부 확인용)
 */
export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}