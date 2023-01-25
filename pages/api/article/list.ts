import { NextApiRequest, NextApiResponse } from 'next'

import { listArticles } from '@controllers/articles/listArticles'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'GET') listArticles(req, res)
  else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
