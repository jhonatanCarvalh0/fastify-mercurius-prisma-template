export const typeVeiculo = `type Veiculo {
  id: Int!
  placa: String!
  numeroCartao: String
  prefixo: String
  tipoFrota: String
  marca: String
  modelo: String
  ano: String
  patrimonio: String
  kmHorimetro: Float
  ordensServico: [OrdemServico!]
}

input CreateVeiculoInput {
  placa: String!
  numeroCartao: String
  prefixo: String
  tipoFrota: String
  marca: String
  modelo: String
  ano: String
  patrimonio: String
  kmHorimetro: Float
}`