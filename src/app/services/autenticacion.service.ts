import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private usuarioLogueado: boolean = false;

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa el Storage
  async init() {
    await this.storage.create();
    const username = await this.storage.get('username');
    this.usuarioLogueado = !!username; // Verifica si hay un usuario logueado
  }

  // Verifica si el usuario está logueado
  async estaLogueado(): Promise<boolean> {
    return this.usuarioLogueado;
  }

  // Iniciar sesión con validación de rol
  async iniciarSesion(username: string, rol: string): Promise<boolean> {
    await this.storage.set('username', username); // Guarda el nombre de usuario
    await this.storage.set('userRole', rol); // Guarda el rol del usuario
    this.usuarioLogueado = true; // Marca como logueado
    return true;
  }

  // Cerrar sesión
  async cerrarSesion() {
    await this.storage.remove('username');
    await this.storage.remove('userRole');
    this.usuarioLogueado = false;
  }

  // Obtener el rol del usuario
  async obtenerRol(): Promise<string | null> {
    return await this.storage.get('userRole');
  }

  // Verificar si el usuario existe
  async usuarioExiste(username: string, rut: string): Promise<boolean> {
    const usuarios = (await this.storage.get('users')) || [];
    return usuarios.some((user: any) => user.username === username || user.rut === rut);
  }

  // Registrar un nuevo usuario
  async registrarUsuario(usuario: any) {
    const usuarios = (await this.storage.get('users')) || [];
    usuarios.push(usuario);
    await this.storage.set('users', usuarios);
  }
}
