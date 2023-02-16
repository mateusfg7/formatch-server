import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from 'lib/prisma'

export async function deleteArticleController(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req

  const querySchema = z.object({
    slug: z.string(),
  })
  const parsedQuery = querySchema.safeParse(query)

  if (!parsedQuery.success) {
    return res
      .status(400)
      .json({ message: 'Invalid slug', error: parsedQuery.error.issues })
  }

  const { slug } = parsedQuery.data

  try {
    await prismaClient.article.delete({
      where: {
        slug,
      },
    })

    return res.status(204).end()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
