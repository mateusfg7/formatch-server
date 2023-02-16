import { prismaClient } from 'lib/prisma'

export async function listAdvertisers() {
  const advertisers = await prismaClient.adMeta.findMany()

  return advertisers
}
