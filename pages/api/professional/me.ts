import { NextApiRequest, NextApiResponse } from 'next'

import { getProfessionalByUser } from '@controllers/professionals/getProfessionalByUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'GET') getProfessionalByUser(req, res)
  else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
