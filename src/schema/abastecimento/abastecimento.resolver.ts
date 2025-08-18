import { AbastecimentoService } from './abastecimento.service';
import { AbastecimentoProcessor } from './abastecimentoProcessor';
import { AbastecimentoFilters, AbastecimentoTableFilters } from './utils/types';

const abastecimentoService = new AbastecimentoService();

const abastecimentoResolvers = () => ({
  Query: {
      // Dados gerais (filtros gerais, incluindo dateRange)
      getAbastecimentos: (_: unknown, { filters }: { filters?: AbastecimentoFilters }) => {
        return abastecimentoService.getAbastecimentos(filters);
      },

      // Dados da tabela (aplica filtros da tabela + ordenação + paginação)
      getAbastecimentosTable: (
        _: unknown,
        { limit, offset, sortBy, sortDirection, filters }: {
          limit?: number;
          offset?: number;
          sortBy?: string;
          sortDirection?: 'ascending' | 'descending';
          filters?: AbastecimentoTableFilters;
        }
      ) => {
        let data = abastecimentoService.getAbastecimentosTable(undefined, filters); // nenhum filtro geral
        data = AbastecimentoProcessor.sortData(data, sortBy, sortDirection);

        // paginação
        if (typeof offset === "number" && typeof limit === "number") {
          data = data.slice(offset, offset + limit);
        }
        return data;
      },

      // Conta registros da tabela (aplica apenas filtros da tabela)
      abastecimentosCount: (_: unknown, { filters }: { filters?: AbastecimentoTableFilters }) => {
        const filtered = abastecimentoService.getAbastecimentosTable(undefined, filters);
        return filtered.length;
      },

    // KPIs
    abastecimentoKpis: (_: unknown, { filters }: { filters?: AbastecimentoFilters }) => {
      const {
        totalGasto,
        totalLitros,
        totalAbastecimentos,
        vehiclesCount,
        kilometersDriven,
      } = abastecimentoService.getKpis(filters);

      return {
        totalCost: totalGasto,
        fuelConsumed: totalLitros,
        suppliesCount: totalAbastecimentos,
        dailyAverageCost: totalGasto / (totalAbastecimentos || 1),
        vehiclesCount,
        kilometersDriven,
        lastUpdate: abastecimentoService.getLastUpdate(),
      };
    },

    // opções de filtro
    vehiclePlateOptions: () => {
      const placas = abastecimentoService.getFilterOptions().placa;
      return placas.map(p => ({ value: p, label: p }));
    },
    departmentOptions: () => {
      const departments = abastecimentoService.getFilterOptions().orgao;
      return departments.map(d => ({ value: d, label: d }));
    },
    vehicleModelOptions: () => {
      const models = abastecimentoService.getFilterOptions().modelo;
      return models.map(m => ({ value: m, label: m }));
    },
    gasStationCityOptions: () => {
      const cities = abastecimentoService.getFilterOptions().cidadePosto;
      return cities.map(c => ({ value: c, label: c }));
    },
    gasStationNameOptions: () => {
      const names = abastecimentoService.getFilterOptions().nomePosto;
      return names.map(n => ({ value: n, label: n }));
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

    costByDepartment: (_: unknown, { filters }: { filters?: any }) => {
      const data = abastecimentoService.getAbastecimentos(filters);
      const totals = data.reduce<Record<string, number>>((acc, item) => {
        const department = item.department || "N/A";
        acc[ department ] = (acc[ department ] || 0) + (item.cost || 0);
        return acc;
      }, {});
      return Object.entries(totals).map(([ department, total ]) => ({ department, total }));
    },

    costByCity: (_: unknown, { filters }: { filters?: any }) => {
      const data = abastecimentoService.getAbastecimentos(filters);
      const totals = data.reduce<Record<string, number>>((acc, item) => {
        const city = item.gasStation?.city || "N/A";
        acc[ city ] = (acc[ city ] || 0) + (item.cost || 0);
        return acc;
      }, {});
      return Object.entries(totals).map(([ city, total ]) => ({ city, total }));
    },

    costByGasStation: (_: unknown, { filters }: { filters?: any }) => {
      const data = abastecimentoService.getAbastecimentos(filters);
      const totals = data.reduce<Record<string, number>>((acc, item) => {
        const name = item.gasStation?.name || "N/A";
        acc[ name ] = (acc[ name ] || 0) + (item.cost || 0);
        return acc;
      }, {});
      return Object.entries(totals).map(([ name, total ]) => ({ name, total }));
    },

    costByPlate: (_: unknown, { filters }: { filters?: any }) => {
      const data = abastecimentoService.getAbastecimentos(filters);
      const totals = data.reduce<Record<string, number>>((acc, item) => {
        const plate = item.vehicle?.plate || "N/A";
        acc[ plate ] = (acc[ plate ] || 0) + (item.cost || 0);
        return acc;
      }, {});
      return Object.entries(totals).map(([ plate, total ]) => ({ plate, total }));
    },

    costByDate: (_: unknown, { filters }: { filters?: any }) => {
      const data = abastecimentoService.getAbastecimentos(filters);
      const totals = data.reduce<Record<string, number>>((acc, item) => {
        let dateStr = "N/A";
        if (item.datetime) {
          const dateObj = new Date(item.datetime);
          if (!isNaN(dateObj.getTime())) {
            dateStr = dateObj.toISOString().substring(0, 10);
          }
        }
        acc[ dateStr ] = (acc[ dateStr ] || 0) + (item.cost || 0);
        return acc;
      }, {});
      return Object.entries(totals).map(([ date, total ]) => ({ date, total }));
    },
    costOverTime: async (_: unknown, { filters }: { filters?: any }) => {
      return abastecimentoService.getCostOverTimeGroupedByMonth(filters);
    },

    // rankings
    rankingByDate: async (_: unknown, { filters }: { filters?: any }) => {
      const data = await abastecimentoService.getAbastecimentos(filters);

      // agrupa custo por data
      const totals = data.reduce<Record<string, number>>((acc, item) => {
        let dateStr = "N/A";
        if (item.datetime) {
          const dateObj = new Date(item.datetime);
          if (!isNaN(dateObj.getTime())) {
            dateStr = dateObj.toISOString().substring(0, 10);
          }
        }
        acc[ dateStr ] = (acc[ dateStr ] || 0) + (item.cost || 0);
        return acc;
      }, {});

      // filtra e ordena em ordem crescente pela data ISO (yyyy-mm-dd)
      const ordered = Object.entries(totals)
        .filter(([ date ]) => date !== "N/A")
        .sort(([ a ], [ b ]) => a.localeCompare(b));

      return ordered.map(([ date, total ]) => ({ date, total }));
    },

    rankingByPlate: async (_: unknown, { filters }: { filters?: any }) => {
      const data = await abastecimentoService.getAbastecimentos(filters);

      // Agrupa por placa somando total e contando quantidade
      const map = new Map<string, { total: number; quantity: number }>();

      data.forEach(({ vehicle, cost }) => {
        if (!vehicle?.plate) return;
        const plate = vehicle.plate;
        if (!map.has(plate)) {
          map.set(plate, { total: 0, quantity: 0 });
        }
        const entry = map.get(plate)!;
        entry.total += cost;
        entry.quantity += 1;
      });

      return Array.from(map, ([ plate, { total, quantity } ]) => ({
        plate,
        total,
        quantity,
      })).sort((a, b) => {
        // Ordena primeiro pelo total decrescente, depois pela quantidade decrescente
        if (b.total !== a.total) return b.total - a.total;
        return b.quantity - a.quantity;
      });;
    },

    rankingByDepartment: async (_: unknown, { filters }: { filters?: any }) => {
      const data = await abastecimentoService.getAbastecimentos(filters);

      // Agrupa por departamento somando total
      const map = new Map<string, number>();
      data.forEach(({ department, cost }) => {
        if (!department) return;
        map.set(department, (map.get(department) || 0) + cost);
      });

      return Array.from(map, ([ department, total ]) => ({ department, total })).sort((a, b) => b.total - a.total);
    },

    abastecimentosColumns: () => {
      return [
        { headerLabel: "Data", accessor: "datetime", isSortable: true, dataType: "date", isFilterable: true, filterKey: "datetime" },
        { headerLabel: "Custo", accessor: "cost", isSortable: true, dataType: "currency", isFilterable: true, filterKey: "cost" },
        { headerLabel: "Litros", accessor: "fuelVolume", isSortable: true, dataType: "number", isFilterable: true, filterKey: "fuelVolume" },
        { headerLabel: "Tipo Combustível", accessor: "fuelType", isSortable: true, dataType: "string", isFilterable: true, filterKey: "fuelType" },
        { headerLabel: "Motorista", accessor: "driverName", isSortable: true, dataType: "string", isFilterable: true, filterKey: "driverName" },
        { headerLabel: "Placa", accessor: "vehicle.plate", isSortable: true, dataType: "string", isFilterable: true, filterKey: "vehiclePlate" },
        { headerLabel: "Modelo", accessor: "vehicle.model", isSortable: true, dataType: "string", isFilterable: true, filterKey: "vehicleModel" },
        { headerLabel: "Marca", accessor: "vehicle.brand", isSortable: true, dataType: "string", isFilterable: true, filterKey: "vehicleBrand" },
        { headerLabel: "Posto", accessor: "gasStation.name", isSortable: true, dataType: "string", isFilterable: true, filterKey: "gasStationName" },
        { headerLabel: "Cidade", accessor: "gasStation.city", isSortable: true, dataType: "string", isFilterable: true, filterKey: "gasStationCity" },
        { headerLabel: "Órgão/Departamento", accessor: "department", isSortable: true, dataType: "string", isFilterable: true, filterKey: "department" },
        // { headerLabel: "Centro de Custo", accessor: "costCenter", isSortable: true, dataType: "string", isFilterable: true, filterKey: "costCenter" },
      ];
    }
  }
});


export default abastecimentoResolvers;