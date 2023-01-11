import { NextApiRequest, NextApiResponse } from 'next'

import { testDbConnection } from '@lib/testDbConnection'
import { savedProfessionalByUser } from '@controllers/user/savedProfessionalsByUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  await testDbConnection(res)

  if (method === 'GET') savedProfessionalByUser(req, res)
  else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
