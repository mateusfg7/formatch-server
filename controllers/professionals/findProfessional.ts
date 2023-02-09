import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'
import { getUserFromHeader } from '@lib/getUserFromHeader'
import { getArrayAverage } from '@utils/arrayAverage'

export async function findProfessional(
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
        services: {
          select: {
            service_name: true,
          },
        },
        Rates: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        saved_users: {
          select: {
            email: true,
          },
        },
      },
    })

    if (!professional) {
      return res.status(404).json({ message: 'Professional not found.' })
    }

    const user = getUserFromHeader(req)

    const emailList = professional.saved_users.map(
      (emailData) => emailData.email
    )
    const isSaved = emailList.includes(user.email)

    const ratedByUser = professional.Rates.find(
      (rate) => rate.user.email === user.email
    )
    const isRated = ratedByUser != undefined ? true : false

    const ratings = professional.Rates.map((rate) => rate.rate_value)
    const averageRate = getArrayAverage(ratings)

    const {
      Rates,
      saved_users,
      id,
      user_owner_id,
      profile_picture_gcs_path,
      createdAt,
      updatedAt,
      services,
      ...rest
    } = professional

    return res.status(200).json({
      ...rest,
      isSaved,
      isRated,
      averageRate,
      services: services.map((service) => service.service_name),
    })
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ error: err, message: 'Internal server error' })
  }
}
