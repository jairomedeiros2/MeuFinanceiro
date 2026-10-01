// import { ToString } from './../../../node_modules/type-fest/source/internal/string.d';
// import { Includes } from './../../../node_modules/type-fest/source/includes.d';
// import { IsNull } from './../../../node_modules/type-fest/source/is-null.d';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TransacaoService } from '../services/transacao'; // Ajuste o caminho do seu serviço
import { FiltroTransacoes } from './filtro-transacoes/filtro-transacoes';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, FiltroTransacoes, CurrencyPipe],
  templateUrl: './transacoes.html',
  styleUrls: ['./transacoes.scss'],
})
export class Transacoes implements OnInit {
  private transacaoService = inject(TransacaoService);
  private dadosBrutos = signal<any[]>([]);

  cardsLateral = {
    saldoAtual: 0.0,
    receitas: 0.0,
    despesas: 0.0,
    balancoMensal: 0.0,
  };

  ngOnInit(): void {
    this.carregarTransacoes();
  }

  listaTransacoes = computed(() => {
    const lista = this.dadosBrutos();
    const filtro = this.transacaoService.filtrosAtivos();

    return lista.filter((item) => {
      console.log('listaTransacoes - item: ', item);
      // 1. Filtro por Contas
      if (filtro.contas && filtro.contas.length > 0) {
        if (!filtro.contas.includes(item.conta)) {
          return false;
        }
      }

       if (filtro.tag) {
         if (!filtro.tag.includes(item.tag)) {
           return false;
         }
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

      if(item.valor > 0){
        this.cardsLateral.receitas += item.valor;
      }
      else{
        this.cardsLateral.despesas -= item.valor;
      }
      //Calculo do Saldo atual = Saldo Inicial das contas ativas + (Todas Receitas Efetivadas + Transferências de entrada)  - (Todas Despesas Efetivadas +Transferências de saída)
      this.cardsLateral.saldoAtual += item.valor;
      this.cardsLateral.balancoMensal += item.valor;

      // console.log('saldo valor: ', item.valor);
      // console.log('saldo receitas: ', this.cardsLateral.receitas);
      // console.log('saldo despesas: ', this.cardsLateral.despesas);
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
        this.dadosBrutos.set(dados);
        // console.log('carregarTransacoes2: ', dados);
      },
      error: (erro) => {
        console.error('Erro ao buscar transações do banco:', erro);
      },
    });
  }
}
