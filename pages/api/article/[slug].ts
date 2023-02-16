import type { NextApiRequest, NextApiResponse } from 'next'

import { getArticleController } from 'controllers/articles/getArticle'
import { deleteArticleController } from 'controllers/articles/deleteArticle'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    case 'GET':
      getArticleController(req, res)
      break

    case 'DELETE':
      deleteArticleController(req, res)
      break

    default:
      res.setHeader('Allow', ['GET', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
