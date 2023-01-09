import { NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import { prismaClient } from '@lib/prisma'

export async function testDbConnection(response: NextApiResponse) {
  try {
    await prismaClient.$queryRaw`SELECT 1`
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P1001') {
        console.error(error)
        return response
          .status(500)
          .json({ message: 'Error while connect with database.' })
      }
    } else {
      console.error(error)
      return response
        .status(500)
        .json({ message: 'Internal server error.', error })
    }
  }
}
