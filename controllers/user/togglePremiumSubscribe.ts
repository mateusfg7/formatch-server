import { getUserFromHeader } from '@lib/getUserFromHeader'
import { NextApiRequest, NextApiResponse } from 'next'
import { prismaClient } from '@lib/prisma'

export async function togglePremiumSubscribe(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = getUserFromHeader(req)

  let userSubscription: { subscribe: boolean } | null

  try {
    userSubscription = await prismaClient.user.findUnique({
      where: {
        email,
      },
      select: {
        subscribe: true,
      },
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error.' })
  }

  if (!userSubscription)
    return res.status(404).json({ message: 'User not found.' })

  const updatedUserSubscription = await prismaClient.user.update({
    where: {
      email,
    },
    data: {
      subscribe: !userSubscription.subscribe,
    },
  })

  return res.status(200).json({
    message: `Premium subscribe ${
      updatedUserSubscription.subscribe ? 'activated' : 'disabled'
    }`,
    subscribe: updatedUserSubscription.subscribe,
  })
}
