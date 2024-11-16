import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventoService } from '../services/evento.service'; // Servicio de eventos

@Component({
  selector: 'app-registro-asistencia-evento',
  templateUrl: './registro-asistencia-evento.page.html',
  styleUrls: ['./registro-asistencia-evento.page.scss'],
})
export class RegistroAsistenciaEventoPage implements OnInit {
  evento: any = {};

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const eventId = params['id'];
      this.evento = this.eventoService.obtenerEventoPorId(eventId);
      console.log('Evento cargado:', this.evento);
    });
  }

  generarQR() {
    console.log('Generar QR para el evento:', this.evento);
    // Aquí puedes implementar la lógica para generar el código QR
  }

  volver() {
    // Navega hacia atrás
    window.history.back();
  }
}
