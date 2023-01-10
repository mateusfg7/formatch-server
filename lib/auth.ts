import * as jose from 'jose'

export async function signInToken(payload: jose.JWTPayload) {
  const secret = new TextEncoder().encode('mateusfg7')
  const alg = 'HS256'

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .sign(secret)

  return token
}

export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode('mateusfg7')

  const { payload } = await jose.jwtVerify(token, secret)

  return payload
}

// export function isAuthenticated(request: NextRequest) {
//   const authorization = request.headers.get('Authorization')

//   if (!authorization) return false

//   const authToken = authorization.split(' ')[1]

//   try {
//     jwtVerify(authToken)
//   } catch (error) {
//     return false
//   }

//   return true
// }
