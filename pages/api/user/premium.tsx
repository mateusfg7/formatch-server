import { NextApiRequest, NextApiResponse } from 'next'

import { testDbConnection } from '@lib/testDbConnection'
import { togglePremiumSubscribe } from '@controllers/user/togglePremiumSubscribe'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  testDbConnection(res)

  if (method === 'PUT') togglePremiumSubscribe(req, res)
  else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
