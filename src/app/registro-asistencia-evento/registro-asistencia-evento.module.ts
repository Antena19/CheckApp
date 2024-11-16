import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroAsistenciaEventoPageRoutingModule } from './registro-asistencia-evento-routing.module';

import { RegistroAsistenciaEventoPage } from './registro-asistencia-evento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroAsistenciaEventoPageRoutingModule
  ],
  declarations: [RegistroAsistenciaEventoPage]
})
export class RegistroAsistenciaEventoPageModule {}
