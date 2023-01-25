import { PrismaClient } from '@prisma/client'

import articles from '../assets/articles.json'
import articleWithAd from '../assets/article-with-ad.json'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.user.create({
      data: {
        name: 'Mateus Felipe',
        email: 'mateusfelipefg77@gmail.com',
        avatar_url: 'https://github.com/mateusfg7.png',
        google_id: '434136468',
        subscribe: true,
      },
    })
  } catch (error) {
    console.log(error)
  }

  try {
    await prisma.article.create({
      data: articleWithAd,
    })
  } catch (error) {
    console.log(error)
  }

  try {
    await prisma.article.createMany({
      data: articles,
    })
  } catch (error) {
    console.log(error)
  }
}

main()
