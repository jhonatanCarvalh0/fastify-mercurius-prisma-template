import Fastify from 'fastify'
import { PrismaClient } from '../generated/prisma'

// Initialize Fastify and Prisma client
const prisma = new PrismaClient()
const fastify = Fastify({
  logger: false
})

// Basic route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Route fetch clients - Get ALL
fastify.get('/clients', async (req, res) => {
  const clientes = await prisma.cliente.findMany()
  return clientes
})

// Shutdown hook
fastify.addHook('onClose', async () => {
  await prisma.$disconnect()
})

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log(`Server running at http://localhost:3000`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()