// src/schema/index.ts
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { FastifyInstance } from 'fastify';
import path from 'path';

export const buildSchema = async (app: FastifyInstance) => {
  // Carrega todos os .typeDefs.ts e .resolver.ts dentro da pasta schema
  const typesArray = loadFilesSync(path.join(__dirname, '/**/*.schema.graphql'));
  // Carrega todos os resolvers
  const resolversArray = loadFilesSync(path.join(__dirname, '/**/*.resolver.ts'));
  // Mapeia os resolvers para funções, se necessário
  const loadedResolvers = await Promise.all(
    resolversArray.map(async (resolverFn) => (typeof resolverFn === 'function' ? await resolverFn() : resolverFn))
  );

  const typeDefs = mergeTypeDefs(typesArray);
  const resolvers = mergeResolvers(loadedResolvers);

  // Registra os resolvers com o uso do Prisma
  // const resolvers = mergeResolvers([
  //   diariasResolvers(app),
  //   abastecimentoResolvers(app),
  //   osResolvers(app),
  // ]);

  return makeExecutableSchema({ typeDefs, resolvers });
};
