// src/graphql/resolvers/painelManutencaoResolver.ts

import { FastifyInstance } from 'fastify';
import { Prisma } from '../../../generated/prisma';

interface FiltrosPainelInput {
  secretaria?: string[];
  tipoOs?: string[];
  dataInicio?: string;
  dataFim?: string;
}

interface ItemResumo {
  nome: string;
  total: number;
}

interface ItemSerieTempo {
  periodo: string;
  total: number;
}

interface DispersaoPonto {
  kmHorimetro: number;
  custo: number;
}

interface FrequenciaHora {
  diaSemana: string;
  hora: number;
  quantidade: number;
}

interface OrdemSemNota {
  id: number;
  cliente: string;
  data: string;
  motivo: string;
}

interface DadosPainelManutencao {
  title: string
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

type OrdemServicoComRelacoes = Prisma.ordem_servicoGetPayload<{
  include: {
    cliente: true;
    fornecedor: true;
    veiculo: true;
  };
}>;

export function painelManutencaoResolver(fastify: FastifyInstance) {
  return {
    Query: {
      obterDadosPainelManutencao: async (
        _: unknown,
        { filtros }: { filtros?: FiltrosPainelInput }
      ): Promise<DadosPainelManutencao> => {
        const title = 'Painel de Manutenção';

        // Construção da cláusula WHERE com base nos filtros
        const where = buildWhereClause(filtros || {});

        const ordens = await fastify.prisma.ordem_servico.findMany({
          where,
          include: { cliente: true, fornecedor: true, veiculo: true }
        });

        // Cálculos básicos
        const totalOS = ordens.length;
        const totalVeiculosDistintos = new Set(
          ordens.map(os => os.veiculo_id).filter(Boolean)
        ).size;

        const valores = ordens.reduce((acc, os) => {
          const pecas = os.pecas_com_desc?.toNumber() || 0;
          const mdo = os.mdo_com_desc?.toNumber() || 0;
          const totalSemDesc = os.total_sem_desc?.toNumber() || 0;
          const totalComDesc = os.total?.toNumber() || 0;

          return {
            totalPecas: acc.totalPecas + pecas,
            totalMaoDeObra: acc.totalMaoDeObra + mdo,
            totalBruto: acc.totalBruto + totalSemDesc,
            totalComDesconto: acc.totalComDesconto + totalComDesc
          };
        }, {
          totalPecas: 0,
          totalMaoDeObra: 0,
          totalBruto: 0,
          totalComDesconto: 0
        });

        const totalGeral = valores.totalPecas + valores.totalMaoDeObra;
        const valorTotal = valores.totalComDesconto;
        const custoMedio = totalOS > 0 ? valorTotal / totalOS : 0;
        const percentualComDesconto = valores.totalBruto > 0
          ? (((1 - (valores.totalComDesconto / valores.totalBruto)) * 100).toFixed(2)).toString()
          : '0';

        // Agregações
        const porTipoOS = aggregateBy(os => os.tipo_os ?? 'Outros', ordens);
        const porSecretaria = aggregateBy(os => os.cliente?.unidade ?? 'Sem Info', ordens);
        const porOficina = aggregateBy(os => os.fornecedor?.nome ?? 'Sem Info', ordens);
        const porModelo = aggregateBy(os => os.veiculo?.modelo ?? 'Sem Info', ordens);

        const linhaDoTempo = aggregateTimeSeries(ordens);
        const dispersaoKmCusto = buildDispersao(ordens);
        const frequenciaDiaHora = buildFrequencia(ordens);
        const osSemNotaFiscal = getOSSemNota(ordens);

        return {
          title,
          totalOS,
          totalVeiculosDistintos,
          valorTotal: round(valorTotal),
          custoMedio: round(custoMedio),
          totalPecas: round(valores.totalPecas),
          totalMaoDeObra: round(valores.totalMaoDeObra),
          totalGeral: round(totalGeral),
          porTipoOS,
          porSecretaria,
          porOficina,
          porModelo,
          linhaDoTempo,
          dispersaoKmCusto,
          frequenciaDiaHora,
          totalBruto: round(valores.totalBruto),
          totalComDesconto: round(valores.totalComDesconto),
          percentualComDesconto: parseFloat(percentualComDesconto),
          osSemNotaFiscal
        };
      }
    }
  };
}

// Funções auxiliares melhoradas
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

function round(n: number, decimals = 2): number {
  return parseFloat(n.toFixed(decimals));
}

function aggregateBy(
  getKey: (os: OrdemServicoComRelacoes) => string,
  ordens: OrdemServicoComRelacoes[]
): ItemResumo[] {
  const aggregated = new Map<string, number>();

  ordens.forEach(os => {
    const key = getKey(os);
    const total = (os.pecas_com_desc?.toNumber() || 0) + (os.mdo_com_desc?.toNumber() || 0);
    aggregated.set(key, (aggregated.get(key) || 0) + total);
  });

  return Array.from(aggregated.entries())
    .map(([ nome, total ]) => ({ nome, total: round(total) }))
    .sort((a, b) => b.total - a.total);
}

function aggregateTimeSeries(ordens: OrdemServicoComRelacoes[]): ItemSerieTempo[] {
  const series = new Map<string, number>();

  ordens.forEach(os => {
    if (!os.data) return;

    const date = new Date(os.data);
    const month = date.getMonth() + 1;
    const key = `${date.getFullYear()}-${month.toString().padStart(2, '0')}`;
    const total = os.total?.toNumber() || 0;

    series.set(key, (series.get(key) || 0) + total);
  });

  return Array.from(series.entries())
    .map(([ periodo, total ]) => ({ periodo, total: round(total) }))
    .sort((a, b) => a.periodo.localeCompare(b.periodo));
}

function buildDispersao(ordens: OrdemServicoComRelacoes[]): DispersaoPonto[] {
  return ordens
    .filter(os => os.veiculo?.km_horimetro != null && os.total != null)
    .map(os => ({
      kmHorimetro: Number(os.veiculo!.km_horimetro),
      custo: round(os.total!.toNumber())
    }));
}

function buildFrequencia(ordens: OrdemServicoComRelacoes[]): FrequenciaHora[] {
  const frequencyMap = new Map<string, number>();
  const days = [ 'domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado' ];

  ordens.forEach(os => {
    if (!os.data) return;

    const date = new Date(os.data);
    const diaSemana = days[ date.getDay() ];
    const hora = date.getHours();
    const key = `${diaSemana}|${hora}`;

    frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1);
  });

  return Array.from(frequencyMap.entries())
    .map(([ key, quantidade ]) => {
      const [ diaSemana, hora ] = key.split('|');
      return { diaSemana, hora: parseInt(hora), quantidade };
    });
}

function getOSSemNota(ordens: OrdemServicoComRelacoes[]): OrdemSemNota[] {
  return ordens
    .filter(os => !os.nf_pecas || !os.nf_mdo)
    .map(os => {
      let motivo = '';
      if (!os.nf_pecas && !os.nf_mdo) motivo = 'Peça e MDO sem nota';
      else if (!os.nf_pecas) motivo = 'Peça sem nota';
      else if (!os.nf_mdo) motivo = 'MDO sem nota';

      return {
        id: os.id,
        cliente: os.cliente?.nome ?? 'Sem cliente',
        data: os.data.toISOString().split('T')[ 0 ],
        motivo
      };
    });
}