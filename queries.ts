// 1. Import the PrismaClient constructor and the withAccelerate extension.
// 2. Instantiate PrismaClient and add the Accelerate extension.
// 3. Define an async function named main to send queries to the database.
// 4. Call the main function.
// 5. Close the database connections when the script terminates.

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
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)

  // const post = await prisma.cliente.update({
  //   where: { id: 1 },
  //   data: { nome: 'nome_alterado' },
  // })
  // console.log(post)
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