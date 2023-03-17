import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'

export async function createAdController(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req

  const bodySchema = z.object({
    name: z.string(),
    logo_url: z.string(),
    contact: z.string(),
  })
  const parsedBody = bodySchema.safeParse(JSON.parse(body))

  if (!parsedBody.success)
    return res.status(400).json({
      message: 'Invalid parameters',
      error: parsedBody.error.issues,
    })

  const { logo_url, name, contact } = parsedBody.data

  try {
    const existingAd = await prismaClient.adMeta.findUnique({
      where: {
        name,
      },
    })

    if (!existingAd) {
      await prismaClient.adMeta.create({
        data: {
          name,
          logo_url,
          contact,
        },
      })
    } else {
      return res.status(409).json({ message: 'Advertiser already registered.' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
  return res.status(201).end()
}
