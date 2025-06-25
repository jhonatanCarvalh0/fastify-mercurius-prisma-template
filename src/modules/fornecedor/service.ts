// src/modules/fornecedor/service.ts
import { FastifyInstance } from 'fastify';

export async function getFornecedores(fastify: FastifyInstance) {
  return fastify.prisma.fornecedor.findMany({
    orderBy: { id: 'asc' },
  });
}

export async function createFornecedor(
  fastify: FastifyInstance,
  data: {
    nome: string;
    cidade?: string;
    uf?: string;
    cnpj?: string;
  }
) {
  return fastify.prisma.fornecedor.create({ data });
