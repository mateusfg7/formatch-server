import { NextApiRequest, NextApiResponse } from 'next'

import { getProfessionalListByService } from '@controllers/professionals/getProfessionalListByService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'GET') getProfessionalListByService(req, res)
  else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
