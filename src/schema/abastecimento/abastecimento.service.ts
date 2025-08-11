// AbastecimentoService.ts
import { AbastecimentoProcessed, AbastecimentoFilters } from './utils/types';
import { loadAbastecimento } from '../../data/loadAbastecimento';
import { mapToProcessed } from './utils/mapToProcessed';
import { AbastecimentoProcessor } from './abastecimentoProcessor';

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

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate).getTime();
      const end = new Date(filters.endDate).getTime();

      filtered = filtered.filter(item => {
        const dt = new Date(item.datetime).getTime();
        return dt >= start && dt <= end;
      });
    }

    if (filters.orgao && filters.orgao.length > 0) {
      filtered = filtered.filter(item => filters.orgao!.includes(item.department));
    }

    if (filters.combustivel && filters.combustivel.length > 0) {
      filtered = filtered.filter(item => filters.combustivel!.includes(item.fuelType));
    }

    if (filters.condutor && filters.condutor.length > 0) {
      filtered = filtered.filter(item => filters.condutor!.includes(item.driverName));
    }

    if (filters.placa && filters.placa.length > 0) {
      filtered = filtered.filter(item => filters.placa!.includes(item.vehicle.plate));
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
