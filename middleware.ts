import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { JWTPayload } from 'jose'
import { z } from 'zod'

import { verifyToken } from '@lib/auth'

export async function middleware(req: NextRequest) {
  const authorization = req.headers.get('Authorization')

  if (!authorization) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authentication failed.' }),
      { status: 400, headers: { 'content-type': 'application/json' } }
    )
  }

  const token = authorization.split(' ')[1]

  let payload: JWTPayload

  try {
    payload = await verifyToken(token)
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid access token.' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  const userScheme = z.object({
    name: z.string(),
    email: z.string().email(),
    avatar_url: z.string().url(),
    subscribe: z.boolean(),
  })

  const parsedUser = userScheme.safeParse(payload)

  if (!parsedUser.success) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid access token.' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  const requestHeaders = new Headers(req.headers)

  requestHeaders.append('user-data', JSON.stringify(parsedUser.data))

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: '/api/((?!user/create|article).*)',
}
