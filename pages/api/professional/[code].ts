import { NextApiRequest, NextApiResponse } from 'next'

import { findProfessional } from '@controllers/professionals/findProfessional'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'GET') findProfessional(req, res)
  else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
