import { prismaClient } from "@lib/prisma";

export async function listArticles() {
  try {
    const articles = await prismaClient.article.findMany({
      orderBy: { createdAt: "desc" },
      include: { AdMeta: true },
    });

    const parsedArticles = articles.map(({ source, ...rest }) => ({
      ...(source && { sources: source?.split(",") }),
      ...rest,
    }));

    return parsedArticles;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
