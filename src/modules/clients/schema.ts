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

export const createClientSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  subunidade: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
