import { Component, AfterViewInit, OnInit } from '@angular/core';
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';
import { EventoService } from '../services/evento.service'; //service de eventos
import { NotificacionService } from '../services/notificacion.service';
import { NavController } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-gestion-de-eventos',
  templateUrl: './gestion-de-eventos.component.html',
  styleUrls: ['./gestion-de-eventos.component.scss']
})
export class GestionDeEventosComponent implements AfterViewInit, OnInit {
  nombreEvento: string = '';
  nombreOrganizador: string = '';
  horaEvento: string = '';
  lugarEvento: string = '';
  numeroParticipantes: number = 0;
  eventos: any[] = [];
  mostrarFechaHoraPicker: boolean = false;
  map: any;
  marker: any;

  constructor(
    private authService: AutenticacionService,
    private router: Router,
    private eventoService: EventoService, //evento service
    private notificacionService: NotificacionService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.cargarEventos();
  }

  ngAfterViewInit() {
    const latLng = { lat: -33.447487, lng: -70.673676 };
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: latLng,
      zoom: 10,
    });
    this.marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      draggable: true,
    });

    google.maps.event.addListener(this.marker, 'dragend', (event: any) => {
      const latLng = this.marker.getPosition();
      this.geocodeLatLng(latLng);
    });
  }

  cargarEventos() {
    this.eventos = this.eventoService.obtenerEventos();
  }

  abrirFechaHoraPicker() {
    this.mostrarFechaHoraPicker = true;
  }

  cerrarFechaHoraPicker() {
    this.mostrarFechaHoraPicker = false;
  }

  mostrarResumen() {
    const evento = {
      nombre: this.nombreEvento,
      organizador: this.nombreOrganizador,
      hora: this.horaEvento,
      lugar: this.lugarEvento,
      participantes: this.numeroParticipantes
    };
    this.eventoService.agregarEvento(evento);
    this.cargarEventos();
    this.limpiarFormulario();
  }

  actualizarMapa() {
    if (!this.lugarEvento.trim()) {
      this.mostrarError("Por favor ingresa un lugar.");
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.lugarEvento }, (results: any[], status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        this.map.setCenter(location);
        this.marker.setPosition(location);
        this.lugarEvento = results[0].formatted_address;
      } else {
        this.mostrarError("No se pudo encontrar la dirección.");
      }
    });
  }

  geocodeLatLng(latLng: any) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results: any[], status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        this.lugarEvento = results[0].formatted_address;
      } else {
        this.mostrarError("No se pudo encontrar la dirección.");
      }
    });
  }

  mostrarError(mensaje: string) {
    const ubicacionDiv = document.getElementById("ubicacion");
    if (ubicacionDiv) {
      ubicacionDiv.innerHTML = `
        <div class="alert alert-danger" role="alert">
          ${mensaje}
        </div>
      `;
    } else {
      console.error("No se encontró el contenedor para mostrar el mensaje de error.");
    }
  }

  editarEvento(index: number) {
    this.router.navigate(['/editar-evento', { id: index }]); 
  }

  confirmarEliminarEvento(index: number) {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este evento?");
    if (confirmacion) {
      this.eliminarEvento(index);
    }
  }

  eliminarEvento(index: number) {
    this.eventoService.eliminarEvento(index);
    this.cargarEventos();
    this.notificacionService.mostrarMensaje('Éxito', 'Evento eliminado correctamente', 'success');
  }

  limpiarFormulario() {
    this.nombreEvento = '';
    this.nombreOrganizador = '';
    this.horaEvento = '';
    this.lugarEvento = '';
    this.numeroParticipantes = 0;
  }

  logout() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

   // Método para volver a la página anterior
   volver() {
    this.navCtrl.back(); // Regresa a la página anterior
  }
}
