import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../services/evento.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lista-asistentes',
  templateUrl: './lista-asistentes.page.html',
  styleUrls: ['./lista-asistentes.page.scss'],
})
export class ListaAsistentesPage implements OnInit {
  listaAsistentes: any[] = [];
  eventoIndex: number = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.eventoIndex = Number(this.route.snapshot.paramMap.get('id'));
    const evento = this.eventoService.obtenerEventos()[this.eventoIndex];
    if (evento && evento.asistentes) {
      this.listaAsistentes = evento.asistentes;
    }
  }

  // MÉTODO PARA AGREGAR UN NUEVO ASISTENTE
  async agregarAsistente() {
    const alert = await this.alertController.create({
      header: 'Agregar Asistente',
      inputs: [
        { name: 'rut', placeholder: 'RUT', type: 'text' },
        { name: 'nombreApellido', placeholder: 'Nombre y Apellido', type: 'text' },
        { name: 'telefono', placeholder: 'Teléfono', type: 'tel' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.rut && data.nombreApellido && data.telefono) {
              // Verificar si el asistente ya existe en la lista
              const asistenteExistente = this.listaAsistentes.find(asistente => asistente.rut === data.rut);
              if (asistenteExistente) {
                this.mostrarAlerta('Error', 'El asistente ya está registrado.');
              } else {
                data.estado = 'ausente'; // Estado inicial "ausente"
                this.listaAsistentes.push(data);
                this.guardarCambios();
              }
            } else {
              this.mostrarAlerta('Error', 'Todos los campos son obligatorios.');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  // MÉTODO PARA EDITAR UN ASISTENTE EXISTENTE
  async editarAsistente(index: number) {
    const asistente = this.listaAsistentes[index];
    const alert = await this.alertController.create({
      header: 'Editar Asistente',
      inputs: [
        { name: 'rut', value: asistente.rut, placeholder: 'RUT', type: 'text' },
        { name: 'nombreApellido', value: asistente.nombreApellido, placeholder: 'Nombre y Apellido', type: 'text' },
        { name: 'telefono', value: asistente.telefono, placeholder: 'Teléfono', type: 'tel' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.rut && data.nombreApellido && data.telefono) {
              // Actualizar la información del asistente
              this.listaAsistentes[index] = {
                ...data,
                estado: asistente.estado, // Mantener el estado actual del asistente
              };
              this.guardarCambios();
            } else {
              this.mostrarAlerta('Error', 'Todos los campos son obligatorios.');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  // MÉTODO PARA ELIMINAR UN ASISTENTE
  eliminarAsistente(index: number) {
    this.listaAsistentes.splice(index, 1);
    this.guardarCambios();
  }

  // MÉTODO PARA GUARDAR LOS CAMBIOS EN LA LISTA DE ASISTENTES
  guardarCambios() {
    const eventos = this.eventoService.obtenerEventos();
    if (this.eventoIndex >= 0) {
      eventos[this.eventoIndex].asistentes = this.listaAsistentes;
      this.eventoService.guardarEventos();
    }
  }

  // MÉTODO PARA VER DETALLE DEL EVENTO
  verDetalleEvento() {
    this.router.navigate(['/registro-asistencia-evento', { id: this.eventoIndex }]);
  }

  // MÉTODO PARA VOLVER A LA GESTIÓN DE EVENTOS
  volver() {
    this.router.navigate(['/gestion-de-eventos']);
  }

  // MÉTODO PARA MOSTRAR ALERTAS
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // MÉTODO PARA GENERAR INFORMES
  generarInformes() {
    this.router.navigate(['/generar-informes', { id: this.eventoIndex }]);
  }
}
