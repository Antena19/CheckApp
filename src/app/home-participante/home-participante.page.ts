import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventoService } from '../services/evento.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-home-participante',
  templateUrl: './home-participante.page.html',
  styleUrls: ['./home-participante.page.scss'],
})
export class HomeParticipantePage implements OnInit {
  eventosInscrito: any[] = [];
  eventosPresente: any[] = [];
  todosLosEventos: any[] = [];
  eventosFiltrados: any[] = [];
  rutParticipante: string = '';
  username: string = '';
  fechaFiltro: Date | null = null;
  busqueda: string = '';

  constructor(
    private router: Router,
    private eventoService: EventoService,
    private storage: Storage,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const usuarioActual = await this.storage.get('usuarioActual');

    if (usuarioActual && usuarioActual.rut) {
      this.rutParticipante = usuarioActual.rut;
      this.username = usuarioActual.nombreApellido || 'Participante';

      // Obtener eventos donde el participante está inscrito
      this.eventosInscrito = this.eventoService.obtenerEventosConParticipanteInscrito(this.rutParticipante);

      // Obtener eventos donde el participante está presente
      this.eventosPresente = this.eventoService.obtenerEventosConParticipantePresente(this.rutParticipante);

      // Obtener todos los eventos disponibles
      this.todosLosEventos = this.eventoService.obtenerEventos();
      this.eventosFiltrados = this.todosLosEventos;
    }
  }

  // MÉTODO PARA FILTRAR EVENTOS POR FECHA O BÚSQUEDA GENERAL
  filtrarEventos() {
    this.eventosFiltrados = this.todosLosEventos.filter(evento => {
      const coincideFecha = this.fechaFiltro ? new Date(evento.fecha).toDateString() === this.fechaFiltro.toDateString() : true;
      const coincideBusqueda = this.busqueda ? 
        evento.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        evento.lugar.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        evento.organizador.toLowerCase().includes(this.busqueda.toLowerCase())
        : true;
      return coincideFecha && coincideBusqueda;
    });
  }

  // MÉTODO PARA REGISTRAR ASISTENCIA A UN EVENTO
  async registrarAsistencia(eventoId?: string) {
    if (eventoId) {
      const evento = this.eventoService.obtenerEventoPorId(eventoId);
      if (evento) {
        // Verificar si el asistente ya está registrado en el evento
        const asistenteExistente = evento.asistentes.find((asistente: any) => asistente.rut === this.rutParticipante);
        if (asistenteExistente) {
          this.mostrarAlerta('Error', 'Ya estás registrado en este evento.');
        } else {
          const nuevoAsistente = {
            rut: this.rutParticipante,
            nombre: this.username,
            estado: 'presente',
          };
          this.eventoService.registrarAsistenciaPorId(eventoId, nuevoAsistente.rut, nuevoAsistente.nombre);
          this.mostrarAlerta('Éxito', 'Asistencia registrada exitosamente.');
          // Actualizar la lista de eventos donde el participante está presente
          this.eventosPresente = this.eventoService.obtenerEventosConParticipantePresente(this.rutParticipante);
        }
      } else {
        this.mostrarAlerta('Error', 'Evento no encontrado.');
      }
    } else {
      this.mostrarAlerta('Error', 'Debe seleccionar un evento.');
    }
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

  // MÉTODO PARA CERRAR SESIÓN
  async logout() {
    await this.storage.remove('usuarioActual');
    this.router.navigate(['/login']);
  }
}
