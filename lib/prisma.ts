import { PrismaClient } from '@prisma/client'

declare global {
  var prismaClient: PrismaClient | undefined // This must be a `var` and not a `let / const`
}

const prismaClient =
  global.prismaClient ||
  new PrismaClient({
    log: ['query', 'error'],
  })

if (process.env.NODE_ENV === 'development') global.prismaClient = prismaClient

export { prismaClient }
