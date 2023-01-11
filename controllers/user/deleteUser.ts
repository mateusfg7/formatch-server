import { NextApiRequest, NextApiResponse } from 'next'

import { prismaClient } from '@lib/prisma'
import { getUserFromHeader } from '@lib/getUserFromHeader'

export async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const { email } = getUserFromHeader(req)

  try {
    const user = await prismaClient.user.findMany({
      where: {
        email,
      },
    })

    if (user.length === 0)
      return res.status(404).json({ message: 'User not found.' })

    await prismaClient.user.delete({
      where: {
        email,
      },
    })

    return res.status(204).end()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}
