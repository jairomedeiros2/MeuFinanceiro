import { Routes } from '@angular/router';
import { Planejamento } from './planejamento/planejamento';
import { Dashboard } from './dashboard/dashboard';
import { Contas } from './contas/contas';
import { CartoesCredito } from './cartoes-credito/cartoes-credito';
import { Transacoes } from './transacoes/transacoes';

export const routes: Routes = [
  { path: '', redirectTo: '/planejamento', pathMatch: 'full' },
  { path: 'planejamento', component: Planejamento },
  { path: 'transacoes', component: Transacoes },
  { path: 'dashboard', component: Dashboard },
  { path: 'contas', component: Contas },
  { path: 'cartoes', component: CartoesCredito },
  { path: '**', redirectTo: '/planejamento' }   // Rota curinga para páginas não encontradas (404)
];
