import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilUsuarioComponent } from './perfil-usuario.component';

const routes: Routes = [
  {
    path: '',
    component: PerfilUsuarioComponent, // Asociar el componente con la ruta
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilUsuarioRoutingModule {}
