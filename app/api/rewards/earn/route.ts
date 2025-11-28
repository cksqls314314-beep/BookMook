// app/api/rewards/earn/route.ts
//
// Loyalty points earn endpoint.
//
// This API accepts a POST request with a JSON body of the form { amount: number }
// and awards loyalty points based on the amount spent. The current policy
// credits 3% of the amount as points (rounded down). Points are stored on
// the user's account in the `data/users.json` file. A valid session cookie
// (`session`) must be present in the request headers so the server can
// identify the user. If the session is invalid or missing, the request
// returns 401.

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSessionEmail, addUserPoints } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const amount = Number(body?.amount)
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: '유효하지 않은 금액입니다.' }, { status: 400 })
    }
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('session')?.value
    const email = await getSessionEmail(sessionToken)
    if (!email) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 })
    }
    // Calculate points as 3% of amount. Use Math.floor to avoid fractional points.
    const pointsToAdd = Math.floor(amount * 0.03)
    if (pointsToAdd <= 0) {
      return NextResponse.json({ success: true, points: 0, message: '결제 금액이 적어 포인트가 적립되지 않습니다.' })
    }
    const totalPoints = await addUserPoints(email, pointsToAdd)
    return NextResponse.json({ success: true, pointsAdded: pointsToAdd, totalPoints })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '포인트 적립 실패' }, { status: 500 })
  }
}

// Reject GET requests and other methods
export function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 })
}