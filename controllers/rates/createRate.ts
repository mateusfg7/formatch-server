import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'
import { getUserFromHeader } from '@lib/getUserFromHeader'

export async function createRate(req: NextApiRequest, res: NextApiResponse) {
  const { rate } = req.body
  const { code } = req.query

  const idSchema = z.string()
  const rateSchema = z.number()

  const parsedCode = idSchema.safeParse(code)
  const parsedRate = rateSchema.safeParse(rate)

  if (!parsedCode.success) {
    return res.status(400).json({
      message: 'Invalid professional ID',
      error: parsedCode.error.issues,
    })
  }
  if (!parsedRate.success) {
    return res
      .status(400)
      .json({ message: 'Invalid rate value', error: parsedRate.error.issues })
  }
  if (parsedRate.data < 1 || parsedRate.data > 5) {
    return res.status(400).json({ message: 'The rate MUST be between 1 and 5' })
  }

  const { email } = getUserFromHeader(req)

  try {
    const existingRate = await prismaClient.rate.findMany({
      where: {
        AND: [{ user: { email } }, { professional: { code: parsedCode.data } }],
      },
    })

    if (existingRate.length > 0)
      return res.status(401).json({ message: 'Professional already rated' })

    const registeredRate = await prismaClient.rate.create({
      data: {
        user: {
          connect: {
            email,
          },
        },
        professional: {
          connect: {
            code: parsedCode.data,
          },
        },
        rate_value: parsedRate.data,
      },
    })

    return res.status(201).json(registeredRate)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
