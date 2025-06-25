export const typeCliente = `
  type Cliente {
    id: Int!
    nome: String!
    unidade: String!
    subunidade: String
    ordensServico: [OrdemServico!]
  }

  input CreateClienteInput {
    nome: String!
    unidade: String!
    subunidade: String
  }
`;
