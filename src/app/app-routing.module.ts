import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard'; // Guard para administradores
import { ParticipantGuard } from './services/participant.guard'; // Guard para participantes

const routes: Routes = [
  {
    path: '',
    redirectTo: 'introduccion', // Cambiamos la redirección inicial a la página de introducción
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard, AdminGuard] // Restringido para administradores
  },
  {
    path: 'home-participante',
    loadChildren: () => import('./home-participante/home-participante.module').then(m => m.HomeParticipantePageModule),
    canActivate: [AuthGuard, ParticipantGuard] // Restringido para participantes
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
    canActivate: [AuthGuard, AdminGuard] // Restringido para administradores
  },
  {
    path: 'crear-evento',
    loadChildren: () => import('./crear-evento/crear-evento.module').then(m => m.CrearEventoPageModule),
    canActivate: [AuthGuard, AdminGuard] // Restringido para administradores
  },
  {
    path: 'editar-evento',
    loadChildren: () => import('./editar-evento/editar-evento.module').then(m => m.EditarEventoPageModule),
    canActivate: [AuthGuard, AdminGuard] // Restringido para administradores
  },
  {
    path: 'introduccion',
    loadChildren: () => import('./introduccion/introduccion.module').then(m => m.IntroduccionPageModule)
  },
  {
    path: 'sin-login',
    loadChildren: () => import('./sin-login/sin-login.module').then(m => m.SinLoginPageModule)
  },
  {
    path: 'registro2',
    loadChildren: () => import('./registro2/registro2.module').then(m => m.Registro2PageModule)
  },
  {
    path: 'registro-asistencia-evento',
    loadChildren: () => import('./registro-asistencia-evento/registro-asistencia-evento.module').then(m => m.RegistroAsistenciaEventoPageModule)
  },
  {
    path: 'lista-asistentes',
    loadChildren: () => import('./lista-asistentes/lista-asistentes.module').then(m => m.ListaAsistentesPageModule)
  },
  {
    path: 'perfil-usuario',
    loadChildren: () => import('./perfil-usuario/perfil-usuario.module').then(m => m.PerfilUsuarioModule),
    canActivate: [AuthGuard] // Solo usuarios logueados
  },
  {
    path: 'reportes',
    loadChildren: () => import('./reportes/reportes.module').then( m => m.ReportesPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
