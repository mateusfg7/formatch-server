import jwt from 'jsonwebtoken'

export const jwtSign = (payload: string | object) =>
  jwt.sign(payload, process.env.JWT_SECRET as string)

export const jwtVerify = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as string)
