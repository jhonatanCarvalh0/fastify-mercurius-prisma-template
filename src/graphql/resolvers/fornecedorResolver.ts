// src/graphql/resolvers/fornecedor.ts
import { FastifyInstance } from 'fastify';

import { getFornecedores, createFornecedor } from '../../modules/fornecedor/service';

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
