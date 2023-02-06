import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'
import { getArrayAverage } from '@utils/arrayAverage'

export async function getProfessionalListByService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req

  const bodySchema = z.object({
    service: z.string(),
    filter: z
      .object({
        uf: z.string().length(2),
        city: z.string(),
      })
      .optional(),
  })

  const parsedBody = bodySchema.safeParse(body)

  if (!parsedBody.success) {
    return res
      .status(400)
      .send({ message: 'Invalid body params', error: parsedBody.error.issues })
  }

  const { service, filter } = parsedBody.data

  try {
    const professionalListOnDb = await prismaClient.professional.findMany({
      where: {
        services: {
          some: {
            service_name: service,
          },
        },
        ...(filter && {
          city: filter.city,
          state_uf: filter.uf.toUpperCase(),
        }),
      },
      include: {
        services: {
          orderBy: {
            service_name: 'asc',
          },
          select: {
            service_name: true,
          },
        },
        Rates: {
          select: {
            rate_value: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    const filteredProfessionalList = professionalListOnDb.map(
      (professional) => {
        const {
          id,
          profile_picture_gcs_path,
          user_owner_id,
          updatedAt,
          Rates,
          services: serviceList,
          ...restIncludedProfessionalData
        } = professional

        const ratings = professional.Rates.map((rate) => rate.rate_value)
        const averageRate = getArrayAverage(ratings)

        const services = serviceList.map(
          (serviceData) => serviceData.service_name
        )

        return {
          ...restIncludedProfessionalData,
          averageRate,
          services,
        }
      }
    )

    return res.status(200).send({
      professional_list: filteredProfessionalList,
      service,
      ...(filter && filter),
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error, message: 'Internal server error' })
  }
}
