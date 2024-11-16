import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nombreApellido: string = '';
  rut: string = '';
  telefono: string = '';
  email: string = '';

  constructor(private router: Router, private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
    console.log('RegistroPage - Storage inicializado');
  }

  async onNext() {
    if (!this.nombreApellido.trim()) {
      alert('Por favor, ingresa tu Nombre y Apellido.');
      return;
    }
    if (!this.validarRut(this.rut)) {
      alert('Por favor, ingresa un RUT válido.');
      return;
    }
    if (!this.validarTelefono(this.telefono)) {
      alert('Por favor, ingresa un Número de Teléfono válido.');
      return;
    }
    if (!this.validarEmail(this.email)) {
      alert('Por favor, ingresa un Email válido.');
      return;
    }

    await this.storage.set('tempRegistro', {
      nombreApellido: this.nombreApellido,
      rut: this.rut,
      telefono: this.telefono,
      email: this.email,
    });

    console.log('Datos temporales guardados:', {
      nombreApellido: this.nombreApellido,
      rut: this.rut,
      telefono: this.telefono,
      email: this.email,
    });

    this.router.navigate(['/registro2']);
  }

  validarRut(rut: string): boolean {
    const rutRegex = /^[0-9]+-[0-9kK]$/;
    return rutRegex.test(rut);
  }

  validarTelefono(telefono: string): boolean {
    const telefonoRegex = /^\+?[0-9]+$/;
    return telefonoRegex.test(telefono);
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
