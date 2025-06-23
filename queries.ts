// 1
import { PrismaClient } from './generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

// 2
const prisma = new PrismaClient()
  .$extends(withAccelerate())


// https://console.prisma.io/cmc9g5lgc02lh080utgqkaijp/cmc9g6nhf032b540wagyysswy/cmc9g6nhf032c540wenfxn1t6/dashboard
// 3
async function main() {
  // ... you will write your Prisma Client queries here
  const post = await prisma.cliente.update({
    where: { id: 1 },
    data: { nome: 'nome_alterado' },
  })
  console.log(post)
}

// 4
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    // 5
    await prisma.$disconnect()
    process.exit(1)
  })