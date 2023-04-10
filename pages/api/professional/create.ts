import { NextApiRequest, NextApiResponse } from 'next'

import { createProfessional } from '@controllers/professionals/createProfessional'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("\n-------------- LOG #1 --------------\n")
  console.log(req)
  console.log("\n------------------------------------\n")
  
  const { method } = req

  if (method === 'POST') createProfessional(req, res)
  else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
