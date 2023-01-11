import { NextApiRequest, NextApiResponse } from 'next'

import { getUserFromHeader } from '@lib/getUserFromHeader'
import { prismaClient } from '@lib/prisma'

export async function savedProfessionalByUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = getUserFromHeader(req)

  try {
    const savedProfessionals = await prismaClient.user.findUnique({
      where: {
        email,
      },
      select: {
        saved_professionals: true,
      },
    })

    if (!savedProfessionals)
      return res.status(404).json({ message: 'User not found.' })

    return res.status(200).json(savedProfessionals.saved_professionals)
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}
