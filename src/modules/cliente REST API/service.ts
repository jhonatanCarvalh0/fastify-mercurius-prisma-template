// modules/clients/service.ts
import { FastifyInstance } from 'fastify';
import { CreateClienteInput } from './schema';

/**
 * Lista todos os clientes no banco de dados.
 */

/**
 * Diretriz:
 * Regras de negócio, acesso ao banco com Prisma
 * 
 * Quando Editar:
 * Quando mudar o que acontece no banco (ex: filtros, joins)
 */

export async function getClientes(fastify: FastifyInstance) {
  return fastify.prisma.cliente.findMany({
    orderBy: { id: 'asc' },
  });
}

/**
 * Cria um novo cliente com os dados validados.
 */
export async function createCliente(fastify: FastifyInstance, data: CreateClienteInput) {
  return fastify.prisma.cliente.create({
    data,
  });
}
