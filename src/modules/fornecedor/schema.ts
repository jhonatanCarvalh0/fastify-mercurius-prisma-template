// modules/clients/schema.ts
import { z } from 'zod';

/**
 * Schema de criação de cliente.
 */

/**
 * Diretriz:
 * Validação e tipagem dos dados recebidos (com Zod)
 * 
 * Quando Editar:
 * Quando mudar o formato esperado dos dados
 */

export const createFornecedorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cidade: z.string().optional(),
  uf: z.string().max(2, 'UF deve ter 2 caracteres'),
  cnpj: z.string().max(18, 'CNPJ deve ter 18 caracteres'),
});

export type CreateFornecedorInput = z.infer<typeof createFornecedorSchema>;
