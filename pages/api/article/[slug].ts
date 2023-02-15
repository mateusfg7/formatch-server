import type { NextApiRequest, NextApiResponse } from 'next'

import { getArticleController } from 'controllers/articles/getArticle'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'GET') getArticleController(req, res)
  else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
