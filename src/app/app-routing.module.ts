import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    loadComponent: () => import('./home/home.page')
      .then(m => m.HomePage)
  },

  {
    path: 'login',
    loadComponent: () => import('./login/login.page')
      .then(m => m.LoginPage)
  },

  {
    path: 'cadastro',
    loadComponent: () => import('./cadastro/cadastro.page')
      .then(m => m.CadastroPage)
  },

  // 🔒 ROTAS PROTEGIDAS
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'monitoramento',
    loadChildren: () => import('./monitoramento/monitoramento.module')
      .then(m => m.MonitoramentoPageModule),
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
