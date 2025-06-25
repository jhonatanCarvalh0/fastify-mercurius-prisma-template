// src/graphql/resolvers/fornecedor.ts
import { FastifyInstance } from 'fastify';

import { getFornecedores, createFornecedor } from '../../modules/fornecedor/service';

export function fornecedorResolvers(fastify: FastifyInstance) {
  return {
    Query: {
      fornecedores: () => getFornecedores(fastify),
    },
    Mutation: {
      createFornecedor: (_: any, args: any) => createFornecedor(fastify, args.data),
    },
  };
}
