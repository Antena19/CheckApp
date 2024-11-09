import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'gestion-de-eventos',
    loadChildren: () => import('./gestion-de-eventos/gestion-de-eventos.module').then(m => m.GestionDeEventosModule),
    canActivate: [AuthGuard]  // Añadido AuthGuard
  },
  {
    path: 'crear-evento',
    loadChildren: () => import('./crear-evento/crear-evento.module').then(m => m.CrearEventoPageModule),
    canActivate: [AuthGuard]  // Añadido AuthGuard
  },
  {
    path: 'editar-evento',
    loadChildren: () => import('./editar-evento/editar-evento.module').then( m => m.EditarEventoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}