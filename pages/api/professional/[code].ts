import { NextApiRequest, NextApiResponse } from 'next'

import { testDbConnection } from '@lib/testDbConnection'
import { findProfessional } from '@controllers/professionals/findProfessional'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  await testDbConnection(res)

  if (method === 'GET') findProfessional(req, res)
  else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
