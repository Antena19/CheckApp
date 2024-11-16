import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SinLoginPageRoutingModule } from './sin-login-routing.module';

import { SinLoginPage } from './sin-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SinLoginPageRoutingModule
  ],
  declarations: [SinLoginPage]
})
export class SinLoginPageModule {}
