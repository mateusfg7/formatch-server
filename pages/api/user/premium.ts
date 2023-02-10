import { NextApiRequest, NextApiResponse } from 'next'

import { togglePremiumSubscribe } from '@controllers/user/togglePremiumSubscribe'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'PUT') togglePremiumSubscribe(req, res)
  else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
