import { loadAbastecimento } from '../../data/loadAbastecimento';

const abastecimentoResolvers = () => ({
  Query: {
    abastecimentos: async () => {
      console.log('Carregando abastecimento...');
      const data = await loadAbastecimento();
      return data
      // return context.prisma.abastecimento.findMany(); // exemplo com Prisma
    },
  },
});

export default abastecimentoResolvers;