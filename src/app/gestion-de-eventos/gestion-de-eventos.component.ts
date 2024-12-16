import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';
import { EventoService } from '../services/evento.service'; // SERVICE DE EVENTOS
import { NotificacionService } from '../services/notificacion.service';
import { NavController, ModalController } from '@ionic/angular'; // Importamos ModalController
import { RegistroAsistenciaModalComponent } from '../registro-asistencia-modal/registro-asistencia-modal.component'; // Importa el componente del modal de registro de asistencia
import { Subscription } from 'rxjs';
import { MenuController } from '@ionic/angular'; // Importamos MenuController para manejar el menú lateral

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
    private modalController: ModalController, // CONTROLADOR DEL MODAL
    private menu: MenuController // Inyectamos el controlador de menú
  ) {}

  // MÉTODO QUE SE EJECUTA AL INICIAR EL COMPONENTE
  async ngOnInit() {
    const usuarioActual = await this.authService.obtenerUsuarioActual();
    if (usuarioActual && usuarioActual.rut) {
      // Suscribirse a los eventos y filtrar por el usuario actual
      this.eventosSubscription = this.eventoService.eventos$.subscribe(eventos => {
        this.eventos = eventos.filter(evento => evento.rut === usuarioActual.rut);
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
      participantes: this.numeroParticipantes,
      rut: usuarioActual.rut // Aseguramos de usar `rut` como el identificador correcto
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
  editarEvento(id: string) {
    this.router.navigate(['/editar-evento', { id: id }]);
  }

  // CONFIRMAR SI SE DESEA ELIMINAR UN EVENTO
  async confirmarEliminarEvento(id: string) {
    const usuarioActual = await this.authService.obtenerUsuarioActual();
    if (!usuarioActual) {
      this.mostrarError('No se ha podido obtener el usuario logueado. Por favor, inicia sesión de nuevo.');
      return;
    }

    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este evento?");
    if (confirmacion) {
      this.eliminarEventoPorId(id, usuarioActual.rut);
    }
  }

  // ELIMINAR UN EVENTO ESPECÍFICO Y ACTUALIZAR LA LISTA
  eliminarEventoPorId(id: string, rutUsuario: string) {
    try {
      this.eventoService.eliminarEventoPorId(id, rutUsuario);
      this.notificacionService.mostrarMensaje('Éxito', 'Evento eliminado correctamente', 'success');
    } catch (error: any) {
      this.mostrarError(error.message);
    }
  }

  // LIMPIAR TODOS LOS CAMPOS DEL FORMULARIO
  limpiarFormulario() {
    this.nombreEvento = '';
    this.nombreOrganizador = '';
    this.horaEvento = '';
    this.lugarEvento = '';
    this.numeroParticipantes = 0;
  }

  // NAVEGAR AL REGISTRO DE ASISTENCIA DE UN EVENTO
  navegarRegistrarAsistencia(eventId: string) {
    this.router.navigate(['/lista-asistentes'], { queryParams: { id: eventId } });
  }

  async abrirModalRegistrarAsistencia(eventId: string) {
    const modal = await this.modalController.create({
      component: RegistroAsistenciaModalComponent,
      componentProps: {
        idEvento: eventId
      }
    });

    await modal.present();

    // Suscribirse a la promesa del modal para saber cuándo se cierra
    modal.onDidDismiss().then((result) => {
      // Verificar si el modal fue cerrado con el propósito de navegar
      if (result.data && result.data.shouldNavigate) {
        this.router.navigate(['/lista-asistentes'], { queryParams: { id: eventId } });
      }
    });
  }

  ngOnDestroy() {
    // Cancelar la suscripción cuando el componente se destruya
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe();
    }
  }

  //METODOS MENÚ
   // Método para abrir el menú lateral
   openMenu() {
    this.menu.enable(true, 'main-menu'); // Habilitamos el menú con el ID 'main-menu'
    this.menu.open('main-menu'); // Abrimos el menú
  }

  // Método para cerrar el menú lateral
  closeMenu() {
    this.menu.close('main-menu'); // Cierra el menú con el ID 'main-menu'
  }

    // Método para cerrar sesión
    async logout() {
      console.log('Cerrando sesión...');
      await this.authService.cerrarSesion(); // Llamamos al método de cerrar sesión del servicio
      this.router.navigate(['/login']); // Redirigimos a la página de login
      console.log('Sesión cerrada. Redirigido al login.');
    }
  

    // Método para navegar a Gestión de Eventos
    navigateToGestionDeEventos() {
      console.log('Navegando a Gestión de Eventos...');
      this.router.navigate(['/gestion-de-eventos']);
    }
  
    // Método para navegar al inicio
    navigateToHome() {
      console.log('Navegando al Home...');
      this.router.navigate(['/home']);
    }
  
    // Método para navegar a la página de informes
    navigateToInformes() {
      console.log('Navegando a la página de informes...');
      this.router.navigate(['/informes']);
    }
  
    // Método para navegar al perfil de usuario
      navigateToMiPerfil() {
        this.router.navigate(['/perfil-usuario']);
      }
}
