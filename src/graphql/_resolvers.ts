// src/graphql/resolvers/index.ts

import { FastifyInstance } from 'fastify';

import { clienteResolvers } from './resolvers/general/cliente/clienteResolver';
import { fornecedorResolvers } from './resolvers/general/fornecedor/fornecedorResolver';
import { painelManutencaoResolver } from './resolvers/panels/manutencao/_panelManutencaoResolver';

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
