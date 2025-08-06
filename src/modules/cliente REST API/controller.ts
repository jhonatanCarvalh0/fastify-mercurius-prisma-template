// modules/clients/controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { createClienteSchema } from './schema';
import { createCliente, getClientes } from './service';

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

export async function listClientesController(request: FastifyRequest, reply: FastifyReply) {
  const clientes = await getClientes(request.server);
  return reply.send(clientes);
}

/**
 * Controller para criar um novo cliente.
 */
export async function createClienteController(request: FastifyRequest, reply: FastifyReply) {
  // Valida o body manualmente com Zod (caso não use Fastify schema)
  const body = createClienteSchema.parse(request.body);

  const client = await createCliente(request.server, body);
  return reply.code(201).send(client);
}
