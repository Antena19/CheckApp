import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, MenuController } from '@ionic/angular';
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
})

export class PerfilUsuarioComponent implements OnInit {
  perfilData = {
    username: '',
    nombreApellido: '',
    rut: '',
    telefono: '',
    email: '',
    fotoPerfil: 'assets/default-profile.jpg',
  };

  isEditing = false;

  constructor(
    private router: Router,
    private authService: AutenticacionService, 
    private alertController: AlertController,
    private menu: MenuController
  ) {}

  async ngOnInit() {
    try {
      const usuario = await this.authService.obtenerUsuarioActual();
      if (usuario) {
        this.perfilData = { ...usuario };
      }
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      this.mostrarAlerta('Error', 'No se pudo cargar la información del usuario');
    }
  }
  
  ViewWillEnter() {
    console.log('Habilitando menú lateral');
    this.menu.enable(true, 'main-menu');
  }

//METODO PARA CAMBIAR FOTO DE PERFIL
  async cambiarFotoPerfil() {
    console.log('Intentando cambiar la foto de perfil'); // Para depuración
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });
  
      if (image?.dataUrl) {
        this.perfilData.fotoPerfil = image.dataUrl;
        console.log('Foto de perfil actualizada:', this.perfilData.fotoPerfil); // Para confirmar
        await this.authService.actualizarPerfil({ fotoPerfil: image.dataUrl });
        this.mostrarAlerta('Éxito', 'Foto de perfil actualizada correctamente');
      }
    } catch (error) {
      console.error('Error al cambiar la foto de perfil:', error);
      this.mostrarAlerta('Error', 'No se pudo cambiar la foto de perfil');
    }
  }
  
//METODO PARA GUARDAR CAMBIOS EN LOS DATOS DEL PERFIL
  async guardarCambios() {
    console.log('Intentando guardar cambios'); // Para depuración
    if (!this.isEditing) return;
  
    const confirmAlert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas guardar los cambios?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: async () => {
            console.log('Guardando cambios...'); // Log para confirmar ejecución
            const { username, rut, ...datosActualizados } = this.perfilData;
  
            try {
              await this.authService.actualizarPerfil(datosActualizados);
              this.isEditing = false;
              this.mostrarAlerta('Éxito', 'Perfil actualizado correctamente');
            } catch (error) {
              console.error('Error al guardar cambios:', error);
              this.mostrarAlerta('Error', 'No se pudieron guardar los cambios');
            }
          },
        },
      ],
    });
  
    await confirmAlert.present();
  }
  

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  //METODO PARA ACTUALIZAR PERFIL
  async actualizarPerfil(datos: any) {
    console.log('Datos recibidos para actualización:', datos);
    // Simula el guardado mientras pruebas:
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
 

  //METODOS MENÚ
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
      this.router.navigate(['/informes']);
    }
  
    // Método para navegar al perfil de usuario
      navigateToMiPerfil() {
        this.router.navigate(['/perfil-usuario']);
      }
}
