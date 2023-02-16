import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prismaClient } from '@lib/prisma'
import { Article } from '@prisma/client'

export async function createArticle(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req

  const articleSchema = z.object({
    title: z.string(),
    banner_url: z.string().url(),
    content: z.string(),
    ad_name: z.string().optional(),
    // ad_meta: z
    //   .object({
    //     name: z.string(),
    //     logo_url: z.string().url(),
    //     website_url: z.string().url(),
    //   })
    //   .optional(),
  })
  const parsedArticle = articleSchema.safeParse(JSON.parse(body))

  if (!parsedArticle.success)
    return res.status(400).json({
      message: 'Invalid parameters',
      error: parsedArticle.error.issues,
    })

  const { title, banner_url, content, ad_name } = parsedArticle.data
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/\p{M}/gu, '')
    .replaceAll(' ', '-')

  let article: Article
  try {
    const data = {
      title,
      banner_url,
      content,
      slug,
    }

    const existingArticle = await prismaClient.article.findUnique({
      where: {
        slug,
      },
    })

    if (!existingArticle) {
      article = await prismaClient.article.create({
        data: {
          ...data,
          ...(ad_name && {
            AdMeta: {
              connect: {
                name: ad_name,
              },
            },
          }),
        },
        include: {
          AdMeta: true,
        },
      })
    } else {
      return res.status(409).json({ message: 'Article title already used.' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
  return res.status(201).json(article)
}
