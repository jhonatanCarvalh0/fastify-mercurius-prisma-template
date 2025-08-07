import path from 'path';
import * as XLSX from 'xlsx';

export function loadAbastecimento() {
  const filePath = path.resolve(__dirname, '../../public/data/ABASTECIMENTO-PVH.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[ workbook.SheetNames[ 0 ] ];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: null });
  return data;
}
