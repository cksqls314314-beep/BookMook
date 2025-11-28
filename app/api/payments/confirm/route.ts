import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { paymentKey, orderId, amount } = await req.json()

    if (!paymentKey || !orderId || typeof amount === 'undefined') {
      return NextResponse.json({ ok: false, error: 'Invalid params' }, { status: 400 })
    }
    const secretKey = process.env.TOSS_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json({ ok: false, error: 'Missing TOSS_SECRET_KEY' }, { status: 500 })
    }

    // Toss Confirm API (Basic Auth with secret key)
    const auth = Buffer.from(`${secretKey}:`).toString('base64')
    const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: data }, { status: res.status })
    }
    return NextResponse.json({ ok: true, data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
