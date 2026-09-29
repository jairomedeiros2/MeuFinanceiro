import { TransacaoService } from './../../services/transacao';
import { Transacoes } from './../transacoes';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-transacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-transacoes.html',
  styleUrls: ['./filtro-transacoes.scss']
})
export class FiltroTransacoes {
  private transacaoService = inject(TransacaoService);
  public svc = inject(TransacaoService); // Tornado público para ler no HTML
  salvarPersonalizado: boolean = true;

  // Objeto local para espelhar as opções selecionadas na tela
  filtros = {
    conta: 'Itau',
    tag: '',
    lancamentoEfetivado: null,
    tipo: '',
    dataInicio: '2026-09-20',
    dataFim: '2026-09-24'
  };


  aplicarFiltro() {
    // Atualiza o Signal global com as novas escolhas do usuário
    // this.transacaoService.filtrosAtivos.set({ ...this.filtros });
    this.svc.filtrosAtivos.set({ ...this.filtros });
    console.log("aplicarFiltro: ",this.filtros)

    // Comando do Bootstrap para fechar a modal programaticamente
    const modalElement = document.getElementById('modalFiltroTransacoes');
    if (modalElement) {
      const bootstrap = (window as any).bootstrap;
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
    }
  }
}
