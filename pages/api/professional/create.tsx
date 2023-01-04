import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'

import { prismaClient } from '../../../lib/prisma'

import { createProfessional } from '../../../controllers/professionals/createProfessional'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  try {
    await prismaClient.$queryRaw`SELECT 1`
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P1001') {
        console.error(error)
        return res
          .status(500)
          .json({ message: 'Error while connect with database.' })
      }
    } else {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error.', error })
    }
  }

  if (method === 'POST') createProfessional(req, res)
  else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}