import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventoService } from '../services/evento.service';
import QRCode from 'qrcode';
import { Share } from '@capacitor/share';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-asistencia-modal',
  templateUrl: './registro-asistencia-modal.component.html',
  styleUrls: ['./registro-asistencia-modal.component.scss'],
})
export class RegistroAsistenciaModalComponent {
  @Input() idEvento: string = ''; // ID del evento pasado al modal
  evento: any;

  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef;

  constructor(
    private modalController: ModalController,
    private eventoService: EventoService,
    private router: Router // Importamos el Router para la navegación
  ) {}

  // MÉTODO PARA CARGAR EL EVENTO AL ABRIR EL MODAL
  ngOnInit() {
    this.evento = this.eventoService.obtenerEventoPorId(this.idEvento);
  }

  // MÉTODO PARA CERRAR EL MODAL
  cerrarModal() {
    this.modalController.dismiss();
  }

  // MÉTODO PARA MOSTRAR EL QR DEL EVENTO
  mostrarQR() {
    if (this.evento) {
      const url = `https://miapp.com/evento/${this.evento.id}`;
      const canvas = this.qrCanvas.nativeElement as HTMLCanvasElement;

      QRCode.toCanvas(canvas, url, { errorCorrectionLevel: 'H' }, (error: any) => {
        if (error) {
          console.error('Error al generar el QR:', error);
        } else {
          console.log('QR generado exitosamente');
        }
      });
    }
  }

  // MÉTODO PARA COMPARTIR EL CÓDIGO QR
  async compartirQR() {
    const canvas = this.qrCanvas.nativeElement as HTMLCanvasElement;
    const imageData = canvas.toDataURL('image/png');

    try {
      await Share.share({
        title: 'Asistencia al Evento',
        text: 'Escanea este código para registrar tu asistencia al evento.',
        url: imageData,
        dialogTitle: 'Compartir Código QR'
      });
    } catch (error) {
      console.error('Error al compartir el código QR:', error);
    }
  }

// MÉTODO PARA VER LA LISTA DE ASISTENTES
verListaAsistentes() {
  // Primero, cerramos el modal y luego navegamos a la página de lista de asistentes
  this.modalController.dismiss().then(() => {
    this.router.navigate(['/lista-asistentes'], { queryParams: { id: this.idEvento } });
  });
}

}
