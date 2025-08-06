// src/services/panelManutencao.repository.ts

import { FastifyInstance } from 'fastify';
import { Prisma } from '../../../../../generated/prisma';
import { FiltrosPainelInput } from './panelManutencaoInterfaces';


// This function builds the WHERE clause for Prisma
function buildWhereClause(filtros: FiltrosPainelInput): Prisma.ordem_servicoWhereInput {
  const where: Prisma.ordem_servicoWhereInput = {};

  if (filtros.secretaria?.length) {
    where.cliente = { unidade: { in: filtros.secretaria } };
  }

  if (filtros.tipoOs?.length) {
    where.tipo_os = { in: filtros.tipoOs };
  }

  if (filtros.dataInicio || filtros.dataFim) {
    where.data = {
      ...(filtros.dataInicio ? { gte: new Date(filtros.dataInicio) } : {}),
      ...(filtros.dataFim ? { lte: new Date(filtros.dataFim) } : {})
    };
  }
  return where;
}

// This function fetches the data from the database
export async function findOrdensServico(
  prisma: FastifyInstance[ 'prisma' ],
  filtros: FiltrosPainelInput
) {
  const where = buildWhereClause(filtros);
  return prisma.ordem_servico.findMany({
    where,
    include: { cliente: true, fornecedor: true, veiculo: true },
  });
}