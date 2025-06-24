// src/plugins/index.ts

import { FastifyInstance } from 'fastify';
import sensible from '@fastify/sensible'
import prismaPlugin from './prisma';

/**
 * Registra todos os plugins necessários no Fastify.
 * Inclui plugins de terceiros e personalizados.
 */
export async function registerPlugins(fastify: FastifyInstance) {
  // 🔌 Plugin: Prisma como decorador
  await fastify.register(prismaPlugin);
  // 🔌 Plugin: Fastify Sensible (utilitários de erro e outros helpers)
  await fastify.register(sensible);
}
