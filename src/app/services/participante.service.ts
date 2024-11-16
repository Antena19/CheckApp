//Este servicio manejará:

//Registro y validación de asistentes.
//Verificación si un participante está invitado a un evento (por RUT u otro identificador).
//Gestión de la asistencia de los participantes.

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class ParticipanteService {
  private participantes: any[] = []; // Lista de participantes
  private eventos: any[] = []; // Lista de eventos

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa el almacenamiento local
  async init() {
    await this.storage.create();
    
    // Datos de ejemplo
    this.eventos = (await this.storage.get('eventos')) || [
      {
        id: 'evento1',
        nombre: 'Capacitación Angular',
        participantes: ['12345678-9'], // RUT registrado
        asistencia: [], // Lista de asistencias
        estado: 'en-proceso', // Puede ser 'pendiente', 'en-proceso', 'finalizado'
      },
    ];
  
    this.participantes = (await this.storage.get('participantes')) || [
      { nombre: 'Juan Pérez', rut: '12345678-9', email: 'juan@example.com' },
    ];
  
    await this.storage.set('eventos', this.eventos);
    await this.storage.set('participantes', this.participantes);
  }

  // Registrar un nuevo participante
  async registrarParticipante(participante: any) {
    this.participantes.push(participante);
    await this.storage.set('participantes', this.participantes);
  }

  // Validar si el participante existe por RUT
  async validarParticipante(rut: string): Promise<boolean> {
    return this.participantes.some((p) => p.rut === rut);
  }

  // Obtener eventos asociados a un participante (por RUT)
  async obtenerEventosParticipante(rut: string): Promise<any[]> {
    return this.eventos.filter((evento) =>
      evento.participantes?.includes(rut)
    );
  }

  // Registrar asistencia a un evento
  async registrarAsistencia(eventoId: string, rut: string): Promise<boolean> {
    const evento = this.eventos.find((e) => e.id === eventoId);

    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    if (!evento.participantes.includes(rut)) {
      evento.participantes.push(rut); // Agregar si no está registrado
    }

    if (!evento.asistencia) {
      evento.asistencia = [];
    }

    evento.asistencia.push({
      rut,
      timestamp: new Date().toISOString(),
    });

    await this.storage.set('eventos', this.eventos);
    return true;
  }
}
