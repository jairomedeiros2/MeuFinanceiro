import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuLateral } from './menu-lateral/menu-lateral';
import { Cabecalho } from './cabecalho/cabecalho';
import { Planejamento } from './planejamento/planejamento';

@Component({
  imports: [RouterOutlet, MenuLateral, Cabecalho],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('MeuFinanceiro');
}
