// src/graphql/_schemaTypes/panel.manutencao.type.ts

export const typePanelManutencao = /* GraphQL */ `
  type DadosPainelManutencao {
    title: String!
    totalOS: Int!
    totalVeiculosDistintos: Int!
    valorTotal: Float!
    custoMedio: Float!
    totalPecas: Float!
    totalMaoDeObra: Float!
    totalGeral: Float!

    porTipoOS: [ItemResumo!]!
    porSecretaria: [ItemResumo!]!
    porOficina: [ItemResumo!]!
    porModelo: [ItemResumo!]!

    linhaDoTempo: [ItemSerieTempo!]!
    dispersaoKmCusto: [DispersaoPonto!]!
    frequenciaDiaHora: [FrequenciaHora!]!

    totalBruto: Float!
    totalComDesconto: Float!
    percentualComDesconto: Float!

    osSemNotaFiscal: [OrdemSemNota!]!
  }

  type ItemResumo {
    nome: String!
    total: Float!
  }

  type ItemSerieTempo {
    periodo: String!
    total: Float!
  }

  type DispersaoPonto {
    kmHorimetro: Float!
    custo: Float!
  }

  type FrequenciaHora {
    diaSemana: String!
    hora: Int!
    quantidade: Int!
  }

  type OrdemSemNota {
    id: Int!
    cliente: String!
    data: String!
    motivo: String!
  }

  input FiltrosPainelInput {
    secretaria: [String!]
    tipoOs: [String!]
    dataInicio: String
    dataFim: String
  }
`;
