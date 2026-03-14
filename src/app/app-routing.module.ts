import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importe garantido

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./cadastro/cadastro.page').then(m => m.CadastroPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'redefsenha',
    loadComponent: () => import('./redefsenha/redefsenha.page').then(m => m.RedefsenhaPage)
  },

  // 🔒 ROTAS PROTEGIDAS (Com AuthGuard)
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AuthGuard] // 🛡️ Protegido
  },
  {
    path: 'monitoramento',
    loadComponent: () => import('./monitoramento/monitoramento.page').then(m => m.MonitoramentoPage),
    canActivate: [AuthGuard] // 🛡️ Protegido
  },
  {
    path: 'solodetect',
    loadChildren: () => import('./solodetect/solodetect.module').then( m => m.SolodetectPageModule)
  },
   {
    path: 'soloia',
    loadChildren: () => import('./soloia/soloia.module').then( m => m.SoloIAPageModule)
  },  {
    path: 'solochat',
    loadChildren: () => import('./solochat/solochat.module').then( m => m.SolochatPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}