import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AutenticacionService } from '../services/autenticacion.service';
import { NotificacionService } from '../services/notificacion.service';

interface User {
  username: string;
  password: string;
  rut: string;
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
    private notificacionService: NotificacionService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.validUsers = await this.storage.get('users') || [];

    if (this.validUsers.length === 0) {
      this.validUsers = [
        { username: 'admin', password: '1234', rut: '12345678-9' },
        { username: 'user', password: '4321', rut: '98765432-1' },
      ];
      await this.storage.set('users', this.validUsers);
    }
  }

  onSubmit() {
    this.login();
  }

  async login() {
    this.username = this.username.trim();
    this.password = this.password.trim();

    const foundUser = this.validUsers.find(
      user => user.username === this.username && user.password === this.password
    );

    if (foundUser) {
      // Determinar el rol según la selección del usuario
      const rol = this.isAdmin ? 'admin' : 'participant';
      await this.authService.iniciarSesion(this.username, rol);

      this.notificacionService.mostrarMensaje('Éxito', 'Inicio de sesión exitoso', 'success');

      // Redirigir según el rol seleccionado
      if (rol === 'admin') {
        this.router.navigate(['/home']);
      } else if (rol === 'participant') {
        this.router.navigate(['/home-participante']);
      }
    } else {
      this.notificacionService.mostrarMensaje('Error', 'Usuario o contraseña inválidos', 'error');
    }
  }

  selectRole(role: string) {
    if (role === 'admin') {
      this.isAdmin = true;
      this.isParticipant = false;
    } else if (role === 'participant') {
      this.isAdmin = false;
      this.isParticipant = true;
    }
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  clearInput(field: string) {
    if (field === 'username') this.username = '';
    if (field === 'password') this.password = '';
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  goToCreateAccount() {
    this.router.navigate(['/registro']);
  }
}
