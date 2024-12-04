import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private eventos: any[] = [];
  private eventosSubject = new BehaviorSubject<any[]>([]); // BehaviorSubject para manejar los cambios en los eventos
  public eventos$ = this.eventosSubject.asObservable(); // Observable para suscribirse a los cambios

  constructor() {
    this.cargarEventos();
  }

  // Cargar eventos desde el almacenamiento local al iniciar el servicio
  cargarEventos() {
    const eventosGuardados = JSON.parse(localStorage.getItem('eventos') || '[]');
    this.eventos = eventosGuardados;
    this.eventosSubject.next(this.eventos); // Emitir el valor inicial
  }

  // Guardar eventos en el almacenamiento local
  public guardarEventos() {
    localStorage.setItem('eventos', JSON.stringify(this.eventos));
    this.eventosSubject.next(this.eventos); // Emitir los cambios
  }

  // Obtener todos los eventos creados por un usuario específico
  obtenerEventosPorUsuario(rutUsuario: string) {
    return this.eventos.filter(evento => evento.rut === rutUsuario);
  }

  // Agregar un nuevo evento asociado a un usuario específico
  agregarEvento(evento: any, rutUsuario: string) {
    const eventoConId = {
      ...evento,
      id: Date.now().toString(), // Generar un ID único basado en la fecha actual
      rut: rutUsuario, // Asociar evento al usuario por RUT
      asistentes: []
    };
    this.eventos.push(eventoConId); // Asociar evento al usuario y inicializar lista de asistentes vacía
    this.guardarEventos(); // Guardar y emitir cambios
  }

  // Editar un evento existente por ID (solo si pertenece al usuario actual)
  editarEventoPorId(id: string, eventoEditado: any, rutUsuario: string) {
    const eventoIndex = this.eventos.findIndex(evento => evento.id === id && evento.rut === rutUsuario);
    if (eventoIndex === -1) {
      throw new Error('Evento no encontrado o no tienes permiso para editarlo.');
    }
    this.eventos[eventoIndex] = { ...this.eventos[eventoIndex], ...eventoEditado };
    this.guardarEventos(); // Guardar y emitir cambios
  }

  // Eliminar un evento por ID (solo si pertenece al usuario actual)
  eliminarEventoPorId(id: string, rutUsuario: string) {
    const eventoIndex = this.eventos.findIndex(evento => evento.id === id && evento.rut === rutUsuario);
    if (eventoIndex === -1) {
      throw new Error('Evento no encontrado o no tienes permiso para eliminarlo.');
    }
    this.eventos.splice(eventoIndex, 1);
    this.guardarEventos(); // Guardar y emitir cambios
  }

  // Obtener evento por ID y RUT del usuario
  obtenerEventoPorIdYUsuario(id: string, rutUsuario: string) {
    return this.eventos.find(evento => evento.id === id && evento.rut === rutUsuario);
  }

  // Obtener evento por ID (sin importar el usuario, para la lógica de participante)
  obtenerEventoPorId(eventoId: string) {
    return this.eventos.find(evento => evento.id === eventoId);
  }

  // Obtener eventos donde el participante está presente
  obtenerEventosConParticipantePresente(rutParticipante: string) {
    return this.eventos.filter(evento =>
      evento.asistentes && evento.asistentes.some((asistente: any) => asistente.rut === rutParticipante && asistente.estado === 'presente')
    );
  }

  // Obtener eventos donde el participante está inscrito
  obtenerEventosConParticipanteInscrito(rutParticipante: string) {
    return this.eventos.filter(evento =>
      evento.asistentes && evento.asistentes.some((asistente: any) => asistente.rut === rutParticipante)
    );
  }

  // Agregar un asistente a un evento (solo si el evento pertenece al usuario actual)
  agregarAsistente(eventoIndex: number, asistente: any, rutUsuario: string) {
    const evento = this.eventos[eventoIndex];
    if (!evento || evento.rut !== rutUsuario) {
      throw new Error('Evento no encontrado o no tienes permiso para modificarlo.');
    }

    // Verificar si el asistente ya existe en el evento
    const asistenteExistente = evento.asistentes.find((a: any) => a.rut === asistente.rut);
    if (asistenteExistente) {
      throw new Error('El asistente ya está registrado en este evento.');
    }

    asistente.estado = 'presente'; // Registrar al asistente como presente
    evento.asistentes.push(asistente);
    this.guardarEventos(); // Guardar y emitir cambios
  }

  // Invitar a un asistente a un evento (estado "ausente", solo si pertenece al usuario actual)
  invitarAsistente(eventoIndex: number, asistente: any, rutUsuario: string) {
    const evento = this.eventos[eventoIndex];
    if (!evento || evento.rut !== rutUsuario) {
      throw new Error('Evento no encontrado o no tienes permiso para modificarlo.');
    }

    // Verificar si el asistente ya existe en el evento
    const asistenteExistente = evento.asistentes.find((a: any) => a.rut === asistente.rut);
    if (asistenteExistente) {
      throw new Error('El asistente ya está registrado en este evento.');
    }

    asistente.estado = 'ausente'; // Registrar al asistente como ausente inicialmente
    evento.asistentes.push(asistente);
    this.guardarEventos(); // Guardar y emitir cambios
  }

  // Registrar la asistencia de un participante mediante el ID del evento
  registrarAsistenciaPorId(eventoId: string, rutParticipante: string, nombre: string) {
    const evento = this.obtenerEventoPorId(eventoId);
    if (!evento) {
      throw new Error('Evento no encontrado.');
    }

    const asistenteExistente = evento.asistentes.find((a: any) => a.rut === rutParticipante);
    if (asistenteExistente) {
      // Actualizar el estado del asistente existente a "presente"
      asistenteExistente.estado = 'presente';
      asistenteExistente.horaRegistro = new Date().toLocaleTimeString();
    } else {
      // Si el asistente no está registrado, agregarlo con estado "presente"
      const nuevoAsistente = {
        rut: rutParticipante,
        nombre,
        estado: 'presente',
        horaRegistro: new Date().toLocaleTimeString(),
      };
      evento.asistentes.push(nuevoAsistente);
    }

    this.guardarEventos(); // Guardar y emitir cambios
  }

  // Editar un asistente (solo si pertenece al usuario actual)
  editarAsistente(eventoIndex: number, asistenteIndex: number, asistenteEditado: any, rutUsuario: string) {
    const evento = this.eventos[eventoIndex];
    if (!evento || !evento.asistentes[asistenteIndex] || evento.rut !== rutUsuario) {
      throw new Error('Asistente no encontrado o no tienes permiso para modificarlo.');
    }
    evento.asistentes[asistenteIndex] = { ...evento.asistentes[asistenteIndex], ...asistenteEditado };
    this.guardarEventos(); // Guardar y emitir cambios
  }

  // Eliminar un asistente (solo si pertenece al usuario actual)
  eliminarAsistente(eventoIndex: number, asistenteIndex: number, rutUsuario: string) {
    const evento = this.eventos[eventoIndex];
    if (!evento || !evento.asistentes[asistenteIndex] || evento.rut !== rutUsuario) {
      throw new Error('Asistente no encontrado o no tienes permiso para eliminarlo.');
    }
    evento.asistentes.splice(asistenteIndex, 1);
    this.guardarEventos(); // Guardar y emitir cambios
  }

  // Obtener asistentes de un evento (solo si pertenece al usuario actual)
  obtenerAsistentes(eventoIndex: number, rutUsuario: string) {
    const evento = this.eventos[eventoIndex];
    if (!evento || evento.rut !== rutUsuario) {
      throw new Error('Evento no encontrado o no tienes permiso para verlo.');
    }
    return evento.asistentes;
  }

  // Obtener todos los eventos (sin importar el usuario)
  obtenerTodosLosEventos() {
    return this.eventos;
  }
}
