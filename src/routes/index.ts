// src/routes/index.ts

import { FastifyInstance } from 'fastify';
import { clientsRoute } from '../modules/clients/route';

/**
 * Registra todas as rotas da aplicação com prefixos apropriados.
 */
export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(clientsRoute, { prefix: '/api/clients' });
}
