import { osTypeDefs } from './os.typeDefs'
import { osResolvers } from './os.resolver'
import { FastifyInstance } from 'fastify'

export const buildSchema = (app: FastifyInstance) => ({
  schema: `
    ${osTypeDefs}
  `,
  resolvers: osResolvers(app)
})
