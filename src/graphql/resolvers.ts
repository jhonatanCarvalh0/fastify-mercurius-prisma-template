// src/graphql/resolvers.ts

import { FastifyInstance } from 'fastify';

export function buildResolvers(fastify: FastifyInstance) {
  return {
    Query: {
      clients: async () => {
        return fastify.prisma.cliente.findMany({ orderBy: { id: 'asc' } });
      },
    },
    Mutation: {
      createClient: async (_: any, args: any) => {
        return fastify.prisma.cliente.create({
          data: args.data,
        });
      },
    },
  };
}
