// src/routes/index.ts

import { FastifyInstance } from 'fastify';
import { clientsRoute } from '../modules/cliente/route';

/**
 * Diretriz:
 * Registra todas as rotas da aplicação, organizando por domínio e adicionando prefixos.
 * 
 * Objetivo:
 * Centralizar o registro de rotas para manter o app modular, limpo e escalável.
 * Cada domínio (ex: clients, users, products) define suas rotas separadamente
 * e é importado aqui com um prefixo RESTful (ex: /api/clients).
 * 
 * Quando Editar:
 * - Quando adicionar um novo módulo com rotas (ex: `usersRoute`)
 * - Quando mudar prefixos de rotas da API (ex: de `/api/clients` para `/v1/clients`)
 * - Quando reorganizar rotas por domínio ou versão
 */

export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(clientsRoute, { prefix: '/api/clients' });
  // await fastify.register(fornecedorRoute, { prefix: '/api/fornecedor' });
}
