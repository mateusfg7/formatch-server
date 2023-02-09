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

    const savedProfessionalList = savedProfessionals.saved_professionals.map(
      (professional) => {
        const { id, user_owner_id, profile_picture_gcs_path, ...rest } =
          professional
        return { ...rest }
      }
    )

    return res.status(200).json(savedProfessionalList)
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
}
