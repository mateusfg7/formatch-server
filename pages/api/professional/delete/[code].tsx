import { NextApiRequest, NextApiResponse } from 'next'

import { testDbConnection } from '@lib/testDbConnection'
import { deleteProfessional } from '@controllers/professionals/deleteProfessional'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  testDbConnection(res)

  if (method === 'DELETE') deleteProfessional(req, res)
  else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
