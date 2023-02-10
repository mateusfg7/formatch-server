import { NextApiRequest, NextApiResponse } from 'next'

import { saveProfessional } from '@controllers/professionals/saveProfessional'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'POST') saveProfessional(req, res)
  else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
