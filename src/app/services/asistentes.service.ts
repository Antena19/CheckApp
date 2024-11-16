import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsistentesService {
  private asistentesPorEvento: { [eventId: string]: any[] } = {}; // Almacenar asistentes por evento

  constructor() {}

  // Obtener lista de asistentes de un evento
  obtenerAsistentes(eventId: string): any[] {
    return this.asistentesPorEvento[eventId] || [];
  }

  // Agregar un asistente a un evento
  agregarAsistente(eventId: string, asistente: any): void {
    if (!this.asistentesPorEvento[eventId]) {
      this.asistentesPorEvento[eventId] = [];
    }
    this.asistentesPorEvento[eventId].push(asistente);
  }

  // Editar asistente en un evento
  editarAsistente(eventId: string, asistenteIndex: number, asistente: any): void {
    if (this.asistentesPorEvento[eventId]) {
      this.asistentesPorEvento[eventId][asistenteIndex] = asistente;
    }
  }

  // Eliminar asistente de un evento
  eliminarAsistente(eventId: string, asistenteIndex: number): void {
    if (this.asistentesPorEvento[eventId]) {
      this.asistentesPorEvento[eventId].splice(asistenteIndex, 1);
    }
  }

  // Cargar una lista de asistentes desde un archivo
  cargarLista(eventId: string, lista: any[]): void {
    this.asistentesPorEvento[eventId] = lista;
  }

  // Obtener el número de asistentes
  obtenerNumeroAsistentes(eventId: string): number {
    return this.asistentesPorEvento[eventId]?.length || 0;
  }
}
