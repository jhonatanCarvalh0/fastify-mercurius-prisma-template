// src/graphql/resolvers/cliente.ts

import { FastifyInstance } from 'fastify';

export function clienteResolvers(fastify: FastifyInstance) {
  return {
    Query: {
      clientes: async () => {
        return fastify.prisma.cliente.findMany({ orderBy: { id: 'asc' } });
      },
    },
    Mutation: {
      createCliente: async (_: any, args: any) => {
        return fastify.prisma.cliente.create({
          data: args.data,
        });
      },
    },
  };
}
