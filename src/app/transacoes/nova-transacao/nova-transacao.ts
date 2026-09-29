import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransacaoService } from '../../services/transacao';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-nova-transacao',
  standalone: true,
  styleUrl: './nova-transacao.scss',
  templateUrl: './nova-transacao.html',
})
export class NovaTransacao {
  private transacaoService = inject(TransacaoService);

  exibirMaisDetalhes: boolean = true; // Controla se a seção estendida (lado direito) está visível

 // Objeto modelo espelhando seu transacoes.json
  novaTransacao: any = {
    valor: "0,00",
    moeda: "BR",
    data: "24/09/2026",
    descricao: "",
    categoria: "salário",
    lancamentoEfetivado: true,
    tag: null,
    conta: "Itau",
    ignorarTransacao: false,
    observacao: "",
    lancamentoFixo: false,
    repetirTransacao: false,
    repetirVezes: 0,
    repetirTempo: null
  };

  alternarDetalhes() {
    this.exibirMaisDetalhes = !this.exibirMaisDetalhes;
  }

  // Função chamada no clique do botão SALVAR
  enviarDados() {
    this.transacaoService.salvarTransacao(this.novaTransacao).subscribe({
      next: (resposta) => {
        console.log('Salvo com sucesso no JSON!', resposta);
        alert('Transação salva com sucesso!');
        // Aqui você pode disparar um evento para fechar a modal ou atualizar a lista
      },
      error: (err) => console.error('Erro ao salvar:', err)
    });
  }
}
