import { AbastecimentoService } from './abastecimento.service';
import { AbastecimentoFilters } from './utils/types';

const abastecimentoService = new AbastecimentoService();

const abastecimentoResolvers = () => ({
  Query: {
    abastecimentos: (_: unknown, { filters }: { filters?: AbastecimentoFilters }) =>
      abastecimentoService.getAbastecimentos(filters),

    kpisAbastecimento: (_: unknown, { filters }: { filters?: AbastecimentoFilters }) =>
      abastecimentoService.getKpis(filters),

    gastoPorOrgao: (_: unknown, { filters }: { filters?: AbastecimentoFilters }) =>
      abastecimentoService.getGastoPorOrgao(filters),

    gastoMensal: (_: unknown, { filters }: { filters?: AbastecimentoFilters }) =>
      abastecimentoService.getGastoMensal(filters),

    filterOptionsAbastecimento: () => abastecimentoService.getFilterOptions(),

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

    // diarias: async () => {
    //   const data = await loadAbastecimento();
    //   console.log('Data loaded from CSV:', data.length, 'records - resolver.ts');
    //   return data;
    //   // return context.prisma.diaria.findMany(); // exemplo com Prisma
    // },
  },
});

export default abastecimentoResolvers;