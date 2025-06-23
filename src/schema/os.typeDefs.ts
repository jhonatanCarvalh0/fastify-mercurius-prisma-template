export const osTypeDefs = `
  type OrdemServico {
    id: Int!
    os_codigo: String!
    data: String!
    tipo_os: String
    total: Float
    veiculo: Veiculo
    fornecedor: Fornecedor
    cliente: Cliente
  }

  type Cliente {
    id: Int!
    nome: String!
    unidade: String!
    subunidade: String
  }

  type Veiculo {
    id: Int!
    placa: String!
  }

  type Fornecedor {
    id: Int!
    nome: String!
    cidade: String
    uf: String
    cnpj: String
  }

  type Query {
    ordensServico: [OrdemServico!]!
    ordemServico(id: Int!): OrdemServico
  }
`
