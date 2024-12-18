import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PerfilUsuarioComponent } from './perfil-usuario.component';
import { PerfilUsuarioRoutingModule } from './perfil-usuario-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilUsuarioRoutingModule, // Importar las rutas específicas del componente
  ],
  declarations: [PerfilUsuarioComponent],
})
export class PerfilUsuarioModule {}
