// src/app/services/notificacion.service.ts
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  constructor(private alertController: AlertController) {}

  async mostrarMensaje(titulo: string, mensaje: string, tipo: 'success' | 'error') {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: tipo === 'success' ? 'alert-success' : 'alert-error'
    });
    await alert.present();
  }
}
