import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomeParticipantePageRoutingModule } from './home-participante-routing.module';
import { HomeParticipantePage } from './home-participante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeParticipantePageRoutingModule
  ],
  declarations: [HomeParticipantePage]
})
export class HomeParticipantePageModule {}

