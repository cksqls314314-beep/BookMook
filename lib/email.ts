// lib/email.ts
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// ⚠️ [테스트 모드 필수] 보내는 사람은 무조건 이 주소여야 합니다.
const fromEmail = 'onboarding@resend.dev'; 

if (!resendApiKey) {
  console.error('❌ [email] RESEND_API_KEY가 없습니다. .env 설정을 확인하세요.');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

type VerificationEmailParams = {
  email: string;
  name?: string | null;
  token: string;
};

export async function sendVerificationEmail({
  email,
  name,
  token,
}: VerificationEmailParams): Promise<void> {
  if (!resend) {
    console.error('❌ [email] Resend 클라이언트가 없습니다. 발송을 건너뜁니다.');
    return;
  }

  const verifyUrl =
    `${siteUrl.replace(/\/$/, '')}` +
    `/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const subject = '[BookMook] 이메일 주소를 확인해 주세요';
  const greeting = name ? `${name}님` : '고객님';

  const html = `
    <div style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111827;">
      <p>안녕하세요 ${greeting}.</p>
      <p>BookMook 회원가입을 완료하려면 아래 버튼을 눌러주세요.</p>
      <p style="margin: 24px 0;">
        <a href="${verifyUrl}"
           style="display:inline-block;padding:12px 20px;background:#000;color:#fff;text-decoration:none;border-radius:9999px;font-weight:500;">
          이메일 인증하기
        </a>
      </p>
      <p style="font-size: 12px; color:#6b7280;">${verifyUrl}</p>
    </div>
  `;

  console.log(`📨 [email] 발송 시도: ${fromEmail} -> ${email}`);

  try {
    // ✅ 수정됨: 결과를 받아서 확인하는 로직 추가
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error('❌ [email] Resend 발송 에러:', error);
      throw new Error(`메일 발송 실패: ${error.message}`);
    }

    console.log('✅ [email] 발송 성공! ID:', data?.id);

  } catch (err) {
    console.error('❌ [email] 예상치 못한 에러:', err);
    throw err; // 에러를 밖으로 던져서 회원가입 로직이 알 수 있게 함
  }
}