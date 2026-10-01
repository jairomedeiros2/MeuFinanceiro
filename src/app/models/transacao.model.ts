export interface Transacao {
  id: number;
  valor: number;
  moeda: string;
  data: string;
  descricao: string;
  categoria: string;
  lancamentoEfetivado: boolean;
  tag: string;
  conta: string;
  ignorarTransacao: boolean;
  observacao: string;
  lancamentoFixo: boolean;
  repetirTransacao: boolean;
  repetirVezes: number;
  repetirTempo: boolean;
}
