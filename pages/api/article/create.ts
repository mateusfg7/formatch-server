import { NextApiRequest, NextApiResponse } from 'next'

import { createArticle } from '@controllers/articles/createArticle'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'POST') createArticle(req, res)
  else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
