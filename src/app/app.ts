import Fastify from 'fastify';
import { registerRoutes } from '../routes';
import { registerPlugins } from '../plugins';

/**
* Cria e configura uma instância do servidor Fastify.
* Fluxo da requisição:
* HTTP → Rota(validação) → Serviço(lógica) → Prisma(DB) → Resposta
*/

export async function buildApp() {
  const fastify = Fastify({ logger: true });

  // 🧩 Registra plugins necessários
  await registerPlugins(fastify);

  // 🔁 Registra rotas básicas internas (como / e /health)
  registerCoreRoutes(fastify);

  // 📦 Rotas principais da aplicação
  await registerRoutes(fastify);

  return fastify;
}

/**
 * Registra rotas básicas que não pertencem a um domínio específico(root, health, etc).
 * Ideal para testes, status e mensagens públicas simples.
 */
function registerCoreRoutes(fastify: typeof Fastify.prototype) {
  // 🌐 Rota base (ex: usado em testes ou resposta padrão do servidor)
  fastify.get('/', async () => {
    return { message: 'Hello World!' };
  });

  // 🔍 Healthcheck: Verifica se o banco está acessível
  fastify.get('/health', async () => {
    try {
      await fastify.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        db: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      fastify.log.error('Health check failed:', error);
      throw fastify.httpErrors.serviceUnavailable('Service unavailable');
    }
  });
}