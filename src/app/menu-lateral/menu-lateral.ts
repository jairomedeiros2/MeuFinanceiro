import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NovaTransacao } from '../transacoes/nova-transacao/nova-transacao';

@Component({
  imports: [RouterLink, RouterLinkActive, NovaTransacao],
  selector: 'app-menu-lateral',
  styleUrl: './menu-lateral.scss',
  templateUrl: './menu-lateral.html',
})
export class MenuLateral {}
