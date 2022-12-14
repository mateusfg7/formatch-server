import type { NextApiRequest, NextApiResponse } from 'next'

import articles from '../../assets/articles.json'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(articles)
}
