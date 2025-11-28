// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 라우터 추가

export default function LoginForm() {
  const router = useRouter(); // 라우터 훅 사용
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPending(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.code === 'EMAIL_NOT_VERIFIED') {
          setError('이메일 인증을 완료한 뒤에 로그인할 수 있습니다.');
        } else {
          setError(data.error || '로그인에 실패했습니다.');
        }
        return;
      }

      // 로그인 성공! -> 메인 페이지로 새로고침 이동 (헤더 업데이트 위해)
      window.location.href = '/'; 
      
    } catch (err) {
      console.error('[login] error', err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setPending(false);
    }
  };

  // ... (아래 JSX 부분은 기존과 동일) ...
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* 입력창 부분은 그대로 두셔도 됩니다 */}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black"
          placeholder="비밀번호"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
      >
        {pending ? '로그인 중…' : '로그인'}
      </button>
    </form>
  );
}