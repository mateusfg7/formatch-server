import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'

export async function findProfessional(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req

  const requestBodySchema = z.object({
    professional_id: z.string(),
  })
  const parsedRequestBody = requestBodySchema.safeParse(body)

  if (!parsedRequestBody.success)
    return res.status(405).json({ error: parsedRequestBody.error.issues[0] })

  const { professional_id } = parsedRequestBody.data
  try {
    const professional = await prismaClient.professional.findUnique({
      where: {
        id: professional_id,
      },
      include: {
        services: true,
      },
    })
    if (professional) {
      res.status(200).json({ professional })
    } else {
      res.status(404).json({ message: 'Professional not found.' })
    }
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ error: err, message: 'Internal server error' })
  }
}
