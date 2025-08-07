// src/server.ts
import Fastify from 'fastify';
import mercurius from 'mercurius';
import prismaPlugin from './plugins/prisma';
import { buildSchema } from './schema/index'; // <-- importa a função agora

export async function buildServer() {
  const app = Fastify();

  // await app.register(prismaPlugin);

  const schema = await buildSchema(app); // <-- chama a função com `app`

  app.register(mercurius, {
    schema,
    context: () => ({}), // contexto vazio, você pode adicionar o Prisma aqui se necessário
    graphiql: true,
  });

  return app;
}
