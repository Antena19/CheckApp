import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventoService } from '../services/evento.service';
import QRCode from 'qrcode';
import { Share } from '@capacitor/share';
import { Router } from '@angular/router';
import { AutenticacionService } from '../services/autenticacion.service'; // Servicio de autenticación
import { Filesystem, Directory } from '@capacitor/filesystem';


@Component({
  selector: 'app-registro-asistencia-modal',
  templateUrl: './registro-asistencia-modal.component.html',
  styleUrls: ['./registro-asistencia-modal.component.scss'],
})
export class RegistroAsistenciaModalComponent {
  @Input() idEvento: string = ''; // ID del evento pasado al modal
  evento: any;
  rutUsuario: string = ''; // RUT del usuario autenticado

  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef;

  constructor(
    private modalController: ModalController,
    private eventoService: EventoService,
    private router: Router,
    private authService: AutenticacionService, 
    

  ) {}

  // MÉTODO PARA CARGAR EL EVENTO AL ABRIR EL MODAL
  async ngOnInit() {
    // Obtener el usuario autenticado
    const usuarioActual = await this.authService.obtenerUsuarioActual();
    if (usuarioActual && usuarioActual.rut) {
      this.rutUsuario = usuarioActual.rut;

      // Obtener el evento asociado al usuario autenticado
      this.evento = this.eventoService.obtenerEventoPorIdYUsuario(this.idEvento, this.rutUsuario);

      if (!this.evento) {
        console.error('Evento no encontrado o no tienes permiso para acceder a él.');
        this.cerrarModal(); // Cerrar el modal si no se encuentra el evento o no hay permiso
      }
    } else {
      console.error('No se ha podido obtener el usuario logueado.');
      this.cerrarModal(); // Cerrar el modal si no se obtiene el usuario autenticado
    }
  }

  // MÉTODO PARA CERRAR EL MODAL
  cerrarModal(shouldNavigate: boolean = false) {
    this.modalController.dismiss({
      shouldNavigate: shouldNavigate
    });
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

  // Convertir el canvas a imagen base64
  const imageData = canvas.toDataURL('image/png');

  if (this.isRunningInBrowser()) {
    // Verificar si la imagen se generó correctamente
    if (!imageData || !imageData.startsWith('data:image/png;base64,')) {
      console.error('Error: No se pudo generar la imagen del código QR.');
      return;
    }

    // Si estamos en el navegador, creamos un enlace de descarga
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'codigo-qr.png'; // Nombre del archivo a descargar

    // Añadimos el enlace al DOM, disparamos el clic y luego lo eliminamos
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Convertir base64 a Blob para guardar como archivo
    const response = await fetch(imageData);
    const blob = await response.blob();

    // Guardar el blob como un archivo en el sistema de archivos del dispositivo
    try {
      const fileName = 'codigo-qr.png';
      const fileResult = await Filesystem.writeFile({
        path: fileName,
        data: blob,
        directory: Directory.Cache
      });

      // Compartir el archivo guardado
      await Share.share({
        title: 'Asistencia al Evento',
        text: 'Escanea este código para registrar tu asistencia al evento.',
        url: `file://${fileResult.uri}`,
        dialogTitle: 'Compartir Código QR'
      });
    } catch (error) {
      console.error('Error al guardar o compartir el código QR:', error);
    }
  }
}

// MÉTODO PARA DETECTAR SI ESTAMOS EN EL NAVEGADOR O EN UN DISPOSITIVO
isRunningInBrowser() {
  return window && window.document && window.document.createElement;
}



// Método para ver la lista de asistentes
verListaAsistentes() {
  // Primero, cerramos el modal y luego navegamos a la página de lista de asistentes
  this.modalController.dismiss({ shouldNavigate: true });
}

//METODO PARA CERRAR EL MODAL
closeModal() {
  this.modalController.dismiss();
}

}
