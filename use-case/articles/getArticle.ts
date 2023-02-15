import { prismaClient } from '@lib/prisma'

export async function getArticle(slug: string) {
  try {
    const article = await prismaClient.article.findUnique({
      where: { slug },
      include: { AdMeta: true },
    })

    return article
  } catch (error) {
    throw error
  }
}
