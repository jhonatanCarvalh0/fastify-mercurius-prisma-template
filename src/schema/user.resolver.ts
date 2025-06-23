import { FastifyInstance } from 'fastify'

export const userResolvers = (app: FastifyInstance) => ({
  Query: {
    users: async () => app.prisma.user.findMany()
  },
  Mutation: {
    createUser: async (_: any, { name, email }: any) =>
      app.prisma.user.create({ data: { name, email } })
  }
})