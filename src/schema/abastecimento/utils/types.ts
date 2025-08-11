// types.ts
export interface Abastecimento {
  Data: string;
  Hora: string;
  KM: number;
  KM_Anterior: number;
  Numero_Cartao: string;
  Combustivel: string;
  Qtde_Combustivel_Abastecido: number;
  Valor_Abastecimento: number;
  Cidade_Posto: string;
  Nome_Posto: string;
  Endereco_Posto: string;
  Matricula_Condutor: string;
  Nome_Condutor: string;
  Orgao: string;
  OrgaoUnificado?: string; // pode vir do processor se quiser unificar
  Sub_Unidade: string;
  Modelo: string;
  Placa: string;
  Prefixo: string;
  Marca: string;
  Renavam: string;
  Ano: number;
  Capacidade_Tanque: number;
  Chassi: string;
  Cor: string;
  Motorizacao: string;
  Cidade_Veiculo: string;
  Centro_Custo: string;
}

export interface AbastecimentoProcessed {
  id: string;
  datetime: string;
  cost: number;
  fuelVolume: number;
  fuelType: string;
  driverName: string;

  vehicle: {
    plate: string;
    model: string;
    brand: string;
  };

  gasStation: {
    name: string;
    city: string;
  };

  department: string;
  costCenter: string;
}

export interface AbastecimentoFilters {
  startDate?: string;
  endDate?: string;
  orgao?: string[];
  combustivel?: string[];
  condutor?: string[];
  placa?: string[];
}

export interface ProcessedAbastecimentoRow {
  [ key: string ]: any;
}