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
  horaEvento: string = '';
  lugarEvento: string = '';
  numeroParticipantes: number = 0;
  map: any;
  marker: any;

  fechaEvento: string = '';
  minDate: string;
  minTime: string;

  constructor(
    private router: Router,
    private eventoService: EventoService,
    private platform: Platform,
    private authService: AutenticacionService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {
    const now = new Date();
    this.minDate = now.toISOString().split('T')[0]; // Establecer la fecha mínima a la fecha actual
    this.minTime = now.toTimeString().split(' ')[0].substring(0, 5); // Establecer la hora mínima a la hora actual
  }

  async ngAfterViewInit() {
    await this.platform.ready();
    await this.loadMap();
  }

  private async loadMap() {
    await new Promise(resolve => setTimeout(resolve, 100)); 

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

        google.maps.event.trigger(this.map, 'resize');
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
    if (!this.nombreEvento || !this.nombreOrganizador || !this.fechaEvento || !this.lugarEvento || !this.numeroParticipantes) {
      this.mostrarError("Por favor completa todos los campos."); // Asegúrate de que no haya campos vacíos
      return;
    }
  
    const eventoFechaHora = new Date(this.fechaEvento); // Combinar fecha y hora para la comparación
    const now = new Date();
  
    if (eventoFechaHora <= now) {
      this.mostrarError("¡Selecciona una fecha válida!"); // Mostrar error si la fecha y hora son pasadas
      return;
    }
  
    const evento = {
      nombre: this.nombreEvento,
      organizador: this.nombreOrganizador,
      fechaHora: this.fechaEvento, // Asegúrate de almacenar la fecha y hora en el evento
      lugar: this.lugarEvento,
      participantes: this.numeroParticipantes
    };
  
    this.eventoService.agregarEvento(evento); // Asegúrate de que esto esté funcionando
    this.router.navigate(['/gestion-de-eventos']); // Navegar a gestión-eventos
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
