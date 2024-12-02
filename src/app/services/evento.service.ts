import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private eventos: any[] = [];

  constructor() {
    this.cargarEventos();
  }

  // Cargar eventos desde el almacenamiento local al iniciar el servicio
  cargarEventos() {
    const eventosGuardados = JSON.parse(localStorage.getItem('eventos') || '[]');
    this.eventos = eventosGuardados;
  }

  // Guardar eventos en el almacenamiento local
  public guardarEventos() {
    localStorage.setItem('eventos', JSON.stringify(this.eventos));
  }

  // Obtener todos los eventos
  obtenerEventos() {
    return this.eventos;
  }

  // Agregar un nuevo evento
  agregarEvento(evento: any) {
    this.eventos.push({ ...evento, asistentes: [] }); // Inicializar lista de asistentes vacía
    this.guardarEventos();
  }

  // Editar un evento existente
  editarEvento(index: number, eventoEditado: any) {
    if (!this.eventos[index]) {
      throw new Error('Evento no encontrado.');
    }
    this.eventos[index] = { ...this.eventos[index], ...eventoEditado };
    this.guardarEventos();
  }

  // Eliminar un evento
  eliminarEvento(index: number) {
    if (!this.eventos[index]) {
      throw new Error('Evento no encontrado.');
    }
    this.eventos.splice(index, 1);
    this.guardarEventos();
  }

  // Obtener evento por ID
  obtenerEventoPorId(id: string) {
    return this.eventos.find(evento => evento.id === id);
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

  // Agregar un asistente a un evento
  agregarAsistente(eventoIndex: number, asistente: any) {
    const evento = this.eventos[eventoIndex];
    if (!evento) {
      throw new Error('Evento no encontrado.');
    }

    // Verificar si el asistente ya existe en el evento
    const asistenteExistente = evento.asistentes.find((a: any) => a.rut === asistente.rut);
    if (asistenteExistente) {
      throw new Error('El asistente ya está registrado en este evento.');
    }

    asistente.estado = 'presente'; // Registrar al asistente como presente
    evento.asistentes.push(asistente);
    this.guardarEventos();
  }

  // Invitar a un asistente a un evento (estado "ausente")
  invitarAsistente(eventoIndex: number, asistente: any) {
    const evento = this.eventos[eventoIndex];
    if (!evento) {
      throw new Error('Evento no encontrado.');
    }

    // Verificar si el asistente ya existe en el evento
    const asistenteExistente = evento.asistentes.find((a: any) => a.rut === asistente.rut);
    if (asistenteExistente) {
      throw new Error('El asistente ya está registrado en este evento.');
    }

    asistente.estado = 'ausente'; // Registrar al asistente como ausente inicialmente
    evento.asistentes.push(asistente);
    this.guardarEventos();
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

    this.guardarEventos();
  }

  // Editar un asistente
  editarAsistente(eventoIndex: number, asistenteIndex: number, asistenteEditado: any) {
    const evento = this.eventos[eventoIndex];
    if (!evento || !evento.asistentes[asistenteIndex]) {
      throw new Error('Asistente no encontrado.');
    }
    evento.asistentes[asistenteIndex] = { ...evento.asistentes[asistenteIndex], ...asistenteEditado };
    this.guardarEventos();
  }

  // Eliminar un asistente
  eliminarAsistente(eventoIndex: number, asistenteIndex: number) {
    const evento = this.eventos[eventoIndex];
    if (!evento || !evento.asistentes[asistenteIndex]) {
      throw new Error('Asistente no encontrado.');
    }
    evento.asistentes.splice(asistenteIndex, 1);
    this.guardarEventos();
  }

  // Obtener asistentes de un evento
  obtenerAsistentes(eventoIndex: number) {
    const evento = this.eventos[eventoIndex];
    if (!evento) {
      throw new Error('Evento no encontrado.');
    }
    return evento.asistentes;
  }
}
