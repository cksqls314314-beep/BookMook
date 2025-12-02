// components/RegisterForm.tsx
'use client';

import { useState } from 'react';

/**
 * 이메일 인증 기반 회원가입 폼 (전화번호 제외)
 */
export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // phone 상태 삭제
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setPending(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          // phone 제외
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '회원가입에 실패했습니다.');
        return;
      }

      setMessage(
        data.message ||
          '회원가입 신청이 완료되었습니다. 이메일로 전송된 인증 링크를 확인해 주세요.',
      );
    } catch (err) {
      console.error('[register] error', err);
      setError('회원가입 처리 중 오류가 발생했습니다.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="register-name"
          className="block text-sm font-medium text-gray-700"
        >
          이름
        </label>
        <input
          id="register-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black"
          placeholder="이름"
        />
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="block text-sm font-medium text-gray-700"
        >
          이메일
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black"
          placeholder="you@example.com"
        />
      </div>

      {/* 전화번호 입력란 삭제됨 */}

      <div>
        <label
          htmlFor="register-password"
          className="block text-sm font-medium text-gray-700"
        >
          비밀번호
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black"
          placeholder="비밀번호"
        />
      </div>

      <div>
        <label
          htmlFor="register-confirm"
          className="block text-sm font-medium text-gray-700"
        >
          비밀번호 확인
        </label>
        <input
          id="register-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black"
          placeholder="비밀번호를 한 번 더 입력해 주세요."
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
      >
        {pending ? '회원가입 중…' : '회원가입'}
      </button>
    </form>
  );
}