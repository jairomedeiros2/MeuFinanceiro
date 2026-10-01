export type TransactionType = 'RECEITA' | 'DESPESA' | 'TRANSFERENCIA';

export interface AccountOption {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface TagOption {
  id: string;
  name: string;
  color?: string;
}

export interface TransactionFilter {
  types: TransactionType[];
  accountIds: string[];
  tagIds: string[];
}

export interface TransacoesFilter {
  contas: string[];
  tag: string;
  lancamentoEfetivado: boolean | null;
  tipo: string;
  dataInicio: string;
  dataFim: string;
}
