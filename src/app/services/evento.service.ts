import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private eventos: any[] = [];
  private maxEventos: number = 10; // Límite máximo de eventos
  private maxAsistentes: number = 500; // Límite máximo de asistentes por evento

  constructor() {
    this.cargarEventos();
  }

  // Cargar eventos desde el almacenamiento local al iniciar el servicio
  cargarEventos() {
    const eventosGuardados = JSON.parse(localStorage.getItem('eventos') || '[]');
    this.eventos = eventosGuardados;
  }

  // Guardar eventos en el almacenamiento local
  private guardarEventos() {
    localStorage.setItem('eventos', JSON.stringify(this.eventos));
  }

  // Obtener todos los eventos
  obtenerEventos() {
    return this.eventos;
  }

  // Agregar un nuevo evento y verificar el límite máximo
  agregarEvento(evento: any) {
    if (this.eventos.length >= this.maxEventos) {
      throw new Error('Se alcanzó el límite máximo de eventos. No puedes crear más de 10 eventos.');
    }
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

  // Agregar un asistente a un evento
  agregarAsistente(eventoIndex: number, asistente: any) {
    const evento = this.eventos[eventoIndex];
    if (!evento) {
      throw new Error('Evento no encontrado.');
    }

    if (evento.asistentes.length >= this.maxAsistentes) {
      throw new Error('Se alcanzó el límite máximo de asistentes para este evento.');
    }

    // Verificar si el asistente ya existe en el evento
    const asistenteExistente = evento.asistentes.find((a: any) => a.rut === asistente.rut);
    if (asistenteExistente) {
      throw new Error('El asistente ya está registrado en este evento.');
    }

    evento.asistentes.push(asistente);
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

