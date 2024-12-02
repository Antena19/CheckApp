import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AutenticacionService } from '../services/autenticacion.service'; // Importamos el servicio de autenticación

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  nombre: string = '';
  username: string = ''; // Variable para almacenar el nombre de usuario

  constructor(
    private router: Router,
    private storage: Storage, // Servicio Storage para manejar el almacenamiento
    private authService: AutenticacionService // Inyectamos el servicio de autenticación
  ) {}

  async ngOnInit() {
    await this.storage.create(); // Inicializamos el storage

    // Verificar si el usuario está autenticado
    const logueado = await this.authService.verificarSesion(); // Utilizamos await para obtener el valor de la promesa
    if (!logueado) {
      this.router.navigate(['/login']); // Redirigir a login si no está logueado
    } else {
      // Obtener el usuario actual desde el servicio de autenticación
      const usuarioActual = await this.authService.obtenerUsuarioActual();
      if (usuarioActual) {
        this.username = usuarioActual.nombreApellido; // Usar el nombre y apellido del usuario para mostrar el mensaje de bienvenida
      } else {
        this.username = 'Usuario'; // Valor por defecto si no se encuentra el usuario
      }
    }
  }

  // Método para escanear el código QR (puedes agregar la lógica más adelante)
  scanQRCode() {
    console.log('Escaneando código QR...');
  }

  // Método para registrar la asistencia
  registerAttendance() {
    if (this.nombre.trim() !== '') {
      console.log('Registrando asistencia para', this.nombre);
      // Redirigir a la página de login después de registrar la asistencia (esto es opcional, depende de tu lógica)
      this.router.navigate(['/login']);
    } else {
      alert('Por favor ingresa un nombre válido.');
    }
  }

  // Método para cerrar sesión
  async logout() {
    await this.authService.cerrarSesion(); // Llamamos al método de cerrar sesión del servicio
    this.router.navigate(['/login']); // Redirigimos a la página de login
  }

  // Método para volver a la página anterior
  goBack() {
    this.router.navigate(['/login']);
  }

  // Método para navegar a Gestión de Eventos
  navigateToGestionDeEventos() {
    this.router.navigate(['/gestion-de-eventos']);
  }
}
