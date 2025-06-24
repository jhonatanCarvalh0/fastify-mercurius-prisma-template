import { buildApp } from './app/app';
import { env } from './config/env';

const start = async () => {
  const fastify = await buildApp();

  try {
    await fastify.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();