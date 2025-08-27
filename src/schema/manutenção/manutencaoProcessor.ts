// manutencaoProcessor.ts
import { ProcessedManutencaoRow } from './utils/types';

export const ManutencaoProcessor = {
  // Função utilitária para normalizar valores vazios
  normalizeField(value: any): string {
    if (value === undefined || value === null || value === "") {
      return "N/A";
    }
    return String(value).trim();
  },

  //Recebe uma data com milissegundos e retorna no formato yyyy-mm-dd hh:mm:ss
  parseDate(dateInput?: string | null): string | null {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  },

  // Processa uma linha individual
  processRow(row: Record<string, string | number | null>): ProcessedManutencaoRow {
    const processed: any = {};
    
    for (const key in row) {
      const value = row[ key ];

      if (value === null || value === undefined || value === '') {
        // se for número → devolve null
        if (!isNaN(Number(value))) {
          processed[ key ] = null;
        } else {
          // se for texto → devolve "N/A"
          processed[ key ] = "N/A";
        }
      } else {
        processed[ key ] = value;
      }
    }

    return processed as ProcessedManutencaoRow;
  },

  // Processa os dados de manutenção
  processManutencaoData(
    data: Record<string, string | number | null>[]
  ): ProcessedManutencaoRow[] {
    return data.map(this.processRow.bind(this));
  },
};
