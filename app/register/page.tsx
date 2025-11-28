// app/register/page.tsx
import RegisterForm from '@/components/RegisterForm';

/**
 * 회원가입 페이지
 *
 * 상단에는 페이지 제목과 안내를 표시하고, 중앙에는 등록 폼을 표시합니다.
 */
export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 md:px-8 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">회원가입</h1>
      <RegisterForm />
    </main>
  );
}