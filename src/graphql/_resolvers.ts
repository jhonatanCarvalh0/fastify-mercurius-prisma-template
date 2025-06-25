// src/graphql/resolvers/index.ts

import { FastifyInstance } from 'fastify';

import { clienteResolvers } from './resolvers/clienteResolver';
import { fornecedorResolvers } from './resolvers/fornecedorResolver';
import { painelManutencaoResolver } from './resolvers/painelManutencaoResolver';

export function buildResolvers(fastify: FastifyInstance) {
  return {
    Query: {
      ...clienteResolvers(fastify).Query,
      ...fornecedorResolvers(fastify).Query,
      ...painelManutencaoResolver(fastify).Query,
    },
    Mutation: {
      ...clienteResolvers(fastify).Mutation,
      ...fornecedorResolvers(fastify).Mutation,
      // ...painelManutencaoResolver(fastify).Mutation,
    },
  };
}
