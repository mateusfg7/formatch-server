import { NextApiRequest, NextApiResponse } from 'next'

import { createRate } from '@controllers/rates/createRate'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'POST') createRate(req, res)
  else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
