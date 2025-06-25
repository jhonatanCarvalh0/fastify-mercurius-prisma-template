// modules/clientes/schema.ts
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

export const createClienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  subunidade: z.string().optional(),
});

export type CreateClienteInput = z.infer<typeof createClienteSchema>;
