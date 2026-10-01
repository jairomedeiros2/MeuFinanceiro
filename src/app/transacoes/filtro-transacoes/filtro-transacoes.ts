import { TransacoesFilter } from './../../models/filter.model';
import { TransacaoService } from './../../services/transacao';
import { Transacoes } from './../transacoes';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-transacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-transacoes.html',
  styleUrls: ['./filtro-transacoes.scss'],
})
export class FiltroTransacoes {
  private transacaoService = inject(TransacaoService);
  public svc = inject(TransacaoService);
  salvarPersonalizado: boolean = true;
  dropdownContasAberto: boolean = false;
  dropdownTagsAberto: boolean = false;

  // Lista de opções disponíveis de contas
  contasDisponiveis = signal<string[]>([
    'Itau',
    'Nuconta',
    'Bradesco',
    'Caixa',
    'Santander',
    'Carteira',
  ]);

  tagsDisponiveis = signal<string[]>([
    'Salário',
    'Receita',
    'Despesa',
    'Transferência',
    'Mecado',
    'Transporte',
    'Saúde',
    'Outros',
  ]);

  filtros: TransacoesFilter = {
    contas: ['Itau'] as string[],
    tag: '',
    lancamentoEfetivado: null,
    tipo: '',
    dataInicio: '2026-09-20',
    dataFim: '2026-09-24',
  };

  ngOnInit(): void {
    const filtrosSelecionados = this.svc.filtrosAtivos();
    if (filtrosSelecionados) {
      const contasIniciais = Array.isArray(filtrosSelecionados.contas)
        ? filtrosSelecionados.contas
        : filtrosSelecionados.contas
          ? [filtrosSelecionados.contas]
          : [];

      this.filtros.contas = [...contasIniciais];
    }

  }

  alterarDropdown(tipo: string): void {
    console.log('alterarDropdown:', tipo);
    // this.dropdownContasAberto = !this.dropdownContasAberto;
    if (tipo == 'contas') this.dropdownContasAberto = !this.dropdownContasAberto;
    else if (tipo == 'tag') this.dropdownTagsAberto = !this.dropdownContasAberto;
  }

  // Fecha o dropdown ao tirar o ponteiro do mouse
  fecharDropdown(tipo: string): void {
    if (tipo == 'contas') this.dropdownContasAberto = false;
    else if (tipo == 'tag') this.dropdownTagsAberto = false;
  }

  // Alterna a seleção da conta no array do rascunho
  alterarConta(conta: string): void {
    const index = this.filtros.contas.indexOf(conta);
    if (index > -1) {
      this.filtros.contas.splice(index, 1);
    } else {
      this.filtros.contas.push(conta);
    }
    console.log('alterarConta():', this.filtros.contas);
  }

  alterarTag(tag:string): void{
    if (tag) {
      this.filtros.tag = tag;
    } else {
      this.filtros.tag = ''
    }
  }

  removerConta(conta: string, event: Event): void {
    event.stopPropagation();
    this.filtros.contas = this.filtros.contas.filter((c) => c !== conta);
  }

  getCorBanco(nomeConta: string): string {
    if (!nomeConta) return '#5c16ca';
    const c = nomeConta.toLowerCase();
    if (c.includes('itau') || c.includes('itaú')) return '#ec7000';
    if (c.includes('nu') || c.includes('nubank')) return '#820ad1';
    if (c.includes('caixa')) return '#005ca9';
    if (c.includes('bradesco')) return '#cc092f';
    if (c.includes('santander')) return '#ea1d2c';
    return '#5c16ca';
  }

  aplicarFiltro() {
    // this.transacaoService.filtrosAtivos.set({ ...this.filtros });
    console.log('filtrosAtivos: ', this.svc.filtrosAtivos);
    this.svc.filtrosAtivos.set({ ...this.filtros });
    console.log('aplicarFiltro: ', this.filtros);

    // Fecha a modal do Bootstrap
    const modalElement = document.getElementById('modalFiltroTransacoes');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
    }
  }
}
