import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TransacoesFilter } from '../models/filter.model';

@Injectable({ providedIn: 'root' })
export class TransacaoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/transacoes';

  // filtrosAtivos = signal<TransacoesFilter>;
  filtrosAtivos = signal<TransacoesFilter>({
    contas: [],
    tag: '',
    lancamentoEfetivado: null,
    tipo: '',
    dataInicio: '2026-09-20',
    dataFim: '2026-09-24',
  });


  limparFiltro(chave: keyof TransacoesFilter): void {
    this.filtrosAtivos.update((filtros) => ({
      ...filtros,
      [chave]: Array.isArray(filtros[chave]) ? [] : null,
    }));
  }

  getTransacoes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Inserir uma nova transação (usado na Modal ao clicar em Salvar)
  salvarTransacao(transacao: any): Observable<any> {
    // const valorDigitado = transacao.valor;
    // const valorLimpo = valorDigitado.replace(/[R$\s.]/g, '').replace(',', '.');
    // const valorNumerico = parseFloat(valorLimpo);
    // transacao.valor = valorNumerico;

    console.log('salvarTransacao:', transacao);
    return this.http.post<any>(this.apiUrl, transacao);
  }
}
