import { prismaClient } from '@lib/prisma'

export async function listArticles() {
  try {
    const articles = await prismaClient.article.findMany({
      orderBy: { createdAt: 'asc' },
      include: { AdMeta: true },
    })

    return articles
  } catch (error) {
    console.log(error)
    throw error
  }
}
