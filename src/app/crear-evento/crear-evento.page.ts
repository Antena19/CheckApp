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
  listaAsistentes: any[] = []; // Lista de asistentes
  map: any;
  marker: any;

  fechaEvento: string = '';
  minDate: string;
  minTime: string;

  private maxAsistentes = 500; // Límite de asistentes

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

  // Generar lista de asistentes basada en el número de participantes
  generarListaAsistentes() {
    if (this.numeroParticipantes > this.maxAsistentes) {
      this.mostrarError(`No puedes tener más de ${this.maxAsistentes} asistentes.`);
      return;
    }

    this.listaAsistentes = Array.from({ length: this.numeroParticipantes }, () => ({
      rut: '',
      nombreApellido: '',
      telefono: ''
    }));
    console.log('Lista de asistentes generada:', this.listaAsistentes);
  }

  // Navegar a la página de lista de asistentes
  verListaAsistentes() {
    this.router.navigate(['/lista-asistentes'], { state: { listaAsistentes: this.listaAsistentes } });
  }

  async guardarEvento() {
    if (!this.nombreEvento || !this.nombreOrganizador || !this.fechaEvento || !this.lugarEvento || !this.numeroParticipantes) {
      this.mostrarError("Por favor completa todos los campos.");
      return;
    }

    if (this.eventoService.obtenerEventos().length >= 10) {
      this.mostrarError("No puedes crear más de 10 eventos.");
      return;
    }

    const evento = {
      nombre: this.nombreEvento,
      organizador: this.nombreOrganizador,
      fechaHora: this.fechaEvento,
      lugar: this.lugarEvento,
      participantes: this.numeroParticipantes,
      asistentes: this.listaAsistentes // Almacena la lista generada
    };

    try {
      this.eventoService.agregarEvento(evento);
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
