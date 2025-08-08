// src/utils/AbastecimentoProcessor.ts
import { unificationMap } from '../../data/orgaoDictionary';
import { ProcessedAbastecimentoRow } from './utils/types';

const numericFields = [
  'KM',
  'KM_Anterior',
  'Qtde_Combustivel_Abastecido',
  'Valor_Abastecimento',
  'Capacidade_Tanque',
];

export const AbastecimentoProcessor = {
  parseDate(dateInput?: string | null): Date | null {
    if (!dateInput) return null;
    const parts = dateInput.split('/');
    if (parts.length !== 3) return null;

    const [ day, month, year ] = parts.map((p) => parseInt(p, 10));
    if ([ day, month, year ].some((n) => isNaN(n))) return null;

    const date = new Date(Date.UTC(year, month - 1, day));
    return isNaN(date.getTime()) ? null : date;
  },

  parseNumber(value?: string | number | null): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number' && !isNaN(value)) return value;

    const cleaned = String(value).replace(/\s+/g, '').replace(',', '.');
    const num = parseFloat(cleaned);

    return isNaN(num) ? 0 : num;
  },

  parseYear(value?: string | number | null): number | null {
    if (!value) return null;
    const year = Number(String(value).slice(0, 4));
    return Number.isInteger(year) ? year : null;
  },

  processRow(row: Record<string, string | number>): ProcessedAbastecimentoRow {
    const processed: Record<string, any> = { ...row };

    for (const field of numericFields) {
      processed[ field ] = AbastecimentoProcessor.parseNumber(row[ field ]);
    }

    processed[ 'Ano' ] = AbastecimentoProcessor.parseYear(row[ 'Ano' ]);

    const originalOrgao = String(processed[ 'Unidade' ]);
    processed[ 'OrgaoUnificado' ] = unificationMap.get(originalOrgao) || originalOrgao;


    processed[ 'parsedDate' ] = AbastecimentoProcessor.parseDate(
      typeof row[ 'Data' ] === 'string' ? row[ 'Data' ] : undefined
    );

    return processed;
  },

  processAbastecimentoData(
    data: Record<string, string | number>[]
  ): ProcessedAbastecimentoRow[] {
    return data.map(this.processRow);
  },
};
