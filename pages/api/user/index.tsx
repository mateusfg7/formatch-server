import { NextApiRequest, NextApiResponse } from 'next'

import { authUser } from '@controllers/user/authUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'GET') authUser(req, res)
  else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
