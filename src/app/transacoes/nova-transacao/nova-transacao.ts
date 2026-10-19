import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransacaoService, formatarDataLocal } from '../../services/transacao';
import { Transacao } from '../../models/transacao.model';
import { CONTAS, CATEGORIAS_DESPESA, CATEGORIAS_RECEITA } from '../../models/opcoes.model';

export type TipoLancamento = 'receita' | 'despesa' | 'transferencia';
type AtalhoData = 'hoje' | 'ontem' | 'outros';

const MAX_DIGITOS = 12; // até 9.999.999.999,99

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-nova-transacao',
  standalone: true,
  styleUrl: './nova-transacao.scss',
  templateUrl: './nova-transacao.html',
})
export class NovaTransacao {
  private transacaoService = inject(TransacaoService);

  readonly contas = CONTAS;

  tipo = signal<TipoLancamento>('receita');
  exibirMaisDetalhes = signal(false);
  atalhoData = signal<AtalhoData>('hoje');
  erros = signal<string[]>([]);
  salvando = signal(false);
  novaTransacao = signal<Transacao>(this.modeloVazio());
  valorCentavos = signal(0);
  valorFormatado = computed(() => this.formatarCentavos(this.valorCentavos()));

  categorias = computed(() =>
    this.tipo() === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA,
  );

  private modeloVazio(): Transacao {
    return {
      valor: 0,
      moeda: 'BR',
      data: formatarDataLocal(new Date()),
      descricao: '',
      categoria: '',
      lancamentoEfetivado: true,
      tag: '',
      conta: '',
      ignorarTransacao: false,
      observacao: '',
      lancamentoFixo: false,
      repetirTransacao: false,
      repetirVezes: 0,
      repetirTempo: false,
    };
  }

  /** Chamado pelo menu lateral ao abrir o modal (Receita ou Despesa). */
  definirTipo(tipo: TipoLancamento): void {
    this.tipo.set(tipo);
    this.reiniciar();
  }

  /** Seletor Receita | Despesa do topo: troca o tipo e mantém os demais campos. */
  alterarTipo(tipo: TipoLancamento): void {
    if (this.tipo() === tipo) return;
    this.tipo.set(tipo);
    // a categoria escolhida pode não existir no outro tipo: limpa só nesse caso
    const permitidas = this.categorias();
    this.novaTransacao.update((t) =>
      permitidas.includes(t.categoria) ? t : { ...t, categoria: '' },
    );
  }

  private reiniciar(): void {
    this.novaTransacao.set(this.modeloVazio());
    this.valorCentavos.set(0);
    this.atalhoData.set('hoje');
    this.erros.set([]);
    this.salvando.set(false);
  }

  alternarDetalhes(): void {
    this.exibirMaisDetalhes.update((v) => !v);
    if (this.exibirMaisDetalhes()) {

    }
  }

  selecionarData(atalho: AtalhoData): void {
    this.atalhoData.set(atalho);
    if (atalho === 'outros') return; // o usuário escolhe no calendário
    const d = new Date();
    if (atalho === 'ontem') d.setDate(d.getDate() - 1);
    this.novaTransacao.update((t) => ({ ...t, data: formatarDataLocal(d) }));
  }

  /**
   * Máscara de moeda: cada dígito digitado entra pela direita (centavos).
   * 1 -> 0,01 | 10 -> 0,10 | 102 -> 1,02 | 1020 -> 10,20 | 10203 -> 102,03 | 102030 -> 1.020,30
   * Backspace remove o último dígito.
   */
  aoDigitarValor(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitos = input.value.replace(/\D/g, '').slice(0, MAX_DIGITOS);
    const centavos = digitos ? parseInt(digitos, 10) : 0;

    this.valorCentavos.set(centavos);
    input.value = this.formatarCentavos(centavos); // reescreve o campo já mascarado
  }

  private formatarCentavos(centavos: number): string {
    if (centavos === 0) return '';
    return (centavos / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private validar(): string[] {
    const t = this.novaTransacao();
    const erros: string[] = [];
    if (this.valorCentavos() <= 0) erros.push('Informe um valor maior que zero.');
    if (!t.descricao.trim()) erros.push('Informe a descrição.');
    if (!t.categoria) erros.push('Selecione a categoria.');
    if (!t.conta) erros.push('Selecione a conta.');
    if (!t.data) erros.push('Informe a data.');
    if (t.repetirTransacao && (!t.repetirVezes || t.repetirVezes < 2)) {
      erros.push('Para repetir, informe 2 vezes ou mais.');
    }
    return erros;
  }

  enviarDados(): void {
    if (this.salvando()) return;

    const erros = this.validar();
    this.erros.set(erros);
    if (erros.length > 0) return;

    const t = this.novaTransacao();
    const sinal = this.tipo() === 'despesa' ? -1 : 1;
    const payload: Transacao = {
      ...t,
      descricao: t.descricao.trim(),
      observacao: t.observacao.trim(),
      valor: sinal * (this.valorCentavos() / 100), // receita > 0, despesa < 0
      repetirVezes: t.repetirTransacao ? t.repetirVezes : 0,
    };

    this.salvando.set(true);
    this.transacaoService.salvarTransacao(payload).subscribe({
      next: () => {
        this.fecharModal();
        this.reiniciar();
      },
      error: (err) => {
        console.error('Erro ao salvar:', err);
        this.erros.set([
          'Não foi possível salvar. Confira se o json-server está rodando em localhost:3000.',
        ]);
        this.salvando.set(false);
      },
    });
  }

  private fecharModal(): void {
    const el = document.getElementById('modalNovaTransacao');
    const bootstrap = (window as any).bootstrap;
    if (el && bootstrap) bootstrap.Modal.getInstance(el)?.hide();
  }
}
