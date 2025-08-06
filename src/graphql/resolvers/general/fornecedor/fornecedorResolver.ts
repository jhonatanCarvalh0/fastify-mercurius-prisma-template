// src/graphql/resolvers/fornecedor.ts
import { FastifyInstance } from 'fastify';

import { createFornecedor, getFornecedores } from './fornecedorService';

export function fornecedorResolvers(fastify: FastifyInstance) {
  return {
    Query: {
      fornecedores: async () => getFornecedores(fastify),
    },
    Mutation: {
      createFornecedor: async (_: any, args: any) => createFornecedor(fastify, args.data),
    },
  };
}
