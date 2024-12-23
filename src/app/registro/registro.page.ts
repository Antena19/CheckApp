import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  username: string = ''; // Cambiado de nombreUsuario a username
  password: string = ''; // Cambiado de contrasena a password
  repetirContrasena: string = '';
  nombreApellido: string = '';
  rut: string = '';
  telefono: string = '+56';
  email: string = '';

  constructor(private router: Router, private storage: Storage) {}

  // INICIALIZAR STORAGE
  async ngOnInit() {
    await this.storage.create();
    console.log('RegistroPage - Storage inicializado');
  }

  // VALIDAR RUT
  validarRut(rut: string): boolean {
    const rutRegex = /^[0-9]{7,8}-[0-9kK]$/;
    return rutRegex.test(rut);
  }

  // VALIDAR TELÉFONO
  validarTelefono(telefono: string): boolean {
    const telefonoRegex = /^\+56[0-9]{9}$/;
    return telefonoRegex.test(telefono);
  }

  // VALIDAR EMAIL
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // CREAR CUENTA
  async onSubmit() {
    if (!this.username.trim() || this.username.length < 6 || this.username.length > 10 || !/^[a-zA-Z0-9]+$/.test(this.username)) {
      alert('Por favor, ingresa un Nombre de Usuario válido (6-10 caracteres, solo letras y números).');
      return;
    }
    if (!this.password.trim() || this.password.length !== 4 || !/^[0-9]{4}$/.test(this.password)) {
      alert('Por favor, ingresa una Contraseña válida (4 dígitos numéricos).');
      return;
    }
    if (this.password !== this.repetirContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    if (!this.nombreApellido.trim()) {
      alert('Por favor, ingresa tu Nombre y Apellido.');
      return;
    }
    if (!this.validarRut(this.rut)) {
      alert('Por favor, ingresa un RUT válido (Ej: 12345678-9).');
      return;
    }
    if (!this.validarTelefono(this.telefono)) {
      alert('Por favor, ingresa un Número de Teléfono válido (Ej: +56912345678).');
      return;
    }
    if (this.email && !this.validarEmail(this.email)) {
      alert('Por favor, ingresa un Email válido.');
      return;
    }

    const nuevoUsuario = {
      username: this.username,
      password: this.password,
      nombreApellido: this.nombreApellido,
      rut: this.rut,
      telefono: this.telefono,
      email: this.email,
    };

    let usuarios = await this.storage.get('users');
    if (!usuarios) {
      usuarios = [];
    }
    usuarios.push(nuevoUsuario);
    await this.storage.set('users', usuarios);

    console.log('Usuario registrado:', nuevoUsuario);
    alert('Cuenta creada con éxito.');

    this.router.navigate(['/login']);
  }

    // Método para navegar de vuelta al login
    navegarALogin() {
      this.router.navigate(['/login']);
    }
}



