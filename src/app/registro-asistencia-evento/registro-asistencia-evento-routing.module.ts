import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroAsistenciaEventoPage } from './registro-asistencia-evento.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroAsistenciaEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroAsistenciaEventoPageRoutingModule {}
