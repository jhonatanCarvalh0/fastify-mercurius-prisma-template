import { AbastecimentoService } from './abastecimento.service';
import { AbastecimentoFilters } from './utils/types';

const abastecimentoService = new AbastecimentoService();

const abastecimentoResolvers = () => ({
  Query: {
    // lista com paginação
    abastecimentos: (
      _: unknown,
      { limit, offset, sortBy, sortDirection, filters }: any
    ) => {
      let data = abastecimentoService.getAbastecimentos(filters);

      // ordenação simples (se precisar algo mais complexo, mover pro service)
      if (sortBy) {
        data = [ ...data ].sort((a, b) => {
          const av = (a as Record<string, any>)[ sortBy ];
          const bv = (b as Record<string, any>)[ sortBy ];
          if (av < bv) return sortDirection === "DESC" ? 1 : -1;
          if (av > bv) return sortDirection === "DESC" ? -1 : 1;
          return 0;
        });
      }

      // paginação
      if (typeof offset === "number" && typeof limit === "number") {
        data = data.slice(offset, offset + limit);
      }

      return data;
    },

    // total de registros
    abastecimentosCount: (_: unknown, { filters }: { filters?: AbastecimentoFilters }) => {
      const filtered = abastecimentoService.getAbastecimentos(filters);
      return filtered.length;
    },

    // KPIs - adaptando nome e campos para o front
    abastecimentoKpis: (_: unknown, { filters }: { filters?: AbastecimentoFilters }) => {
      const { totalGasto, totalLitros, totalAbastecimentos } = abastecimentoService.getKpis(filters);
      return {
        totalCost: totalGasto,
        dailyAverageCost: totalGasto / (totalAbastecimentos || 1),
        suppliesCount: totalAbastecimentos,
        lastUpdate: new Date()
      };
    },

    // opções de filtro - separando em vehicleOptions e statusOptions
    vehicleOptions: () => {
      const placas = abastecimentoService.getFilterOptions().placa;
      return placas.map(p => ({ value: p, label: p }));
    },
    statusOptions: () => {
      // Se status não estiver no service, pega do processedData
      const statusList = Array.from(new Set(
        (abastecimentoService as any).processedData.map((item: any) => item.status).filter(Boolean)
      )).sort();
      return statusList.map(s => ({ value: s, label: s }));
    },

    // gráficos
    costByVehicle: (_: unknown, { filters }: { filters?: AbastecimentoFilters }) => {
      const data = abastecimentoService.getAbastecimentos(filters);
      const totals = data.reduce<Record<string, number>>((acc, item) => {
        const vehicle = item.vehicle?.plate || "N/A";
        acc[ vehicle ] = (acc[ vehicle ] || 0) + (item.cost || 0);
        return acc;
      }, {});
      return Object.entries(totals).map(([ vehicle, total ]) => ({ vehicle, total }));
    },

    costByStatus: (_: unknown, { filters }: { filters?: AbastecimentoFilters }) => {
      const data = abastecimentoService.getAbastecimentos(filters);
      const totals = data.reduce<Record<string, number>>((acc, item) => {
        const status = item.status || "N/A";
        acc[ status ] = (acc[ status ] || 0) + (item.cost || 0);
        return acc;
      }, {});
      return Object.entries(totals).map(([ status, total ]) => ({ status, total }));
    },

    abastecimentosColumns: () => {
      return [
        { headerLabel: "Data", accessor: "datetime", isSortable: true, dataType: "date" },
        { headerLabel: "Custo", accessor: "cost", isSortable: true, dataType: "currency" },
        { headerLabel: "Volume", accessor: "fuelVolume", isSortable: true, dataType: "number" },
        { headerLabel: "Tipo Combustível", accessor: "fuelType", isSortable: true, dataType: "string" },
        { headerLabel: "Status", accessor: "status", isSortable: true, dataType: "string" },
        { headerLabel: "Motorista", accessor: "driverName", isSortable: true, dataType: "string" },
        { headerLabel: "Placa", accessor: "vehicle.plate", isSortable: true, dataType: "string" },
        { headerLabel: "Modelo", accessor: "vehicle.model", isSortable: true, dataType: "string" },
        { headerLabel: "Marca", accessor: "vehicle.brand", isSortable: true, dataType: "string" },
        { headerLabel: "Posto", accessor: "gasStation.name", isSortable: true, dataType: "string" },
        { headerLabel: "Cidade", accessor: "gasStation.city", isSortable: true, dataType: "string" },
        { headerLabel: "Órgão/Departamento", accessor: "department", isSortable: true, dataType: "string" },
        { headerLabel: "Centro de Custo", accessor: "costCenter", isSortable: true, dataType: "string" }
      ];
    }
  }
});


export default abastecimentoResolvers;