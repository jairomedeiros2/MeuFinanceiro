import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TransacaoService, inicioDoMes, fimDoMes } from '../services/transacao';
import { Transacao } from '../models/transacao.model';
import { FiltroTransacoes } from './filtro-transacoes/filtro-transacoes';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, FiltroTransacoes, CurrencyPipe],
  templateUrl: './transacoes.html',
  styleUrls: ['./transacoes.scss'],
})
export class Transacoes implements OnInit {
  private svc = inject(TransacaoService);

  ngOnInit(): void {
    this.svc.carregar();
  }

  /** Lista filtrada e ordenada (mais recente primeiro). Sem efeitos colaterais. */
  listaTransacoes = computed(() => {
    const filtro = this.svc.filtrosAtivos();
    const inicio = this.paraDate(filtro.dataInicio);
    const fim = this.paraDate(filtro.dataFim);
    const tipo = (filtro.tipo ?? '').toLowerCase();

    return this.svc
      .transacoes()
      .filter((t) => {
        if (filtro.contas.length > 0 && !filtro.contas.includes(t.conta)) return false;
        if (filtro.tag && t.tag !== filtro.tag) return false;
        if (
          filtro.lancamentoEfetivado !== null &&
          t.lancamentoEfetivado !== filtro.lancamentoEfetivado
        )
          return false;
        if (tipo.startsWith('receita') && t.valor <= 0) return false;
        if (tipo.startsWith('despesa') && t.valor >= 0) return false;

        const data = this.paraDate(t.data);
        if (data && inicio && data < inicio) return false;
        if (data && fim && data > fim) return false;
        return true;
      })
      .sort(
        (a, b) => (this.paraDate(b.data)?.getTime() ?? 0) - (this.paraDate(a.data)?.getTime() ?? 0),
      );
  });

  /** Cards da lateral: recalculados do zero a cada mudança (antes acumulavam). */
  resumo = computed(() => {
    const itens = this.listaTransacoes().filter((t) => !t.ignorarTransacao);
    const efetivados = itens.filter((t) => t.lancamentoEfetivado);

    const receitas = itens.filter((t) => t.valor > 0).reduce((s, t) => s + t.valor, 0);
    const despesas = itens.filter((t) => t.valor < 0).reduce((s, t) => s + Math.abs(t.valor), 0);

    return {
      saldoAtual: efetivados.reduce((s, t) => s + t.valor, 0),
      receitas,
      despesas,
      balancoMensal: receitas - despesas,
    };
  });

  rotuloMes = computed(() => {
    const inicio = this.paraDate(this.svc.filtrosAtivos().dataInicio) ?? new Date();
    const texto = inicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  });

  mesAnterior(): void {
    this.mudarMes(-1);
  }
  mesSeguinte(): void {
    this.mudarMes(1);
  }

  private mudarMes(delta: number): void {
    const base = this.paraDate(this.svc.filtrosAtivos().dataInicio) ?? new Date();
    const novo = new Date(base.getFullYear(), base.getMonth() + delta, 1);
    this.svc.filtrosAtivos.update((f) => ({
      ...f,
      dataInicio: inicioDoMes(novo),
      dataFim: fimDoMes(novo),
    }));
  }

  excluir(t: Transacao): void {
    if (t.id === undefined || !confirm(`Excluir "${t.descricao}"?`)) return;
    this.svc.excluirTransacao(t.id).subscribe({
      error: (e) => console.error('Erro ao excluir:', e),
    });
  }

  exibirData(valor: string): string {
    const d = this.paraDate(valor);
    return d ? d.toLocaleDateString('pt-BR') : valor;
  }

  /** Aceita "2026-10-15" (ISO) e "15/10/2026". */
  private paraDate(valor: string | null | undefined): Date | null {
    if (!valor) return null;
    if (valor.includes('/')) {
      const [dia, mes, ano] = valor.split('/').map(Number);
      return new Date(ano, mes - 1, dia);
    }
    const [ano, mes, dia] = valor.substring(0, 10).split('-').map(Number);
    return new Date(ano, mes - 1, dia);
  }
}
