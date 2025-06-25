// src/graphql/resolvers/painel_manutencao.ts
import { FastifyInstance } from 'fastify';
import { Prisma } from '../../../generated/prisma';

// Tipos para os dados do painel
type ResumoFinanceiro = {
  totalPecas: number;
  totalMaoDeObra: number;
  totalGeral: number;
  dataAtualizacao: string;
};

type ItemAgregado = {
  nome: string;
  valorTotal: number;
  porcentagem?: number;
};

type DadosGrafico = {
  categorias: string[];
  valores: number[];
  porcentagens?: number[];
};

type FiltrosAplicados = {
  tipoOS: string[];
  periodo: string;
};

type DadosPainelManutencao = {
  titulo: string;
  resumo: ResumoFinanceiro;
  secretarias: ItemAgregado[];
  oficinas: ItemAgregado[];
  modelos: ItemAgregado[];
  graficoBarras: DadosGrafico;
  graficoPizza: DadosGrafico;
  filtrosAplicados: FiltrosAplicados;
};

// Tipo para os filtros de entrada
type FiltrosPainelInput = {
  secretaria?: string;
  mes?: string;
  dataInicio?: string;
  dataFim?: string;
  marca?: string;
  oficina?: string;
  cidade?: string;
  modelo?: string;
  tipoOS?: string;
};

// Tipo para a Ordem de Serviço com relações
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
        // 1. Aplicar filtros às ordens de serviço
        const whereClause = buildWhereClause(filtros || {});

        // 2. Obter todas as OS com os filtros aplicados
        const ordensServico = await fastify.prisma.ordem_servico.findMany({
          where: whereClause,
          include: {
            cliente: true,
            fornecedor: true,
            veiculo: true
          }
        });

        // 3. Calcular totais
        const { totalPecas, totalMaoDeObra } = calculateTotals(ordensServico);
        const totalGeral = totalPecas + totalMaoDeObra;

        // 4. Agregar dados por secretaria, oficina e modelo
        const secretarias = aggregateBy(ordensServico, 'cliente.unidade');
        const oficinas = aggregateBy(ordensServico, 'fornecedor.nome');
        const modelos = aggregateBy(ordensServico, 'veiculo.modelo');

        // 5. Preparar dados para gráficos
        const graficoBarras = prepareBarChartData(secretarias, totalGeral);
        const graficoPizza = preparePieChartData(ordensServico, totalGeral);

        // 6. Retornar estrutura completa do painel
        return {
          titulo: 'PAINEL DE CONTROLE DE MANUTENÇÃO DE VEÍCULO',
          resumo: {
            totalPecas,
            totalMaoDeObra,
            totalGeral,
            dataAtualizacao: new Date().toLocaleDateString('pt-BR')
          },
          secretarias: calculatePercentages(secretarias, totalGeral),
          oficinas: calculatePercentages(oficinas, totalGeral),
          modelos: calculatePercentages(modelos, totalGeral),
          graficoBarras,
          graficoPizza,
          filtrosAplicados: {
            tipoOS: filtros?.tipoOS ? [ filtros.tipoOS ] : [],
            periodo: filtros?.mes || 'Todos os períodos'
          }
        };
      }
    }
  };
}

// Funções auxiliares com tipagem
function buildWhereClause(filtros: FiltrosPainelInput): Prisma.ordem_servicoWhereInput {
  const where: Prisma.ordem_servicoWhereInput = {};

  if (filtros.secretaria) {
    where.cliente = { unidade: filtros.secretaria };
  }

  if (filtros.mes) {
    const [ year, month ] = filtros.mes.split('-');
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (!isNaN(yearNum)) {
      where.data = {
        gte: new Date(yearNum, monthNum ? monthNum - 1 : 0, 1),
        lt: new Date(yearNum, monthNum ? monthNum : 12, 1)
      };
    }
  }

  if (filtros.dataInicio && filtros.dataFim) {
    const startDate = new Date(filtros.dataInicio);
    const endDate = new Date(filtros.dataFim);

    if (!isNaN(startDate.getTime())) {
      where.data = {
        gte: startDate,
        lte: isNaN(endDate.getTime()) ? startDate : endDate
      };
    }
  }

  if (filtros.oficina) {
    where.fornecedor = { nome: filtros.oficina };
  }

  if (filtros.modelo) {
    where.veiculo = { modelo: filtros.modelo };
  }

  if (filtros.tipoOS) {
    where.tipo_os = filtros.tipoOS;
  }

  return where;
}

function calculateTotals(ordensServico: OrdemServicoComRelacoes[]): { totalPecas: number; totalMaoDeObra: number } {
  return ordensServico.reduce(
    (totals, os) => ({
      totalPecas: totals.totalPecas + (os.pecas_com_desc?.toNumber() || 0),
      totalMaoDeObra: totals.totalMaoDeObra + (os.mdo_com_desc?.toNumber() || 0)
    }),
    { totalPecas: 0, totalMaoDeObra: 0 }
  );
}

function aggregateBy(ordensServico: OrdemServicoComRelacoes[], propertyPath: string): ItemAgregado[] {
  const result: Record<string, number> = {};

  for (const os of ordensServico) {
    const value = getPropertyByPath(os, propertyPath) || 'Sem informação';
    const total = (os.pecas_com_desc?.toNumber() || 0) + (os.mdo_com_desc?.toNumber() || 0);

    result[ value ] = (result[ value ] || 0) + total;
  }

  return Object.entries(result)
    .map(([ nome, valorTotal ]) => ({ nome, valorTotal }))
    .sort((a, b) => b.valorTotal - a.valorTotal);
}

function getPropertyByPath(obj: any, path: string): string | null {
  return path.split('.').reduce((o: any, p: string) => o?.[ p ], obj) as string | null;
}

function calculatePercentages(items: ItemAgregado[], total: number): ItemAgregado[] {
  return items.map(item => ({
    ...item,
    porcentagem: total > 0 ? parseFloat(((item.valorTotal / total) * 100).toFixed(2)) : 0
  }));
}

function prepareBarChartData(secretarias: ItemAgregado[], totalGeral: number): DadosGrafico {
  return {
    categorias: secretarias.map(s => s.nome),
    valores: secretarias.map(s => s.valorTotal),
    porcentagens: secretarias.map(s => parseFloat(((s.valorTotal / totalGeral) * 100).toFixed(2)))
  };
}

function preparePieChartData(ordensServico: OrdemServicoComRelacoes[], totalGeral: number): DadosGrafico {
  const tiposOS = ordensServico.reduce((acc, os) => {
    const tipo = os.tipo_os || 'Outros';
    const total = (os.pecas_com_desc?.toNumber() || 0) + (os.mdo_com_desc?.toNumber() || 0);
    acc[ tipo ] = (acc[ tipo ] || 0) + total;
    return acc;
  }, {} as Record<string, number>);

  const entries = Object.entries(tiposOS).sort((a, b) => b[ 1 ] - a[ 1 ]);

  return {
    categorias: entries.map(([ tipo ]) => tipo),
    valores: entries.map(([ _, valor ]) => valor),
    porcentagens: entries.map(([ _, valor ]) => parseFloat(((valor / totalGeral) * 100).toFixed(2)))
  };
}