import Fastify from 'fastify'
import { join } from 'path'

// Initialize Fastify
const fastify = Fastify({
  logger: true
})

// Basic route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
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