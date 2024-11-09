import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionDeEventosComponent } from './gestion-de-eventos.component';

const routes: Routes = [
  {
    path: '',
    component: GestionDeEventosComponent // Ruta para el componente
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionDeEventosRoutingModule {}
