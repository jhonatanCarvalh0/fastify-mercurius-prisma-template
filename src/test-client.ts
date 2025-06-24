import { PrismaClient } from '../generated/prisma/client';


const prisma = new PrismaClient();

async function main() {
  const clientes = await prisma.cliente.findMany();
  console.log("All clients:", clientes);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });