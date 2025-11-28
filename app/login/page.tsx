// app/login/page.tsx
'use client';

import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

/**
 * 로그인 / 회원가입 페이지 (상단 탭으로 전환)
 */
export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <main className="mx-auto max-w-3xl px-6 md:px-8 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">
        {mode === 'login' ? '로그인' : '회원가입'}
      </h1>

      <section className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white px-8 py-10 shadow-sm">
        {/* 상단 탭 */}
        <div className="mb-8 flex rounded-full bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full py-2 text-sm font-medium ${
              mode === 'login'
                ? 'bg-black text-white'
                : 'bg-transparent text-gray-500'
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-full py-2 text-sm font-medium ${
              mode === 'register'
                ? 'bg-black text-white'
                : 'bg-transparent text-gray-500'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 폼 영역 – 탭에 따라 교체 */}
        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
      </section>
    </main>
  );
}
