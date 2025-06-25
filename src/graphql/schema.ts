// src/graphql/schema.ts
import * as types from './_schemaTypes';

export const typeDefs = /* GraphQL */ `

${types.typeCliente}
${types.typeFornecedor}
${types.typePanelManutencao}
${types.typeOrdemServico}
${types.typePessoa}
${types.typeVeiculo}

type Query {
  clientes: [Cliente!]!
  fornecedores: [Fornecedor!]!
  obterDadosPainelManutencao(filtros: FiltrosPainelInput): DadosPainelManutencao!
  }

type Mutation {
    createCliente(data: CreateClienteInput!): Cliente!
    createFornecedor(data: CreateFornecedorInput!): Fornecedor!
  }

  scalar DateTime
  scalar Decimal 

`;


