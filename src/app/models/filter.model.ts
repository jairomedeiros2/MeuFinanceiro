export type ChaveFiltro = 'contas' | 'tag' | 'lancamentoFixo' | 'lancamentoEfetivado';
export type NaturezaLancamento = 'receita' | 'despesa' | 'transferencia';

export interface TransacoesFilter {
  contas: string[];
  tag: string;
  lancamentoEfetivado: boolean | null;
  lancamentoFixo: boolean | null;
  dataInicio: string;
  dataFim: string;
}

