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

  // Obtener todos los eventos
  obtenerEventos() {
    return this.eventos;
  }

  // Agregar un nuevo evento y actualizar el almacenamiento local
  agregarEvento(evento: any) {
    this.eventos.push(evento);
    localStorage.setItem('eventos', JSON.stringify(this.eventos));
  }

  // Editar un evento existente
  editarEvento(index: number, eventoEditado: any) {
    this.eventos[index] = eventoEditado;
    localStorage.setItem('eventos', JSON.stringify(this.eventos));
  }

  // Eliminar un evento
  eliminarEvento(index: number) {
    this.eventos.splice(index, 1);
    localStorage.setItem('eventos', JSON.stringify(this.eventos));
  }
}
