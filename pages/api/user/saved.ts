import { NextApiRequest, NextApiResponse } from 'next'

import { savedProfessionalByUser } from '@controllers/user/savedProfessionalsByUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'GET') savedProfessionalByUser(req, res)
  else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
