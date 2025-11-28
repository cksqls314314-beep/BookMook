export default function FailPage({
  searchParams,
}: {
  searchParams: { code?: string; message?: string; orderId?: string }
}) {
  return (
    <div className="card p-6">
      <div className="text-xl font-semibold mb-2">결제가 실패했습니다</div>
      <div className="text-sm text-black/70">사유: {searchParams.message || '알 수 없음'}</div>
      <a className="btn mt-4 inline-block" href="/cart">장바구니로 돌아가기</a>
    </div>
  )
}
