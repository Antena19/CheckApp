import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventoService } from '../services/evento.service';
import { Platform, AlertController } from '@ionic/angular';
import { AutenticacionService } from '../services/autenticacion.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.page.html',
  styleUrls: ['./editar-evento.page.scss']
})
export class EditarEventoPage implements AfterViewInit, OnDestroy {
  @ViewChild('map') mapElement!: ElementRef;

  nombreEvento: string = '';
  nombreOrganizador: string = '';
  fechaEvento: string = '';
  horaInicio: string = '';
  horaTermino: string = '';
  lugarEvento: string = '';
  listaAsistentes: any[] = []; // Lista de asistentes
  map: any;
  marker: any;
  eventoId: string = '';
  eventosSubscription!: Subscription;

  constructor(
    private router: Router,
    private eventoService: EventoService,
    private platform: Platform,
    private authService: AutenticacionService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  async ngAfterViewInit() {
    await this.platform.ready();   // Espera que la plataforma esté lista
    await this.verifyMapElement(); // Verifica la disponibilidad del mapa
    await this.loadMap();          // Inicializa el mapa
    await this.cargarEvento();     // Carga la información del evento
  }

  private async verifyMapElement() {
    // Verifica que el contenedor del mapa esté disponible
    let retries = 0;
    while (!this.mapElement || !this.mapElement.nativeElement) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Espera brevemente
      retries++;
      if (retries > 50) { // Intenta 50 veces antes de rendirse
        console.error('Error: El contenedor del mapa no está disponible.');
        return;
      }
    }
  }
  

  private async loadMap() {
    await new Promise(resolve => setTimeout(resolve, 100));
  
    const latLng = { lat: -33.447487, lng: -70.673676 }; // Ubicación inicial por defecto
    if (this.mapElement && this.mapElement.nativeElement) {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: latLng,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });
  
      this.marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        draggable: true,
      });
  
      // Evento de arrastre para obtener nueva ubicación
      google.maps.event.addListener(this.marker, 'dragend', (event: any) => {
        const latLng = this.marker.getPosition();
        this.geocodeLatLng(latLng);
      });
  
      google.maps.event.trigger(this.map, 'resize');
    } else {
      console.error('Error: El contenedor del mapa no se encontró.');
    }
  }
  async cargarEvento() {
    try {
      // Obtén el ID del evento desde la URL
      this.eventoId = this.activatedRoute.snapshot.paramMap.get('id') || '';
      if (!this.eventoId) {
        this.mostrarError("No se proporcionó un ID de evento válido.");
        return;
      }
  
      // Obtén el usuario actual logueado
      const usuario = await this.authService.obtenerUsuarioActual();
      if (!usuario) {
        this.mostrarError("No se pudo obtener el usuario actual. Por favor, inicia sesión.");
        return;
      }
  
      // Obtén el evento desde el servicio usando el ID y el RUT del usuario
      const evento = this.eventoService.obtenerEventoPorIdYUsuario(this.eventoId, usuario.rut);
      if (evento) {
        this.nombreEvento = evento.nombre;
        this.nombreOrganizador = evento.organizador;
        this.fechaEvento = evento.fecha;
        this.horaInicio = evento.horaInicio;
        this.horaTermino = evento.horaTermino || '';
        this.lugarEvento = evento.lugar;
        this.listaAsistentes = evento.asistentes || []; // Cargar lista existente o inicializar vacía
        this.actualizarMapa();
      } else {
        this.mostrarError("Evento no encontrado o no tienes permiso para verlo.");
      }
    } catch (error) {
      this.mostrarError("Ha ocurrido un error al cargar el evento.");
    }
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
        if (this.map) {
          this.map.setCenter(location);
          this.marker.setPosition(location);
          this.lugarEvento = results[0].formatted_address;
        }
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
    }
  }

  async guardarEvento() {
    if (!this.nombreEvento || !this.nombreOrganizador || !this.fechaEvento || !this.horaInicio || !this.lugarEvento) {
      this.mostrarError("Por favor completa todos los campos.");
      return;
    }

    try {
      // Obtener el usuario actual logueado
      const usuario = await this.authService.obtenerUsuarioActual();

      if (!usuario) {
        throw new Error('No se ha podido obtener el usuario logueado. Por favor, inicia sesión de nuevo.');
      }

      const eventoEditado = {
        id: this.eventoId,
        nombre: this.nombreEvento,
        organizador: this.nombreOrganizador,
        fecha: this.fechaEvento,
        horaInicio: this.horaInicio,
        horaTermino: this.horaTermino,
        lugar: this.lugarEvento,
        asistentes: this.listaAsistentes // Guardar lista actualizada
      };

      // Editar el evento utilizando el servicio de eventos y pasar el id del evento y rut del usuario
      this.eventoService.editarEventoPorId(this.eventoId, eventoEditado, usuario.rut);
      this.router.navigate(['/gestion-de-eventos']);
    } catch (error: any) {
      this.mostrarError(error.message);
    }
  }

  async cancelar() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas salir sin guardar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigate(['/gestion-de-eventos']);
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  volver() {
    this.navCtrl.back();
  }

  ngOnDestroy() {
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe(); // Desuscribirse para evitar memory leaks
    }
  }
}
