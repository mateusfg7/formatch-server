import { NextApiRequest, NextApiResponse } from 'next'

import { deleteUser } from '@controllers/user/deleteUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'DELETE') deleteUser(req, res)
  else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
