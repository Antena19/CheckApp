import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeParticipantePage } from './home-participante.page';

const routes: Routes = [
  {
    path: '',
    component: HomeParticipantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeParticipantePageRoutingModule {}

