import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AutenticacionService } from '../services/autenticacion.service';
import { NotificacionService } from '../services/notificacion.service';
import { DatosEjemploService } from '../services/datos-ejemplo.service';

interface User {
  username: string;
  password: string;
  rut: string;
  nombreApellido: string;
  telefono: string;
  email: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  isAdmin: boolean = false;
  isParticipant: boolean = false;
  validUsers: User[] = [];

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(
    private router: Router,
    private storage: Storage,
    private authService: AutenticacionService,
    private notificacionService: NotificacionService,
    private datosEjemploService: DatosEjemploService
  ) {}

  // INICIALIZAR COMPONENTE Y CARGAR USUARIOS DE EJEMPLO
  async ngOnInit() {
    await this.storage.create();
    await this.datosEjemploService.cargarDatosEjemplo();
  }

  // ACTUALIZAR USUARIOS AL ENTRAR A LA PÁGINA DE LOGIN
  async ionViewWillEnter() {
    this.validUsers = await this.storage.get('users') || [];
    console.log('Usuarios actualizados:', this.validUsers); // Depuración
  }

  // ENVÍO DEL FORMULARIO DE LOGIN
  onSubmit() {
    this.login();
  }

  // MÉTODO PARA INICIAR SESIÓN
  async login() {
    this.username = this.username.trim();
    this.password = this.password.trim();
    console.log(`Intentando iniciar sesión con: ${this.username} ${this.password}`); // Depuración

    const foundUser = this.validUsers.find(
      user => user.username === this.username && user.password === this.password
    );

    if (foundUser) {
      // Determinar el rol según la selección del usuario
      const rol = this.isAdmin ? 'admin' : 'participant';
      await this.authService.iniciarSesion(this.username, this.password, rol);

      this.notificacionService.mostrarMensaje('Éxito', 'Inicio de sesión exitoso', 'success');
      console.log(`Inicio de sesión exitoso para ${this.username} con rol: ${rol}`); // Depuración

      // Redirigir según el rol seleccionado
      if (rol === 'admin') {
        console.log('Redirigiendo a la página de home...');
        await this.router.navigate(['/home']);
      } else if (rol === 'participant') {
        console.log('Redirigiendo a la página de home-participante...');
        await this.router.navigate(['/home-participante']);
      }
    } else {
      this.notificacionService.mostrarMensaje('Error', 'Usuario o contraseña inválidos', 'error');
      console.log('Credenciales inválidas'); // Depuración
    }
  }

  // MÉTODO PARA SELECCIONAR ROL (ADMINISTRADOR O PARTICIPANTE)
  selectRole(role: string) {
    if (role === 'admin') {
      this.isAdmin = true;
      this.isParticipant = false;
    } else if (role === 'participant') {
      this.isAdmin = false;
      this.isParticipant = true;
    }
  }

  // MÉTODO PARA CAMBIAR LA VISIBILIDAD DE LA CONTRASEÑA
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  // MÉTODO PARA LIMPIAR CAMPOS DE ENTRADA
  clearInput(field: string) {
    if (field === 'username') this.username = '';
    if (field === 'password') this.password = '';
  }

  // MÉTODO PARA NAVEGAR A RESETEO DE CONTRASEÑA
  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  // MÉTODO PARA NAVEGAR A LA CREACIÓN DE CUENTA
  goToCreateAccount() {
    this.router.navigate(['/registro']);
  }
}
