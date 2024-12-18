import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventoService } from '../services/evento.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { ScannerService } from '../services/scanner.service';

@Component({
  selector: 'app-home-participante',
  templateUrl: './home-participante.page.html',
  styleUrls: ['./home-participante.page.scss'],
})
export class HomeParticipantePage implements OnInit {
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
    private alertController: AlertController,
    public scanner: ScannerService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const usuarioActual = await this.storage.get('usuarioActual');

    if (usuarioActual && usuarioActual.rut) {
      this.rutParticipante = this.normalizarRut(usuarioActual.rut);
      this.username = usuarioActual.nombreApellido || 'Participante';

      // Obtener todos los eventos disponibles
      this.cargarEventos();
    }
  }

  // MÉTODO PARA CARGAR EVENTOS Y MARCAR INSCRIPCIÓN
  async cargarEventos() {
    this.todosLosEventos = this.eventoService.obtenerTodosLosEventos();

    // Normalizar RUT del participante antes de realizar las comparaciones
    const rutParticipanteNormalizado = this.normalizarRut(this.rutParticipante);

    // Marcar los eventos en los que el participante está inscrito
    this.todosLosEventos.forEach(evento => {
      evento.estaInscrito = evento.asistentes.some((asistente: any) =>
        this.normalizarRut(asistente.rut) === rutParticipanteNormalizado
      );
      evento.asistenciaConfirmada = evento.estaInscrito && 
        evento.asistentes.some(
          (asistente: any) => 
            this.normalizarRut(asistente.rut) === rutParticipanteNormalizado && 
            asistente.estado === 'presente'
        );
    });

    // Inicializar los eventos filtrados con todos los eventos (puede ser actualizado por el filtro de búsqueda)
    this.eventosFiltrados = this.todosLosEventos;

    // Persistir el estado de los botones deshabilitados para los eventos ya confirmados
    await this.actualizarEstadoBotones();
  }

  // MÉTODO PARA FILTRAR EVENTOS POR FECHA O BÚSQUEDA GENERAL
  filtrarEventos() {
    this.eventosFiltrados = this.todosLosEventos.filter(evento => {
      const coincideFecha = this.fechaFiltro
        ? new Date(evento.fecha).toISOString().split('T')[0] === 
          new Date(this.fechaFiltro).toISOString().split('T')[0]
        : true;
      const coincideBusqueda = this.busqueda
        ? evento.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
          evento.lugar.toLowerCase().includes(this.busqueda.toLowerCase()) ||
          evento.organizador.toLowerCase().includes(this.busqueda.toLowerCase())
        : true;
      return coincideFecha && coincideBusqueda;
    });
  }

  // MÉTODO PARA REGISTRAR ASISTENCIA A UN EVENTO
  async registrarAsistencia(eventoId: string) {
    if (!eventoId) {
      this.mostrarAlerta('Error', 'Debe seleccionar un evento.');
      return;
    }

    const evento = this.eventoService.obtenerEventoPorId(eventoId);
    if (!evento) {
      this.mostrarAlerta('Error', 'Evento no encontrado o no tienes permiso para verlo.');
      return;
    }

    this.actualizarAsistenciaEvento(evento);

    // Guardar cambios en el evento
    this.eventoService.guardarEventos();

    // Mostrar mensaje de éxito
    this.mostrarAlerta('Éxito', 'Asistencia registrada exitosamente.');

    // Actualizar el estado del botón de asistencia
    this.actualizarEstadoBotonAsistencia(eventoId);

    // Refrescar la lista de eventos
    this.cargarEventos();
  }

  // MÉTODO PARA ACTUALIZAR LA ASISTENCIA DE UN EVENTO
  actualizarAsistenciaEvento(evento: any) {
    const rutNormalizado = this.normalizarRut(this.rutParticipante);

    // Verificar si el asistente ya está registrado en el evento
    let asistenteExistente = evento.asistentes.find(
      (asistente: any) => this.normalizarRut(asistente.rut) === rutNormalizado
    );

    if (asistenteExistente) {
      // Cambiar el estado del asistente a "presente"
      asistenteExistente.estado = 'presente';
      asistenteExistente.horaRegistro = new Date().toLocaleTimeString();
    } else {
      // Si no está registrado, agregar al asistente con el estado "presente"
      const nuevoAsistente = {
        rut: rutNormalizado,
        nombreApellido: this.username,
        estado: 'presente',
        horaRegistro: new Date().toLocaleTimeString(),
      };
      evento.asistentes.push(nuevoAsistente);
    }
  }

  // MÉTODO PARA ACTUALIZAR EL ESTADO DEL BOTÓN DE ASISTENCIA
  actualizarEstadoBotonAsistencia(eventoId: string) {
    const evento = this.eventosFiltrados.find(e => e.id === eventoId);
    if (evento) {
      evento.asistenciaConfirmada = true;
    }
  }

  // MÉTODO PARA NORMALIZAR EL RUT (Manteniendo el guion y sin cambiar mayúsculas/minúsculas)
  normalizarRut(rut: string): string {
    return rut.replace(/\./g, '').trim();
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

  // MÉTODO PARA ACTUALIZAR EL ESTADO DE LOS BOTONES EN CARGA
  async actualizarEstadoBotones() {
    const rutParticipanteNormalizado = this.normalizarRut(this.rutParticipante);

    this.eventosFiltrados.forEach(evento => {
      evento.asistenciaConfirmada = evento.asistentes.some(
        (asistente: any) =>
          this.normalizarRut(asistente.rut) === rutParticipanteNormalizado &&
          asistente.estado === 'presente'
      );
    });
  }

  // MÉTODO PARA CERRAR SESIÓN
  async logout() {
    await this.storage.remove('usuarioActual');
    this.router.navigate(['/login']);
  }

    //METODO PARA SCANEAR
    async Scaneo() {
      const eventoId = await this.scanner.StartScan();
      if (eventoId) {
        const evento = this.todosLosEventos.find(e => e.id === eventoId);
        if (evento) {
          this.registrarAsistencia(eventoId); // Registrar asistencia
        } else {
          alert("El evento asociado al QR no existe o no está disponible.");
        }
      }
    }
  
}