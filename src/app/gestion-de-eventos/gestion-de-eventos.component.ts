import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';
import { EventoService } from '../services/evento.service'; // SERVICE DE EVENTOS
import { NotificacionService } from '../services/notificacion.service';
import { NavController, ModalController } from '@ionic/angular'; // Importamos ModalController
import { RegistroAsistenciaModalComponent } from '../registro-asistencia-modal/registro-asistencia-modal.component'; // Importa el componente del modal de registro de asistencia
import { Subscription } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-gestion-de-eventos',
  templateUrl: './gestion-de-eventos.component.html',
  styleUrls: ['./gestion-de-eventos.component.scss']
})
export class GestionDeEventosComponent implements AfterViewInit, OnInit, OnDestroy {
  nombreEvento: string = '';
  nombreOrganizador: string = '';
  horaEvento: string = '';
  lugarEvento: string = '';
  numeroParticipantes: number = 0;
  eventos: any[] = [];
  mostrarFechaHoraPicker: boolean = false;
  map: any;
  marker: any;

  private eventosSubscription!: Subscription;

  constructor(
    private authService: AutenticacionService,
    private router: Router,
    private eventoService: EventoService, // SERVICE DE EVENTOS
    private notificacionService: NotificacionService,
    private navCtrl: NavController,
    private modalController: ModalController // CONTROLADOR DEL MODAL
  ) {}

  // MÉTODO QUE SE EJECUTA AL INICIAR EL COMPONENTE
  async ngOnInit() {
    const usuarioActual = await this.authService.obtenerUsuarioActual();
    if (usuarioActual && usuarioActual.rut) {
      // Suscribirse a los eventos y filtrar por el usuario actual
      this.eventosSubscription = this.eventoService.eventos$.subscribe(eventos => {
        this.eventos = eventos.filter(evento => evento.usuarioRUT === usuarioActual.rut);
      });
    }
  }

  // MÉTODO PARA INICIALIZAR EL MAPA DESPUÉS DE QUE EL COMPONENTE HAYA CARGADO LA VISTA
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

  // CARGAR TODOS LOS EVENTOS EXISTENTES DESDE EL SERVICIO
  async cargarEventos() {
    const usuarioActual = await this.authService.obtenerUsuarioActual();
    if (usuarioActual && usuarioActual.rut) {
      this.eventos = this.eventoService.obtenerEventosPorUsuario(usuarioActual.rut);
    }
  }

  // ABRIR EL PICKER DE FECHA Y HORA
  abrirFechaHoraPicker() {
    this.mostrarFechaHoraPicker = true;
  }

  // CERRAR EL PICKER DE FECHA Y HORA
  cerrarFechaHoraPicker() {
    this.mostrarFechaHoraPicker = false;
  }

  // MOSTRAR RESUMEN DEL EVENTO CREADO Y GUARDARLO
  async mostrarResumen() {
    const usuarioActual = await this.authService.obtenerUsuarioActual();
    if (!usuarioActual) {
      this.mostrarError('No se ha podido obtener el usuario logueado. Por favor, inicia sesión de nuevo.');
      return;
    }

    const evento = {
      nombre: this.nombreEvento,
      organizador: this.nombreOrganizador,
      hora: this.horaEvento,
      lugar: this.lugarEvento,
      participantes: this.numeroParticipantes
    };
    this.eventoService.agregarEvento(evento, usuarioActual.rut);
    this.limpiarFormulario();
  }

  // ACTUALIZAR EL MAPA SEGÚN LA DIRECCIÓN INGRESADA
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

  // CONVERTIR COORDENADAS LATITUDE/LONGITUDE A DIRECCIÓN
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

  // MOSTRAR MENSAJE DE ERROR EN LA INTERFAZ
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

  // MÉTODO PARA EDITAR UN EVENTO ESPECÍFICO
  editarEvento(index: number) {
    this.router.navigate(['/editar-evento', { id: index }]);
  }

  // CONFIRMAR SI SE DESEA ELIMINAR UN EVENTO
  async confirmarEliminarEvento(index: number) {
    const usuarioActual = await this.authService.obtenerUsuarioActual();
    if (!usuarioActual) {
      this.mostrarError('No se ha podido obtener el usuario logueado. Por favor, inicia sesión de nuevo.');
      return;
    }

    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este evento?");
    if (confirmacion) {
      this.eliminarEvento(index, usuarioActual.rut);
    }
  }

  // ELIMINAR UN EVENTO ESPECÍFICO Y ACTUALIZAR LA LISTA
  eliminarEvento(index: number, rutUsuario: string) {
    this.eventoService.eliminarEvento(index, rutUsuario);
    this.notificacionService.mostrarMensaje('Éxito', 'Evento eliminado correctamente', 'success');
  }

  // LIMPIAR TODOS LOS CAMPOS DEL FORMULARIO
  limpiarFormulario() {
    this.nombreEvento = '';
    this.nombreOrganizador = '';
    this.horaEvento = '';
    this.lugarEvento = '';
    this.numeroParticipantes = 0;
  }

  // CERRAR SESIÓN Y REDIRIGIR AL LOGIN
  logout() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  // VOLVER A LA PÁGINA ANTERIOR
  volver() {
    this.navCtrl.back(); // REGRESA A LA PÁGINA ANTERIOR
  }

  // NAVEGAR AL REGISTRO DE ASISTENCIA DE UN EVENTO
  navegarRegistrarAsistencia(eventId: string) {
    this.router.navigate(['/registro-asistencia-evento'], { queryParams: { id: eventId } });
  }

  // ABRIR MODAL PARA REGISTRAR ASISTENCIA
  async abrirModalRegistrarAsistencia(eventId: string) {
    const modal = await this.modalController.create({
      component: RegistroAsistenciaModalComponent,
      componentProps: {
        idEvento: eventId
      }
    });
    await modal.present();
  }

  ngOnDestroy() {
    // Cancelar la suscripción cuando el componente se destruya
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe();
    }
  }
}
