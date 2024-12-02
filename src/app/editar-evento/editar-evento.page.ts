import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventoService } from '../services/evento.service';
import { Platform, AlertController } from '@ionic/angular';
import { AutenticacionService } from '../services/autenticacion.service';
import { NavController } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.page.html',
  styleUrls: ['./editar-evento.page.scss']
})
export class EditarEventoPage implements AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;

  nombreEvento: string = '';
  nombreOrganizador: string = '';
  horaInicio: string = '';
  horaTermino: string = '';
  lugarEvento: string = '';
  fechaEvento: string = '';
  eventoIndex: number = -1;

  map: any;
  marker: any;

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
    await this.platform.ready();
    await this.loadMap();
    this.cargarEvento();
  }

  private async loadMap() {
    await new Promise(resolve => setTimeout(resolve, 100));

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
  }

  cargarEvento() {
    this.eventoIndex = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    const evento = this.eventoService.obtenerEventos()[this.eventoIndex];
    if (evento) {
      this.nombreEvento = evento.nombre;
      this.nombreOrganizador = evento.organizador;
      this.fechaEvento = evento.fecha;
      this.horaInicio = evento.horaInicio;
      this.horaTermino = evento.horaTermino;
      this.lugarEvento = evento.lugar;
      this.actualizarMapa();
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
      this.mostrarError("Por favor completa todos los campos.");
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Aceptar',
          handler: () => {
            const eventoEditado = {
              nombre: this.nombreEvento,
              organizador: this.nombreOrganizador,
              fecha: this.fechaEvento,
              horaInicio: this.horaInicio,
              horaTermino: this.horaTermino,
              lugar: this.lugarEvento
            };

            this.eventoService.editarEvento(this.eventoIndex, eventoEditado);
            this.router.navigate(['/gestion-de-eventos']);
          }
        }
      ]
    });

    await alert.present();
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
