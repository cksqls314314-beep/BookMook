// app/checkout/page.tsx
'use client'

import { useCart } from '@/components/cart/CartProvider'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  loadPaymentWidget,
  ANONYMOUS,
  type PaymentWidgetInstance,
  // 에러나는 구체적인 타입들은 제거하고 any로 대체합니다.
} from '@tosspayments/payment-widget-sdk'
import { v4 as uuidv4 } from 'uuid'

export default function CheckoutPage() {
  const { items } = useCart()

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL as string) || 'http://localhost:3000'

  const totalAmount = useMemo(
    () => items.reduce((s, x) => s + x.price * x.qty, 0),
    [items]
  )

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null)
  // 👇 타입을 any로 변경하여 빌드 에러 방지
  const methodsRef = useRef<any>(null)
  const agreementRef = useRef<any>(null)
  const orderIdRef = useRef<string>('')

  const [mounted, setMounted] = useState(false)
  const [uiReady, setUiReady] = useState(false)
  const [debug, setDebug] = useState<string>('')

  useEffect(() => setMounted(true), [])

  async function renderAll(amount: number) {
    if (!document.querySelector('#payment-widget') || !document.querySelector('#agreement')) {
      setDebug('no-container')
      return
    }
    setDebug('render:start')
    const widget = await loadPaymentWidget(clientKey, ANONYMOUS)
    paymentWidgetRef.current = widget

    const methods = await widget.renderPaymentMethods(
      '#payment-widget',
      { value: amount },
      { variantKey: 'DEFAULT' }
    )
    methodsRef.current = methods

    const agreement = await widget.renderAgreement('#agreement', {
      variantKey: 'AGREEMENT',
    })
    agreementRef.current = agreement

    let found = !!document.querySelector('#payment-widget iframe')
    let tries = 0
    while (!found && tries < 5) {
      tries++
      await new Promise((r) => setTimeout(r, 300))
      found = !!document.querySelector('#payment-widget iframe')
    }

    setUiReady(found)
    setDebug(found ? 'render:done' : 'iframe:not-found')
  }

  useEffect(() => {
    if (!mounted || !clientKey || items.length === 0) return
    orderIdRef.current = 'order_' + uuidv4().replace(/-/g, '').slice(0, 20)
    renderAll(totalAmount).catch((e) => {
      console.error('renderAll error', e)
      setDebug('render:error')
    })
  }, [mounted, clientKey, items.length])

  useEffect(() => {
    if (items.length === 0) return
    methodsRef.current?.updateAmount(totalAmount)
  }, [totalAmount, items.length])

  useEffect(() => {
    if (items.length === 0) {
      paymentWidgetRef.current = null
      methodsRef.current = null
      agreementRef.current = null
      setUiReady(false)
      setDebug('cart:empty')
    }
  }, [items.length])

  const onPay = async () => {
    if (!paymentWidgetRef.current || !methodsRef.current || !agreementRef.current) {
      alert('결제 UI가 아직 준비되지 않았습니다. 장바구니를 확인하고 잠시 후 다시 시도해주세요.')
      return
    }
    try {
      await paymentWidgetRef.current.requestPayment({
        orderId: orderIdRef.current,
        orderName: 'BookMook 장바구니',
        successUrl: `${baseUrl}/checkout/success`,
        failUrl: `${baseUrl}/checkout/fail`,
      })
    } catch (e) {
      console.error('requestPayment error', e)
      alert('결제 요청 중 오류가 발생했습니다. 콘솔 로그를 확인해주세요.')
    }
  }

  if (!mounted) return null

  if (!items.length) {
    return (
      <div className="card p-8 text-center text-black/60">
        장바구니가 비어 있습니다.
        <div className="mt-2 text-xs text-black/40">debug: {debug}</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <section className="md:col-span-2 space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">결제</h1>
        <div id="payment-widget" className="card p-4" />
        <div id="agreement" className="card p-4" />
        <div className="text-xs text-black/40">
          debug: {debug} {uiReady ? '(ready)' : '(loading...)'}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="card p-4 space-y-2">
          <div className="font-medium">주문 요약</div>
          {items.map((x) => (
            <div
              key={x.isbn}
              className="flex items-center justify-between text-sm text-black/70"
            >
              <span>
                {x.title} × {x.qty}
              </span>
              <span>{(x.price * x.qty).toLocaleString()}원</span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between text-base">
            <span>합계</span>
            <strong>{totalAmount.toLocaleString()}원</strong>
          </div>
          <button
            className="btn-primary btn mt-4 w-full"
            disabled={!uiReady}
            onClick={onPay}
          >
            결제하기
          </button>
        </div>
      </aside>

      <style jsx global>{`
        #payment-widget { min-height: 360px; position: relative; }
        #payment-widget iframe { display: block !important; width: 100% !important; min-height: 340px !important; }
      `}</style>
    </div>
  )
}