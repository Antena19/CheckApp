import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-registro-asistencia-evento',
  templateUrl: './registro-asistencia-evento.page.html',
  styleUrls: ['./registro-asistencia-evento.page.scss'],
})
export class RegistroAsistenciaEventoPage implements OnInit {
  evento: any = {};

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private router: Router
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

  generarInforme() {
    console.log('Generar informe para el evento:', this.evento);
    this.router.navigate(['/generar-informe'], { state: { evento: this.evento } });
  }

  volver() {
    window.history.back();
  }
}
