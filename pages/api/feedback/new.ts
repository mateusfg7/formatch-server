import { NextApiRequest, NextApiResponse } from 'next'

import { createFeedback } from '@controllers/feedback/create'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'POST') createFeedback(req, res)
  else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
