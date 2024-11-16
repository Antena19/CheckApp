import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SinLoginPage } from './sin-login.page';

const routes: Routes = [
  {
    path: '',
    component: SinLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinLoginPageRoutingModule {}
