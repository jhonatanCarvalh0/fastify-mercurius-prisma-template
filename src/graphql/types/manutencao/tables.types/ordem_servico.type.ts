export const typeOrdemServico = `
type OrdemServico {
  id: Int!
  osCodigo: String!
  data: DateTime!
  tipoOs: String
  categoriaOs: String
  totalMdo: Float
  taxaDescMdo: Float
  mdoComDesc: Float
  totalPecas: Float
  taxaDescPecas: Float
  pecasComDesc: Float
  total: Float
  totalSemDesc: Float
  nfPecas: String
  nfMdo: String
  nfConjugada: String
  declaracao: Boolean!
  correcao: Boolean!
  periodo: String
  arquivo: String
  secretaria: String
  clienteId: Int
  veiculoId: Int
  fornecedorId: Int
  aprovadorId: Int
  condutorEntregouId: Int
  condutorRetirouId: Int
  responsavelTecnicoId: Int
  cliente: Cliente
  fornecedor: Fornecedor
  veiculo: Veiculo
  aprovador: Pessoa
  condutorEntregou: Pessoa
  condutorRetirou: Pessoa
  responsavelTecnico: Pessoa
}

input CreateOrdemServicoInput {
  osCodigo: String!
  data: DateTime!
  tipoOs: String
  categoriaOs: String
  totalMdo: Float
  taxaDescMdo: Float
  mdoComDesc: Float
  totalPecas: Float
  taxaDescPecas: Float
  pecasComDesc: Float
  total: Float
  totalSemDesc: Float
  nfPecas: String
  nfMdo: String
  nfConjugada: String
  declaracao: Boolean!
  correcao: Boolean!
  periodo: String
  arquivo: String
  secretaria: String
  clienteId: Int!
  veiculoId: Int!
  fornecedorId: Int!
  aprovadorId: Int!
  condutorEntregouId: Int!
  condutorRetirouId: Int!
  responsavelTecnicoId: Int!
}`