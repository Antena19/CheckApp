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
  constructor(private storage: Storage, private eventoService: EventoService) {}

  // MÉTODO PARA CARGAR DATOS DE EJEMPLO EN EL STORAGE
  async cargarDatosEjemplo() {
    await this.storage.create();
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
  await this.storage.create();

  // Obtener el usuario administrador del Storage
  const usuarios: User[] = await this.storage.get('users') || [];
  const adminUser = usuarios.find(user => user.username === 'admin');

  if (adminUser) {
    // Eliminar cualquier evento de ejemplo anterior
    const eventos = this.eventoService.obtenerEventos();
    const eventoEjemploExistente = eventos.find(evento => evento.nombre === 'Evento de Ejemplo' && evento.organizador === adminUser.nombreApellido);

    if (eventoEjemploExistente) {
      const index = eventos.indexOf(eventoEjemploExistente);
      this.eventoService.eliminarEvento(index);
    }

    // Crear un nuevo evento de ejemplo
    const fechaActual = new Date();
    const eventoEjemplo = {
      id: Date.now(), // ID único basado en la fecha actual
      nombre: 'Evento de Ejemplo',
      organizador: adminUser.nombreApellido,
      fecha: fechaActual.toISOString().split('T')[0],
      horaInicio: `${fechaActual.getHours()}:${fechaActual.getMinutes()}`,
      horaTermino: '',
      lugar: 'Ubicación por Defecto',
      usuarioId: adminUser.rut // Asociar el evento con el RUT del administrador
    };

    this.eventoService.agregarEvento(eventoEjemplo);
    console.log('Evento de ejemplo creado para el administrador:', eventoEjemplo);
  }
}

}
