import { prismaClient } from '@lib/prisma'

export async function getArticle(slug: string) {
  try {
    const { source, ...rest } = await prismaClient.article.findUniqueOrThrow({
      where: { slug },
      include: { AdMeta: true },
    })

    return { ...(source && { sources: source?.split(',') }), ...rest }
  } catch (error) {
    throw error
  }
}
