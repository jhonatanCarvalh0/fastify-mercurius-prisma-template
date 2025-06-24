// src/graphql/index.ts

import mercurius from 'mercurius';
import { typeDefs } from './schema';
import { FastifyInstance } from 'fastify';
import { buildResolvers } from './resolvers';

/**
 * Integra o Mercurius (GraphQL) ao servidor Fastify.
 * Expondo playground em `/graphql`.
 */
export async function registerGraphQL(fastify: FastifyInstance) {
  await fastify.register(mercurius, {
    schema: typeDefs,
    resolvers: buildResolvers(fastify),
    graphiql: true, // acessível via navegador em /graphiql
  });
}
