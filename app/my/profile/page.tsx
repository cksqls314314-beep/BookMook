// app/my/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 사용자 정보
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.replace('/login');
          return;
        }
        setEmail(data.user.email);
        setName(data.user.name || '');
        setNickname(data.user.nickname || '');
        setPhone(data.user.phone || '');
        setIsVerified(data.user.isVerified);
        setLoading(false);
      });
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // 닉네임과 전화번호 함께 전송
        body: JSON.stringify({ nickname, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '수정에 실패했습니다.');
      } else {
        setSuccess('성공적으로 저장되었습니다!');
        setTimeout(() => {
           window.location.reload();
        }, 1000);
      }
    } catch (err) {
      setError('서버 통신 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-500">정보를 불러오는 중...</div>;

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-bold mb-8">내 정보 수정</h1>
      
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">이메일</label>
            <div className="flex items-center justify-between w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-500 select-none">
              <span>{email}</span>
              {isVerified ? (
                <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">인증됨</span>
              ) : (
                <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">미인증</span>
              )}
            </div>
            {!isVerified && (
              <p className="mt-1 text-xs text-red-400">
                * 전화번호 수정 등을 위해 이메일 인증이 필요합니다. (가입 시 발송된 메일 확인)
              </p>
            )}
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">이름</label>
            <div className="w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-500 select-none">
              {name}
            </div>
          </div>

          {/* 별명 */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-900 mb-1">
              별명 <span className="text-blue-500 text-xs font-normal">(사이트에서 활동할 이름)</span>
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="나만의 멋진 별명을 지어주세요"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            />
          </div>

          {/* ✅ 전화번호 수정 (이메일 인증 필요) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
              휴대폰 번호
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01012345678"
                disabled={!isVerified} // 미인증 시 비활성화
                className={`w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition ${
                  !isVerified 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'text-gray-900 focus:border-black focus:ring-1 focus:ring-black'
                }`}
              />
            </div>
            {/* 미인증 시 안내 메시지 */}
            {!isVerified && (
               <p className="mt-1 text-xs text-gray-400">
                 🔒 이메일 인증을 완료해야 전화번호를 수정할 수 있습니다.
               </p>
            )}
          </div>

          {/* 결과 메시지 */}
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
          {success && <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">{success}</div>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-black py-3.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? '저장 중...' : '변경사항 저장'}
          </button>
        </form>
      </div>
    </main>
  );
}