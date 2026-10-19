import { TransacoesFilter } from './../../models/filter.model';
import { TransacaoService } from './../../services/transacao';
import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CONTAS,
  TAGS,
  DropdownId,
  SITUACOES,
  corBanco,
  LANCAMENTO_FIXO,
} from '../../models/opcoes.model';

@Component({
  selector: 'app-filtro-transacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-transacoes.html',
  styleUrls: ['./filtro-transacoes.scss'],
})
export class FiltroTransacoes {
  //#region Fechar dropdown ao clicar fora
  @HostListener('document:pointerdown', ['$event'])
  fecharAoClicarFora(event: PointerEvent): void {
    if (!this.dropdownAberto) return;
    const alvo = event.target as Element | null;
    if (!alvo?.closest('.campo-dropdown')) this.dropdownAberto = null;
  }
  //#endregion Explicação da region no final do código (explicação 01)

  readonly transacaoService = inject(TransacaoService);
  salvarPersonalizado: boolean = true; //**

  readonly contasDisponiveis = CONTAS;
  readonly tagsDisponiveis = TAGS;
  readonly situacoesDisponiveis = SITUACOES;
  readonly lancamentoFixoDisponiveis = LANCAMENTO_FIXO;
  filtros: TransacoesFilter = this.clonar(this.transacaoService.filtrosAtivos());
  dropdownAberto: DropdownId | null = null;

  private clonar(f: TransacoesFilter): TransacoesFilter {
    return { ...f, contas: [...f.contas] };
  }

  sincronizar(): void {
    this.filtros = this.clonar(this.transacaoService.filtrosAtivos());
  }

  ngOnInit(): void {

  }

  alterarDropdown(id: DropdownId): void {
    this.dropdownAberto = this.dropdownAberto === id ? null : id;
  }

  alterarSelect(id: DropdownId, valor: any, event?: Event): void {
    event?.stopPropagation();

    switch (id) {
      case 'contas': {
        const c = this.filtros.contas;
        this.filtros.contas = c.includes(valor) ? c.filter((x) => x !== valor) : [...c, valor];
        break; // multisseleção: mantém aberto
      }
      case 'tag':
        this.filtros.tag = valor || '';
        this.dropdownAberto = null;
        break;
      case 'lancamentoFixo':
        this.filtros.lancamentoFixo = typeof valor === 'boolean' ? valor : null;
        this.dropdownAberto = null;
        break;
      case 'status':
        this.filtros.lancamentoEfetivado = typeof valor === 'boolean' ? valor : null; // ('' == false) é igual verdadeiro
        this.dropdownAberto = null;
        break;
    }
  }

  removerConta(conta: string, event: Event): void {
    event.stopPropagation();
    this.filtros.contas = this.filtros.contas.filter((c) => c !== conta);
  }

  getCorBanco(nomeConta: string): string {
    return corBanco(nomeConta);
  }

  aplicarFiltro(): void {
    this.transacaoService.filtrosAtivos.set(this.clonar(this.filtros));
    this.fecharModal();
  }

  private fecharModal(): void {
    const el = document.getElementById('modalFiltroTransacoes');
    const bootstrap = (window as any).bootstrap;
    if (el && bootstrap) bootstrap.Modal.getInstance(el)?.hide();
  }
}

/*==================== Explicações do código ====================*/
/*========== Explicação 01: Região para agrupar métodos relacionados ao fechamento do dropdown ==========*/
/* Usei pointerdown em vez de click por dois motivos:
    * Toque no iOS: o Safari do iOS não dispara click no document quando o elemento tocado não é “clicável” (uma div comum, por exemplo). O pointerdown funciona igual em mouse, toque e caneta.
    * Ordem dos eventos: o pointerdown acontece antes do click. Quando o clique numa opção remove o elemento do DOM (o @if fecha o menu), o handler de fora já rodou com o elemento ainda no lugar, sem risco de o closest falhar num nó removido.

** O @HostListener fica sempre ativo, mas retorna logo na primeira linha quando nenhum dropdown está aberto, então o custo é desprezível.
    //Não precisei mais usar esse...
    @HostListener('document:keydown.escape')
    fecharComEsc(): void {
      this.dropdownAberto = null;
    }
*/
