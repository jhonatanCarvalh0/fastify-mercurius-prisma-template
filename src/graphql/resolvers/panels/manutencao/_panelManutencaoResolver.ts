// src/graphql/resolvers/panelManutencaoResolver.ts

import { FastifyInstance } from 'fastify';
import { DadosPainelManutencao, FiltrosPainelInput } from './panelManutencaoInterfaces';
import { findOrdensServico } from './panelManutencaoRepository';
import { processarDadosPainel } from './panelManutencaoService';



export function painelManutencaoResolver(fastify: FastifyInstance) {
  return {
    Query: {
      obterDadosPainelManutencao: async (
        _: unknown,
        { filtros }: { filtros?: FiltrosPainelInput }
      ): Promise<DadosPainelManutencao> => {
        // 1. Fetch raw data using the repository
        const ordens = await findOrdensServico(fastify.prisma, filtros || {});

        // 2. Process the raw data using the service
        const dadosProcessados = processarDadosPainel(ordens);

        // 3. Assemble and return the final GraphQL response
        return {
          title: 'Painel de Manutenção',
          ...dadosProcessados,
        };
      },
    },
  };
}