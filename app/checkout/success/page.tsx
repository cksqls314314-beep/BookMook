'use client'
import { useCart } from '@/components/cart/CartProvider'
import { useEffect, useState } from 'react'

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { paymentKey?: string; orderId?: string; amount?: string }
}) {
  const { clear } = useCart()
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const { paymentKey, orderId, amount } = searchParams
      if (!paymentKey || !orderId || !amount) {
        setError('잘못된 접근입니다.')
        return
      }
      const res = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
      })
      const data = await res.json()
      if (data.ok) {
        // 결제가 확인되면 카트 비우고 적립금 적립 시도
        setResult(data.data)
        clear()
        try {
          // 결제 금액으로 포인트 적립. amount는 문자열로 전달되므로 숫자로 변환
          const earnRes = await fetch('/api/rewards/earn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: Number(amount) }),
          })
          const earnData = await earnRes.json()
          // 결과에 포인트 정보 포함시키기
          if (earnData && earnData.success) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: attach to result for display
            setResult((prev: any) => ({ ...prev, pointsAdded: earnData.pointsAdded }))
          }
        } catch (e) {
          // 포인트 적립 실패는 무시
        }
      } else {
        setError(JSON.stringify(data.error))
      }
    })()
  }, [searchParams, clear])

  if (error) {
    return <div className="card p-6"><div className="text-red-600 font-medium mb-2">결제 확인 실패</div><pre className="text-xs whitespace-pre-wrap">{error}</pre></div>
  }
  if (!result) {
    return <div className="card p-6">결제 확인 중...</div>
  }
  return (
    <div className="card p-6 space-y-2">
      <div className="text-xl font-semibold">결제가 완료되었습니다.</div>
      <div className="text-sm text-black/60">주문번호: {result.orderId}</div>
      <div className="text-sm text-black/60">결제수단: {result.method}</div>
      {/* 적립금 안내 */}
      {result.pointsAdded ? (
        <div className="text-sm text-green-600">회원 적립금 {result.pointsAdded.toLocaleString()}포인트가 적립되었습니다.</div>
      ) : null}
      <a className="btn mt-4 inline-block" href="/">홈으로</a>
    </div>
  )
}
