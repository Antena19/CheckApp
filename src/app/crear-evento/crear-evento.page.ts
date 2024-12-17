import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventoService } from '../services/evento.service';
import { Platform, AlertController } from '@ionic/angular';
import { AutenticacionService } from '../services/autenticacion.service';
import { NavController } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss']
})
export class CrearEventoPage implements AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;

  nombreEvento: string = '';
  nombreOrganizador: string = '';
  horaInicio: string = '';
  horaTermino: string = '';
  lugarEvento: string = '';
  fechaEvento: string = '';
  minDate: string;
  minTime: string;

  map: any;
  marker: any;

  constructor(
    private router: Router,
    private eventoService: EventoService,
    private platform: Platform,
    private authService: AutenticacionService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {
    const now = new Date();
    this.minDate = now.toISOString().split('T')[0];
    this.minTime = now.toTimeString().split(' ')[0].substring(0, 5);
  }

  async ngAfterViewInit() {
    await this.platform.ready();
    await this.verifyMapElement();
    await this.loadMap();
  }

  private async verifyMapElement() {
    // Espera y verifica si el mapa se carga
    let retries = 0;
    while (!this.mapElement || !this.mapElement.nativeElement) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
      if (retries > 50) {
        console.error('Error: El contenedor del mapa no está disponible.');
        return;
      }
    }
  }
  

  private async loadMap() {
    try {
      const latLng = { lat: -33.447487, lng: -70.673676 };
  
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
  
        google.maps.event.addListener(this.marker, 'dragend', (event: any) => {
          const latLng = this.marker.getPosition();
          this.geocodeLatLng(latLng);
        });
  
        // Disparar el evento resize por si hay cambios en el DOM
        google.maps.event.trigger(this.map, 'resize');
      } else {
        console.error('Error: El contenedor del mapa no se encontró.');
      }
    } catch (error) {
      console.error('Error al cargar el mapa:', error);
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

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async guardarEvento() {
    if (!this.nombreEvento || !this.nombreOrganizador || !this.fechaEvento || !this.horaInicio || !this.lugarEvento) {
      this.mostrarError("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      // Obtener el usuario actual logueado
      const usuario = await this.authService.obtenerUsuarioActual();

      if (!usuario) {
        throw new Error('No se ha podido obtener el usuario logueado. Por favor, inicia sesión de nuevo.');
      }

      // Crear el nuevo evento
      const evento = {
        id: Date.now().toString(), // ID único basado en la fecha actual (convertido a string)
        nombre: this.nombreEvento,
        organizador: this.nombreOrganizador,
        fecha: this.fechaEvento,
        horaInicio: this.horaInicio,
        horaTermino: this.horaTermino,
        lugar: this.lugarEvento
      };

      // Guardar el evento utilizando el servicio de eventos y pasar el rut del usuario actual
      this.eventoService.agregarEvento(evento, usuario.rut);

      // Redirigir a la página de gestión de eventos
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
}
