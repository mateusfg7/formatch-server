import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'
import { getUserFromHeader } from '@lib/getUserFromHeader'
import { Rate } from '@prisma/client'

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
    const checkProfessional = await prismaClient.professional.findMany({
      where: {
        code: parsedCode.data,
      },
    })

    if (checkProfessional.length === 0) {
      return res.status(400).json({ message: 'Professional not found' })
    }

    const existingRate = await prismaClient.rate.findFirst({
      where: {
        AND: [{ user: { email } }, { professional: { code: parsedCode.data } }],
      },
    })

    const registeredRate = await prismaClient.rate.upsert({
      where: {
        id: existingRate?.id ?? '',
      },
      update: {
        rate_value: parsedRate.data,
      },
      create: {
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
