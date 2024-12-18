import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DatosEjemploService } from './datos-ejemplo.service';

export interface UserData {
  username: string;
  nombreApellido: string;
  rut: string;
  telefono: string;
  email: string;
  fotoPerfil: string;
}

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private usuarioLogueado: boolean = false;

  // DATOS DEL USUARIO EN SESIÓN ACTUAL
  private usuarioActual: any = null;

  constructor(private storage: Storage, private datosEjemploService: DatosEjemploService) {
    this.init();
  }

  // Inicializa el Storage
  async init() {
    await this.storage.create();
    const usuarioActual = await this.storage.get('usuarioActual');
    this.usuarioLogueado = !!usuarioActual; // Verifica si hay un usuario logueado
  }

  // Verificar si el usuario está logueado
  async verificarSesion(): Promise<boolean> {
    const usuarioActual = await this.storage.get('usuarioActual');
    return !!usuarioActual;
  }

  // Verificar si el usuario existe en el storage e iniciar sesión
  async iniciarSesion(username: string, password: string, rol: string): Promise<boolean> {
    const usuarios = (await this.storage.get('users')) || [];
    const usuario = usuarios.find((user: any) => user.username === username && user.password === password);

    if (usuario) {
      await this.storage.set('usuarioActual', usuario); // Guarda el usuario actual en el Storage
      await this.storage.set('userRole', rol); // Guarda el rol del usuario
      this.usuarioLogueado = true; // Marca al usuario como logueado

      // Si es el administrador, creamos el evento de ejemplo.
      if (username === 'admin') {
        await this.datosEjemploService.crearEventoEjemploAdmin();
      }

      return true;
    } else {
      return false; // Retornar false si el usuario no es encontrado
    }
  }

  // Cerrar sesión
  async cerrarSesion() {
    await this.storage.remove('usuarioActual');
    await this.storage.remove('userRole');
    this.usuarioLogueado = false;
  }

  // Obtener el rol del usuario actual
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

  // MÉTODO PARA OBTENER EL USUARIO ACTUAL
  async obtenerUsuarioActual() {
    const usuario = await this.storage.get('usuarioActual');
    if (usuario) {
      console.log('Usuario obtenido del Storage:', usuario);
      return usuario;
    } else {
      console.error('No se encontró un usuario logueado');
      return null;
    }
  }

// ACTUALIZAR LOS DATOS DEL USUARIO ACTUAL
async actualizarPerfil(datosActualizados: Partial<UserData>) {
  const usuarioActual = await this.obtenerUsuarioActual();
  if (!usuarioActual) {
    throw new Error('No se encontró un usuario logueado.');
  }

  // Prevenir cambios de username, rut y password
  if (datosActualizados.username || datosActualizados.rut || ('password' in datosActualizados)) {
    throw new Error('No se permite cambiar el nombre de usuario, RUT o contraseña.');
  }

  // Actualizar datos y guardarlos en el storage
  const usuarioActualizado = { ...usuarioActual, ...datosActualizados };
  await this.storage.set('usuarioActual', usuarioActualizado);

  // Actualizar en la lista general de usuarios
  const usuarios = (await this.storage.get('users')) || [];
  const index = usuarios.findIndex((u: any) => u.rut === usuarioActual.rut);
  if (index !== -1) {
    usuarios[index] = usuarioActualizado;
    await this.storage.set('users', usuarios);
  }
}
  
}
