import { NextApiRequest, NextApiResponse } from 'next'

import { prismaClient } from '@lib/prisma'

export async function listFeedback(req: NextApiRequest, res: NextApiResponse) {
  return await prismaClient.feedback
    .findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    .then((feedbacks) => res.status(200).json(feedbacks))
    .catch((error) => {
      console.log(error)
      res.status(500).end()
    })
}
