// src/plugins/prisma.ts

import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '../../generated/prisma';

// Estende o tipo do Fastify para incluir `.prisma`
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

/**
 * Plugin do Fastify que adiciona o Prisma Client como decorador `fastify.prisma`.
 */
const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const prisma = new PrismaClient();

  await prisma.$connect()

  // Torna prisma acessível via fastify.prisma
  fastify.decorate('prisma', prisma);

  // Desconecta Prisma quando o servidor for encerrado
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});


export default prismaPlugin