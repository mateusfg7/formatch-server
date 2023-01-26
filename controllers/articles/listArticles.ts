import { NextApiRequest, NextApiResponse } from 'next'

import { prismaClient } from '@lib/prisma'

export async function listArticles(req: NextApiRequest, res: NextApiResponse) {
  try {
    const articles = await prismaClient.article.findMany({
      orderBy: { createdAt: 'asc' },
      include: { AdMeta: true },
    })

    return res.status(200).json(articles)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
