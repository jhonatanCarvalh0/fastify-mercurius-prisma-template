// modules/clients/route.ts
import { FastifyInstance } from 'fastify';
import { createClientController, listClientsController } from './controller';

/**
 * Rotas relacionadas ao domínio "Clientes"
 */

/**
 * Diretriz:
 * Define os endpoints da API e direciona pro controller correspondente.
 * 
 * Quando Editar:
 * Quando adicionar/renomear/remover rotas
 */

export async function clientsRoute(fastify: FastifyInstance) {
  // 🔹 GET /api/clients - Lista clientes
  fastify.get('/', listClientsController);

  // 🔹 POST /api/clients - Cria cliente
  fastify.post('/', createClientController);
}
