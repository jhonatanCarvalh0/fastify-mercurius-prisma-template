import Fastify from 'fastify'
import mercurius from 'mercurius'
import prismaPlugin from './plugins/prisma'
import { buildSchema } from './schema'

export async function buildServer() {
  const app = Fastify()

  await app.register(prismaPlugin)

  const { schema, resolvers } = buildSchema(app)

  app.register(mercurius, {
    schema,
    resolvers,
    graphiql: true
  })

  return app
}

