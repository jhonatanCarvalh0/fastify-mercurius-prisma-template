// src/graphql/types/painelManutencao.types.ts
// This file defines the types used in the painelManutencao GraphQL resolver

import { Prisma } from '../../../../../generated/prisma';

// Input type for GraphQL filters
export interface FiltrosPainelInput {
  secretaria?: string[];
  tipoOs?: string[];
  dataInicio?: string;
  dataFim?: string;
}

// Data Transfer Objects (DTOs) for the final response
export interface ItemResumo {
  nome: string;
  total: number;
}

export interface ItemSerieTempo {
  periodo: string;
  total: number;
}

export interface DispersaoPonto {
  kmHorimetro: number;
  custo: number;
}

export interface FrequenciaHora {
  diaSemana: string;
  hora: number;
  quantidade: number;
}

export interface OrdemSemNota {
  id: number;
  cliente: string;
  data: string;
  motivo: string;
}

// The main dashboard data structure
export interface DadosPainelManutencao {
  title: string;
  totalOS: number;
  totalVeiculosDistintos: number;
  valorTotal: number;
  custoMedio: number;
  totalPecas: number;
  totalMaoDeObra: number;
  totalGeral: number;
  porTipoOS: ItemResumo[];
  porSecretaria: ItemResumo[];
  porOficina: ItemResumo[];
  porModelo: ItemResumo[];
  linhaDoTempo: ItemSerieTempo[];
  dispersaoKmCusto: DispersaoPonto[];
  frequenciaDiaHora: FrequenciaHora[];
  totalBruto: number;
  totalComDesconto: number;
  percentualComDesconto: number;
  osSemNotaFiscal: OrdemSemNota[];
}

// Type for the data coming from Prisma
export type OrdemServicoComRelacoes = Prisma.ordem_servicoGetPayload<{
  include: {
    cliente: true;
    fornecedor: true;
    veiculo: true;
  };
}>;