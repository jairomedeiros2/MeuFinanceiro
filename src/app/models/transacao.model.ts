export interface Transacao {
  id?: string; // gerado pelo json-server ao salvar (não envie no POST)
  valor: number; // receita > 0, despesa < 0
  moeda: string;
  data: string; // ISO: "2026-10-15"
  descricao: string;
  categoria: string;
  lancamentoEfetivado: boolean;
  tag: string | null;
  conta: string;
  ignorarTransacao: boolean;
  observacao: string;
  lancamentoFixo: boolean;
  repetirTransacao: boolean;
  repetirVezes: number;
  repetirTempo: boolean | null;
}
