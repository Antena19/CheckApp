import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditarEventoPageRoutingModule } from './editar-evento-routing.module';
import { EditarEventoPage } from './editar-evento.page';
// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarEventoPageRoutingModule,
    MatFormFieldModule, // Importación de Angular Material Form Field
    MatInputModule, // Importación para MatInput
    MatDatepickerModule, // Importación para Datepicker
    MatNativeDateModule, // Requerido para usar el Datepicker
    MatButtonModule // Para los botones de Material
  ],
  declarations: [EditarEventoPage]
})
export class EditarEventoPageModule {}
