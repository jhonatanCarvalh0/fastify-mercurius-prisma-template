// modules/fornecedor/route.ts
import { FastifyInstance } from 'fastify';
import { createFornecedorController, listFornecedoresController } from './controller';


/**
 * Rotas relacionadas ao domínio "Fornecedores"
 */

/**
 * Diretriz:
 * Define os endpoints da API e direciona pro controller correspondente.
 * 
 * Quando Editar:
 * Quando adicionar/renomear/remover rotas
 */

export async function fornecedorRoute(fastify: FastifyInstance) {
  // 🔹 GET /api/fornecedores - Lista fornecedores
  fastify.get('/', listFornecedoresController);

  // 🔹 POST /api/fornecedores - Cria fornecedor
  fastify.post('/', createFornecedorController);
}
