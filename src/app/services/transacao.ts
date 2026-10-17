import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Transacao } from '../models/transacao.model';
import { ChaveFiltro, TransacoesFilter } from '../models/filter.model';

export function formatarDataLocal(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function inicioDoMes(ref: Date = new Date()): string {
  return formatarDataLocal(new Date(ref.getFullYear(), ref.getMonth(), 1));
}

// dia 0 do mês seguinte = último dia do mês (resolve meses com 28/29/30/31 dias)
export function fimDoMes(ref: Date = new Date()): string {
  return formatarDataLocal(new Date(ref.getFullYear(), ref.getMonth() + 1, 0));
}

export function ehMesCompleto(inicio: string, fim: string): boolean {
  const [a, m] = (inicio ?? '').split('-').map(Number);
  if (!a || !m) return false;
  const ref = new Date(a, m - 1, 1);
  return inicio === inicioDoMes(ref) && fim === fimDoMes(ref);
}

@Injectable({ providedIn: 'root' })
export class TransacaoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/transacoes';

  /** Lista completa vinda do json-server. Todas as telas leem daqui. */
  readonly transacoes = signal<Transacao[]>([]);

  readonly filtrosAtivos = signal<TransacoesFilter>({
    contas: [],
    tag: '',
    lancamentoEfetivado: null,
    tipo: '',
    dataInicio: inicioDoMes(),
    dataFim: fimDoMes(),
  });

  carregar(): void {
    this.http.get<Transacao[]>(this.apiUrl).subscribe({
      next: (dados) => this.transacoes.set(dados),
      error: (erro) => console.error('Erro ao buscar transações:', erro),
    });
  }

  salvarTransacao(transacao: Transacao): Observable<Transacao> {
    return this.http.post<Transacao>(this.apiUrl, transacao).pipe(tap(() => this.carregar()));
  }

  atualizarTransacao(transacao: Transacao): Observable<Transacao> {
    return this.http
      .put<Transacao>(`${this.apiUrl}/${transacao.id}`, transacao)
      .pipe(tap(() => this.carregar()));
  }

  excluirTransacao(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.carregar()));
  }

  // limparFiltro(chave: keyof TransacoesFilter): void {
  //   this.filtrosAtivos.update((filtros) => {
  //     const atual = filtros[chave];
  //     const vazio = Array.isArray(atual) ? [] : typeof atual === 'string' ? '' : null;
  //     return { ...filtros, [chave]: vazio };
  //   });
  // }

  /** Remove um filtro específico (ou uma conta específica, no caso de 'contas'). */
  removerFiltro(chave: ChaveFiltro, valor?: string): void {
    this.filtrosAtivos.update((f) => {
      switch (chave) {
        case 'contas':
          return { ...f, contas: f.contas.filter((c) => c !== valor) };
        case 'tag':
          return { ...f, tag: '' };
        case 'tipo':
          return { ...f, tipo: '' };
        case 'lancamentoEfetivado':
          return { ...f, lancamentoEfetivado: null };
        // case 'periodo':
        //   return { ...f, ...this.mesDe(f.dataInicio) };
      }
    });
  }

  /** Limpa tudo, mas mantém o mês que o usuário está vendo. */
  limparTodos(): void {
    this.filtrosAtivos.update((f) => ({
      ...f,
      contas: [],
      tag: '',
      tipo: '',
      lancamentoEfetivado: null,
      // ...this.mesDe(f.dataInicio),
    }));
  }

  /** Mês cheio que contém a data informada (ou o mês atual se ela for inválida). */
  private mesDe(iso: string): { dataInicio: string; dataFim: string } {
    const [a, m] = (iso ?? '').split('-').map(Number);
    const ref = a && m ? new Date(a, m - 1, 1) : new Date();
    return { dataInicio: inicioDoMes(ref), dataFim: fimDoMes(ref) };
  }
}
