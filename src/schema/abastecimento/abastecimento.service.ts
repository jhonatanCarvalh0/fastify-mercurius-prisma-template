// AbastecimentoService.ts
import { AbastecimentoProcessed, AbastecimentoFilters } from './utils/types';
import { loadAbastecimento } from '../../data/loadAbastecimento';
import { mapToProcessed } from './utils/mapToProcessed';
import { AbastecimentoProcessor } from './abastecimentoProcessor';

function parseDateTimeBR(dateTimeStr: string): Date | null {
  if (!dateTimeStr) return null;
  // data e hora separados por espaço
  const [ datePart, timePart ] = dateTimeStr.split(' ');
  if (!datePart) return null;
  const [ day, month, year ] = datePart.split('/').map(Number);
  if ([ day, month, year ].some(isNaN)) return null;

  // hora pode ser undefined
  const [ hour = 0, minute = 0, second = 0 ] = timePart ? timePart.split(':').map(Number) : [ 0, 0, 0 ];

  return new Date(year, month - 1, day, hour, minute, second);
}

export class AbastecimentoService {
  private rawData: any[];
  private processedData: AbastecimentoProcessed[];

  constructor() {
    this.rawData = loadAbastecimento();
    this.processedData = mapToProcessed(AbastecimentoProcessor.processAbastecimentoData(this.rawData));
  }

  public getAbastecimentos(filters?: AbastecimentoFilters): AbastecimentoProcessed[] {
    let filtered = this.processedData;

    if (!filters) return filtered;

    if (filters.dateRange) {
      const from = new Date(filters.dateRange.from);
      const to = new Date(filters.dateRange.to);

      filtered = filtered.filter(item => {
        if (!item.datetime) return false;
        const dt = parseDateTimeBR(item.datetime);
        if (!dt) return false;
        return dt >= from && dt <= to;
      });
    }


    if (filters.department && filters.department.length > 0) {
      filtered = filtered.filter(item => filters.department!.includes(item.department));
    }

    if (filters.fuelType && filters.fuelType.length > 0) {
      filtered = filtered.filter(item => filters.fuelType!.includes(item.fuelType));
    }

    if (filters.driverName) {
      filtered = filtered.filter(item => item.driverName === filters.driverName);
    }

    if (filters.vehiclePlate && filters.vehiclePlate.length > 0) {
      filtered = filtered.filter(item => filters.vehiclePlate!.includes(item.vehicle?.plate));
    }

    if (filters.vehicleModel && filters.vehicleModel.length > 0) {
      filtered = filtered.filter(item => filters.vehicleModel!.includes(item.vehicle?.model));
    }

    if (filters.gasStationCity && filters.gasStationCity.length > 0) {
      filtered = filtered.filter(item => filters.gasStationCity!.includes(item.gasStation?.city));
    }

    if (filters.gasStationName && filters.gasStationName.length > 0) {
      filtered = filtered.filter(item => filters.gasStationName!.includes(item.gasStation?.name));
    }

    return filtered;
  }

  public getKpis(filters?: AbastecimentoFilters) {
    const data = this.getAbastecimentos(filters);
    const totalGasto = data.reduce((acc, item) => acc + (item.cost || 0), 0);
    const totalLitros = data.reduce((acc, item) => acc + (item.fuelVolume || 0), 0);
    const totalAbastecimentos = data.length;

    // Vamos calcular veículos únicos aqui
    const uniqueVehicles = new Set(data.map(item => item.vehicle?.plate).filter(Boolean));

    // Se tiver campo para quilômetros rodados, soma aqui (exemplo: item.kilometers)
    const totalKilometers = data.reduce((acc, item) => acc + (item.vehicle.km || 0), 0);

    return {
      totalGasto,
      totalLitros,
      totalAbastecimentos,
      vehiclesCount: uniqueVehicles.size,
      kilometersDriven: totalKilometers,
    };
  }


  public getGastoPorOrgao(filters?: AbastecimentoFilters) {
    const data = this.getAbastecimentos(filters);
    const gastosPorOrgao = data.reduce<Record<string, number>>((acc, item) => {
      const orgao = item.department || 'N/A';
      acc[ orgao ] = (acc[ orgao ] || 0) + (item.cost || 0);
      return acc;
    }, {});

    return Object.entries(gastosPorOrgao)
      .map(([ name, total ]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }

  public getGastoMensal(filters?: AbastecimentoFilters) {
    const data = this.getAbastecimentos(filters);
    const gastosPorMes = data.reduce<Record<string, number>>((acc, item) => {
      if (!item.datetime) return acc;
      const date = new Date(item.datetime);
      const mesAno = `${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;
      acc[ mesAno ] = (acc[ mesAno ] || 0) + (item.cost || 0);
      return acc;
    }, {});

    return Object.entries(gastosPorMes)
      .map(([ month, total ]) => ({ month, total }))
      .sort((a, b) => {
        const [ m1, y1 ] = a.month.split('/');
        const [ m2, y2 ] = b.month.split('/');
        return new Date(`${y1}-${m1}-01`).getTime() - new Date(`${y2}-${m2}-01`).getTime();
      });
  }

  public getFilterOptions() {
    const orgaoOptions = Array.from(new Set(this.processedData.map(item => item.department).filter(Boolean))).sort();
    const placaOptions = Array.from(new Set(this.processedData.map(item => item.vehicle.plate).filter(Boolean))).sort();
    const modelOptions = Array.from(new Set(this.processedData.map(item => item.vehicle.model).filter(Boolean))).sort();
    const gasStationCityOptions = Array.from(new Set(this.processedData.map(item => item.gasStation.city).filter(Boolean))).sort();
    const gasStationNameOptions = Array.from(new Set(this.processedData.map(item => item.gasStation.name).filter(Boolean))).sort();

    return {
      orgao: orgaoOptions,
      placa: placaOptions,
      modelo: modelOptions,
      cidadePosto: gasStationCityOptions,
      nomePosto: gasStationNameOptions
    };
  }
}
