import { NextApiRequest, NextApiResponse } from 'next'

import { createFeedback } from '@controllers/feedback/create'
import { listFeedback } from '@controllers/feedback/list'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'POST') createFeedback(req, res)
  else if (method === 'GET') listFeedback(req, res)
  else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
