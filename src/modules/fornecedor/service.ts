// modules/fornecedor/service.ts
import { FastifyInstance } from 'fastify';
import { CreateFornecedorInput } from './schema';

/**
 * Lista todos os fornecedores no banco de dados.
 */

/**
 * Diretriz:
 * Regras de negócio, acesso ao banco com Prisma
 * 
 * Quando Editar:
 * Quando mudar o que acontece no banco (ex: filtros, joins)
 */

export async function getFornecedores(fastify: FastifyInstance) {
  return fastify.prisma.fornecedor.findMany({
    orderBy: { id: 'asc' },
  });
}

/**
 * Cria um novo fornecedor com os dados validados.
 */
export async function createFornecedor(fastify: FastifyInstance, data: CreateFornecedorInput) {
  return fastify.prisma.fornecedor.create({
    data,
  });
}
