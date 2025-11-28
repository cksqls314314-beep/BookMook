// app/verify-result/page.tsx
import Link from 'next/link';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerifyResultPage({
  searchParams,
}: {
  searchParams: { success?: string; message?: string };
}) {
  const isSuccess = searchParams.success === 'true';
  const message = searchParams.message || (isSuccess ? '이메일 인증이 완료되었습니다.' : '인증에 실패했습니다.');

  return (
    <main className="mx-auto max-w-md px-6 py-24 md:py-32">
      <div className="card p-10 text-center shadow-lg border border-neutral-100 bg-white rounded-3xl">
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              <CheckCircle size={36} strokeWidth={3} />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <XCircle size={36} strokeWidth={3} />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">
          {isSuccess ? '인증 완료' : '인증 실패'}
        </h1>
        
        <p className="text-neutral-500 mb-8 leading-relaxed">
          {message}
          {isSuccess && <br />}
          {isSuccess && <span className="text-sm">이제 정상적으로 서비스를 이용하실 수 있습니다.</span>}
        </p>

        <div className="space-y-3">
          {isSuccess ? (
            <Link
              href="/login"
              className="block w-full rounded-xl bg-black py-3.5 text-sm font-bold text-white hover:bg-neutral-800 transition"
            >
              로그인 하러 가기
            </Link>
          ) : (
            <Link
              href="/"
              className="block w-full rounded-xl bg-black py-3.5 text-sm font-bold text-white hover:bg-neutral-800 transition"
            >
              홈으로 돌아가기
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}