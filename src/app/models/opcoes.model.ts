export const CONTAS = [
  'Itau',
  'Nuconta',
  'Bradesco',
  'Banco do Brasil',
  'Caixa',
  'Santander',
  'Carteira',
];

export const TAGS = [
  'Salário',
  'Receita',
  'Despesa',
  'Transferência',
  'Mecado',
  'Transporte',
  'Saúde',
  'Outros',
];

export const CATEGORIAS_RECEITA = ['Salário', 'Investimentos', 'Freelance', 'Outros'];
export const TIPO_TRANSACAO = ['RECEITA', 'DESPESA', 'TRANSFERENCIA'];
export const CATEGORIAS_DESPESA = [
  'Alimentação',
  'Educação',
  'Lazer',
  'Mercado',
  'Moradia / Casa',
  'Saúde',
  'Transporte',
  'Viagens',
  'Pai',
  'Outros',
];

export type DropdownId = 'contas' | 'tag' | 'lancamentoFixo' | 'status';
export const SITUACOES = [
  { valor: true, rotulo: 'Efetivado' },
  { valor: false, rotulo: 'Pendente' },
];
export const LANCAMENTO_FIXO = [
  { valor: true, rotulo: 'Fixo' },
  { valor: false, rotulo: 'Recorrente' },
];

export function corBanco(nomeConta: string): string {
  if (!nomeConta) return '#5c16ca';
  const c = nomeConta.toLowerCase();
  if (c.includes('itau') || c.includes('itaú')) return '#ec7000';
  if (c.includes('nu') || c.includes('nubank')) return '#820ad1';
  if (c.includes('caixa')) return '#005ca9';
  if (c.includes('bradesco')) return '#cc092f';
  if (c.includes('santander')) return '#ea1d2c';
  return '#5c16ca';
}
