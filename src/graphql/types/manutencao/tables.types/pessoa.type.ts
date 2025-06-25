export const typePessoa = `enum PessoaTipo {
  CONDUTOR
  APROVADOR
  TECNICO
}

type Pessoa {
  id: Int!
  nome: String!
  cpf: String
  tipo: PessoaTipo!
  ordensServicoAprovador: [OrdemServico!]
  ordensServicoCondutorEntregou: [OrdemServico!]
  ordensServicoCondutorRetirou: [OrdemServico!]
  ordensServicoResponsavelTecnico: [OrdemServico!]
}

input CreatePessoaInput {
  nome: String!
  cpf: String
  tipo: PessoaTipo!
}`