import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'
import { getArrayAverage } from '@utils/arrayAverage'

export async function getProfessionalListByService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req

  const querySchema = z.object({
    service: z.string(),
    uf: z.string().length(2).optional(),
    city: z.string().optional(),
  })

  const parsedQuery = querySchema.safeParse(query)

  if (!parsedQuery.success) {
    return res.status(400).send({
      message: 'Invalid query params',
      error: parsedQuery.error.issues,
    })
  }

  const { service, uf, city } = parsedQuery.data

  try {
    const professionalListOnDb = await prismaClient.professional.findMany({
      where: {
        services: {
          some: {
            service_name: service,
          },
        },
        ...(city &&
          uf && {
            city: city,
            state_uf: uf.toUpperCase(),
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
        User: {
          select: {
            subscribe: true,
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
          User: { subscribe },
          ...restIncludedProfessionalData
        } = professional

        const ratings = professional.Rates.map((rate) => rate.rate_value)
        const averageRate = getArrayAverage(ratings)

        const services = serviceList.map(
          (serviceData) => serviceData.service_name
        )

        const emphasis = subscribe

        return {
          ...restIncludedProfessionalData,
          averageRate,
          services,
          emphasis,
        }
      }
    )

    const random_sort = () => Math.random() - 0.5

    return res.status(200).send({
      professional_list: filteredProfessionalList.sort(random_sort),
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error, message: 'Internal server error' })
  }
}
