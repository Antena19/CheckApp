import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GestionDeEventosRoutingModule } from './gestion-de-eventos-routing.module'; // Rutas del módulo
import { GestionDeEventosComponent } from './gestion-de-eventos.component'; // Componente

@NgModule({
  declarations: [GestionDeEventosComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionDeEventosRoutingModule // Importa el módulo de rutas
  ]
})
export class GestionDeEventosModule {}
