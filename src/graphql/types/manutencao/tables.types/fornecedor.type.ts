export const typeFornecedor = `
type Fornecedor {
  id: Int!
  nome: String!
  cidade: String
  uf: String
  cnpj: String
  ordensServico: [OrdemServico!]
}

input CreateFornecedorInput {
  nome: String!
  cidade: String
  uf: String
  cnpj: String
}`