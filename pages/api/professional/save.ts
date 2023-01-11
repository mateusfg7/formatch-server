import { NextApiRequest, NextApiResponse } from 'next'

import { testDbConnection } from '@lib/testDbConnection'
import { saveProfessional } from '@controllers/professionals/saveProfessional'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  await await testDbConnection(res)

  if (method === 'POST') saveProfessional(req, res)
  else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
