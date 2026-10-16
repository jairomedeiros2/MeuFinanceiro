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
export const TIPO_LANCAMENTO = ['FIXO', 'REPETIDO'];
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

export type DropdownId = 'contas' | 'tag' | 'tipo' | 'situacao';
export const SITUACOES = [
  { valor: true, rotulo: 'Efetivado' },
  { valor: false, rotulo: 'Pendente' },
];
