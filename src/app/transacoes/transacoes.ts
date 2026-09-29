import { ToString } from './../../../node_modules/type-fest/source/internal/string.d';
import { Includes } from './../../../node_modules/type-fest/source/includes.d';
import { IsNull } from './../../../node_modules/type-fest/source/is-null.d';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransacaoService } from '../services/transacao'; // Ajuste o caminho do seu serviço
import { FiltroTransacoes } from './filtro-transacoes/filtro-transacoes';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, FiltroTransacoes],
  templateUrl: './transacoes.html',
  styleUrls: ['./transacoes.scss'] // ou .css caso não use scss nesta pasta
})
export class Transacoes implements OnInit {
  private transacaoService = inject(TransacaoService);
  private dadosBrutos = signal<any[]>([]);

  // listaTransacoes: any[] = [];
  // listaTransacoes = signal<any[]>([]); //Com Signal criamos uma 'variavel inteligente' que monitora as mudanças por si mesma, tirando o problema do atraso na api.

  ngOnInit(): void {
    console.log('carregarTransacoes: ', this.listaTransacoes);
    this.carregarTransacoes();
  }

  listaTransacoes = computed(() => {
    const lista = this.dadosBrutos();
    const filtro = this.transacaoService.filtrosAtivos();

    return lista.filter(item => {
      //Se filtro não conter a conta remove a transação da lista.
      if(filtro.conta && filtro.conta.toLowerCase().indexOf(item.conta.toLowerCase()) == -1){
          return false;
      }
      // 2. Filtragem por lançamento efetivado
      if (filtro.lancamentoEfetivado) {
        const isLancamentoEfetivado = !item.lancamentoEfetivado;
        if (isLancamentoEfetivado) {
          return false;
        }
      }

      // 3. Filtragem por Intervalo de Datas
      if (filtro.dataInicio || filtro.dataFim) {
        const dataItem = this.converterDataJson(item.data);

        if (filtro.dataInicio) {
          const dataLimiteInicio = new Date(filtro.dataInicio + 'T00:00:00');
          if (dataItem < dataLimiteInicio) return false;
        }

        if (filtro.dataFim) {
          const dataLimiteFim = new Date(filtro.dataFim + 'T23:59:59');
          if (dataItem > dataLimiteFim) return false;
        }
      }
      return true;
    });
  });

// Converte "23/09/2026" do seu JSON para um objeto Date real comparável
  private converterDataJson(dataString: string): Date {
    const partes = dataString.split('/');
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Meses começam em 0 no JS
    const ano = parseInt(partes[2], 10);
    return new Date(ano, mes, dia);
  }

  carregarTransacoes(): void {
    this.transacaoService.getTransacoes().subscribe({
      next: (dados) => {
        // this.listaTransacoes = dados;
        // this.listaTransacoes.set(dados);
        this.dadosBrutos.set(dados);
        console.log('carregarTransacoes2: ', this.listaTransacoes);
        console.log('carregarTransacoes3: ', this.dadosBrutos);
      },
      error: (erro) => {
        console.error('Erro ao buscar transações do banco:', erro);
      }
    });
  }
}
