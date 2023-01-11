import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'
import { getUserFromHeader } from '@lib/getUserFromHeader'

export async function saveProfessional(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.body

  const codeSchema = z.string()

  const parsedCode = codeSchema.safeParse(code)

  if (!parsedCode.success) {
    return res.status(400).json({
      message: 'Invalid professional code',
      error: parsedCode.error.issues,
    })
  }

  const { email } = getUserFromHeader(req)

  try {
    const professional = await prismaClient.professional.findUnique({
      where: {
        code: parsedCode.data,
      },
      include: {
        saved_users: {
          select: {
            email: true,
          },
        },
      },
    })

    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' })
    }

    const isProfessionalSaved = professional.saved_users.includes({ email })

    if (isProfessionalSaved) {
      await prismaClient.user.update({
        where: {
          email,
        },
        data: {
          saved_professionals: {
            disconnect: {
              code: parsedCode.data,
            },
          },
        },
      })
    } else {
      await prismaClient.user.update({
        where: {
          email,
        },
        data: {
          saved_professionals: {
            connect: {
              code: parsedCode.data,
            },
          },
        },
      })
    }

    return res.status(204).end()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error.' })
  }
}
