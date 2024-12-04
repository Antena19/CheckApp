import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../services/evento.service';
import { AlertController, MenuController } from '@ionic/angular';
import { AutenticacionService } from '../services/autenticacion.service'; // Servicio de autenticación

@Component({
  selector: 'app-lista-asistentes',
  templateUrl: './lista-asistentes.page.html',
  styleUrls: ['./lista-asistentes.page.scss'],
})
export class ListaAsistentesPage implements OnInit {
  listaAsistentes: any[] = [];
  id: string = ''; // ID del evento
  rutUsuario: string = ''; // RUT del usuario autenticado

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private alertController: AlertController,
    private menu: MenuController, // Controlador de menú
    private authService: AutenticacionService // Servicio de autenticación
  ) {}

  async ngOnInit() {
    // Obtener el usuario autenticado
    const usuarioActual = await this.authService.obtenerUsuarioActual();
    if (usuarioActual && usuarioActual.rut) {
      this.rutUsuario = this.normalizarRut(usuarioActual.rut);
    }

    // Obtener el ID del evento desde la URL
    this.id = this.route.snapshot.queryParamMap.get('id') || '';
    this.cargarListaAsistentes();
  }

  // MÉTODO PARA CARGAR LA LISTA DE ASISTENTES
  cargarListaAsistentes() {
    const evento = this.eventoService.obtenerEventoPorId(this.id);

    if (evento && evento.asistentes) {
      this.listaAsistentes = evento.asistentes;
    } else {
      this.mostrarAlerta('Error', 'Evento no encontrado o no tienes permiso para acceder a los asistentes.');
      this.router.navigate(['/gestion-de-eventos']);
    }
  }

  // MÉTODO QUE SE EJECUTA AL ENTRAR A LA VISTA
  ionViewWillEnter() {
    this.menu.enable(true, 'main-menu'); // Habilitar el menú con el ID 'main-menu' cuando se entre a esta vista
  }

  // MÉTODO PARA ABRIR EL MENÚ LATERAL
  openMenu() {
    this.menu.enable(true, 'main-menu'); // Habilitamos el menú con el ID 'main-menu'
    this.menu.open('main-menu'); // Abrimos el menú
  }

  // MÉTODO PARA CERRAR EL MENÚ LATERAL
  closeMenu() {
    this.menu.close('main-menu'); // Cerramos el menú con el ID 'main-menu'
  }

  // MÉTODO PARA AGREGAR UN NUEVO ASISTENTE
  async agregarAsistente() {
    const alert = await this.alertController.create({
      header: 'Agregar Asistente',
      inputs: [
        { name: 'rut', placeholder: 'RUT (Formato: 00000000-0)', type: 'text' },
        { name: 'nombreApellido', placeholder: 'Nombre y Apellido', type: 'text' },
        { name: 'telefono', placeholder: 'Teléfono', type: 'tel' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.rut) {
              const rutNormalizado = this.normalizarRut(data.rut);
              if (!this.validarRut(rutNormalizado)) {
                this.mostrarAlerta('Error', 'El RUT ingresado no tiene un formato válido.');
                return false;
              }

              // Verificar si el asistente ya existe en la lista
              const asistenteExistente = this.listaAsistentes.find(
                asistente => this.normalizarRut(asistente.rut) === rutNormalizado
              );
              if (asistenteExistente) {
                this.mostrarAlerta('Error', 'El asistente ya está registrado.');
                return false;
              } else {
                data.rut = rutNormalizado;
                data.estado = 'ausente'; // Estado inicial "ausente"
                this.listaAsistentes.push(data);
                this.guardarCambios();
                return true;
              }
            } else {
              this.mostrarAlerta('Error', 'El campo RUT es obligatorio.');
              return false;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  // MÉTODO PARA NORMALIZAR EL RUT (Manteniendo el guion y sin cambiar mayúsculas/minúsculas)
  normalizarRut(rut: string): string {
    return rut.replace(/\./g, '').trim();
  }

  // MÉTODO PARA VALIDAR EL FORMATO DEL RUT (Debe seguir el formato 00000000-0)
  validarRut(rut: string): boolean {
    const rutRegex = /^\d{7,8}-[0-9Kk]$/;
    return rutRegex.test(rut);
  }

  // MÉTODO PARA EDITAR UN ASISTENTE EXISTENTE
  async editarAsistente(index: number) {
    const asistente = this.listaAsistentes[index];
    const alert = await this.alertController.create({
      header: 'Editar Asistente',
      inputs: [
        { name: 'rut', value: asistente.rut, placeholder: 'RUT', type: 'text', disabled: true },
        { name: 'nombreApellido', value: asistente.nombreApellido, placeholder: 'Nombre y Apellido', type: 'text' },
        { name: 'telefono', value: asistente.telefono, placeholder: 'Teléfono', type: 'tel' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.nombreApellido && data.telefono) {
              // Actualizar la información del asistente
              this.listaAsistentes[index] = {
                ...asistente,
                nombreApellido: data.nombreApellido,
                telefono: data.telefono,
              };
              this.guardarCambios();
            } else {
              this.mostrarAlerta('Error', 'Los campos Nombre y Apellido, y Teléfono son obligatorios.');
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
    if (this.id) {
      const evento = this.eventoService.obtenerEventoPorId(this.id);
      if (evento) {
        evento.asistentes = this.listaAsistentes;
        this.eventoService.guardarEventos(); // Actualiza el evento directamente y guarda los cambios
      } else {
        this.mostrarAlerta('Error', 'No se pudo encontrar el evento o no tienes permiso para editarlo.');
      }
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

  // MÉTODO PARA VER DETALLE DEL EVENTO
  verDetalleEvento() {
    this.router.navigate(['/registro-asistencia-evento', { id: this.id }]);
  }

  // MÉTODO PARA VOLVER A LA GESTIÓN DE EVENTOS
  volver() {
    this.router.navigate(['/gestion-de-eventos']);
  }

  // MÉTODO PARA GENERAR INFORMES
  generarInformes() {
    this.router.navigate(['/generar-informes', { id: this.id }]);
  }

  // MÉTODO PARA CERRAR SESIÓN
  async logout() {
    console.log('Cerrando sesión...');
    await this.authService.cerrarSesion(); // Llamamos al método de cerrar sesión del servicio
    this.router.navigate(['/login']); // Redirigimos a la página de login
    console.log('Sesión cerrada. Redirigido al login.');
  }

  // MÉTODO PARA NAVEGAR A LA PÁGINA DE INICIO
  navigateToHome() {
    console.log('Navegando al Home...');
    this.router.navigate(['/home']);
  }

  // MÉTODO PARA NAVEGAR A GESTIÓN DE EVENTOS
  navigateToGestionDeEventos() {
    console.log('Navegando a Gestión de Eventos...');
    this.router.navigate(['/gestion-de-eventos']);
  }

  // MÉTODO PARA NAVEGAR A LA PÁGINA DE INFORMES
  navigateToInformes() {
    console.log('Navegando a la página de informes...');
    this.router.navigate(['/informes']);
  }

  // MÉTODO PARA NAVEGAR A LA PÁGINA DE MI PERFIL
  navigateToMiPerfil() {
    console.log('Navegando a Mi Perfil...');
    this.router.navigate(['/mi-perfil']);
  }
}
