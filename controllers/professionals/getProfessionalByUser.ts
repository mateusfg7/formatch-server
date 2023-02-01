import { NextApiRequest, NextApiResponse } from 'next'

import { prismaClient } from '@lib/prisma'
import { getUserFromHeader } from '@lib/getUserFromHeader'
import { getArrayAverage } from '@utils/arrayAverage'

export async function getProfessionalByUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getUserFromHeader(req)

  try {
    const professional = await prismaClient.professional.findFirst({
      where: {
        User: {
          email: user.email,
        },
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
        _count: {
          select: {
            saved_users: true,
          },
        },
      },
    })

    if (!professional) {
      return res.status(404).json({ message: 'Professional not found.' })
    }

    const ratings = professional.Rates.map((rate) => rate.rate_value)
    const averageRate = getArrayAverage(ratings)

    const {
      Rates,
      id,
      user_owner_id,
      profile_picture_gcs_path,
      createdAt,
      updatedAt,
      services,
      _count,
      ...rest
    } = professional

    return res.status(200).json({
      ...rest,
      savedCount: _count.saved_users,
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
