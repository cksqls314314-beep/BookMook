// lib/email.ts
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const fromEmail = 'onboarding@resend.dev';

if (!resendApiKey) {
  console.warn(
    '[email] RESEND_API_KEY가 설정되어 있지 않습니다. 실제 메일은 발송되지 않습니다.',
  );
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

type VerificationEmailParams = {
  email: string;
  name?: string | null;
  token: string;
};

/**
 * 회원가입 이메일 인증 메일 발송
 *
 * /app/api/auth/register/route.ts 에서 호출됨.
 * 링크:  `${SITE_URL}/api/auth/verify-email?token=...&email=...`
 */
export async function sendVerificationEmail({
  email,
  name,
  token,
}: VerificationEmailParams): Promise<void> {
  // 안전장치: API 키가 없으면 그냥 로그만 남기고 종료
  if (!resend) {
    console.warn('[email] Resend 클라이언트가 초기화되지 않아서 메일을 보내지 못했습니다.');
    return;
  }

  const verifyUrl =
    `${siteUrl.replace(/\/$/, '')}` +
    `/api/auth/verify-email?token=${encodeURIComponent(
      token,
    )}&email=${encodeURIComponent(email)}`;

  const subject = '[BookMook] 이메일 주소를 확인해 주세요';

  const greeting = name ? `${name}님` : '고객님';

  const text = [
    `안녕하세요 ${greeting}.`,
    '',
    'BookMook 회원가입을 완료하려면 아래 링크를 클릭해 이메일 주소를 인증해 주세요.',
    verifyUrl,
    '',
    '이 링크는 24시간 동안만 유효합니다.',
  ].join('\n');

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; color: #111827;">
      <p>안녕하세요 ${greeting}.</p>
      <p>BookMook 회원가입을 완료하려면 아래 버튼을 눌러 이메일 주소를 확인해 주세요.</p>
      <p style="margin: 24px 0;">
        <a href="${verifyUrl}"
           style="display:inline-block;padding:12px 20px;background:#000;color:#fff;
                  text-decoration:none;border-radius:9999px;font-weight:500;">
          이메일 인증하기
        </a>
      </p>
      <p>버튼이 동작하지 않으면 아래 주소를 브라우저 주소창에 복사해 붙여넣어 주세요.</p>
      <p style="word-break: break-all; font-size: 12px; color:#6b7280;">${verifyUrl}</p>
      <p style="margin-top:24px; font-size:12px; color:#6b7280;">
        이 링크는 발송 시점으로부터 24시간 동안만 유효합니다.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject,
    text,
    html,
  });
}
