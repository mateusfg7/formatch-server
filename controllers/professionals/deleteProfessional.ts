import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'
import { getUserFromCookies } from '@lib/getUserFromCookies'
import { deleteFileFromGcs } from '@utils/deleteFileFromGcs'

export async function deleteProfessional(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query

  const professionalCodeSchema = z.string()
  const parsedProfessionalCode = professionalCodeSchema.safeParse(code)

  if (!parsedProfessionalCode.success)
    return res.status(400).json({ error: parsedProfessionalCode.error.issues })

  const professionalCode = parsedProfessionalCode.data

  try {
    const professional = await prismaClient.professional.findUnique({
      where: {
        code: professionalCode,
      },
      include: {
        User: {
          select: {
            email: true,
          },
        },
      },
    })

    if (!professional)
      return res.status(404).json({ message: 'Professional not found.' })

    const user = getUserFromCookies(req)

    if (user.email != professional.User.email) {
      return res.status(401).json({
        message: 'You do not have permission to delete this professional',
      })
    }

    const deleteFromGcsResponse = await deleteFileFromGcs(
      professional.profile_picture_gcs_path
    )
    if (deleteFromGcsResponse.statusCode !== 204)
      return res
        .status(500)
        .json({ message: 'Error while deleting professional.' })

    await prismaClient.professional.delete({
      where: {
        code: professionalCode,
      },
    })
    res.status(204).end()
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ error: err, message: 'Internal server error' })
  }
}
