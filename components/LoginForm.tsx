// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
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
        // ✅ 서버에서 보낸 에러 메시지("이메일 또는 비밀번호가 일치하지 않습니다")를 그대로 표시
        setError(data.error || '로그인에 실패했습니다.');
        return;
      }

      // 로그인 성공 시
      window.location.href = '/'; 
      
    } catch (err) {
      console.error('[login] error', err);
      setError('알 수 없는 오류가 발생했습니다.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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

      {/* 에러 메시지 표시 영역 */}
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
      >
        {pending ? '확인 중...' : '로그인'}
      </button>
    </form>
  );
}