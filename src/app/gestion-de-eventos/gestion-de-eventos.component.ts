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
        this.eventos = eventos.filter(evento => evento.rut === usuarioActual.rut);
      });
    }
  }


  ngAfterViewInit() {
    // MÉTODO PARA INICIALIZAR EL MAPA DESPUÉS DE QUE EL COMPONENTE HAYA CARGADO LA VISTA
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

  // CERRAR SESIÓN Y REDIRIGIR AL LOGIN
  logout() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
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

  volver() {
    this.navCtrl.back();
  }
}