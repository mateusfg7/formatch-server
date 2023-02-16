import { NextApiRequest, NextApiResponse } from 'next'

import { listAdvertisers } from 'use-case/advertisers/listAdvertisers'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method === 'GET') {
    try {
      const advertisers = await listAdvertisers()

      return res.status(200).json(advertisers)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
