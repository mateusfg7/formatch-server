import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'

export async function createFeedback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestBodySchema = z.object({
    type: z.enum(['SUGGEST', 'ERROR']),
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    message: z.string(),
  })

  const parsedRequestBody = requestBodySchema.safeParse(req.body)

  if (!parsedRequestBody.success)
    return res.status(400).json({ error: parsedRequestBody.error.issues })

  const { type, message, email, name } = parsedRequestBody.data

  return await prismaClient.feedback
    .create({
      data: {
        type,
        message,
        name: name ?? 'Anonymous',
        email,
      },
    })
    .then(() => res.status(201).end())
    .catch((error) => {
      console.log(error)
      res.status(500).end()
    })
}
