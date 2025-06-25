// src/graphql/index.ts

import { FastifyInstance } from 'fastify';
import mercurius from 'mercurius';
import { buildResolvers } from './_resolvers';
import { typeDefs } from './schema';

/**
 * Integra o Mercurius (GraphQL) ao servidor Fastify.
 * Expondo playground em `/graphql`.
 */
export async function registerGraphQL(fastify: FastifyInstance) {
  await fastify.register(mercurius, {
    schema: typeDefs,
    resolvers: buildResolvers(fastify),
    graphiql: true, // 👈 importante para funcionar via navegador
    path: '/graphql', // 👈 esse é o endpoint
  });
}
