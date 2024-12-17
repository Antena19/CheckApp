import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AutenticacionService } from '../services/autenticacion.service'; // Importamos el servicio de autenticación
import { MenuController } from '@ionic/angular'; // Importamos MenuController para manejar el menú lateral

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {

  constructor(
    private router: Router,
    private storage: Storage, // Servicio Storage para manejar el almacenamiento
    private authService: AutenticacionService, // Inyectamos el servicio de autenticación
    private menu: MenuController // Inyectamos el controlador de menú
  ) {}

  ngOnInit() {
  }

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

  // Método para volver a la página anterior
  goBack() {
    console.log('Navegando a la página anterior...');
    this.router.navigate(['/login']);
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
    this.router.navigate(['/reportes']);
  }

  // Método para navegar al perfil de usuario
    navigateToMiPerfil() {
      this.router.navigate(['/perfil-usuario']);
    }


}
