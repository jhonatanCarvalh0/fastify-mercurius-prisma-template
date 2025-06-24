// modules/clients/types.ts

/**
 * Diretriz:
 * Tipos auxiliares (opcional, se não usar z.infer)
 * 
 * Quando Editar:
 * Quando precisar tipar estruturas customizadas
 */


export interface Client {
  id: number;
  nome: string;
  unidade: string;
  subunidade?: string;
}
export interface CreateClientInput {
  nome: string;
  unidade: string;
  subunidade?: string;
}