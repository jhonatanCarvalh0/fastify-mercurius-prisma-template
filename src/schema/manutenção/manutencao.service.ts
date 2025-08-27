import { ManutencaoProcessor } from './manutencaoProcessor';
// manutencao.service.ts - Manutenção
import { loadManutencao } from '../../data/loadManutencao';
import { mapToProcessed } from './utils/mapToProcessed';
import { ManutencaoFilters, ManutencaoProcessed, ManutencaoTableFilters } from './utils/types';

export class ManutencaoService {
  private rawData: any;
  private processedData: ManutencaoProcessed[];

  constructor() {
    this.rawData = loadManutencao();
    this.processedData = mapToProcessed(ManutencaoProcessor.processManutencaoData(this.rawData));
  }

  public getManutencao(filters?: ManutencaoFilters) {
    return this.processedData
  }

  public getManutencaoTable(filters?: ManutencaoFilters, tableFilters?: ManutencaoTableFilters) {
    const data = this.getManutencao()
    return data;
  }

  public ManutencaoKpis(filters?: ManutencaoFilters) {
    const data = this.getManutencao(filters);

    //Custo total
    const totalCost = data.map(r => Number(r.totalCost) || 0).reduce((acc, val) => acc + val, 0);

    // Ordens de serviço (OS) - Contagem
    const serviceOrderCount = data.length;

    // Custo médio por OS
    const averageCostPerOs = serviceOrderCount > 0 ? totalCost / serviceOrderCount : 0;

    return {
      totalCost,
      serviceOrderCount,
      averageCostPerOs,
      lastUpdate: this.getLastUpdate()
    };
  }

  public getLastUpdate() {
    // Pega todas as datas válidas
    const dates = this.processedData
      .map(item => item.datetime)
      .filter(Boolean)
      .map((dateStr: string) => {
        // Substitui espaço por 'T' para garantir que o JS interprete corretamente
        const isoStr = dateStr.replace(' ', 'T');
        return new Date(isoStr);
      })
      .filter((date: Date) => !isNaN(date.getTime()));

    // Se não houver datas válidas, retorna a data atual como fallback
    const latestDate = dates.length > 0
      ? new Date(Math.max(...dates.map(d => d.getTime())))
      : new Date();

    const yyyy = latestDate.getFullYear();
    const mm = String(latestDate.getMonth() + 1).padStart(2, '0');
    const dd = String(latestDate.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  public getManutencaoCharts(filters?: ManutencaoFilters) {
    const data = this.getManutencao(filters);

    // Agrupa custo por departamento
    const costByDepartmentMap: Record<string, number> = {};
    data.forEach(row => {
      const dept = row.department || 'N/A';
      const cost = Number(row.totalCost) || 0;
      costByDepartmentMap[ dept ] = (costByDepartmentMap[ dept ] || 0) + cost;
    });

    const costByDepartment = Object.entries(costByDepartmentMap).map(([ department, total ]) => ({
      department,
      total
    }));

    // Agrupa custo por tipo de manutenção (categoriaOs)
    const costByTipoManutencaoMap: Record<string, number> = {};
    data.forEach(row => {
      const tipo = row.categoryOs || 'N/A';
      const cost = Number(row.totalCost) || 0;
      costByTipoManutencaoMap[ tipo ] = (costByTipoManutencaoMap[ tipo ] || 0) + cost;
    });

    const costByTypeOfManutencao = Object.entries(costByTipoManutencaoMap).map(([ categoryOs, total ]) => ({
      categoryOs,
      total
    }));

    return {
      costByDepartment,
      costByTypeOfManutencao
    };
  }


  public getFilterOptions(filters?: ManutencaoFilters) {
    // 1. Filtra os dados com base no que já foi selecionado
    let filtered = this.processedData;

    if (filters?.department) {
      filtered = filtered.filter(item => item.department === filters.department);
    }

    if (filters?.categoryOs) {
      filtered = filtered.filter(item => item.categoryOs === filters.categoryOs);
    }

    if (filters?.plate) {
      filtered = filtered.filter(item => item.plate === filters.plate);
    }

    // 2. Extrai valores únicos para cada campo de filtro
    const mapToFilterType = (arr: (string | undefined | null)[]) =>
      Array.from(new Set(arr.filter(Boolean))).sort()
        .map(value => ({ value: value!, label: value! }));

    // Gera opções de filtro
    const departmentOptions = mapToFilterType(filtered.map(item => item.department));
    const categoryOptions = mapToFilterType(filtered.map(item => item.categoryOs));
    const plateOptions = mapToFilterType(filtered.map(item => item.plate));
    console.log('Opções de filtro geradas:', { departmentOptions, categoryOptions, plateOptions });

    return {
      department: departmentOptions,
      categoryOs: categoryOptions,
      plate: plateOptions,
    };
  }
  
}