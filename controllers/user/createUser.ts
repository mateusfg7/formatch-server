import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '../../lib/prisma'
import { jwtSign } from '../../utils/jwt'

export async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const requestBodySchema = z.object({
    access_token: z.string(),
  })

  const parsedRequestBody = requestBodySchema.safeParse(req.body)

  if (!parsedRequestBody.success)
    return res.status(400).json({ error: parsedRequestBody.error.issues })

  const { access_token } = parsedRequestBody.data

  const googleUserData = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  ).then((response) => response.json())

  const userInfoSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    picture: z.string().url(),
  })

  const userInfo = userInfoSchema.safeParse(googleUserData)

  if (!userInfo.success)
    return res.status(400).json({ message: 'Invalid google access token.' })

  const { email, id, name, picture } = userInfo.data

  let user = await prismaClient.user.findUnique({
    where: {
      google_id: id,
    },
  })

  if (!user) {
    user = await prismaClient.user.create({
      data: {
        name,
        email,
        avatar_url: picture,
        google_id: id,
        subscribe: false,
      },
    })
  }

  const token = jwtSign({
    name: user.name,
    email: user.email,
    avatar_url: user.avatar_url,
    subscribe: user.subscribe,
  })

  return res.status(201).json({ token })
}
