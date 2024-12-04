import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { EventoService } from '../services/evento.service';

interface User {
  username: string;
  password: string;
  rut: string;
  nombreApellido: string;
  telefono: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatosEjemploService {
  constructor(private storage: Storage, private eventoService: EventoService) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  // MÉTODO PARA CARGAR DATOS DE EJEMPLO EN EL STORAGE
  async cargarDatosEjemplo() {
    let usuarios: User[] = (await this.storage.get('users')) || [];

    // AGREGAR ADMINISTRADOR POR DEFECTO SIEMPRE
    const adminUser: User = {
      username: 'admin',
      password: '1234',
      rut: '00000000-0',
      nombreApellido: 'Administrador del Sistema',
      telefono: '+56912345678',
      email: 'admin@checkapp.com',
    };

    // AGREGAR USUARIO DE EJEMPLO
    const ejemploUser: User = {
      username: 'angelina',
      password: '1234',
      rut: '17144575-2',
      nombreApellido: 'Angelina Mendoza',
      telefono: '+56998555466',
      email: 'angelina@ejemplo.com',
    };

    // VERIFICAR SI EL USUARIO ADMINISTRADOR Y EL USUARIO DE EJEMPLO YA EXISTEN
    const adminExists = usuarios.some(user => user.username === 'admin');
    const userExists = usuarios.some(user => user.username === 'angelina');

    if (!adminExists) {
      usuarios.push(adminUser);
      console.log('Usuario administrador creado por defecto:', adminUser);
    }

    if (!userExists) {
      usuarios.push(ejemploUser);
      console.log('Usuario de ejemplo creado:', ejemploUser);
    }

    await this.storage.set('users', usuarios);
  }

  // MÉTODO PARA CREAR UN EVENTO DE EJEMPLO CUANDO EL ADMIN SE LOGUEA
  async crearEventoEjemploAdmin() {
    // Obtener el usuario administrador del Storage
    const usuarios: User[] = await this.storage.get('users') || [];
    const adminUser = usuarios.find(user => user.username === 'admin');

    if (adminUser) {
      // Eliminar cualquier evento de ejemplo anterior
      const eventos = await this.eventoService.obtenerEventosPorUsuario(adminUser.rut);
      const eventoEjemploExistente = eventos.find(evento => evento.nombre === 'Evento de Ejemplo' && evento.organizador === adminUser.nombreApellido);

      if (eventoEjemploExistente) {
        this.eventoService.eliminarEventoPorId(eventoEjemploExistente.id, adminUser.rut);
      }

      // Crear un nuevo evento de ejemplo
      const fechaActual = new Date();
      const eventoEjemplo = {
        id: Date.now().toString(), // ID único basado en la fecha actual
        nombre: 'Evento de Ejemplo',
        organizador: adminUser.nombreApellido,
        fecha: fechaActual.toISOString().split('T')[0],
        horaInicio: `${fechaActual.getHours()}:${fechaActual.getMinutes()}`,
        horaTermino: '',
        lugar: 'Ubicación por Defecto',
        rut: adminUser.rut, // Cambiado a 'rut' para ser consistente con el servicio de eventos
        asistentes: [] // Lista de asistentes vacía por defecto
      };

      this.eventoService.agregarEvento(eventoEjemplo, adminUser.rut);
      console.log('Evento de ejemplo creado para el administrador:', eventoEjemplo);
    }
  }
}
