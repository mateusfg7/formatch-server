import { NextApiRequest, NextApiResponse } from 'next'

import { getUserFromHeader } from '@lib/getUserFromHeader'

export async function authUser(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromHeader(req)

  return res.status(200).json(user)
}
