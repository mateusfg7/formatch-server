import { NextApiRequest, NextApiResponse } from 'next'
import prismaClient from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req

  switch (method) {
    case 'GET':
      try {
        const star = await prismaClient.star.findUnique({
          where: {
            id: Number(query.id),
          },
        })
        res.status(201).json({ star })
      } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
