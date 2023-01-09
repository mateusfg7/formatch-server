import { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromCookies } from '../../lib/getUserFromCookies'

export async function authUser(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromCookies(req)

  return res.status(200).json(user)
}
