import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AutenticacionService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const userRole = await this.authService.obtenerRol();
    console.log(`Rol del usuario: ${userRole}`); // Añade esto para depurar

    if (userRole !== 'admin') {
      console.log('El rol del usuario no es administrador, redirigiendo al login...');
      await this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
