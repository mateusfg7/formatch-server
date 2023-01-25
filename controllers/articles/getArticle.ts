import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'

export async function getArticle(req: NextApiRequest, res: NextApiResponse) {
  const { slug: slugQuery } = req.query

  const slugSchema = z.string()
  const parsedSlug = slugSchema.safeParse(slugQuery)

  if (!parsedSlug.success) {
    return res
      .status(400)
      .json({ message: 'Invalid slug', error: parsedSlug.error.issues })
  }

  const slug = parsedSlug.data
  console.log(slug)

  try {
    const article = await prismaClient.article.findUnique({
      where: { slug },
      include: { AdMeta: true },
    })

    if (!article) {
      return res.status(4004).json({ message: 'Article not found' })
    }

    return res.status(200).json(article)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
