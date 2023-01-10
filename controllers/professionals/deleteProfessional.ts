import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'
import { deleteFileFromGcs } from '@utils/deleteFileFromGcs'

export async function deleteProfessional(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req

  const professionalDataSchema = z.object({
    professional_id: z.string(),
  })
  const parsedProfessionalData = professionalDataSchema.safeParse(body)

  if (!parsedProfessionalData.success)
    return res.status(400).json({ error: parsedProfessionalData.error.issues })

  const { professional_id } = parsedProfessionalData.data

  try {
    const professional = await prismaClient.professional.findMany({
      where: {
        id: professional_id,
      },
    })

    if (professional.length === 0)
      return res.status(404).json({ message: 'Professional not found.' })

    const deleteFromGcsResponse = await deleteFileFromGcs(
      professional[0].profile_picture_gcs_path
    )
    if (deleteFromGcsResponse.statusCode !== 204)
      return res
        .status(500)
        .json({ message: 'Error while deleting professional.' })

    await prismaClient.professional.deleteMany({
      where: {
        id: professional_id,
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
