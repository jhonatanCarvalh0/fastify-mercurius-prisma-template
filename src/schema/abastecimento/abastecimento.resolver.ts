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

      // ordenação simples
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
        lastUpdate: new Date(),
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


    costOverTime: (_: unknown, { filters }: { filters?: any }) => {
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

      const ordered = Object.entries(totals)
        .filter(([ date ]) => date !== "N/A")
        .sort(([ a ], [ b ]) => a.localeCompare(b));

      return ordered.map(([ date, total ]) => ({ date, total }));
    },


    abastecimentosColumns: () => {
      return [
        { headerLabel: "Data", accessor: "datetime", isSortable: true, dataType: "date" },
        { headerLabel: "Custo", accessor: "cost", isSortable: true, dataType: "currency" },
        { headerLabel: "Volume", accessor: "fuelVolume", isSortable: true, dataType: "number" },
        { headerLabel: "Tipo Combustível", accessor: "fuelType", isSortable: true, dataType: "string" },
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