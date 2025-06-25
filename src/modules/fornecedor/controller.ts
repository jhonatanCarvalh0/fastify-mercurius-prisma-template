// modules/clients/controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { createFornecedorSchema } from './schema';
import { createFornecedor, getFornecedores } from './service';

/**
 * Controller para listar todos os fornecedores.
 */

/**
 * Diretriz:
 * Recebe a request, valida, trata erros e chama o service
 * 
 * Quando Editar:
 * Quando mudar o comportamento da rota (ex: resposta)
 */

export async function listFornecedoresController(request: FastifyRequest, reply: FastifyReply) {
  const fornecedores = await getFornecedores(request.server);
  return reply.send(fornecedores);
}

/**
 * Controller para criar um novo fornecedor.
 */
export async function createFornecedorController(request: FastifyRequest, reply: FastifyReply) {
  // Valida o body manualmente com Zod (caso não use Fastify schema)
  const body = createFornecedorSchema.parse(request.body);

  const fornecedor = await createFornecedor(request.server, body);
  return reply.code(201).send(fornecedor);
}
