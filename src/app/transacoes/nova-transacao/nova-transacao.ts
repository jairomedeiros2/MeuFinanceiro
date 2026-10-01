import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransacaoService } from '../../services/transacao';
import { Transacao } from '../../models/transacao.model';

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
  novaTransacao: Transacao = {
    id: 0,
    valor: 0.00,
    moeda: "BR",
    data: "",
    descricao: "",
    categoria: "",
    lancamentoEfetivado: true,
    tag: '',
    conta: "",
    ignorarTransacao: false,
    observacao: "",
    lancamentoFixo: false,
    repetirTransacao: false,
    repetirVezes: 0,
    repetirTempo: false
  };

  alternarDetalhes() {
    this.exibirMaisDetalhes = !this.exibirMaisDetalhes;
  }

  // Função chamada no clique do botão SALVAR
  enviarDados() {
    // const valorDigitado = this.novaTransacao.valor;
    // const valorLimpo = valorDigitado
    //   .replace(/[R$\s.]/g, '')
    //   .replace(',', '.');
    // const valorNumerico = parseFloat(valorLimpo);
    // this.novaTransacao = valorNumerico;

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
