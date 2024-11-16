import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-registro2',
  templateUrl: './registro2.page.html',
  styleUrls: ['./registro2.page.scss'],
})
export class Registro2Page {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  tempData: any = {}; // Para almacenar los datos temporales del registro (nombre, rut, etc.)

  constructor(private router: Router, private storage: Storage) {}

  async ngOnInit() {
    // Inicializar storage y obtener datos temporales
    await this.storage.create();
    this.tempData = await this.storage.get('tempRegistro');

    if (!this.tempData) {
      alert('No se encontraron datos de registro. Por favor, comienza desde el paso 1.');
      this.router.navigate(['/registro']); // Redirigir al primer paso si no hay datos
    }

    console.log('Datos temporales recuperados:', this.tempData);
  }

  async onRegister() {
    // Validar los campos de esta página
    if (!this.validarUsername(this.username)) {
      alert('El Nombre de Usuario debe contener solo letras o números y tener entre 3 y 8 caracteres.');
      return;
    }
    if (!this.validarPassword(this.password)) {
      alert('La Contraseña debe ser numérica y tener exactamente 4 dígitos.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor, verifica.');
      return;
    }

    // Validar si el nombre de usuario ya existe
    const storedUsers = (await this.storage.get('users')) || [];
    const userExists = storedUsers.some((user: any) => user.username === this.username);

    if (userExists) {
      alert('El Nombre de Usuario ya está en uso. Por favor, elige otro.');
      return;
    }

    // Crear un nuevo usuario con los datos completos
    const newUser = {
      ...this.tempData, // Nombre, RUT, Teléfono, Email, Rol
      username: this.username,
      password: this.password,
    };

    // Guardar el nuevo usuario en el almacenamiento
    storedUsers.push(newUser);
    await this.storage.set('users', storedUsers);

    console.log('Usuario registrado exitosamente:', newUser);

    // Mostrar mensaje de éxito y redirigir al login
    alert(`¡Registro exitoso! Bienvenido(a), ${newUser.nombre}.`);
    this.router.navigate(['/login']);
  }

  // Validar nombre de usuario
  validarUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9]{3,8}$/;
    return usernameRegex.test(username);
  }

  // Validar contraseña
  validarPassword(password: string): boolean {
    const passwordRegex = /^\d{4}$/; // Solo 4 dígitos numéricos
    return passwordRegex.test(password);
  }
}
