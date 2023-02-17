import { NextApiRequest, NextApiResponse } from 'next'

import { createAdController } from 'controllers/advertisers/createAd'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'POST') createAdController(req, res)
  else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
