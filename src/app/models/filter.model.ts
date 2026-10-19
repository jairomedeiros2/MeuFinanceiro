export type TipoTransacao = 'RECEITA' | 'DESPESA' | 'TRANSFERENCIA';
export type TipoLancamento = 'FIXA' | 'REPETIDO';
export type ChaveFiltro = 'contas' | 'tag' | 'lancamentoFixo' | 'lancamentoEfetivado';

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
  types: TipoTransacao[];
  accountIds: string[];
  tagIds: string[];
}

export interface TransacoesFilter {
  contas: string[];
  tag: string;
  lancamentoEfetivado: boolean | null;
  lancamentoFixo: boolean | null;
  dataInicio: string;
  dataFim: string;
}
