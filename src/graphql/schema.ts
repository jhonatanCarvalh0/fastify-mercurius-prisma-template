// src/graphql/schema.ts

export const typeDefs = /* GraphQL */ `
  type Client {
    id: Int!
    nome: String!
    unidade: String!
    subunidade: String
  }

  type Query {
    clients: [Client!]!
  }

  input CreateClientInput {
    nome: String!
    unidade: String!
    subunidade: String
  }

  type Mutation {
    createClient(data: CreateClientInput!): Client!
  }
`;
