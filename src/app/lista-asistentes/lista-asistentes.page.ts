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
              this.listaAsistentes.push(data);
              this.guardarCambios();
            }
          },
        },
      ],
    });
    await alert.present();
  }

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
              this.listaAsistentes[index] = data;
              this.guardarCambios();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  eliminarAsistente(index: number) {
    this.listaAsistentes.splice(index, 1);
    this.guardarCambios();
  }

  guardarCambios() {
    const eventos = this.eventoService.obtenerEventos();
    if (this.eventoIndex >= 0) {
      eventos[this.eventoIndex].asistentes = this.listaAsistentes;
      localStorage.setItem('eventos', JSON.stringify(eventos));
    }
  }

  verDetalleEvento() {
    this.router.navigate(['/registro-asistencia-evento', { id: this.eventoIndex }]);
  }

  volver() {
    this.router.navigate(['/gestion-de-eventos']);
  }
}
