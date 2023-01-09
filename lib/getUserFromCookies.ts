import { NextApiRequest } from 'next'
import { z } from 'zod'

export function getUserFromCookies(request: NextApiRequest) {
  const { cookies } = request

  let { user } = cookies

  if (!user) throw Error('Cannot get user.')

  user = JSON.parse(user)

  const userScheme = z.object({
    name: z.string(),
    email: z.string().email(),
    avatar_url: z.string().url(),
    subscribe: z.boolean(),
  })

  const parsedUser = userScheme.safeParse(user)

  if (!parsedUser.success) throw Error('Cannot parse user.')

  return parsedUser.data
}
