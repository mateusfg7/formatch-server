import { NextApiRequest, NextApiResponse } from 'next'

import { deleteProfessional } from '@controllers/professionals/deleteProfessional'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'DELETE') deleteProfessional(req, res)
  else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
