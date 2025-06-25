export const typePanelManutencao = `
  type ResumoFinanceiro {
    totalPecas: Float!
    totalMaoDeObra: Float!
    totalGeral: Float!
    dataAtualizacao: String!
  }

  type ItemAgregado {
    nome: String!
    valorTotal: Float!
    porcentagem: Float
  }

  type DadosGrafico {
    categorias: [String!]!
    valores: [Float!]!
    porcentagens: [Float]
  }

  type DadosPainelManutencao {
    titulo: String!
    resumo: ResumoFinanceiro!
    secretarias: [ItemAgregado!]!
    oficinas: [ItemAgregado!]!
    modelos: [ItemAgregado!]!
    graficoBarras: DadosGrafico!
    graficoPizza: DadosGrafico!
    filtrosAplicados: FiltrosAplicados!
  }

  input FiltrosPainelInput {
    secretaria: String
    mes: String
    dataInicio: String
    dataFim: String
    marca: String
    oficina: String
    cidade: String
    modelo: String
    tipoOS: String
  }

  type FiltrosAplicados {
    tipoOS: [String!]
    periodo: String
  }

`;