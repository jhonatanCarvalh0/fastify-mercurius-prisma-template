// modules/clients/controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { createClientSchema } from './schema';
import { createClient, getClients } from './service';

/**
 * Controller para listar todos os clientes.
 */

/**
 * Diretriz:
 * Recebe a request, valida, trata erros e chama o service
 * 
 * Quando Editar:
 * Quando mudar o comportamento da rota (ex: resposta)
 */

export async function listClientsController(request: FastifyRequest, reply: FastifyReply) {
  const clients = await getClients(request.server);
  return reply.send(clients);
}

/**
 * Controller para criar um novo cliente.
 */
export async function createClientController(request: FastifyRequest, reply: FastifyReply) {
  // Valida o body manualmente com Zod (caso não use Fastify schema)
  const body = createClientSchema.parse(request.body);

  const client = await createClient(request.server, body);
  return reply.code(201).send(client);
}
