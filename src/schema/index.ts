import { userTypeDefs } from './user.typeDefs'
import { userResolvers } from './user.resolver'
import { FastifyInstance } from 'fastify'

export const buildSchema = (app: FastifyInstance) => ({
  schema: `
    ${userTypeDefs}
  `,
  resolvers: userResolvers(app)
})
