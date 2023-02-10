import { NextApiRequest, NextApiResponse } from 'next'

import { updateProfessional } from '@controllers/professionals/updateProfessional'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'PUT') updateProfessional(req, res)
  else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
