import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Mateus Felipe',
      email: 'mateusfelipefg77@gmail.com',
      avatar_url: 'https://github.com/mateusfg7.png',
      google_id: '434136468',
      subscribe: true,
    },
  })

  console.log(user)
}

main()
