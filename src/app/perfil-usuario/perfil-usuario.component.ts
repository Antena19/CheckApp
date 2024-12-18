import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { AutenticacionService } from '../services/autenticacion.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


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
    private menu: MenuController,
    private navCtrl: NavController,
    private toastController: ToastController
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

// Método para actualizar perfil
async actualizarPerfil(datos: any) {
  try {
    console.log('Datos recibidos para actualización:', datos);
    await this.authService.actualizarPerfil(datos);
    this.mostrarMensaje("Perfil actualizado con éxito");
  } catch (error: unknown) {  // Cambio aquí para especificar el tipo como 'unknown'
    console.error('Error al actualizar el perfil:', error);
    // Verifica que el error es una instancia de Error antes de acceder a su propiedad 'message'
    if (error instanceof Error) {
      this.mostrarMensaje(error.message, 'danger');
    } else {
      // Si el error no es una instancia de Error, aún maneja el caso de error genérico
      this.mostrarMensaje("Ocurrió un error desconocido", 'danger');
    }
  }
}


// Método para mostrar mensajes
async mostrarMensaje(message: string, color: string = 'success') {
  const toast = await this.toastController.create({
    message,
    color,
    duration: 2000
  });
  toast.present();
}
      volver() {
        this.navCtrl.back();
      }
}
