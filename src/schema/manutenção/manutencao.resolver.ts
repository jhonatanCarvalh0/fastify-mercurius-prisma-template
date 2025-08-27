// manutencao.resolver.ts - Manutenção
import { ManutencaoService } from './manutencao.service';
import { ManutencaoFilters } from './utils/types';

const manutencaoService = new ManutencaoService();

export const manutencaoResolvers = () => ({
  Query: {
    // Lista de dados completa
    getManutencao: () => {
      const data = manutencaoService.getManutencao();

      return data;
    },

    // Tabela com filtros, paginação e ordenação
    getManutencaoTable: () => {
      const data = manutencaoService.getManutencaoTable();

      return data;
    },

    // Contagem total de registros da tabela
    TableCount: () => {
      const data = manutencaoService.getManutencaoTable();
      return data.length;
    },

    // KPIs
    ManutencaoKpis: (filters?: ManutencaoFilters) => {
      return manutencaoService.ManutencaoKpis(filters);
    },

    // Gráficos
    ManutencaoCharts: (filters?: ManutencaoFilters) => {
      return manutencaoService.getManutencaoCharts(filters)
    },

    //Filtros
    FilterOptions: () => {
      return manutencaoService.getFilterOptions()
    },
  }
})
